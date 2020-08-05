const faker = require('faker');
const { Publisher } = require('@hoekma/redpop');
const config = require('./config');
const publisher = new Publisher(config);

const eventsToPublish = 1;
const messageToPublish = {
  string: faker.random.word(),
  date: faker.date.recent(),
  number: faker.random.number(),
  boolean: true,
  stringArray: [faker.random.word(), faker.random.word(), faker.random.word()],
  object: { word: faker.random.word(), number: faker.random.word() },
};

(async () => {
  for (let i = 0; i < eventsToPublish; i++) {
    const eventId = await publisher.publish(messageToPublish);
    console.log(`Published Event ${eventId}`);
  }
  process.exit();
})();
