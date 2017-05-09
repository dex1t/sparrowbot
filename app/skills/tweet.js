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
    }, (err, tweet) => {
      const nextMsg = msg.original_message;

      if (err) {
        console.log(err);
        nextMsg.text = `Oops :persevere: ${err[0].message}`;
        nextMsg.attachments[0].actions = null;
        nextMsg.attachments[0].color = '#D0012A';
        bot.replyInteractive(msg, nextMsg);
        return;
      }

      nextMsg.text = 'Tweeted :dizzy:';
      nextMsg.attachments[0].actions = null;
      nextMsg.attachments[0].author_link = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
      nextMsg.attachments[0].footer = 'Twitter';
      nextMsg.attachments[0].footer_icon = 'https://a.slack-edge.com/6e067/img/services/twitter_pixel_snapped_32.png';
      nextMsg.attachments[0].ts = new Date(Date.parse(tweet.created_at)).getTime() / 1000;
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
