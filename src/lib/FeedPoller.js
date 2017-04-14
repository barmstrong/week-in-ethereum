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
    }, 5 * 1000);
  }

  broadcast() {
    // Broadcast to all users the latest article
    let article = this.articles[0];
    let self = this;

    redisClient.smembers('users', function(err, users) {
      users.forEach(function(user) {
        redisClient.hget('last-update', user, function(err, articleId) {
          console.log(user)
          console.log(`article id: ${articleId}`)
          if (articleId !== article.id) {
            let message = `Hey! The latest issue of ${constants.NAME} is out: ${article.link}`;

            self.bot.client.send(user, SOFA.Message({
              body: message,
              controls: [constants.CONTROLS.tip, constants.CONTROLS.unsubscribe],
              showKeyboard: false,
            }));

            redisClient.hset('latest-update', user, article.id);
          }
        });
      });
    });
  };

  addUser(session) {
    let article = this.articles[0];
    let tokenId = session.get('tokenId');
    console.log(`userid: ${tokenId}`);
    redisClient.sadd('users', tokenId);
    console.log(`article id: ${article.id}`);
    redisClient.hset('latest-update', tokenId, article.id);
    redisClient.hget('latest-update', tokenId, function (err, arId) { console.log(`HGET ID: ${arId}`)});
  };

  removeUser(session) {
    let tokenId = session.get('tokenId');
    redisClient.srem('users', tokenId);
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

  getLatestArticle() {
    return this.articles[0];
  }
}

module.exports = FeedPoller;
