class Search {
  constructor(sparrowbot) {
    this.controller = sparrowbot.controller;
    this.client = sparrowbot.twitterClient;
    this.searchState = {};
    this.job = {};
  }

  run() {
    // resume
    this.controller.on('rtm_open', (bot) => {
      this.controller.storage.channels.all((err, channels) => {
        channels.forEach((channel) => {
          if (!channel.searchState) return;

          this.searchState[channel.id] = {
            query: channel.searchState.query,
            sinceId: channel.searchState.sinceId,
          };

          this.job[channel.id] = this.searchRequestJob(bot, channel.id, channel.searchState.query);
          console.log('Resume:', this.searchState);
        });
      });
    });

    this.controller.hears(['^search (.*)$', '^search$'], 'direct_mention', (bot, msg) => {
      const query = msg.match[1] && msg.match[1].trim();
      const id = msg.channel;

      if (this.searchState[id] && this.searchState[id].query) {
        bot.reply(msg, 'Already searching :no_mouth:');
        return;
      } else if (!query || query.length < 0) {
        bot.reply(msg, 'No query specified :cry:\nUsage: search "query"');
        return;
      }

      bot.botkit.log('Query:', query);
      bot.reply(msg, `OK:ok_hand: Start searching by "${query}"`);

      this.searchRequest(bot, id, query);
      this.job[id] = this.searchRequestJob(bot, id, query);
    });

    this.controller.hears(['stop searching', 'stop search'], 'direct_mention', (bot, msg) => {
      const id = msg.channel;

      clearInterval(this.job[id]);
      this.searchState[id] = null;
      this.controller.storage.channels.save({ id, searchState: null });

      bot.reply(msg, 'OK:ok_hand: Stop searching');
    });

    this.controller.hears('status', 'direct_mention', (bot, msg) => {
      const id = msg.channel;

      if (this.searchState[id] && this.searchState[id].query) {
        bot.reply(msg, `Now searching by "${this.searchState[id].query}" :surfer:`);
      } else {
        bot.reply(msg, 'No searching :no_mouth:');
      }
    });
  }

  searchRequestJob(bot, id, query) {
    return setInterval(() => {
      bot.say({ channel: id, type: 'typing' });
      this.searchRequest(bot, id, query);
    }, 60000);
  }

  searchRequest(bot, id, query) {
    const sinceId = this.searchState[id] && this.searchState[id].sinceId;
    bot.botkit.log('Current SinceTweetId:', sinceId);

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

      const nextSinceId = tweets.statuses[0] && tweets.statuses[0].id_str;
      this.searchState[id] = {
        query,
        sinceId: nextSinceId,
      };
      this.controller.storage.channels.save({
        id,
        searchState: {
          query,
          sinceId: nextSinceId,
        },
      });

      bot.botkit.log('Result Count:', tweets.statuses.length);
      tweets.statuses.forEach((tweet) => {
        bot.say({
          channel: id,
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
        {
          name: 'reply',
          text: 'Reply',
          type: 'button',
          value: tweet.user.screen_name,
        },
      ],
    };
  }
}

module.exports = Search;
