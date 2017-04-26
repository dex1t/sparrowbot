const Botkit = require('botkit');
const path = require('path');
const fs = require('fs');

class Bot {
  static run() {
    const controller = Botkit.slackbot({
      debug: !!process.env.DEBUG_MODE,
    });

    controller.spawn({
      token: process.env.SLACK_BOT_TOKEN,
    }).startRTM((err) => {
      if (err) {
        throw new Error(err);
      }
    });

    fs.readdirSync(path.join(__dirname, 'skills')).forEach((file) => {
      const Skill = require(`./skills/${file}`); // eslint-disable-line
      new Skill(controller).run();
    });
  }
}

module.exports = Bot;
