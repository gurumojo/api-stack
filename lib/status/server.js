const signal = require('http-graceful-shutdown')

const http = require('./lib/express')()

const {doc, env, health, metric} = require('./route')

const {STATUS_PORT} = process.env

http.use('/doc', doc)
http.use('/env', env)
http.use('/health', health)
http.use('/metric', metric)

http.listen(STATUS_PORT, () => {
	console.log(`Listening on port ${STATUS_PORT}`)
})

signal(http, {
	signals: 'SIGINT SIGTERM',
	timeout: 5000,
	development: false,
	onShutdown: async (signal) => {
		console.log(`Caught ${signal} ...`)
		console.log('Close connections ...')
	},
	finally: () => {
		console.log('Shutdown complete.')
	}
})
