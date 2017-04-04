const Config = require('./Config');
const FeedParser = require('feedparser');
const request = require('request');
const redis = require('redis');
/*
const config = new Config(process.argv[2]);
const redisClient = redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password
});
*/
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
    }, 60 * 1000);
  }

  broadcast() {
    // Broadcast to all users the latest article
    //  this.users();
  }

  users() {
    //redisClient
  }

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
