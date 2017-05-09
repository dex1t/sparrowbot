class Tweet {
  constructor(sparrowbot) {
    this.controller = sparrowbot.controller;
    this.client = sparrowbot.twitterClient;
  }

  run() {
    this.controller.on('interactive_message_callback', (bot, msg) => {
      switch (msg.actions[0].name) {
        case 'tweet-post':
          this.handleTweetButton(bot, msg);
          break;
        case 'tweet-cancel':
          this.handleCancelButton(bot, msg);
          break;
        default:
          // do nothing
      }
    });
  }

  handleTweetButton(bot, msg) {
    this.client.post('statuses/update', {
      status: msg.actions[0].value,
      in_reply_to_status_id: msg.callback_id,
    }, (err) => {
      if (err) {
        this.controller.botkit.log('Error: statuses/update', err);
      }

      const nextMsg = msg.original_message;
      nextMsg.text = 'Tweeted :dizzy:';
      nextMsg.attachments[0].actions = null;
      bot.replyInteractive(msg, nextMsg);
    });
  }

  handleCancelButton(bot, msg) {
    const nextMsg = msg.original_message;
    nextMsg.text = 'Cancelled :no_mouth:';
    nextMsg.attachments[0].actions = null;
    nextMsg.attachments[0].color = null;
    bot.replyInteractive(msg, nextMsg);
  }
}

module.exports = Tweet;
