const url = require('url');
const fs = require('fs');
const yaml = require('js-yaml');

class Config {
  constructor(path) {
    let config = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    for(let k in config) this[k]=config[k];

    if (this.redis.uri) { this.redisUrl = this.redis.uri; }
    if (this.redis.envKey) { this.redisUrl = process.env[this.redis.envKey]; }
    if (!this.address) { this.address = process.env['TOKEN_CLIENT_ADDRESS'] }
  }

  set redisUrl(s) {
    let uri = url.parse(s);
    if (uri.protocol && uri.protocol == 'redis:') {
      this.redis.host = uri.hostname;
      this.redis.port = uri.port;
      this.redis.password = uri.auth.split(':')[1];
    }
  }
}

module.exports = Config;
