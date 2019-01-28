.PHONY: build bump ci clean debug dev down init local \
	ps purge roll start stop tail task test test-local up

COUNT?=0

FILE=docker-compose

build:
	docker-compose -f ${FILE}.api.yml -f ${FILE}.docs.yml \
		-f ${FILE}.task.yml -f ${FILE}.test.yml \
		build --force-rm ${SERVICE}

bump:
	bin/migrate up ${SCHEMA}

ci:
	docker-compose -f ${FILE}.api.yml -f ${FILE}.task.yml -f ${FILE}.test.yml \
		build --force-rm --no-cache --pull

clean:
	docker-compose -f ${FILE}.api.yml -f ${FILE}.docs.yml \
		-f ${FILE}.task.yml -f ${FILE}.test.yml \
		down -v --remove-orphans --rmi local
	rm -f etc/postgres/version

dev: build docs test-local

docs:
	docker-compose -f ${FILE}.api.yml -f ${FILE}.test.yml -f ${FILE}.docs.yml \
		up -d ${SERVICE}

down:
	docker-compose -f ${FILE}.api.yml -f ${FILE}.docs.yml \
		-f ${FILE}.task.yml -f ${FILE}.test.yml \
		down
	rm -f etc/postgres/version

init: purge build up bump test

launch:
	docker-compose up -d --build --force-recreate --remove-orphans ${SERVICE}

logs:
	docker-compose -f ${FILE}.api.yml -f ${FILE}.docs.yml \
		-f ${FILE}.task.yml -f ${FILE}.test.yml \
		logs ${SERVICE}

local:
	docker-compose -f ${FILE}.api.yml -f ${FILE}.test.yml -f ${FILE}.local.yml \
		up -d ${SERVICE}

ps:
	docker-compose -f ${FILE}.api.yml -f ${FILE}.docs.yml \
		-f ${FILE}.task.yml -f ${FILE}.test.yml \
		ps

purge: clean sweep

pristine: clean scrub sweep

roll:
	bin/migrate down ${SCHEMA}

scrub:
	sudo rm -rf var/* 

sweep:
	docker rm $(docker ps -aq) 2>/dev/null || true
	docker image prune -f
	rm -rf {test,lib/lambda/*,lib/monitor}/node_modules

tail:
	docker-compose -f ${FILE}.api.yml -f ${FILE}.task.yml -f ${FILE}.test.yml \
		logs -f --tail ${COUNT} ${SERVICE}

task:
	docker-compose -f ${FILE}.api.yml -f ${FILE}.task.yml \
		run task

test:
	docker-compose -f ${FILE}.api.yml -f ${FILE}.test.yml \
		run test

test-local:
	docker-compose -f ${FILE}.api.yml -f ${FILE}.local.yml -f ${FILE}.test.yml \
		run test

up:
	docker-compose up -d ${SERVICE}
