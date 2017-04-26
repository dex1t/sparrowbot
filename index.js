const Bot = require('./app/bot.js');

if (process.env.SLACK_BOT_TOKEN &&
    process.env.TWITTER_CONSUMER_KEY &&
    process.env.TWITTER_CONSUMER_SECRET &&
    process.env.TWITTER_ACCESS_TOKEN &&
    process.env.TWITTER_ACCESS_SECRET) {
  Bot.run();
} else {
  console.log('Error: Specify Slack Token and Twitter Token in environment');
  process.exit(1);
}
