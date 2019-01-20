const runtime = {}

function doc(req, res) {
	console.log(JSON.stringify(Object.assign(
		{datetime: new Date().toISOString()},
		{path:'/doc'},
		req.headers
	)))
	res.send(runtime)
}

module.exports = doc
