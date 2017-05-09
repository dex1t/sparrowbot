class Reply {
  constructor(sparrowbot) {
    this.controller = sparrowbot.controller;
    this.client = sparrowbot.twitterClient;
  }

  run() {
    this.controller.on('interactive_message_callback', (bot, msg) => {
      if (msg.actions[0].name !== 'reply') return;

      const parentMsg = msg.original_message;
      parentMsg.channel = msg.channel;
      parentMsg.user = msg.user; // ask user who pressed reply button

      const confirmReply = (res, convo) => {
        convo.ask('これでツイートしてOK?', [
          {
            pattern: bot.utterances.yes,
            callback: (r, c) => {
              c.say(`Cool. ${msg.callback_id} ${msg.actions[0].value} ${res.text}`);
              c.next();
            },
          },
          {
            pattern: bot.utterances.no,
            callback: (r, c) => {
              c.say('Cancelled :ghost:');
              c.next();
            },
          },
        ]);
      };

      const askReplyContent = (res, convo) => {
        convo.ask(`<@${parentMsg.user}> How do you reply?`, [
          {
            default: true,
            callback: (r, c) => {
              confirmReply(r, c);
              c.next();
            },
          },
          {
            pattern: bot.utterances.no,
            callback: (r, c) => {
              c.say('Cancelled :ghost:');
              c.next();
            },
          },
        ]);
      };

      bot.startConversationInThread(parentMsg, askReplyContent);
    });
  }
}

module.exports = Reply;
