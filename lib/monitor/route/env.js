const whitelist = [
	'API_ANON_ROLE',
	'API_AUTH_ROLE',
	'API_HOST',
	'API_IMAGE',
	'API_PORT',
	'API_SCHEMA',
	'COMPOSE_FILE',
	'COMPOSE_PROJECT_NAME',
	'DB_HOST',
	'DB_IMAGE',
	'DB_NAME',
	'HEALTHCHECK_DIVISOR',
	'HEALTHCHECK_INTERVAL',
	'HEALTHCHECK_THRESHOLD',
	'MONITOR_HOST',
	'MONITOR_IMAGE',
	'MONITOR_PORT',
	'NODE_TLS_REJECT_UNAUTHORIZED',
	'NODE_VERSION',
	'PROXY_HOST',
	'PROXY_IMAGE',
	'PROXY_PORT',
	'SECURE_PORT',
	'SERVICE_PORT',
	'SIDECAR_PORT'
]

const runtime = {}

function init() {
	whitelist.forEach(variable => {
		runtime[variable] = process.env[variable]
	})
}

function env(req, res) {
	console.log(JSON.stringify(Object.assign(
		{datetime: new Date().toISOString()},
		{path: '/env'},
		req.headers
	)))
	res.send({env: runtime})
}

init()

module.exports = env
