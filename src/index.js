const ProtoConsumer = require('./consumer');
const config = require('./config');

consumer = new ProtoConsumer(config);

console.info('Starting ProtoConsumer');
console.info('Press ctrl-c to quit');

consumer.start();
