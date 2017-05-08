class Retweet {
  constructor(sparrowbot) {
    this.controller = sparrowbot.controller;
    this.client = sparrowbot.twitterClient;
  }

  run() {
    this.controller.on('interactive_message_callback', (bot, msg) => {
      switch (msg.actions[0].name) {
        case 'retweet':
          this.retweet(bot, msg);
          break;
        case 'unretweet':
          this.unretweet(bot, msg);
          break;
        default:
          bot.botkit.log('No action:', msg.actions);
      }
    });
  }

  retweet(bot, msg) {
    this.client.post('statuses/retweet', { id: msg.callback_id }, () => {
      const nextMsg = msg.original_message;

      const action = nextMsg.attachments[0].actions.find(act => act.name === 'retweet');
      action.name = 'unretweet';
      action.text = 'Unretweet';
      action.style = 'danger';

      nextMsg.attachments.push({ text: `:recycle: Retweeted by <@${msg.user}>` });
      bot.replyInteractive(msg, nextMsg);
    });
  }

  unretweet(bot, msg) {
    this.client.post('statuses/unretweet', { id: msg.callback_id }, () => {
      const nextMsg = msg.original_message;

      const action = nextMsg.attachments[0].actions.find(act => act.name === 'unretweet');
      action.name = 'retweet';
      action.text = 'Retweet';
      action.style = null;

      const removeIdx = nextMsg.attachments.findIndex(attach => attach.text && attach.text.includes('Retweeted'));
      nextMsg.attachments.splice(removeIdx, 1);

      bot.replyInteractive(msg, nextMsg);
    });
  }
}

module.exports = Retweet;
