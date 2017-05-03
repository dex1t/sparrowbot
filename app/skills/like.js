class Like {
  constructor(sparrowbot) {
    this.controller = sparrowbot.controller;
    this.client = sparrowbot.twitterClient;
  }

  run() {
    this.controller.on('interactive_message_callback', (bot, msg) => {
      if (msg.actions[0].name !== 'like') {
        return;
      }
      console.log(msg);

      this.client.post('favorites/create', { id: msg.callback_id }, (err, tweet, res) => {
        const nextMsg = msg.original_message;
        nextMsg.attachments.push({
          color: '#00aced',
          text: `:heart: Liked by <@${msg.user}>`,
        });
        bot.replyInteractive(msg, nextMsg);
      });
    });
  }
}

module.exports = Like;
