class Search {
  constructor(sparrowbot) {
    this.controller = sparrowbot.controller;
    this.client = sparrowbot.twitterClient;
  }

  run() {
    this.controller.hears(['^search (.*)$', '^search$'], 'direct_mention', (bot, msg) => {
      const query = msg.match[1] && msg.match[1].trim();
      if (this.job) {
        bot.reply(msg, `Already searching by "${this.job.query}" :no_mouth:`);
        return;
      } else if (!query || query.length < 0) {
        bot.reply(msg, 'No query specified :cry:\nUsage: search "query"');
        return;
      }

      bot.botkit.log('Query:', query);
      bot.reply(msg, `OK:ok_hand: Start searching by "${query}"`);

      this.job = setInterval(() => {
        this.searchJob(bot, msg, query);
      }, 60000);
      this.job.query = query;
    });

    this.controller.hears(['stop searching', 'stop search'], 'direct_mention', (bot, msg) => {
      clearInterval(this.job);
      this.job = null;
      this.controller.storage.channels.save({ id: msg.channel, sinceTweetId: null });
      bot.reply(msg, 'OK:ok_hand: Stop searching');
    });

    this.controller.hears('status', 'direct_mention', (bot, msg) => {
      if (this.job) {
        bot.reply(msg, `Now searching by "${this.job.query}" :surfer:`);
      } else {
        bot.reply(msg, 'No searching :no_mouth:');
      }
    });
  }

  searchJob(bot, msg, query) {
    this.controller.storage.channels.get(msg.channel, (err, data) => {
      const sinceId = data && data.sinceTweetId;
      bot.botkit.log('Current SinceTweetId:', sinceId);
      bot.startTyping(msg);
      this.search(bot, msg, query, sinceId);
    });
  }

  search(bot, msg, query, sinceId = null) {
    this.client.get('search/tweets', {
      result_type: 'recent',
      q: query,
      since_id: sinceId,
    }, (err, tweets) => {
      if (err) {
        bot.botkit.log('Error: Twitter Stream ', err);
        return;
      } else if (tweets.statuses.length < 1) {
        bot.botkit.log('No Result');
        return;
      }

      this.controller.storage.channels.save({
        id: msg.channel,
        sinceTweetId: tweets.statuses[0] && tweets.statuses[0].id_str,
      });

      bot.botkit.log('Result Count:', tweets.statuses.length);
      tweets.statuses.forEach((tweet) => {
        bot.reply(msg, {
          attachments: [
            this.buildTweetAttachment(tweet),
          ],
        });
      });
    });
  }

  buildTweetAttachment(tweet) {
    return {
      author_name: `${tweet.user && tweet.user.name} @${tweet.user.screen_name}`,
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

module.exports = Search;
