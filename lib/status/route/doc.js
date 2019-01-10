const runtime = {}

function doc(req, res) {
	console.log('DOC')
	res.send(runtime)
}

module.exports = doc
