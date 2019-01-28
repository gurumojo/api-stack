const request = require('supertest')

const {charset, header, status, type} = require('../../lib/constant')

const {MONITOR_HOST, MONITOR_PORT} = process.env

const monitor = request(`http://${MONITOR_HOST}:${MONITOR_PORT}`)

const doc = '/doc'
const env = '/env'
const health = '/health'
const metric = '/metric'
const config = '/config'
const report = '/report'
const wildcard = '/*'
const swagger = '2.0'
const title = 'PostgREST API'
const summary = 'OpenAPI description (this document)'

describe('Service Monitor', () => {

	describe(doc, () => {

		it('returns OK with JSON', () => {
			return monitor.get(doc)
			.expect(status.OK)
			.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
		})
	})

	describe(env, () => {

		it('returns OK with JSON', () => {
			return monitor.get(env)
			.expect(status.OK)
			.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
		})

		it('details the execution environment', () => {
			return monitor.get(env)
			.expect(response => {
				expect(response.body.env.hasOwnProperty('NODE_VERSION')).toBe(true)
			})
		})
	})

	describe(health, () => {

		it('returns OK with JSON', () => {
			return monitor.get(health)
			.expect(status.OK)
			.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
		})
	})

	describe(metric, () => {

		it('returns OK with JSON', () => {
			return monitor.get(metric)
			.expect(status.OK)
			.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
		})
	})

	describe(config, () => {

		it('returns OK with JSON', () => {
			return monitor.get(config)
			.expect(status.OK)
			.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
		})
	})

	describe(report, () => {

		it('returns CREATED with JSON', () => {
			return monitor.post(report)
			.send({ foo: 'bar', baz: 'qux' })
			.expect(status.CREATED)
			.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
		})
	})

	describe(wildcard, () => {

		it('returns Not Found with HTML', () => {
			return monitor.get(wildcard)
			.expect(status.NOT_FOUND)
			.expect(header.CONTENT_TYPE, `${type.HTML}; ${charset.UTF8}`)
		})
	})
})
