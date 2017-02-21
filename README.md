# Token SOFA App

This repo helps you build a [Token app](https://www.tokenbrowser.com) in Javascript.

The [sample bot](src/bot.js) can:

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

Then check out [`src/bot.js`](src/bot.js) to start changing the bot logic.

## Architecture

When you deploy a Token app, your app consists of a few pieces.

* **token-headless-client** - This is a client that we provide. It is similar to the iOS or Android client except it runs headless without any UI. It handles encrypting all messages using the Signal protocol and speaking to the Token backend services.
* **bot.js** - This is where all your app logic lives. Your app most proxy all requests through the token-headless-client to ensure it communicates correctly with the Token backend services.
* **redis** - Redis pub/sub is used to help your bot and the token-headless-client communicate.

![diagram](http://i.imgur.com/7aLwv0S.png)

This sample bot also uses Postgres to store session and user data so that you can persist state for each user.

## See also

* [https://www.tokenbrowser.com]
