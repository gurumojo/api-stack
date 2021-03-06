const request = require('supertest')

const {charset, header, status, type} = require('./../../lib/constant')

const jwt = require('../fixture/jwt').api_auth

const {API_HOST, API_PORT} = process.env

const api = request(`http://${API_HOST}:${API_PORT}`)

const path = '/'
const swagger = '2.0'
const title = 'PostgREST API'
const summary = 'OpenAPI description (this document)'
const user = {
	"id":"e1be1033-4668-4652-bc44-dfcb904ca537",
	"email":"theguy@gurumojo.net",
	"phone":"12345678901",
	"handle":"theguy"
}

describe(title, () => {

	it('returns a UTF-8 JSON response body', () => {
		return api.get(path)
		.expect(status.OK)
		.expect(header.CONTENT_TYPE, `${type.API}; ${charset.UTF8}`)
	})

	it('considers the Accept header in requests', () => {
		return api.get(path)
		.set(header.ACCEPT, type.TEXT)
		.expect(status.UNSUPPORTED_MEDIA_TYPE)
		.expect(header.CONTENT_TYPE, `${type.JSON}; ${charset.UTF8}`)
	})

	it('provides swagger schema at the service root path', () => {
		return api.get(path)
		.expect(status.OK)
		.expect(header.CONTENT_TYPE, `${type.API}; ${charset.UTF8}`)
		.then(response => {
			expect(response.body.swagger).toBe(swagger)
			expect(response.body.info.title).toBe(title)
			expect(response.body.paths[path].get.summary).toBe(summary)
		})
	})

	it('uses JWT for authorization', () => {
		return api.get(path)
		.set(header.AUTH, `Bearer ${jwt}`)
		.then(response => {
			expect(response.body.swagger).toBe(swagger)
			expect(response.body.info.title).toBe(title)
			expect(response.body.paths[path].get.summary).toBe(summary)
		})
	})

	it('refuses POST requests at the root path', () => {
		return api.post(path)
		.send(user)
		.set(header.AUTH, `Bearer ${jwt}`)
		.expect(status.NOT_FOUND)
	})

	it('allows POST requests for authenticated users', () => {
		return api.post('/user')
		.send(user)
		.set(header.AUTH, `Bearer ${jwt}`)
		.expect(status.CREATED)
	})

	it('allows DELETE requests for authenticated users', () => {
		return api.delete('/user')
		.send(user)
		.set(header.AUTH, `Bearer ${jwt}`)
		.expect(status.NO_CONTENT)
	})
})


/*
  "info": {
    "version": "5.2.0 (1e732ac)",
    "title": "PostgREST API",
    "description": "standard public schema"
  },
  "host": "0.0.0.0:3000",
  "basePath": "/",
  "schemes": [
    "http"
  ],
  "consumes": [
    "application/json",
    "application/vnd.pgrst.object+json",
    "text/csv"
  ],
  "produces": [
    "application/json",
    "application/vnd.pgrst.object+json",
    "text/csv"
  ],
  "paths": {
    "/": {
      "get": {
        "tags": [
          "Introspection"
        ],
        "summary": "OpenAPI description (this document)",
        "produces": [
          "application/openapi+json",
          "application/json"
        ],
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    }
  },
*/
