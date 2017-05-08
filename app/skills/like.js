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

      this.client.post('favorites/create', { id: msg.callback_id }, () => {
        const nextMsg = msg.original_message;

        const action = nextMsg.attachments[0].actions.find(act => act.name === 'like');
        action.name = 'unlike';
        action.text = 'Unlike';
        action.style = 'danger';

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
