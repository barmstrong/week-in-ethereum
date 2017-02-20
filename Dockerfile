# latest official node image
FROM node:latest

RUN npm install -g nodemon

ADD dependencies/token-headless-bot /usr/src/token-headless-bot
ADD dependencies/token-headless-bot /tmp/dependencies/token-headless-bot

# use cached layer for node modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/bot && cp -a /tmp/node_modules /usr/src/bot/

# add project files
ADD src /usr/src/bot/src
ADD package.json /usr/src/bot/package.json
WORKDIR /usr/src/bot

CMD nodemon -L src/bot.js config.yml