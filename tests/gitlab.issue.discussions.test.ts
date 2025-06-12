import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab issue discussions endpoints', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';

  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('lists issue discussions', async () => {
    const mockData = [{ id: 'abc', notes: [] }];
    nock(base)
      .get('/api/v4/projects/123/issues/4/discussions')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/issues/4/discussions');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('gets a single issue discussion', async () => {
    const mockData = { id: 'abc', notes: [] };
    nock(base)
      .get('/api/v4/projects/123/issues/4/discussions/abc')
      .reply(200, mockData);

    const res = await request(app).get(
      '/projects/123/issues/4/discussions/abc',
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('creates an issue discussion', async () => {
    const payload = { body: 'hi' };
    const mockData = { id: 'abc', notes: [] };
    nock(base)
      .post('/api/v4/projects/123/issues/4/discussions', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/issues/4/discussions')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('adds a note to an issue discussion', async () => {
    const payload = { body: 'note' };
    const mockData = { id: 'note1', body: 'note' };
    nock(base)
      .post('/api/v4/projects/123/issues/4/discussions/abc/notes', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/issues/4/discussions/abc/notes')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('updates a note in an issue discussion', async () => {
    const payload = { body: 'edit' };
    const mockData = { id: 'note1', body: 'edit' };
    nock(base)
      .put('/api/v4/projects/123/issues/4/discussions/abc/notes/1', payload)
      .reply(200, mockData);

    const res = await request(app)
      .put('/projects/123/issues/4/discussions/abc/notes/1')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('deletes a note from an issue discussion', async () => {
    nock(base)
      .delete('/api/v4/projects/123/issues/4/discussions/abc/notes/1')
      .reply(204);

    const res = await request(app).delete(
      '/projects/123/issues/4/discussions/abc/notes/1',
    );
    expect(res.status).toBe(204);
  });
});
