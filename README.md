# Creating A Token app

This repository makes it easy to build and launch a new Token app in as little as 5 minutes :rocket:

TODO Nice animated gif

This repo handles the complex logic of generating [SOFA](https://www.tokenbrowser.com/token-sofa-spec/) messages and encrypting them properly using the [Signal protocol](https://en.wikipedia.org/wiki/Signal_Protocol), so that you can focus on bot logic.

## Steps

### 1. Fork this repo

Click Fork in the top right and get your own copy.

### 2. Generate a 12 word seed and store it securely

Visit Ian Coleman's [bip39 generator page](https://iancoleman.github.io/bip39/) and select "12 words" and "Ethereum", then click "Generate".

![generate seed](http://i.imgur.com/i8NDduY.png)

Copy the 12 word phrase and store this in a password manager or somewhere secure. If you lose this phrase you will lose access to your money. Likewise, if an attacker gets access to it they can take your money.

Note: You can use any tool to generate the seed, this is just one method. Note that the last word is a checksum, so you can't just make up the words.

### 3. Deploy to Heroku (or with Docker)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/tokenbrowser/token-sofa-app)

### 4. Connect to your app

### 5. Make changes


## Architecture

This bot has a Redis backend for storage. It converts your standard messages into SOFA messages, and then encrypts them to use the Signal protocol for end-to-end encryption.

![Connection Diagram](docs/images/connections.png)

## See also

See [https://www.tokenbrowser.com]
