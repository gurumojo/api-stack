const runtime = {}

function metric(req, res) {
	console.log('METRIC')
	res.send(runtime)
}

module.exports = metric
