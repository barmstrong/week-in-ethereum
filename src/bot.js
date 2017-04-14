const Bot = require('./lib/Bot');
const FeedPoller = require('./lib/FeedPoller');
const SOFA = require('sofa-js');
const constants = require('./lib/constants');
const Fiat = require('./lib/Fiat');

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
  poller.isSubscribed(session.get('tokenId'), function(err, subscribed) {
    if (subscribed) {
      latest(session);
    } else {
      welcome(session);
    }
  });
};

function onCommand(session, command) {
  switch (command.content.value) {
    case 'latest':
      latest(session);
      break;
    case 'tip':
      tip(session);
      break;
    case 'about':
      about(session);
      break;
    case 'historical':
      historical(session);
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
  let article = poller.latestArticle();
  let message = `Check out the latest issue of '${constants.NAME}': ${article.link}`;
  sendMessage(session, message);
};

function tip(session) {
  let controls = [];
  for (let key in constants.AMOUNTS) {
    let val = constants.AMOUNTS[key];
    controls.push({type: 'button', label: `$${val}`, value: key})
  }
  controls.push({type: 'button', label: `Cancel`, value: 'cancel'})

  session.reply(SOFA.Message({
    body: "Choose an amount:",
    controls: controls,
    showKeyboard: false,
  }));
};

function amount(session, command) {
  // fetch exchange rates once a minute
  Fiat.fetch(1000 * 1).then((toEth) => {
    session.requestEth(toEth.USD(constants.AMOUNTS[command]), `Help support '${constants.NAME}'`)
  });
};

function about(session) {
  let message = `This Week In Ethereum is published by Evan Van Ness. It is a weekly collection of the latest news in the Ethereum community.`;
  sendMessage(session, message);
};

function historical(session) {
  let message = "Here are some recent articles:\n";
  let count = 0;
  poller.articlesList().forEach(function(article) {
    count = count + 1;
    if (count > 5)
      return
    let date = article.date.toString().split(' ').slice(0,4).join(' ');
    message = message + `${date}\n${article.link}\n`
    // message = message + `${typeof(article.date)}\n${article.link}\n`
  });
  sendMessage(session, message);
};

function subscribe(session) {
  poller.addUser(session);
  session.reply(`Thank you for subscribing 🙌. We'll notify you whenever a new article comes out (about once a week).`);
  latest(session);
};

function unsubscribe(session) {
  poller.removeUser(session);
  let message = '😭 sorry to see you go. We hope you come back!'
  sendMessage(session, message);
};

// HELPERS

function sendMessage(session, message) {
  // redisClient.sismember('users', session.get('tokenId'), function(err, subscribed) {
  poller.isSubscribed(session.get('tokenId'), function(err, subscribed) {
    let controls = [];
    if (subscribed) {
      controls = constants.SUBSCRIBED_CONTROLS;
    } else {
      controls = constants.UNSUBSCRIBED_CONTROLS;
    }
    session.reply(SOFA.Message({
      body: message,
      controls: controls,
      showKeyboard: false,
    }));
  });
}
