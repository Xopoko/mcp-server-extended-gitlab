import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab tags endpoints', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';

  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('creates a tag', async () => {
    const payload = { tag_name: 'v1.0', ref: 'main' };
    const mockData = { name: 'v1.0' };
    nock(base)
      .post('/api/v4/projects/123/repository/tags', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/tags')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('returns a tag', async () => {
    const mockData = { name: 'v1.0' };
    nock(base)
      .get('/api/v4/projects/123/repository/tags/v1.0')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/tags/v1.0');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('returns tags list', async () => {
    const mockData = [{ name: 'v1.0' }];
    nock(base)
      .get('/api/v4/projects/123/repository/tags')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/tags');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('deletes a tag', async () => {
    nock(base)
      .delete('/api/v4/projects/123/repository/tags/v1.0')
      .reply(204);

    const res = await request(app).delete('/projects/123/tags/v1.0');
    expect(res.status).toBe(204);
  });
});
