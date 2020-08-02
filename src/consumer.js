const { Consumer } = require('@hoekma/redpop');

class ProtoTypeConsumer extends Consumer {
  init() {
    // Code in Init runs when the subscriber first starts up.
    console.info('Init was run');
  }

  onBatchesComplete() {
    // Runs after each batch is complete.  For example
    // stream receives 500 messages and config.batchSize=50
    // this will run after 10 batches of messages.
    process.stdout.write('B');
  }

  onBatchComplete() {
    // Runs after each batch is complete.  For example
    // stream receives 500 messages and config.batchSize=50
    // this will run after each batch of 50 messages.

    process.stdout.write('b');
  }
  processEvent(event) {
    // Runs once for each event.  Put your business logic here.
    console.log(event.id);
    return true;
  }
}

module.exports = ProtoTypeConsumer;
