import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab pipelines endpoints', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';

  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('returns pipelines list from GitLab', async () => {
    const mockData = [{ id: 1, status: 'success' }];
    nock(base)
      .get('/api/v4/projects/123/pipelines')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/pipelines');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('returns a pipeline', async () => {
    const mockData = { id: 1, status: 'success' };
    nock(base)
      .get('/api/v4/projects/123/pipelines/1')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/pipelines/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
