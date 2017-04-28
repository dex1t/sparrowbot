# Sparrowbot

a Slack Bot to interact with Twitter for Customer Success :bird:

## Features

- [x] Streaming
- [ ] Favorite
- [ ] Retweet
- [ ] Reply via Slack Thread
- [ ] Tweet

## Usage

- Create [Slack Bot as application](https://api.slack.com/apps?new_app=1), and get _Bot User OAuth Access Token_
  - Enable Interactive Messages and Bots
  - Set callback url to enable interactive message
- Create [Twitter application](https://apps.twitter.com/app/new), and get _Consumer Key/Secret_, _Access Token/Secret_
- Set token to `.env`

## Development Note

Slack requires callback url with https to use the interactive message buttons. Use [localtunnel.me](http://localtunnel.me/) (or ngrock) on development.  
https://github.com/howdyai/botkit/blob/master/docs/readme-slack.md#message-buttons
