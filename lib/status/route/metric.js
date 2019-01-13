const runtime = {}

function metric(req, res) {
	console.log(JSON.stringify(Object.assign(
		{datetime: new Date().toISOString()},
		{path:'/metric'},
		req.headers
	)))
	res.send(runtime)
}

module.exports = metric
