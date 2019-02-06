// require('dotenv').config()
const { SSM } = require('aws-sdk')

const ssm = new SSM ({ region: process.env.AWS_REGION || 'us-west-2' })

let array, env, object

let options = {
	Path: '/net/gurumojo/api/dev',
	// MaxResults: 0,
	// NextToken: 'STRING_VALUE',
	// ParameterFilters: [
	// 	{
	// 		Key: 'STRING_VALUE', /* required */
	// 		Option: 'STRING_VALUE',
	// 		Values: [
	// 			'STRING_VALUE',
	// 		]
	// 	},
	// ],
	// Recursive: true,
	WithDecryption: true
}

function baseNameFromPath(path) {
	return path.split('/').pop()
}

function envNameFromPath(path) {
	return path.split('/').pop().replace(nonalphanumeric, '_').toUpperCase()
}

async function fetch (config) {
	let proceed = true
	let records = []
	let response
	while (proceed) {
		try {
			response = await ssm.getParametersByPath(config).promise()
		} catch (error) {
			throw new Error(error.message)
		}
		if (response) {
			records = records.concat(response.Parameters)
		}
		if (!response || !response.NextToken) {
			proceed = false
		}
	}
	return records
}

const nonalphanumeric = /[^a-z0-9]/gi

function getParamSet(path) {
	return getParametersByPath(path).then(params => {
		let output
		if (array || process.env.SSM_AS_ARRAY) {
			if (env || process.env.SSM_AS_ENV_NAME) {
				output = params.map(x => `${envNameFromPath(x.Name)}=${x.Value}`)
			} else {
				output = params.map(x => `${baseNameFromPath(x.Name)}=${x.Value}`)
			}
		} else if (object || process.env.SSM_AS_OBJECT) {
			output = params.reduce((o, x) => {
				if (env || process.env.SSM_AS_ENV_NAME) {
					o[envNameFromPath(x.Name)] = x.Value
				} else {
					o[baseNameFromPath(x.Name)] = x.Value
				}
				return o
			}, {})
		} else {
			output = params.reduce((o, x) => {
				o[x.Name] = x.Value
				return o
			}, {})
		}
		return output
	})
}

function getParamSetAsArray (path) {
	array = 1
	let params = getParamSet(path).finally(() => {
		array = process.env.SSM_AS_ARRAY || 0
	})
	return params
}

function getParamSetAsObject (path) {
	object = 1
	let params = getParamSet(path).finally(() => {
		object = process.env.SSM_AS_OBJECT || 0
	})
	return params
}

function getParamSetAsEnvArray (path) {
	array = 1
	env = 1
	let params = getParamSet(path).finally(() => {
		array = process.env.SSM_AS_ARRAY || 0
		env = process.env.SSM_AS_ENV_NAME || 0
	})
	return params
}

function getParamSetAsEnvObject (path) {
	object = 1
	env = 1
	let params = getParamSet(path).finally(() => {
		object = process.env.SSM_AS_OBJECT || 0
		env = process.env.SSM_AS_ENV_NAME || 0
	})
	return params
}

function getParametersByPath (Path=options.Path) {
	let config = Object.assign({}, options, {Path: process.env.PARAM_PATH || Path})
	return fetch(config).catch(error => {
		console.log(`SSM Failure: ${error.stack} ${config}`)
	})
}

module.exports = {
	getParamSet,
	getParamSetAsArray,
	getParamSetAsObject,
	getParamSetAsEnvArray,
	getParamSetAsEnvObject,
	getParametersByPath
}
