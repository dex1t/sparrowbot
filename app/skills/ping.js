class Ping {
  constructor(sparrowbot) {
    this.controller = sparrowbot.controller;
  }

  run() {
    this.controller.hears('ping', ['direct_message', 'direct_mention', 'mention'], (bot, msg) => {
      bot.reply(msg, 'pong');
    });
  }
}

module.exports = Ping;
