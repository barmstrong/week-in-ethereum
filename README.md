# Token SOFA App

This repo helps you build a [Token app](https://www.tokenbrowser.com) with Javascript.

We provide a [sample bot](https://github.com/tokenbrowser/token-app-js/tree/master/src) that can:

* send messages
* send and request money
* create simple UI for buttons and menus
* store sessions and state for each user

TODO

* sending image messages
* creating web view UIs

## Launch your own Token app in 5 minutes

Read our [guide to creating a Token app](http://developers.tokenbrowser.com/docs/creating-a-token-app).

When ready, fork this repo and deploy it to Heroku or run it locally with `docker-compose up`.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Then check out [`bot.js`](src/bot.js) to start changing the bot logic.

## Architecture



This bot has a Redis backend for storage. It converts your standard messages into SOFA messages, and then encrypts them to use the Signal protocol for end-to-end encryption.

## See also

See [https://www.tokenbrowser.com]
