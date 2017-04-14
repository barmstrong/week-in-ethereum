const Config = require('./Config');
const FeedParser = require('feedparser');
const request = require('request');
const redis = require('redis');
const constants = require('./constants');
const SOFA = require('sofa-js');

const config = new Config(process.argv[2]);
const redisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password
});

class FeedPoller {
  constructor(bot) {
    this.url = 'http://www.weekinethereum.com/rss';
    this.feedparser = new FeedParser();
    this.articles = [];
    this.getArticles();
    this.start();
    this.bot = bot;
  };

  start() {
    this.timer = setInterval(() => {
      this.getArticles();
      this.broadcast();
    }, 60 * 5 * 1000); // 5 minutes
  }

  // Broadcast to all users the latest article
  broadcast() {
    let latestArticle = this.articles[0];
    console.log(`Broadcast Latest Article: ${latestArticle.id}`)
    let self = this;

    redisClient.smembers('subscribed', function(err, users) {
      users.forEach(function(user) {
        redisClient.hget('latest', user, function(err, lastReceivedId) {
          if (latestArticle.id !== lastReceivedId) {
            console.log(`Sending to user ${user}`)
            let message = `Hey! The latest issue of ${constants.NAME} is out: ${latestArticle.link}`;

            self.bot.client.send(user, SOFA.Message({
              body: message,
              controls: constants.SUBSCRIBED_CONTROLS,
              showKeyboard: false,
            }));

            self.markRead(user, latestArticle.id);
          }
        });
      });
    });
  };

  addUser(session) {
    let userId = session.get('tokenId');
    redisClient.sadd('subscribed', userId);
    this.markRead(userId, this.articles[0].id);
  };

  removeUser(session) {
    redisClient.srem('subscribed', session.get('tokenId'));
  };

  isSubscribed(userId, callback) {
    redisClient.sismember('subscribed', userId, function(err, val) {
      callback(err, val);
    });
  };

  markRead(userId, articleId) {
    redisClient.hset('latest', userId, articleId);
  };

  getArticles() {
    // Populate this.articles with all articles available
    let req = request(this.url)
    let self = this;

    req.on('response', function (res) {
      if (res.statusCode !== 200) {
        console.log('Request failed');
      } else {
        this.pipe(self.feedparser);
      }
    });

    req.on('error', function (error) {
      console.log('Request failed');
    });

    this.feedparser.on('readable', function () {
      // This is where the action is!
      let meta = this.meta;
      let item, article;
      this.articles = [];

      while (item = this.read()) {
        article = {
          id: item['guid'],
          title: item['title'],
          link: item['link'],
          date: item['date'],
          description: item['description'],
          summary: item['summary']
        }
        self.articles.push(article)
      }
    });

    this.feedparser.on('error', function (error) {
      console.log('Feed parser failed');
      console.log(error);
    });

  }

  latestArticle() {
    return this.articles[0];
  }

  articlesList() {
    return this.articles;
  }
}

module.exports = FeedPoller;
