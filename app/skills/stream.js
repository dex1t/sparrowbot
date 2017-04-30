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
      bot.reply(msg, {
        attachments: [
          this.buildTweetAttachment(tweet),
        ],
      });
    });
    this.stream.on('error', (error) => {
      bot.botkit.log('Error: Twitter Stream ', error);
    });
  }

  buildTweetAttachment(tweet) {
    return {
      author_name: `${tweet.user.name} @${tweet.user.screen_name}`,
      author_icon: tweet.user.profile_image_url_https,
      author_link: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
      text: tweet.text,
      color: '#00aced',
      footer: 'Twitter',
      footer_icon: 'https://a.slack-edge.com/6e067/img/services/twitter_pixel_snapped_32.png',
      ts: new Date(Date.parse(tweet.created_at)).getTime() / 1000,
      fallback: tweet.text,
      callback_id: tweet.id_str,
      attachment_type: 'default',
      actions: [
        {
          name: 'like',
          text: 'Like',
          type: 'button',
        },
        {
          name: 'retweet',
          text: 'Retweet',
          type: 'button',
        },
      ],
    };
  }
}

module.exports = Stream;
