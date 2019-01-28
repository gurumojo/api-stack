function report(request, response) {
	if (process.env.DEBUG) {
		console.log(JSON.stringify(Object.assign(
			{datetime: new Date().toISOString()},
			{path: '/report'},
			request.headers,
			request.body
		)))
	}
	response.status(201).send({})
}

module.exports = report
