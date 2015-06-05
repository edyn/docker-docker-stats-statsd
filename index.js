var env = require('envalid');
var StatsD = require('node-statsd');
var allcontainers = require('docker-allcontainers');
var dockerstats = require('docker-stats');
var _ = require('lodash');
var through = require('through2');

env.validate(process.env, {
  STATSD_HOST: {recommended: true},
  STATSD_PORT: {recommended: true},
  STATSD_PREFIX: {recommended: true},
});

var statsdClient =  new StatsD({
  host: env.get('STATSD_HOST', '127.0.0.1'),
  port: env.get('STATSD_PORT', 8125),
  prefix: env.get('STATSD_PREFIX', 'docker.'),
});

/*statsdClient = {
  gauge: function(key, value){
    console.log(key, value);
  }
}*/

var stats = dockerstats({
  docker: null,
  events: allcontainers({
    preheat: true,
    docker:null})
});

stats.pipe(through.obj(update));

function update(chunk, enc, callback) {
  var name = chunk.name;
  var info = {
    cpu: {
      cpu_percent: chunk.stats.cpu_stats.cpu_usage.percent,
    },
    memory: {
      usage: chunk.stats.memory_stats.usage,
      max_usage: chunk.stats.memory_stats.max_usage,
      total_rss: chunk.stats.memory_stats.stats.total_rss,
      total_swap: chunk.stats.memory_stats.stats.total_swap,
      total_pgpgin: chunk.stats.memory_stats.stats.total_pgpgin,
      total_pgpgout: chunk.stats.memory_stats.stats.total_pgpgout,
      total_pgfault: chunk.stats.memory_stats.stats.total_pgfault
    }
  };

  //console.log(chunk.stats);
  
  updateContainer(name, info)
  callback();
}

function updateContainer (name, info) {
  _.each(info, function(section, key){
    if (!_.isObject(section)) {
      statsdClient.gauge(name + '.' + key, section);
    } else {
      _.each(section, function(value, metric){
        statsdClient.gauge(name + '.' + key + '.' + metric, value);
      });
    }
  });
}
