const Botkit = require('botkit');
const path = require('path');
const fs = require('fs');
const url = require('url');
const redis = require('botkit-storage-redis');

class Bot {
  static run() {
    const redisURL = url.parse(process.env.REDIS_URL);
    const redisStorage = redis({
      namespace: 'sparrowbot-dev',
      host: redisURL.hostname,
      port: redisURL.port,
      auth_pass: redisURL.auth && redisURL.auth.split(':')[1],
    });

    const controller = Botkit.slackbot({
      debug: false,
      clientId: process.env.SLACK_APP_CLIENT_ID,
      clientSecret: process.env.SLACK_APP_CLIENT_SECRET,
      scopes: ['bot'],
      storage: redisStorage,
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
