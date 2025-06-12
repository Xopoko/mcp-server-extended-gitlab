import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab deploy keys, tokens and deployments', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';

  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('lists deploy keys', async () => {
    const mockData = [{ id: 1, title: 'key' }];
    nock(base)
      .get('/api/v4/projects/123/deploy_keys')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/deploy_keys');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('creates a deploy token', async () => {
    const payload = { name: 'token', scopes: ['read_repository'] };
    const mockData = { id: 2, name: 'token' };
    nock(base)
      .post('/api/v4/projects/123/deploy_tokens', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/deploy_tokens')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('lists deployments', async () => {
    const mockData = [{ id: 1 }];
    nock(base)
      .get('/api/v4/projects/123/deployments')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/deployments');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
