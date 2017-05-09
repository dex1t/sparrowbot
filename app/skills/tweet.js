class Tweet {
  constructor(sparrowbot) {
    this.controller = sparrowbot.controller;
    this.client = sparrowbot.twitterClient;
  }

  run() {
    this.controller.on('interactive_message_callback', (bot, msg) => {
      if (msg.actions[0].name !== 'tweet') return;
      switch (msg.actions[0].value) {
        case 'tweet':
          this.handleTweetButton(bot, msg);
          break;
        case 'cancel':
          this.handleCancelButton(bot, msg);
          break;
        default:
          // do nothing
      }
    });
  }

  handleTweetButton(bot, msg) {

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
