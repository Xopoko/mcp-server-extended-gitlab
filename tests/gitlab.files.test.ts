import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab File fetch endpoint', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';
  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('returns raw file content', async () => {
    const fileContent = 'console.log("hello");';
    const encodedPath = encodeURIComponent('src/index.ts');
    nock(base)
      .get(`/api/v4/projects/123/repository/files/${encodedPath}/raw`)
      .query({ ref: 'main' })
      .reply(200, fileContent);

    const res = await request(app).get('/projects/123/files/src/index.ts?ref=main');
    expect(res.status).toBe(200);
    expect(res.text).toBe(fileContent);
  });
});
