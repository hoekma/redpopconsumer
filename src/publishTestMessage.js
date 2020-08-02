const { Publisher } = require('@hoekma/redpop');
const config = require('./config');
const messagesToPublish = 1000;
const publisher = new Publisher(config);

(async () => {
  for (let i = 0; i < messagesToPublish; i++) {
    const messageId = await publisher.publish({ test: 'message' });
    console.log(`Published Mesage ${messageId}`);
  }
  process.exit();
})();
