import request from 'supertest';
import { createApp } from '../src/bootstrapServer';

describe('Hello tool route', () => {
  const app = createApp();
  it('greets the provided name', async () => {
    const res = await request(app)
      .post('/tool/hello')
      .send({ name: 'Alice' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ greeting: 'Hello, Alice!' });
  });
});
