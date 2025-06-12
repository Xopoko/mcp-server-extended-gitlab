import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab misc endpoints', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';

  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('lists group epics', async () => {
    const mockData = [{ id: 1 }];
    nock(base)
      .get('/api/v4/groups/5/epics')
      .reply(200, mockData);

    const res = await request(app).get('/groups/5/epics');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('lists personal access tokens', async () => {
    const mockData = [{ id: 1 }];
    nock(base)
      .get('/api/v4/personal_access_tokens')
      .reply(200, mockData);

    const res = await request(app).get('/personal_access_tokens');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('proxies GraphQL', async () => {
    const query = '{ projects { id } }';
    const mockData = { data: { projects: [] } };
    nock(base)
      .post('/api/v4/graphql', { query })
      .reply(200, mockData);

    const res = await request(app)
      .post('/api/graphql')
      .send({ query })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
