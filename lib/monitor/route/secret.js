const { getParamSetAsObject } = require('../lib/ssm')

// curl -i localhost:3000/secret -H 'x-param-path: /net/gurumojo/api/dev/jwt'

function secret(request, response) {
	if (process.env.DEBUG) {
		console.log(JSON.stringify(Object.assign(
			{datetime: new Date().toISOString()},
			{path: '/secret'},
			request.headers
		)))
	}
	let path = request.get('x-param-path')
	if (!path) {
		let error = new Error('Missing required x-param-path header')
		response.status(400).send({ error })
	} else {
		getParamSetAsObject(path)
		.then(params => {
			response.status(200).type('json').send(params)
		})
		.catch(error => {
			response.status(error.status || 502).send({ error })
		})
	}
}

module.exports = secret
