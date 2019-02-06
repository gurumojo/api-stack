const http = require('./lib/express')()

http.use('/doc', require('./route/doc'))
http.use('/env', require('./route/env'))
http.use('/health', require('./route/health'))
http.use('/metric', require('./route/metric'))

http.use('/config', require('./route/config'))
http.use('/report', require('./route/report'))
http.use('/secret', require('./route/secret'))

// http.use((error, request, response, next) => {
//   let status = error.status || 500
//   response.status(status).send({ error: error.message, status })
// })

const {MONITOR_PORT} = process.env

http.listen(MONITOR_PORT, () => {
	console.log(`Listening on port ${MONITOR_PORT}`)
})
