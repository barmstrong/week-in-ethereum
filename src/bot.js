const SOFA = require('sofa-js');
const Bot = require('./lib/Bot');

let bot = new Bot();


function sendEth(session, value) {
  session.rpc({
    method: "sendTransaction",
    params: {
      to: session.get('paymentAddress'),
      value: value
    }
  }, (session, error, result) => {
    if (result) {
      session.reply(SOFA.Payment({
        status: "unverified",
        value: value,
        txHash: result.txHash
      }));
    }
  });
}


bot.hear('SOFA::PaymentRequest:', (session, message) => {
  let value = parseInt(message.content.value.slice(2), 16);
  if (!session.get("paymentAddress")) {
    session.reply("I don't know where to pay you! I'm requesting your client to initialize, one sec.");
    session.reply(SOFA.InitRequest({
      values: ['paymentAddress', 'language']
    }));
    return;
  }

  if (value < 546881485900000000) {
    if (session.get('human')) {
      session.reply("Ok! I'll send you some cash.")
      sendEth(session, message.content.value)
    } else {
      session.set('ethRequestPendingCaptcha', message.content.value)
      session.openThread('captcha')
    }
  } else {
    session.reply("I have a $5 maximum.");
  }
})


bot
  .thread('captcha')
  .onOpen = (session) => {
    session.reply("I need you to prove you're human. Type the numbers below:")
    session.reply("123")
    session.set('captcha', '123')
    session.set('captcha_attempts', 3)
    session.setState('awaiting_captcha_solve')
  }


bot
  .thread('captcha')
  .state('awaiting_captcha_solve')
  .hear('SOFA::Message:', (session, message) => {
    console.log(message.content.body)
    console.log(session.get('captcha'))
    if (message.content.body == session.get('captcha')) {
      session.set('human', true)
      session.reply('Correct!')
      sendEth(session, session.get('ethRequestPendingCaptcha'))
      session.closeThread()
    } else {
      if (session.get('captcha_attempts') > 0) {
        session.set('captcha_attempts', session.get('captcha_attempts')-1)
        session.reply('Incorrect, try again')
      } else {
        session.reply('Too many failures. #bye')
        session.closeThread()
      }
    }
  })


bot.hear('ping', (session, message) => {
  session.rpc({
    method: "ping",
    params: {}
  }, (session, error, result) => {
    console.log(result);
    session.reply(result.message);
  });
})

bot.hear('reset', (session, message) => {
  session.reset()
  session.reply(SOFA.Message({body: "I've reset your state."}));
})

bot.hear('SOFA::Init:', (session, message) => {
  for(let k in message.content) {
    session.set(k, message.content[k]);
  }
  session.reply("Initialized with paymentAddress "+message.content.paymentAddress+" and language "+message.content.language);
})

bot.hear('SOFA::Payment:', (session, message) => {
  session.reply("Thanks for the loot.");
})

bot.hear('initMe', (session, message) => {
  session.reply(SOFA.InitRequest({
    values: ['paymentAddress', 'language']
  }));
})

bot.hear('begMe', (session, message) => {
  session.reply(SOFA.PaymentRequest({
    body: "Thanks for the great time! Can you send your share of the tab?",
    value: "0xce0eb154f900000",
    destinationAddress: "0x056db290f8ba3250ca64a45d16284d04bc6f5fbf"
  }));
})

bot.hear('SOFA::Command:', (session, message) => {
  session.reply("I was commanded: "+message.content.value);
})

bot.hear('buttons', (session, message) => {
  session.reply(SOFA.Message({
    body: "Now let’s try sending some money. Choose a charity to make a donation of $0.01.",
    controls: [
      {type: "button", label: "Red Cross", value: "red-cross"},
      {type: "button", label: "Ethereum foundation", value: "ethereum-foundation"},
      {type: "button", label: "GiveWell.org", value: "givewell.org"},
      {type: "button", label: "Not now, thanks", value: null}
    ]
  }));
})

bot.hear('groups', (session, message) => {
  session.reply(SOFA.Message({
    body: "What would you like me to do for you right now?",
    controls: [
      {
        type: "group",
        label: "Trip",
        controls: [
          {type: "button", label: "Directions", action: "Webview:/Directions"},
          {type: "button", label: "Timetable", value: "timetable"},
          {type: "button", label: "Exit Info", value: "exit"},
          {type: "button", label: "Service Conditions", action: "Webview:/ServiceConditions"}
        ]
      },{
        type: "group",
        label: "Services",
        controls: [
          {type: "button", label: "Buy Ticket", action: "buy-ticket"},
          {type: "button", label: "Support", value: "support"}
        ]
      },
      {type: "button", label: "Nothing", value: -1}
    ],
    showKeyboard: false
  }));
})


bot.hear('SOFA::Message:', (session, message) => {
  session.reply("Hello "+session.address+"! You can say these things:\n1. ping\n2. reset\n3. initMe\n4. buttons\n 5. groups");
});