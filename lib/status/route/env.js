const whitelist = [
	'API_ANON_ROLE',
	'API_AUTH_ROLE',
	'API_HOST',
	'API_IMAGE',
	'API_PORT',
	'API_SCHEMA',
	'BUILD_CONTEXT',
	'COMPOSE_FILE',
	'COMPOSE_PROJECT_NAME',
	'DB_HOST',
	'DB_IMAGE',
	'DB_NAME',
	'HEALTHCHECK_DIVISOR',
	'HEALTHCHECK_INTERVAL',
	'HEALTHCHECK_THRESHOLD',
	'NODE_TLS_REJECT_UNAUTHORIZED',
	'NODE_VERSION',
	'PROXY_HOST',
	'PROXY_IMAGE',
	'PROXY_PORT',
	'SECURE_PORT',
	'SERVICE_PORT',
	'SIDECAR_PORT',
	'STATUS_HOST',
	'STATUS_IMAGE',
	'STATUS_PORT'
]

const runtime = {}

function init() {
	whitelist.forEach(variable => {
		runtime[variable] = process.env[variable]
	})
}

function env(req, res) {
	console.log('ENV')
	res.send({env: runtime})
}

init()

module.exports = env
