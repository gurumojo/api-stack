const request = require('request')

const {label:{FAIL, PASS, WARN}} = require('../lib/constant')

const {
	API_HOST,
	API_PORT,
	HEALTHCHECK_DIVISOR,
	HEALTHCHECK_INTERVAL,
	HEALTHCHECK_THRESHOLD
} = process.env

const uri = `http://${API_HOST}:${API_PORT}/`

const runtime = {history: []}

let interval

function check() {
	return typeof runtime.detail === 'object'
}

function save() {
	if (runtime.history.length > HEALTHCHECK_THRESHOLD) {
		runtime.history = runtime.history.slice(1 - HEALTHCHECK_THRESHOLD)
	}
	let current = {state: runtime.status, timestamp: Date.now()}
	runtime.history.push(current)
	let wins = runtime.history.reduce((sum, x) => {
		return sum + (x.state === PASS ? 1 : 0)
	}, 0)
	runtime.rating = wins / (HEALTHCHECK_THRESHOLD / HEALTHCHECK_DIVISOR)
	runtime.status = (runtime.rating >= 1) ? (check() ? PASS : WARN) : FAIL
	let when = runtime.history.reduce((update, x) => {
		return (x.state === runtime.status) ? update : x.timestamp
	}, runtime.update)
	runtime.update = when
}

function bump() {
	request(uri, (error, response, body) => {
		if (error) {
			runtime.detail = error.message
			runtime.status = FAIL
			console.log('Request', error.stack)
		} else {
			try {
				runtime.detail = JSON.parse(body).info
				runtime.status = PASS
			} catch (fail) {
				runtime.detail = fail.message
				runtime.status = FAIL
				console.log('Parse', fail.stack)
			}
		}
		save()
	})
}

function health(req, res) {
	if (!interval) {
		interval = setInterval(bump, HEALTHCHECK_INTERVAL)
	}
	let {detail, rating, status, update} = runtime
	let timestamp = Date.now()
	let state = {health: {detail, rating, status, update, timestamp}}
	if (process.env.DEBUG) {
		console.log(JSON.stringify(Object.assign(
			{datetime: new Date().toISOString()},
			{path:'/health'},
			req.headers,
			{status}
		)))
	}
	res.status(200).send(state)
}

module.exports = health
