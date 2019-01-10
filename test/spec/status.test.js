const request = require('supertest')

const {charset, header, status, type} = require('./../../lib/constant')

const {STATUS_HOST, STATUS_PORT} = process.env

const info = request(`http://${STATUS_HOST}:${STATUS_PORT}`)

const doc = '/doc'
const env = '/env'
const health = '/health'
const metric = '/metric'
const wildcard = '/*'
const swagger = '2.0'
const title = 'PostgREST API'
const summary = 'OpenAPI description (this document)'

describe('Service Status', () => {

	describe(doc, () => {

		it('returns OK with JSON', () => {
			return info.get(doc)
			.expect(status.OK)
			.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
		})
	})

	describe(env, () => {

		it('returns OK with JSON', () => {
			return info.get(env)
			.expect(status.OK)
			.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
		})

		it('details the execution environment', () => {
			return info.get(env)
			.expect(response => {
				expect(response.body.env.hasOwnProperty('NODE_VERSION')).toBe(true)
			})
		})
	})

	describe(health, () => {

		it('returns OK with JSON', () => {
			return info.get(health)
			.expect(status.OK)
			.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
		})
	})

	describe(metric, () => {

		it('returns OK with JSON', () => {
			return info.get(metric)
			.expect(status.OK)
			.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
		})
	})

	describe(wildcard, () => {

		it('returns Not Found with HTML', () => {
			return info.get(wildcard)
			.expect(status.NOT_FOUND)
			.expect(header.CONTENT_TYPE, `${type.HTML}; ${charset.UTF8}`)
		})
	})
})
