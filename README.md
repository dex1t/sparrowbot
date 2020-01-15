# Sparrowbot

a Slack Bot to interact with Twitter for Customer Success :robot:

## Features

- [x] Search
- [x] Like/Unlike
- [x] Retweet/Unretweet
- [x] Reply via Slack Thread

<img src='https://user-images.githubusercontent.com/870741/72449868-ba978580-37fc-11ea-88d3-627208e10037.png' width='500px'/>

## Set up
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

1. Create [Slack application for bot user](https://api.slack.com/apps?new_app=1). Then enable the interactive messages feature and bot feature.
2. Install Slack application to your Slack team.
3. Create [Twitter application](https://apps.twitter.com/app/new) to interact with your Twitter account.
4. Deploy Sparrowbot to Heroku, then set Slack and Twitter Token to Heroku config variables.
5. Set `https://your-domain.herokuapp.com/oauth` to redirect url on your Slack App [oauth setting](https://api.slack.com/apps/).
6. Set `https://your-domain.herokuapp.com/slack/receive` to request url on your Slack App [interactive message setting](https://api.slack.com/apps/).
7. Authorize your account on `https://your-app.herokuapp.com/login/` .

## Development

Slack requires callback url with https to use the interactive message buttons. Use [localtunnel.me](http://localtunnel.me/) (or ngrock) on development.  

```
$ lt -p 8080 -s sparrowbot-dev
$ nf start
```
