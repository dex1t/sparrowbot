class Retweet {
  constructor(sparrowbot) {
    this.controller = sparrowbot.controller;
    this.client = sparrowbot.twitterClient;
  }

  run() {
    this.controller.on('interactive_message_callback', (bot, msg) => {
      if (msg.actions[0].name !== 'retweet') {
        return;
      }

      this.client.post('statuses/retweet', { id: msg.callback_id }, () => {
        const nextMsg = msg.original_message;
        nextMsg.attachments.push({
          color: '#00aced',
          text: `:recycle: Retweeted by <@${msg.user}>`,
        });
        bot.replyInteractive(msg, nextMsg);
      });
    });
  }
}

module.exports = Retweet;
