import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab feature flags and freeze periods', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';

  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('creates a feature flag', async () => {
    const payload = { name: 'flag' };
    const mockData = { id: 1, name: 'flag' };
    nock(base)
      .post('/api/v4/projects/123/feature_flags', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/feature_flags')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('lists feature flags', async () => {
    const mockData = [{ id: 1, name: 'flag' }];
    nock(base)
      .get('/api/v4/projects/123/feature_flags')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/feature_flags');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('deletes a feature flag', async () => {
    nock(base)
      .delete('/api/v4/projects/123/feature_flags/1')
      .reply(204);

    const res = await request(app).delete('/projects/123/feature_flags/1');
    expect(res.status).toBe(204);
  });

  it('lists freeze periods', async () => {
    const mockData = [{ id: 1 }];
    nock(base)
      .get('/api/v4/projects/123/freeze_periods')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/freeze_periods');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
