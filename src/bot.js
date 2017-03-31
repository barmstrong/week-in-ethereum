const Bot = require('./lib/Bot');

let bot = new Bot();
bot.onEvent = function(session, message) {
  session.reply("Hello world.")
}
