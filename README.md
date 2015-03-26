# docker-librato

Forward all your stats to [Librato Metrics](metrics.librato.com), like a breeze.

## Usage as a Container

The simplest way to forward all your container's log to Librato Metrics is to
run this repository as a container, with:

```sh
docker run \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e LIBRATO_EMAIL="" \
  -e LIBRATO_TOKEN="" \
  meteorhacks/docker-librato
```

You can also use two different tokens for logging and stats:
```sh
docker run \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e LIBRATO_EMAIL="" \
  -e LIBRATO_TOKEN="" \
  meteorhacks/docker-librato
```

### Running container in a restricted environment.
Some environments(such as Google Compute Engine) does not allow to access the docker socket without special privileges. You will get EACCES(`Error: read EACCES`) error if you try to run the container. To run the container in such environments add --privileged to the `docker run` command.

Example:
```sh
docker run --privileged \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -e LIBRATO_EMAIL="" \
  -e LIBRATO_TOKEN="" \
  meteorhacks/docker-librato
```

## Building a docker repo from this repository

First clone this repository, then:

```bash
docker build -t librato .
docker run \
  -v /var/run/docker.sock:/var/run/docker.sock \
  librato
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

This app is based on [nearform/docker-logentries](https://github.com/nearform/docker-logentries).

## License

MIT
