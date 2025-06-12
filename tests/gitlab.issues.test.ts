import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab issues endpoints', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';
  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('returns issues list from GitLab', async () => {
    const mockData = [{ id: 1, title: 'Issue1' }];
    nock(base)
      .get('/api/v4/projects/123/issues')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/issues');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('creates an issue in GitLab', async () => {
    const payload = { title: 'New issue' };
    const mockData = { id: 2, title: 'New issue' };
    nock(base)
      .post('/api/v4/projects/123/issues', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/issues')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });
});
