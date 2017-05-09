class Reply {
  constructor(sparrowbot) {
    this.controller = sparrowbot.controller;
    this.client = sparrowbot.twitterClient;
  }

  run() {
    this.client.get('account/verify_credentials', (err, res) => {
      if (err) {
        this.controller.botkit.log('Error: account/verify_credentials', err);
      }
      this.myTwitter = res;
    });

    this.controller.on('interactive_message_callback', (bot, msg) => {
      if (msg.actions[0].name !== 'reply') return;

      const parentMsg = msg.original_message;
      parentMsg.channel = msg.channel;
      parentMsg.user = msg.user; // ask user who pressed reply button

      const askReplyContent = (res, convo) => {
        convo.ask(`<@${parentMsg.user}> Please write your reply here :writing_hand:`, [
          {
            default: true,
            callback: (r, c) => {
              const replyText = `@${msg.actions[0].value} ${r.text}`;
              c.say({
                text: 'Would you like to post this reply? :rocket:',
                attachments: [{
                  author_name: `@${this.myTwitter.screen_name}`,
                  author_icon: this.myTwitter.profile_image_url_https,
                  text: replyText,
                  fallback: replyText,
                  color: this.myTwitter.profile_link_color,
                  callback_id: msg.callback_id,
                  actions: [
                    {
                      type: 'button',
                      name: 'tweet-post',
                      text: 'Post',
                      value: replyText,
                      style: 'primary',
                    },
                    {
                      type: 'button',
                      name: 'tweet-cancel',
                      text: 'Cancel',
                    },
                  ],
                }],
              });
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
