import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab access tokens and requests', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';

  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('lists project access tokens', async () => {
    const mockData = [{ id: 1 }];
    nock(base)
      .get('/api/v4/projects/123/access_tokens')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/access_tokens');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('lists project access requests', async () => {
    const mockData = [{ id: 1 }];
    nock(base)
      .get('/api/v4/projects/123/access_requests')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/access_requests');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('lists group access tokens', async () => {
    const mockData = [{ id: 1 }];
    nock(base)
      .get('/api/v4/groups/5/access_tokens')
      .reply(200, mockData);

    const res = await request(app).get('/groups/5/access_tokens');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('lists group access requests', async () => {
    const mockData = [{ id: 1 }];
    nock(base)
      .get('/api/v4/groups/5/access_requests')
      .reply(200, mockData);

    const res = await request(app).get('/groups/5/access_requests');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
