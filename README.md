# RedPop Consumer

## RedPopConsumer represents a complete, ready to go consumer. To use it

1. Edit src/config.js to meet your requirements
2. Edit src/consumer.js to meet your requirements
3. If you don't have a running Redis 5.0 server, run `docker-compose up -d` to start a redis server. Docker must be installed and running of course.
4. run `npm start`

Lifecyle for the RedPop Consumer is the following:

## RedPop Consumer startup:

1. When `npm start` runs, Node runs `src/index.js` which

   1. instantiates `ProtoConsumer`, passing `src/config.js` to its constructor. ProtoConsumer is a subclass of RedPop's Consumer class.
   2. Runs `Consumer::start()` to start the consumer which is an infinite loop listening for events.

2. The first event hook available to the developer is `Consumer::init()`. This runs once before the consumer begins listening for events. It never runs again. The default ProtoConsumer behavior is to output `Starting ProtoConsumer` to the console.

3. ProtoConsumer then starts listenting for events to be published on to the Redis stream. It waits `config.waitTimeMs` milliseconds for a batch of events from the Redis Stream defined in `src/config.js`.

4. If it does not recieve a batch of events, the next event hook available to the developer is `Consumer::onBatchesComplete()`. This runs each time the Consumer polls for events and doesn't receive anything.

## RedPop Consumer Event Processing

1. Because RedPop is an event driven system, nothing happens until an external `event` happens. This takes place in the form of a `Publisher` putting a events into the the stream defined in `src/config.js`.

2. When ProtoConsumer listens for events and the Redis server has unplayed event(s), the Redis server assigns a batch of events to the instance of ProtoConsumer. The size of the batch is limited by `config.consumer.batchSize` which can be tuned for performance in high-volume implementations.

3. RedPop's Consumer will process each event in the batch one at a time. The next event hook available to the developer is `Consumer::processEvent()`. For each event in the batch, processEvent will receive a JSON object in the following format:

```javascript
    { id: `1234567890123-0`,   // event ID
      data: { ...name-value-pairs }
    }
```

1. ProcessEvent() is where your business logic acts on the data in the event payload. For instance, yu may update a database record, send an SMS message, or update a log file. Return `true` to signal te event was successfully processed or `false` to indicate it needs to be reprocessed. It will be reprocessed up to `config.consumer.eventMaximumReplays` times.

2. Afer RedPop's Consumer processes all of the events in the batch, the next event `BatchComplete` runs, and an event hook is available to the developer: `onBatchComplete()`.

3. Then the consumer goes back into listening mode waiting for another batch. If one is immediately avalable, it will play the events to `processEvent()`. If not, it runs `onBatchesComplete()` and resumes listening.

The full event processing lifecycle is:

EVENT BATCH RECEIVED\_ => processEvent() => onBatchComplete() => onBatchesComplete()

## See it in action

This test will require at least two terminal windows. One will contain your consumer that is waiting for events. The other will run an NPM script that publishes events. You will be able to see the consumer playing the event.

1. Open two terminal windows
2. `cd` to the directory with redpop consumer.
3. In the first terminal window, run `npm i`
4. When that finishes, run `npm start` to start the consumer
5. You should see a message saying `Starting ProtoConsumer` along with some capital "B" that will start showing the consumer polling for batches of events.
6. In the second terminal window, type `npm run publishTestEvents`
7. Observe the event IDs being published in the window.
8. Observe the consumer output showing the event IDs.

I recommend you play with the consumer's `processEvent` method to see how you can act on the event that is passed in. Here are some ideas:

1. See if you can make the consumer output the message instead of the event ID.
2. Try increasing the number of events published in the `publishTestEvent.js` file to 100,000. Start another consumer in a third terminal window and publish 100K events to see your consumer scale horizontally. Notice the small `'b'` in front of the event id. This is an indicator that the consumer has finished processing a batch, which means that the consumers are processing the events as fast as the publisher is publishing them.
3. Run your publishers at least 10 times to build up over 1 million events in the stream. Taking too long? Create more publisher windows to simulate horizontal load.
4. Depending on your computer (primarily cores available to horizontally scale) this might take a number of minutes. You can check in a new window by running `npm run getEventCount` to see how many events have been added to the stream.
5. After your consumer finishes processing (or you run out of patience and ctl-c the publishers). Launch 10 or more consumer windows. Here you are simulating your server consumer environment scaling out servers to handle huge workloads.
6. In a publisher window, type `npm run replayTestEvents`. This will replay all of your events in the stream -- over a million events (or however many messages you saw when your ran `npm getEventCount`). You will notice that replaying these events takes a fraction of the time now that they are available for replay, which makes transaction-intensive operations like data science easy to iterate on.

## Conclusion

That's it! All you really have to do at a bare minimum is add some basic logic to Consumer::processEvent() and the rest is up to your imagination.
