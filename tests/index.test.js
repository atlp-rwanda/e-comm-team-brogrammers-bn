import request from 'supertest';
import app from '../src/app';

describe('testing the project', () => {
  test('should return hello message', async () => {
    const res = await request(app).get('/home');
    // eslint-disable-next-line no-undef
    expect(res.statusCode).toBe(200);
  });

  test('GET unsupportedlink/unsupportedsublink', async () => {
    const res = await request(app).get('/unsupportedlink/unsupportedsublink');
    // eslint-disable-next-line no-undef
    expect(res.statusCode).toBe(404);
  });
});
