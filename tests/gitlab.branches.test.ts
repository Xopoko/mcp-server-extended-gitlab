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
});
