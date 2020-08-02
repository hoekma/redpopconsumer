const { Publisher } = require('@hoekma/redpop');
const config = require('./config');
const publisher = new Publisher(config);

(async () => {
  await publisher.xgroup('SETID', config.stream.name, config.consumer.group, 0);

  process.exit();
})();
