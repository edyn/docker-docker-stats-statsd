var env = require('envalid');
var librato = require('librato-node');
var allcontainers = require('docker-allcontainers');
var dockerstats = require('docker-stats');
var through = require('through2');

env.validate(process.env, {
  LIBRATO_EMAIL: {required: true},
  LIBRATO_TOKEN: {required: true},
});

librato.configure({
  email: env.get('LIBRATO_EMAIL'),
  token: env.get('LIBRATO_TOKEN'),
});

// start librato
librato.start();

var stats = dockerstats({
  docker: null,
  events: allcontainers({docker:null})
});

stats.pipe(through.obj(update));

function update(chunk, enc, callback) {
  var name = chunk.name;
  var info = {
    pcpu: chunk.stats.cpu_stats.cpu_usage.cpu_percent,
    memory: chunk.stats.memory_stats.stats.total_rss,
  };

  updateContainer(name, info)
  callback();
}

function updateContainer (name, info) {
  librato.measure('dstats-'+name+'-pcpu', info.pcpu);
  librato.measure('dstats-'+name+'-memory', info.memory);
}
