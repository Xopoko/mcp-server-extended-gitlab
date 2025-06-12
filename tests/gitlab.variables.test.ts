import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab project variables and protected branches', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';

  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('adds a project variable', async () => {
    const payload = { key: 'VAR', value: '1' };
    const mockData = { key: 'VAR', value: '1' };
    nock(base)
      .post('/api/v4/projects/123/variables', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/variables')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('lists project variables', async () => {
    const mockData = [{ key: 'VAR', value: '1' }];
    nock(base)
      .get('/api/v4/projects/123/variables')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/variables');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('deletes a project variable', async () => {
    nock(base)
      .delete('/api/v4/projects/123/variables/VAR')
      .reply(204);

    const res = await request(app).delete('/projects/123/variables/VAR');
    expect(res.status).toBe(204);
  });

  it('lists protected branches', async () => {
    const mockData = [{ name: 'main' }];
    nock(base)
      .get('/api/v4/projects/123/protected_branches')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/protected_branches');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
