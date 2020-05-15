# RedPop Consumer

## RedPopConsumer represents a complete, ready to go subscriber. To use it

1. Edit src/config.js to meet your requirements
2. Edit src/consumer.js to meet your requirements
3. If you don't have a running Redis 5.0 server, run `docker-compose up -d` to start a redis server. Docker must be installed and running of course.
4. run `npm start`

Lifecyle for the RedPop Consumer is the following:

## RedPop Consumer startup:

1. When `npm start` runs, Node runs `src/index.js` which

   1. instantiates `ProtoConsumer`, passing `src/config.js` to its constructor. ProtoConsumer is a subclass of RedPop's Consumer class.
   2. Runs `Consumer::start()` to start the subscriber which is an infinite loop listening for events.

2. The first event hook available to the developer is `Consumer::init()`. This runs once before the consumer begins listening for messages. It never runs again. The default ProtoConsumer behavior is to output `Starting ProtoConsumer` to the console.

3. ProtoConsumer then starts listenting for events to be published on to the Redis stream. It waits `config.waitTimeMs` milliseconds for a batch of events from the Redis Stream defined in `src/config.js`.

4. If it does not recieve a batch of events, the next event hook available to the developer is `Consumer::onBatchesComplete()`. This runs each time the Consumer polls for events and doesn't receive anything.

## RedPop Consumer Message/Event Processing

1. Because RedPop is an event driven system, nothing happens until an external `event` happens. This takes place in the form of a `Publisher` putting a events into the the stream defined in `src/config.js`.

2. When ProtoConsumer listens for events and the Redis server has unplayed event(s), the Redis server assigns a batch of events to the instance of ProtoConsumer. The size of the batch is limited by `config.consumer.batchSize` which can be tuned for performance in high-volume implementations.

3. RedPop's Consumer will process each event in the batch one at a time. The next event hook available to the developer is `Consumer::processEvent()`. For each event in the batch, processEvent will receive a JSON object in the following format:

```javascript
    { id: `redis message id`,
      data: { ...name-value-pairs }
    }
```

1. ProcessEvent() is where your business logic acts on the data in the event payload. For instance, yu may update a database record, send an SMS message, or update a log file. Return `true` to signal te event was successfully processed or `false` to indicate it needs to be reprocessed. It will be reprocessed up to `config.consumer.eventMaximumReplays` times.

2. Afer RedPop's Consumer processes all of the messages in the batch, the next event `BatchComplete` runs, and an event hook is available to the developer: `onBatchComplete()`.

3. Then the subscriber goes back into listening mode waiting for another batch. If one is immediately avalable, it will play the events to `processEvent()`. If not, it runs `onBatchesComplete()` and resumes listening.

The full message processing lifecycle is:

EVENT BATCH RECEIVED\_ => processEvent() => onBatchComplete() => onBatchesComplete()

## Conclustion

That's it! All you really have to do at a bare minimum is add some basic logic to Consumer::processMessage() and the rest is up to your imagination. See the companion `redpop publisher` repo for a ready-made publisher to test your subscriber. And try running your subscriber in many windows and feeding it 100's of 1000's of messages to see the horizontal scaling capabilities.
