class Ping {
  constructor(controller) {
    this.controller = controller;
  }

  run() {
    this.controller.hears('ping', ['direct_message', 'direct_mention', 'mention'], (bot, message) => {
      bot.reply(message, 'pong');
    });
  }
}

module.exports = Ping;
