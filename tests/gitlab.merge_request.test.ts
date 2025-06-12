import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab single merge request endpoint', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';
  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('returns a merge request', async () => {
    const mockData = { id: 1, title: 'MR1' };
    nock(base)
      .get('/api/v4/projects/123/merge_requests/1')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/merge_requests/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
