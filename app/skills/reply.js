const emojiConvertor = require('emoji-js');

class Reply {
  constructor(sparrowbot) {
    this.controller = sparrowbot.controller;
    this.client = sparrowbot.twitterClient;

    this.emojiConvertor = new emojiConvertor();
    this.emojiConvertor.init_env();
    this.emojiConvertor.replace_mode = 'unified';
  }

  run() {
    this.client.get('account/verify_credentials', (err, res) => {
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
              let replyText = `@${msg.actions[0].value} ${this.replaceEmojiSyntax(r.text)}`;
              replyText = this.removeSlackLink(replyText);
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

  replaceEmojiSyntax(text) {
    const nativeEmojiText = this.emojiConvertor.replace_colons(text);
    return nativeEmojiText.replace(/:[a-zA-Z0-9-_+]+:/g, '');
  }

  removeSlackLink(text) {
    return text.replace(/<(http|https):\/\/[^<>]+>/g, m => m.replace(/(^<|>$)/g, "").split('|').pop());
  }
}

module.exports = Reply;
