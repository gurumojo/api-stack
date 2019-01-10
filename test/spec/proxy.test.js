const request = require('supertest')

const {charset, header, status, type} = require('./../../lib/constant')

const {PROXY_HOST, PROXY_PORT} = process.env

const proxy = request(`https://${PROXY_HOST}:${PROXY_PORT}`)

const root = '/'
const doc = '/doc'
const env = '/env'
const health = '/health'
const metric = '/metric'
const swagger = '2.0'
const title = 'PostgREST API'
const summary = 'OpenAPI description (this document)'

describe('Service Proxy', () => {

	it(`returns OK with API at ${root}`, () => {
		return proxy.get(root)
		.expect(status.OK)
		.expect(header.CONTENT_TYPE, `${type.API}; ${charset.UTF8}`)
	})

	it(`returns OK with JSON at ${doc}`, () => {
		return proxy.get(doc)
		.expect(status.OK)
		.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
	})

	it(`returns OK with JSON at ${env}`, () => {
		return proxy.get(env)
		.expect(status.OK)
		.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
	})

	it(`returns OK with JSON at ${health}`, () => {
		return proxy.get(health)
		.expect(status.OK)
		.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
	})

	it(`returns OK with JSON at ${metric}`, () => {
		return proxy.get(metric)
		.expect(status.OK)
		.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
	})

	it('returns Not Found with JSON at /*', () => {
		return proxy.get('/perfectly-bogus-test-route')
		.expect(status.NOT_FOUND)
		.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
	})
})
