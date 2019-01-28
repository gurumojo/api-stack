function config(req, res) {
	if (process.env.DEBUG) {
		console.log(JSON.stringify(Object.assign(
			{datetime: new Date().toISOString()},
			{path:'/config'},
			req.headers
		)))
	}
	res.status(200).send(process.env)
}

module.exports = config
