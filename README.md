# Sparrowbot

a Slack Bot to interact with Twitter for Customer Success :bird:

## Features

- [x] Streaming
- [x] Favorite
- [ ] Retweet
- [ ] Reply via Slack Thread
- [ ] Tweet

## Deployment

1. Create [Slack application for bot user](https://api.slack.com/apps?new_app=1). Then enable the interactive messages feature and bot feature.
2. Install Slack application to your Slack team.
3. Create [Twitter application](https://apps.twitter.com/app/new) to interact with your Twitter account.
4. Deploy Sparrowbot to Heroku, then set Slack and Twitter Token to Heroku config variables.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Development Note

Slack requires callback url with https to use the interactive message buttons. Use [localtunnel.me](http://localtunnel.me/) (or ngrock) on development.  
https://github.com/howdyai/botkit/blob/master/docs/readme-slack.md#message-buttons
