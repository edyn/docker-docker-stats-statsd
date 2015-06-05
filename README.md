# docker-stats-statsd

Forward all your stats to Etsy's [Statsd](https://github.com/etsy/statsd), like a breeze.

## Usage as a Container

The simplest way to forward all your container's log to Statsd. Given the versatility of statsd, you can configure the metrics to go to any supported backends; including Librato, Graphite. All you have to do is run this repository as a container, with:

```sh
docker run \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e STATSD_HOST="" \
  -e STATSD_PORT="" \
  -e STATSD_PREFIX="" \
  edyn/docker-stats-statsd
```
Note that all three options default to reasonable values (STATSD_HOST, STATSD_PORT, STATSD_PREFIX) => (127.0.0.1, 8125, "docker.")
```

### Running container in a restricted environment.
Some environments(such as Google Compute Engine) does not allow to access the docker socket without special privileges. You will get EACCES(`Error: read EACCES`) error if you try to run the container. To run the container in such environments add --privileged to the `docker run` command.

Example:
```sh
docker run --privileged \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e STATSD_HOST="" \
  -e STATSD_PORT="" \
  -e STATSD_PREFIX="" \
  edyn/docker-stats-statsd
```

## Building a docker repo from this repository

First clone this repository, then:

```bash
docker build -t docker-stats .
docker run \
  -v /var/run/docker.sock:/var/run/docker.sock \
  docker-stats
```

## How it works

This module wraps four [Docker
APIs](https://docs.docker.com/reference/api/docker_remote_api_v1.17/):

* `POST /containers/{id}/attach`, to fetch the logs
* `GET /containers/{id}/stats`, to fetch the stats of the container
* `GET /containers/json`, to detect the containers that are running when
  this module starts
* `GET /events`, to detect new containers that will start after the
  module has started

This module wraps
[docker-loghose](https://github.com/mcollina/docker-loghose) and
[docker-stats](https://github.com/pelger/docker-stats) to fetch the logs
and the stats as a never ending stream of data.

All the originating requests are wrapped in a
[never-ending-stream](https://github.com/mcollina/never-ending-stream).

## Credits

This app is based on [Meteorhacks](https://github.com/meteorhacks/docker-librato).

## License

MIT
