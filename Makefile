.PHONY: build bump ci clean debug dev docs down init launch local logs \
	ps purge pristine roll scrub sweep start tail task test test-local up

COUNT?=0

# NETWORKS?="-f docker-compose.vpn.yml"

build:
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.docs.yml \
		-f docker-compose.task.yml \
		-f docker-compose.test.yml \
		${NETWORKS} \
		build --force-rm ${SERVICE}

bump:
	bin/migrate up ${SCHEMA}

ci:
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.task.yml \
		-f docker-compose.test.yml \
		${NETWORKS} \
		build --force-rm --no-cache --pull

clean:
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.docs.yml \
		-f docker-compose.task.yml \
		-f docker-compose.test.yml \
		${NETWORKS} \
		down -v --remove-orphans --rmi local
	rm -f etc/postgres/version

debug:
	echo "How to debug...?"

dev: build docs test-local

docs:
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.docs.yml \
		-f docker-compose.test.yml \
		${NETWORKS} \
		up -d ${SERVICE}

down:
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.docs.yml \
		-f docker-compose.task.yml \
		-f docker-compose.test.yml \
		${NETWORKS} \
		down
	rm -f etc/postgres/version

init: purge build up bump test

launch:
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.docs.yml \
		-f docker-compose.task.yml \
		-f docker-compose.test.yml \
		${NETWORKS} \
	docker-compose up -d --build --force-recreate --remove-orphans ${SERVICE}

local:
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.local.yml \
		-f docker-compose.test.yml \
		${NETWORKS} \
		up -d ${SERVICE}

logs:
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.docs.yml \
		-f docker-compose.task.yml \
		-f docker-compose.test.yml \
		${NETWORKS} \
		logs ${SERVICE}

ps:
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.docs.yml \
		-f docker-compose.task.yml \
		-f docker-compose.test.yml \
		${NETWORKS} \
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
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.task.yml \
		-f docker-compose.test.yml \
		${NETWORKS} \
		logs -f --tail ${COUNT} ${SERVICE}

task:
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.task.yml \
		${NETWORKS} \
		run task

test:
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.test.yml \
		${NETWORKS} \
		run test

test-local:
	docker-compose \
		-f docker-compose.api.yml \
		-f docker-compose.local.yml \
		-f docker-compose.test.yml \
		-f docker-compose.vpn.yml \
		${NETWORKS} \
		run test

up:
	docker-compose \
		-f docker-compose.api.yml \
		${NETWORKS} \
		up -d ${SERVICE}
