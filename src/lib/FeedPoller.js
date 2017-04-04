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
    }, 10 * 1000);
  }

  broadcast() {
    // Broadcast to all users the latest article
    console.log('BROADCAST')
    let article = this.articles[0];
    let self = this;

    redisClient.get('users', function(err, value) {
      if (err) throw(err);

      let users = [];
      let newUsers = []
      if (value) {
        users = JSON.parse(value);
      }

      console.log(users);
      users.forEach(function(user) {
        if (user.subscribed && user.lastUpdate !== article.link) {
          let message = `Hey! The latest issue of ${constants.NAME} is out: ${article.link}`;

          self.bot.client.send(user.userId, SOFA.Message({
            body: message,
            controls: [constants.CONTROLS.tip, constants.CONTROLS.unsubscribe],
            showKeyboard: false,
          }));

          user.lastUpdate = article.link;
          newUsers.push({
            userId: user.userId,
            lastUpdate: article.link,
            subscribed: user.subscribed,
          });
        } else {
          newUsers.push(user);
        }
      });
      redisClient.set('users', JSON.stringify(newUsers));
    });
  };

  addUser(session) {
    console.log('ADD NEW USER')
    let article = this.articles[0];
    redisClient.get('users', function(err, value) {
      if (err) throw(err);

      let users = [];
      if (value) {
        users = JSON.parse(value);
      }
      users.push({
        userId: session.get('tokenId'),
        lastUpdate: article.link,
        subscribed: true,
      });
      console.log(users);
      redisClient.set('users', JSON.stringify(users));
    });
  };

  removeUser(session) {
    console.log('REMOVE USER')
    redisClient.get('users', function(err, value) {
      if (err) throw(err);

      let users = [];
      let newUsers = []
      if (value) {
        users = JSON.parse(value);
      }
      users.forEach(function(user) {
        if (user.userId !== session['tokenId']) {
          newUsers.push(user);
        }
      });
      console.log(newUsers);
      redisClient.set('users', JSON.stringify(newUsers));
    });
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
