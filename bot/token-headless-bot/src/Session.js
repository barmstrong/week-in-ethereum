const Config = require('./Config');
const fs = require('fs');
const mkdirp = require('mkdirp');

class Session {
  constructor(bot, address) {
    this.bot = bot;
    this.config = new Config(process.argv[2]);

    if (!fs.existsSync(this.config.store)) {
      mkdirp.sync(this.config.store);
    }
    this.address = address;
    this.path = this.config.store+'/'+address+'.json';
    this.data = {
      address: this.address
    };
    this.thread = null;
    this.state = null;

    if (fs.existsSync(this.path)) {
      this.data = JSON.parse(fs.readFileSync(this.path, 'utf8'));
      if (this.data._thread) {
        this.thread = this.bot.threads[this.data._thread];
      }
      if (this.data._state) {
        this.state = this.data._state;
      }
    } else {
      this.flush();
    }
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
    this.flush();
  }

  setState(name) {
    this.state = name;
    this.set('_state', name);
  }

  openThread(name) {
    this.closeThread();
    this.set('_thread', name)
    this.thread = this.bot.threads[name];
    this.thread.open(this);
  }

  closeThread() {
    if (this.thread) {
      this.thread.close(this);
    }
    this.thread = null;
    this.set('_thread', null);
    this.setState(null)
  }

  reset() {
    this.closeThread()
    this.setState(null)
    this.data = {
      address: this.address
    };
    this.flush();
  }

  reply(message) {
    this.bot.client.send(this, message);
  }

  rpc(rpcCall, callback) {
    this.bot.client.rpc(this, rpcCall, callback);
  }

  touch() {
    if (this.data == null) {
      this.data = {
        address: this.address
      };
    }
    this.data.timestamp = Math.round(new Date().getTime()/1000);
  }

  flush() {
    this.touch()
    fs.writeFileSync(this.path, this.json);
  }

  get json() {
    return JSON.stringify(this.data);
  }
}

module.exports = Session;
