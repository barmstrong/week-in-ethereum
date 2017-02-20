const Client = require('./Client');
const Thread = require('./Thread');
const SOFA = require('./SOFA');

class Bot {
  constructor() {
    this.client = new Client(this);
    this.rootThread = new Thread(this);
    this.threads = {};
  }

  thread(name) {
    if (!this.threads.hasOwnProperty(name)) {
      this.threads[name] = new Thread(this);
    }
    return this.threads[name];
  }

  hear(pattern, cb) {
    this.rootThread.hear(pattern, null, cb);
  }

  onMessage(session, message) {
    let heard = false;
    if (session.thread) {
      heard = session.thread.onMessage(session, message);
    }
    if (!heard) {
      heard = this.rootThread.onMessage(session, message);
    }
    return heard;
  }
}

module.exports = Bot;
