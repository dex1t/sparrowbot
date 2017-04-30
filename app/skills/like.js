const Twitter = require('twitter');

class Like {
  constructor(controller) {
    this.controller = controller;
    this.client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_SECRET,
    });
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
