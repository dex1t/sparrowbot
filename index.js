const Botkit = require('botkit');

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

const controller = Botkit.slackbot({
  debug: false,
});

controller.spawn({
  token: process.env.token,
}).startRTM((err) => {
  if (err) {
    throw new Error(err);
  }
});

// say hi
controller.hears('hi', ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, 'hi');
});
