import request from 'supertest'
import app from '../src/app.js'

describe('testing the project', () => {
  test('should return hello message', async () => {
    const res = await request(app).get('/home')
    expect(res.statusCode).toBe(200)
  })

  test('GET unsupportedlink/unsupportedsublink', async () => {
    const res = await request(app).get('/unsupportedlink/unsupportedsublink')
    expect(res.statusCode).toBe(404)
  })
})