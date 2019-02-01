api-stack
=========

[![Greenkeeper badge](https://badges.greenkeeper.io/gurumojo/api-stack.svg)](https://greenkeeper.io/)

Service stack definition providing a secure Nginx proxy, a PostgREST server,
and an Express server complete with centralized configuration via the .env
mechanism provided by docker-compose for local development. Testing and
production environments should overwrite default secrets coded into this
library with secure functionality similar to the AWS SSM parameter store.


Prerequisite
------------

This command line focused package depends on:

	bash
	docker
	docker-compose
	make

Ensuring they are available at runtime are exercises left to the reader.


Config
------

See ./.env for default environment variables.


Development
-----------

	make init
	vim <something>
	make dev

See ./Makefile for task definition details.


Makefile
--------

Optional arguments may be provided to make via environment variables.
The default task builds local docker-compose container service images.

Build a stack (or individual service):

	[SERVICE=<name>] make [build]

Run a stack (or individual service):

	[SERVICE=<name>] make up

Upgrade DB schema to the latest (or other specific) version:

	[SCHEMA=<version>] make bump

Remove DB schema (or rollback to specific patch level):

	[SCHEMA=<version>] make roll

Check on stack state:

	make ps
	[COUNT=<lines>] [SERVICE=<name>] make tail

Run available test specs against a running stack:

	make test

Stop the stack:

	make down

Scrub related container images, volumes, and node modules:

	make clean

Wipe out persisted data from local volume:

	make purge

Execute a continuous integration process:

	make ci
