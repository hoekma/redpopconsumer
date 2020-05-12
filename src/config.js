module.exports = {
  server: {
    address: 'localhost',
    port: 6379,
    connectionType: 'standalone',
  },
  stream: {
    name: 'protoStream',
  },
  consumer: {
    group: 'protoGroup',
    name: 'protoGroup',
    waitTimeMs: 2000,
    batchSize: 50,
    pendingEventTimeoutMs: 10000,
    idleConsumerTimeoutMs: 10000,
    eventMaximumReplays: 3,
  },
};
