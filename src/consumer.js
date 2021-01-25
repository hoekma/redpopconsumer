const { Consumer } = require("@hoekma/redpop");

class ProtoTypeConsumer extends Consumer {
  init() {
    // Code in Init runs when the consumer first starts up.
    console.info("Init was run");
  }

  onBatchesComplete() {
    // Runs after all batches are complete.  For example
    // stream receives 500 event and config.batchSize=50
    // this will run after 10 batches of events.
    process.stdout.write(".");
  }

  onBatchComplete() {
    // Runs after each batch is complete.  For example
    // stream receives 500 events and config.batchSize=50
    // this will run after each batch of 50 events.

    process.stdout.write("+");
  }
  processEvent(event) {
    // Runs once for each event.  Put your business logic here.
    console.log(event.id);
    return true;
  }
}

module.exports = ProtoTypeConsumer;
