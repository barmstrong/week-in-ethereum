# Token SOFA App

This repository helps you create a Token app that uses the SOFA protocol.

See [this guide to creating a Token app](http://developers.tokenbrowser.com/docs/creating-a-token-app) in as little as 5 minutes.

## Architecture

This bot has a Redis backend for storage. It converts your standard messages into SOFA messages, and then encrypts them to use the Signal protocol for end-to-end encryption.

![Connection Diagram](docs/images/connections.png)

## See also

See [https://www.tokenbrowser.com]
