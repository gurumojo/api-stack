function report(req, res) {
	if (process.env.DEBUG) {
		console.log(JSON.stringify(Object.assign(
			{datetime: new Date().toISOString()},
			{path: '/report'},
			req.headers,
			req.body
		)))
	}
	res.status(201).send({})
}

module.exports = report
