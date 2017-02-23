const SOFA = require('sofa-js');
const Bot = require('./lib/Bot');

let bot = new Bot();

bot.onEvent = function(session, message) {
  switch (message.type) {
    case "Message":
      onMessage(session, message);
      break;
    case "Command":
      onCommand(session, message);
      break;
  }
}

function onMessage(session, message) {
  if (message.content.body.includes("red")) {
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
  } else {
    sendColorPrompt(session, "I only want to talk about my favorite color. Guess what it is!");
  }
}

function onCommand(session, command) {
  if (command.content.value === "red") {
    session.reply("Yep! Red is the best");
  } else {
    sendColorPrompt(session, "Nope! Try again.");
  }
}

function sendColorPrompt(session, body) {
  session.reply(SOFA.Message({
    body:  body,
    controls: [
      {type: "button", label: "Red", value: "red"},
      {type: "button", label: "Green", value: "green"},
      {type: "button", label: "Blue", value: "blue"}
    ],
    showKeyboard: false
  }));
}
