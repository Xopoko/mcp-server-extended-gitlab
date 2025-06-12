import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab container registry', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';

  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('lists registry repositories', async () => {
    const mockData = [{ id: 1 }];
    nock(base)
      .get('/api/v4/projects/123/registry/repositories')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/registry/repositories');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('lists registry protection rules', async () => {
    const mockData = [{ id: 1 }];
    nock(base)
      .get('/api/v4/projects/123/registry/protection/repository/rules')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/registry/protection/repository/rules');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
