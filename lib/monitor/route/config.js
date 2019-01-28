const whitelist = Object.freeze([
	'API_ANON_ROLE',
	'API_AUTH_ROLE',
	'API_HOST',
	'API_IMAGE',
	'API_PORT',
	'API_SCHEMA',
	'API_SECRET',
	'API_URL',
	'COMPOSE_FILE',
	'COMPOSE_PROJECT_NAME',
	'DB_HOST',
	'DB_IMAGE',
	'DB_NAME',
	'DB_PORT',
	'DB_SECRET',
	'DB_USER',
	'HEALTHCHECK_DIVISOR',
	'HEALTHCHECK_INTERVAL',
	'HEALTHCHECK_THRESHOLD',
	'MONITOR_HOST',
	'MONITOR_IMAGE',
	'MONITOR_PORT',
	'NODE_TLS_REJECT_UNAUTHORIZED',
	'PROXY_HOST',
	'PROXY_IMAGE',
	'PROXY_PORT',
	'SECURE_PORT',
	'SERVICE_PORT',
	'SIDECAR_PORT',
	'SWAGGER_IMAGE',
	'SWAGGER_PORT'
	// 'PGRST_DB_ANON_ROLE',
	// 'PGRST_DB_POOL',
	// 'PGRST_DB_SCHEMA',
	// 'PGRST_DB_URI',
	// 'PGRST_JWT_AUD',
	// 'PGRST_JWT_SECRET',
	// 'PGRST_MAX_ROWS',
	// 'PGRST_PRE_REQUEST',
	// 'PGRST_ROLE_CLAIM_KEY',
	// 'PGRST_SECRET_IS_BASE64',
	// 'PGRST_SERVER_HOST',
	// 'PGRST_SERVER_PORT',
	// 'PGRST_SERVER_PROXY_URI',
])

function config(request, response) {
	if (process.env.DEBUG) {
		console.log(JSON.stringify(Object.assign(
			{datetime: new Date().toISOString()},
			{path:'/config'},
			request.headers
		)))
	}
	let runtime = whitelist.reduce((env, key) => {
		env[key] = process.env[key]
		return env
	}, {})
	response.status(200).send(runtime)
}

module.exports = config
