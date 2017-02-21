# Token SOFA App

This repo helps you build a [Token app](https://www.tokenbrowser.com) in Javascript.

The sample bot can:

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

Deploying a Token app requires a few pieces:

* **token-headless-client**<br>
  This is a client that we provide (similar to the iOS or Android client) that provides a wrapper around the Token backend services, and handles end-to-end encrypting all messages using the Signal protocol.
* **redis**<br>
  We use redis pub/sub to provide a connection between the token-headless-client and your bot. All requests to and from your bot are proxied through the token-headless-client process they can reach the Token backend.
* **bot.js**<br>
  This is where all your app logic lives.

![diagram](http://i.imgur.com/7aLwv0S.png)

This sample bot also uses Postgres to store session and user data so that you can persist state for each user.

## See also

* [https://www.tokenbrowser.com]
