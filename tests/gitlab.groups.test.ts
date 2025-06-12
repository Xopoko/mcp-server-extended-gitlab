import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab groups endpoints', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';
  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('creates a group', async () => {
    const payload = { name: 'Test', path: 'test' };
    const mockData = { id: 5, name: 'Test' };
    nock(base)
      .post('/api/v4/groups', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/groups')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('returns a group', async () => {
    const mockData = { id: 5, name: 'Test' };
    nock(base)
      .get('/api/v4/groups/5')
      .reply(200, mockData);

    const res = await request(app).get('/groups/5');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('deletes a group', async () => {
    nock(base)
      .delete('/api/v4/groups/5')
      .reply(202);

    const res = await request(app).delete('/groups/5');
    expect(res.status).toBe(202);
  });

  it('lists group members', async () => {
    const mockData = [{ id: 1, name: 'Alice' }];
    nock(base)
      .get('/api/v4/groups/5/members')
      .reply(200, mockData);

    const res = await request(app).get('/groups/5/members');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
