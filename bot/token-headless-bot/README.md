# Token Headless Bot

This Node.js package provides a framework for the simple authoring of bots that control
a [token-headless-client](https://github.com/tokenbrowser/token-headless-client) instance.

If you are authoring a Token bot, you should consider grabbing [token-sofa-app](https://github.com/tokenbrowser/token-sofa-app)
instead - it composes and configures everything you need to easily deploy a bot for Token, including this package.


## Installation

```bash
npm install token-sofa-bot
```

## Usage

```javascript
const SOFA = require('token-headless-bot').SOFA;
const Bot = require('token-headless-bot').Bot;

let bot = new Bot();

bot.hear('yes', (session, message) => {
  session.reply(SOFA.Message({
    body: "Choose a charity to make a donation of $0.01.",
    controls: [
      {type: "button", label: "Red Cross", value: "red-cross"},
      {type: "button", label: "Ethereum foundation", value: "ethereum-foundation"},
      {type: "button", label: "GiveWell.org", value: "givewell.org"},
      {type: "button", label: "Not now, thanks", value: null}
    ]
  }));
})
```
