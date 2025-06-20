import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab project endpoint', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';
  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('returns project metadata', async () => {
    const mockData = { id: 123, name: 'example' };
    nock(base)
      .get('/api/v4/projects/123')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('returns projects list', async () => {
    const mockData = [{ id: 1, name: 'proj' }];
    nock(base)
      .get('/api/v4/projects')
      .reply(200, mockData);

    const res = await request(app).get('/projects');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('searches projects', async () => {
    const mockData = [{ id: 1, name: 'proj' }];
    nock(base)
      .get('/api/v4/projects')
      .query({ search: 'test' })
      .reply(200, mockData);

    const res = await request(app).get('/projects/search?q=test');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
