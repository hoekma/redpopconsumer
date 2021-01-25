module.exports = {
  server: {
    connectionType: "cluster",
    connection: {
      host: "localhost",
      port: 6379,
    },
    connections: [
      {
        host: "localhost",
        port: 7000,
      },
    ],
    //password='defaultpass'
  },
  stream: {
    name: "protoStream",
  },
  consumer: {
    group: "protoGroup",
    name: "protoGroup",
    waitTimeMs: 2000,
    batchSize: 50,
    pendingEventTimeoutMs: 10000,
    idleConsumerTimeoutMs: 10000,
    eventMaximumReplays: 3,
  },
};
