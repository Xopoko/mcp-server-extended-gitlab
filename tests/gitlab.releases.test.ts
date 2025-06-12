import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab releases endpoints', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';

  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('creates a release', async () => {
    const payload = { name: 'v1.0', tag_name: 'v1.0' };
    const mockData = { name: 'v1.0' };
    nock(base)
      .post('/api/v4/projects/123/releases', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/releases')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('returns a release', async () => {
    const mockData = { name: 'v1.0' };
    nock(base)
      .get('/api/v4/projects/123/releases/v1.0')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/releases/v1.0');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('returns releases list', async () => {
    const mockData = [{ name: 'v1.0' }];
    nock(base)
      .get('/api/v4/projects/123/releases')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/releases');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('updates a release', async () => {
    const payload = { name: 'v1.0', description: 'update' };
    const mockData = { name: 'v1.0', description: 'update' };
    nock(base)
      .put('/api/v4/projects/123/releases/v1.0', payload)
      .reply(200, mockData);

    const res = await request(app)
      .put('/projects/123/releases/v1.0')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('deletes a release', async () => {
    nock(base)
      .delete('/api/v4/projects/123/releases/v1.0')
      .reply(204);

    const res = await request(app).delete('/projects/123/releases/v1.0');
    expect(res.status).toBe(204);
  });
});
