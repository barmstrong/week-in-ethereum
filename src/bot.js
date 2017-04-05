const Bot = require('./lib/Bot');
const FeedPoller = require('./lib/FeedPoller');
const SOFA = require('sofa-js');
const constants = require('./lib/constants');

let bot = new Bot();
let poller = new FeedPoller(bot);

// ROUTING
bot.onEvent = function(session, message) {
  switch (message.type) {
    case 'Init':
      welcome(session);
      break;
    case 'Message':
      onMessage(session, message);
      break;
      case 'Command':
      onCommand(session, message);
      break;
    case 'Payment':
      onPayment(session);
      break;
  }
};

function onMessage(session, message) {
  if (session.get('subscribed')) {
    latest(session);
  } else {
    welcome(session);
  }
};

function onCommand(session, command) {
  switch (command.content.value) {
    case 'tip':
      tip(session);
      break;
    case 'amount1':
    case 'amount2':
    case 'amount3':
    case 'amount4':
      amount(session, command.content.value);
      break;
    case 'subscribe':
      subscribe(session)
      break
    case 'cancel':
    case 'latest':
      latest(session)
      break
    case 'unsubscribe':
      unsubscribe(session)
      break
    }
};

// STATES

function onPayment(session) {
  let message = `Thank you for supporting '${constants.NAME}' 🙏`;
  sendMessage(session, message);
};

function welcome(session) {
  let message = `Hi! Welcome to '${constants.NAME}'. We keep you up to date with what's happening in the Ethereum community. Tap 'Subscribe' to get started.`;
  sendMessage(session, message);
};

function latest(session) {
  // Default response for subscribed users
  let article = poller.getLatestArticle();
  let message = `Hey! Check out the latest issue of '${constants.NAME}': ${article.link}`;
  sendMessage(session, message);
};

function tip(session) {
  let controls = [];
  for (let key in constants.AMOUNTS) {
    let val = constants.AMOUNTS[key];
    controls.push({type: 'button', label: `${val} ETH`, value: key})
  }
  controls.push({type: 'button', label: `Cancel`, value: 'cancel'})

  session.reply(SOFA.Message({
    body: "Choose an amount:",
    controls: controls,
    showKeyboard: false,
  }));
};

function amount(session, command) {
  session.requestEth(constants.AMOUNTS[command], `Tip to '${constants.NAME}'`)
};

function subscribe(session) {
  session.set('subscribed', true)
  poller.addUser(session);
  let article = poller.getLatestArticle();
  let message = `Thank you for subscribing 🙌. This is a weekly newsletter, so you will receive your next update within a week. For now, check out the latest issue: ${article.link}`;
  sendMessage(session, message);
};

function unsubscribe(session) {
  session.set('subscribed', false);
  poller.removeUser(session);
  let message = '😭 sorry to see you go. We hope you come back!'
  sendMessage(session, message);
};

// HELPERS

function sendMessage(session, message) {
  let controls = [];
  if (session.get('subscribed')) {
    controls = [
      constants.CONTROLS.latest,
      constants.CONTROLS.tip,
      constants.CONTROLS.unsubscribe
    ];
  } else {
    controls = [
      constants.CONTROLS.latest,
      constants.CONTROLS.subscribe
    ];
  }
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: false,
  }));
}
