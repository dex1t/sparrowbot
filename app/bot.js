const Botkit = require('botkit');
const path = require('path');
const fs = require('fs');

class Bot {
  static run() {
    const controller = Botkit.slackbot({
      debug: false,
      clientId: process.env.SLACK_APP_CLIENT_ID,
      clientSecret: process.env.SLACK_APP_CLIENT_SECRET,
      scopes: ['bot'],
      json_file_store: './',
    });

    controller.spawn({
      token: process.env.SLACK_BOT_TOKEN,
    }).startRTM((err) => {
      if (err) {
        throw new Error(err);
      }
    });

    controller.setupWebserver(process.env.PORT, () => {
      controller.createOauthEndpoints(controller.webserver, (err, req, res) => {
        if (err) {
          res.status(500).send(`ERROR: ${err}`);
        } else {
          res.send('Success!');
        }
      });
      controller.createWebhookEndpoints(controller.webserver);
    });

    fs.readdirSync(path.join(__dirname, 'skills')).forEach((file) => {
      const Skill = require(`./skills/${file}`); // eslint-disable-line
      new Skill(controller).run();
    });
  }
}

module.exports = Bot;
