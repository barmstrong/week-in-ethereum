# Creating A Token app

TODO Nice animated gif

This repository makes it easy to build and launch a new Token app in as little as 5 minutes.

It handles the complex logic of generating [SOFA](https://www.tokenbrowser.com/token-sofa-spec/) messages and encrypting them properly using the [Signal protocol](https://en.wikipedia.org/wiki/Signal_Protocol).

## Steps

### 1. Fork this repo

### 2. Generate a 12 word seed and store it securely

### 3. Deploy to Heroku (or with Docker)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/tokenbrowser/token-sofa-app)

### 4. Connect to your app

### 5. Make changes


## Architecture

This bot has a Redis backend for storage. It converts your standard messages into SOFA messages, and then encrypts them to use the Signal protocol for end-to-end encryption.

![Connection Diagram](docs/images/connections.png)

## See also

See [https://www.tokenbrowser.com]
