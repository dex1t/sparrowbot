const Twitter = require('twitter');

class Stream {
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
    this.controller.hears('start', 'direct_mention', (bot, msg) => {
      if (this.stream) {
        bot.reply(msg, `already streaming by '${this.stream.track}'`);
      } else {
        bot.reply(msg, 'start streaming');
        this.startStreaming(bot, msg);
      }
    });

    this.controller.hears('stop', 'direct_mention', (bot, msg) => {
      if (this.stream) {
        this.stream.destroy();
        this.stream = null;
        bot.reply(msg, 'stop streaming');
      } else {
        bot.reply(msg, 'stream is not found');
      }
    });
  }

  startStreaming(bot, msg) {
    const track = 'プレミアムフライデー';

    this.stream = this.client.stream('statuses/filter', { track });
    this.stream.track = track;
    this.stream.on('data', (tweet) => {
      const url = `http://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
      bot.reply(msg, {
        text: url,
      });
    });
    this.stream.on('error', (error) => {
      bot.botkit.log('Error: Twitter Stream ', error);
    });
  }
}

module.exports = Stream;
