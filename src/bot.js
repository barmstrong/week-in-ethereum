const Bot = require('./lib/Bot');
const FeedPoller = require('./lib/FeedPoller');
const SOFA = require('sofa-js');
/*

// Add new users
let users;
redisClient.get('users', function(err, value) {
  if (err) throw(err);
  if (value) {
    users = JSON.parse(value);
  } else {
    users = [];
  }
});

redisClient.set('users', JSON.stringify(users));
*/
let bot = new Bot();
let poller = new FeedPoller();
// poller.start(bot);

// CONSTANTS

const NAME = 'Week in Ethereum News';

const CONTROLS = {
  subscribe: {
    type: 'button',
    label: 'Subscribe to the newsletter 📩',
    value: 'subscribe'
  },
  unsubscribe: {
    type: 'button',
    label: 'Unsubscribe 👋',
    value: 'unsubscribe'
  },
  tip: {
    type: 'button',
    label: 'Tip 💸',
    value: 'tip'
  }
};

const AMOUNTS = {
  amount1: 0.01,
  amount2: 0.1,
  amount3: 0.5,
  amount4: 1.0,
}

// ROUTING

bot.onEvent = function(session, message) {
  console.log(message.type)
  switch (message.type) {
    case "Init":
      welcome(session);
      break;
    case "Message":
      onMessage(session, message);
      break;
    case "Command":
      onCommand(session, message);
      break;
    case "Payment":
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
      tip(session)
      break
    case 'amount1':
    case 'amount2':
    case 'amount3':
    case 'amount4':
      amount(session, command.content.value);
      break;
    case 'subscribe':
      subscribe(session)
      break
    case 'unsubscribe':
      unsubscribe(session)
      break
    }
};

// STATES

function onPayment(session) {
  let message = `Thank you for supporting '${NAME}' 🙏`;
  sendMessage(session, message);
};

function welcome(session) {
  let message = `Hi! Welcome to '${NAME}'. We keep you up to date with what's happening in the Ethereum community. Tap 'Subscribe' to get started.`;
  sendMessage(session, message);
};

function latest(session) {
  // Default response for subscribed users
  let article = poller.getLatestArticle();
  let message = `Hey! Check out the latest issue of '${NAME}': ${article.link}`;
  sendMessage(session, message);
};

function tip(session) {
  let controls = [];
  for (let key in AMOUNTS) {
    let val = AMOUNTS[key];
    controls.push({type: 'button', label: `${val} ETH`, value: key})
  }
  controls.push({type: 'button', label: `Cancel`, value: 'subscribe'})

  session.reply(SOFA.Message({
    body: "Choose an amount:",
    controls: [
      {type: 'button',label: '',value: 'subscribe'}
    ],
    showKeyboard: false,
  }));
};

function amount(session, command) {
  session.requestEth(AMOUNTS['amount'], `Tip to '${NAME}'`)
};

function subscribe(session) {
  session.set('subscribed', true)
  let article = poller.getLatestArticle();
  let message = `Thank you for subscribing 🙌. This is a weekly newsletter, so you will receive your next update within a week. For now, check out the latest issue: ${article.link}`;
  sendMessage(session, message);
};

function unsubscribe(session) {
  session.set('subscribed', false);
  let message = '😭 sorry to see you go. We hope you come back!'
  sendMessage(session, message);
};

// HELPERS

function sendMessage(session, message) {
  let controls = [];
  if (session.get('subscribed')) {
    controls = [
      CONTROLS.tip,
      CONTROLS.unsubscribe
    ];
  } else {
    controls = [CONTROLS.subscribe];
  }
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: false,
  }));
}
