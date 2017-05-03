const Botkit = require('botkit');
const path = require('path');
const fs = require('fs');
const url = require('url');

const redisURL = url.parse(process.env.REDISTOGO_URL || process.env.REDIS_URL);
const redisStorage = require('botkit-storage-redis')({
  namespace: 'sparrowbot',
  host: redisURL.hostname,
  port: redisURL.port,
  auth_pass: redisURL.auth && redisURL.auth.split(':')[1],
});

class Bot {
  constructor() {
    this.controller = Botkit.slackbot({
      retry: 10,
      clientId: process.env.SLACK_APP_CLIENT_ID,
      clientSecret: process.env.SLACK_APP_CLIENT_SECRET,
      scopes: ['bot'],
      storage: redisStorage,
    });
  }

  setupWebserver() {
    this.controller.setupWebserver(process.env.PORT, () => {
      this.controller.createOauthEndpoints(this.controller.webserver, (err, req, res) => {
        if (err) {
          res.status(500).send(`ERROR: ${err}`);
        } else {
          res.send('Success!');
        }
      });
      this.controller.createWebhookEndpoints(this.controller.webserver);
      this.controller.createHomepageEndpoint(this.controller.webserver);
    });
  }

  setupSkills() {
    fs.readdirSync(path.join(__dirname, 'skills')).forEach((file) => {
      const Skill = require(`./skills/${file}`); // eslint-disable-line
      new Skill(this.controller).run();
    });
  }

  run() {
    this.controller.spawn({
      token: process.env.SLACK_BOT_TOKEN,
    }).startRTM((err) => {
      if (err) {
        throw new Error(err);
      }
    });
    this.setupWebserver();
    this.setupSkills();
  }
}

module.exports = Bot;
