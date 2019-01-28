const signal = require('http-graceful-shutdown')

const http = require('./lib/express')()

http.use('/doc', require('./route/doc'))
http.use('/env', require('./route/env'))
http.use('/health', require('./route/health'))
http.use('/metric', require('./route/metric'))

http.use('/config', require('./route/config'))
http.use('/report', require('./route/report'))

const {MONITOR_PORT} = process.env

http.listen(MONITOR_PORT, () => {
	console.log(`Listening on port ${MONITOR_PORT}`)
})

signal(http, {
	signals: 'SIGINT SIGTERM',
	timeout: 5000,
	development: false,
	onShutdown: async (signal) => {
		console.log(`Caught ${signal} ...`)
	},
	finally: () => {
		console.log('Shutdown complete.')
	}
})
