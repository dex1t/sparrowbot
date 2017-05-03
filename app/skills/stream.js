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
    this.controller.hears('^start streaming(.*)$', 'direct_mention', (bot, msg) => {
      const query = msg.match[1].trim();
      if (this.stream) {
        bot.reply(msg, `Already streaming by "${this.stream.query}" :no_mouth:`);
        return;
      } else if (query.length < 1) {
        bot.reply(msg, 'No filter specified :cry:\nUsage: start streaming "Twitter search query"')
        return;
      }

      bot.botkit.log('Streaming Query:', query);
      bot.reply(msg, `OK:ok_hand: Start streaming by ${query}`);
      this.startStreaming(bot, msg, query);
    });

    this.controller.hears('stop streaming', 'direct_mention', (bot, msg) => {
      if (this.stream) {
        this.stream.destroy();
        this.stream = null;
        bot.reply(msg, 'OK:ok_hand: Stop streaming');
      } else {
        bot.reply(msg, 'Stream is not found :no_mouth:');
      }
    });
  }

  startStreaming(bot, msg, track) {
    this.stream = this.client.stream('statuses/filter', { track });
    this.stream.query = track;
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
      footer: 'Twitter',
      footer_icon: 'https://a.slack-edge.com/6e067/img/services/twitter_pixel_snapped_32.png',
      ts: new Date(Date.parse(tweet.created_at)).getTime() / 1000,
      fallback: tweet.text,
      callback_id: tweet.id_str,
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
