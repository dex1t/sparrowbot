const Bot = require("./app/bot.js");

if (
  process.env.REDIS_URL &&
  process.env.SLACK_BOT_TOKEN &&
  process.env.SLACK_APP_CLIENT_ID &&
  process.env.SLACK_APP_CLIENT_SECRET &&
  process.env.TWITTER_CONSUMER_KEY &&
  process.env.TWITTER_CONSUMER_SECRET &&
  process.env.TWITTER_ACCESS_TOKEN &&
  process.env.TWITTER_ACCESS_SECRET
) {
  new Bot().run();
} else {
  console.log("Error: Specify Slack Token and Twitter Token in environment");
  process.exit(1);
}
