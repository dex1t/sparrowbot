class Like {
  constructor(sparrowbot) {
    this.controller = sparrowbot.controller;
    this.client = sparrowbot.twitterClient;
  }

  run() {
    this.controller.on('interactive_message_callback', (bot, msg) => {
      switch (msg.actions[0].name) {
        case 'like':
          this.like(bot, msg);
          break;
        case 'unlike':
          this.unlike(bot, msg);
          break;
        default:
          // do nothing
      }
    });
  }

  like(bot, msg) {
    this.client.post('favorites/create', { id: msg.callback_id }, () => {
      const nextMsg = msg.original_message;

      const action = nextMsg.attachments[0].actions.find(act => act.name === 'like');
      action.name = 'unlike';
      action.text = 'Unlike';
      action.style = 'danger';

      nextMsg.attachments.push({ text: `:heart: Liked by <@${msg.user}>` });
      bot.replyInteractive(msg, nextMsg);
    });
  }

  unlike(bot, msg) {
    this.client.post('favorites/destroy', { id: msg.callback_id }, () => {
      const nextMsg = msg.original_message;

      const action = nextMsg.attachments[0].actions.find(act => act.name === 'unlike');
      action.name = 'like';
      action.text = 'Like';
      action.style = null;

      const removeIdx = nextMsg.attachments.findIndex(attach => attach.text && attach.text.includes('Liked'));
      nextMsg.attachments.splice(removeIdx, 1);

      bot.replyInteractive(msg, nextMsg);
    });
  }
}

module.exports = Like;
