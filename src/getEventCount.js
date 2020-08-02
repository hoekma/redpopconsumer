const { Publisher } = require('@hoekma/redpop');
const config = require('./config');
const publisher = new Publisher(config);

(async () => {
  const eventCount = await publisher.xlen(config.stream.name);
  console.log('Event Count:', eventCount);
  process.exit();
})();
