import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab branches endpoint', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';
  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('returns branch list from GitLab', async () => {
    const mockData = [{ name: 'main' }];
    nock(base)
      .get('/api/v4/projects/123/repository/branches')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/branches');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('creates a repository branch', async () => {
    const payload = { branch: 'feature', ref: 'main' };
    const mockData = { name: 'feature' };
    nock(base)
      .post('/api/v4/projects/123/repository/branches', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/branches')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('returns a single branch', async () => {
    const mockData = { name: 'main' };
    nock(base)
      .get('/api/v4/projects/123/repository/branches/main')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/branches/main');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('deletes a repository branch', async () => {
    nock(base)
      .delete('/api/v4/projects/123/repository/branches/old')
      .reply(204);

    const res = await request(app).delete('/projects/123/branches/old');
    expect(res.status).toBe(204);
  });
});
