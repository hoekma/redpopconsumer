const faker = require('faker');
const { Publisher } = require('@hoekma/redpop');
const config = require('./config');
const publisher = new Publisher(config);

const eventsToPublish = 1000000;

(async () => {
  for (let i = 0; i < eventsToPublish; i++) {
    const eventId = await publisher.publish({ message: faker.random.word });
    console.log(`Published Event ${eventId}`);
  }
  process.exit();
})();
