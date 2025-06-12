import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab merge request management endpoints', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';
  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('creates a merge request', async () => {
    const payload = { source_branch: 'feat', target_branch: 'main', title: 'MR' };
    const mockData = { id: 1, title: 'MR' };
    nock(base)
      .post('/api/v4/projects/123/merge_requests', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/merge_requests')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('accepts a merge request', async () => {
    const mockData = { id: 1, merged: true };
    nock(base)
      .put('/api/v4/projects/123/merge_requests/1/merge')
      .reply(200, mockData);

    const res = await request(app).put('/projects/123/merge_requests/1/merge');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('closes a merge request', async () => {
    const mockData = { id: 1, state: 'closed' };
    nock(base)
      .put('/api/v4/projects/123/merge_requests/1/close')
      .reply(200, mockData);

    const res = await request(app).put('/projects/123/merge_requests/1/close');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('reopens a merge request', async () => {
    const mockData = { id: 1, state: 'reopened' };
    nock(base)
      .put('/api/v4/projects/123/merge_requests/1/reopen')
      .reply(200, mockData);

    const res = await request(app).put('/projects/123/merge_requests/1/reopen');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('rebases a merge request', async () => {
    const mockData = { rebase_in_progress: true };
    nock(base)
      .put('/api/v4/projects/123/merge_requests/1/rebase')
      .reply(200, mockData);

    const res = await request(app).put('/projects/123/merge_requests/1/rebase');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('returns merge request changes', async () => {
    const mockData = { changes: [] };
    nock(base)
      .get('/api/v4/projects/123/merge_requests/1/changes')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/merge_requests/1/changes');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('returns a single discussion', async () => {
    const mockData = { id: 'abc', notes: [] };
    nock(base)
      .get('/api/v4/projects/123/merge_requests/1/discussions/abc')
      .reply(200, mockData);

    const res = await request(app).get(
      '/projects/123/merge_requests/1/discussions/abc',
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('adds note to existing discussion', async () => {
    const payload = { body: 'hi' };
    const mockData = { id: 'note1', body: 'hi' };
    nock(base)
      .post('/api/v4/projects/123/merge_requests/1/discussions/abc/notes', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/merge_requests/1/discussions/abc/notes')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('creates a merge request discussion', async () => {
    const payload = { body: 'hi' };
    const mockData = { id: 'abc', notes: [] };
    nock(base)
      .post('/api/v4/projects/123/merge_requests/1/discussions', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/merge_requests/1/discussions')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('deletes a merge request discussion', async () => {
    nock(base)
      .delete('/api/v4/projects/123/merge_requests/1/discussions/abc')
      .reply(204);

    const res = await request(app).delete(
      '/projects/123/merge_requests/1/discussions/abc',
    );
    expect(res.status).toBe(204);
  });

  it('updates a merge request discussion', async () => {
    const payload = { body: 'update' };
    const mockData = { id: 'abc', notes: [] };
    nock(base)
      .put('/api/v4/projects/123/merge_requests/1/discussions/abc', payload)
      .reply(200, mockData);

    const res = await request(app)
      .put('/projects/123/merge_requests/1/discussions/abc')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('resolves a discussion', async () => {
    const mockData = { id: 'abc', resolved: true };
    nock(base)
      .put('/api/v4/projects/123/merge_requests/1/discussions/abc/resolve')
      .reply(200, mockData);

    const res = await request(app).put(
      '/projects/123/merge_requests/1/discussions/abc/resolve',
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('unresolves a discussion', async () => {
    const mockData = { id: 'abc', resolved: false };
    nock(base)
      .put('/api/v4/projects/123/merge_requests/1/discussions/abc/unresolve')
      .reply(200, mockData);

    const res = await request(app).put(
      '/projects/123/merge_requests/1/discussions/abc/unresolve',
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('returns a merge request note', async () => {
    const mockData = { id: 5, body: 'note' };
    nock(base)
      .get('/api/v4/projects/123/merge_requests/1/notes/5')
      .reply(200, mockData);

    const res = await request(app).get(
      '/projects/123/merge_requests/1/notes/5',
    );
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('creates a merge request note', async () => {
    const payload = { body: 'note' };
    const mockData = { id: 5, body: 'note' };
    nock(base)
      .post('/api/v4/projects/123/merge_requests/1/notes', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/merge_requests/1/notes')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('updates a merge request note', async () => {
    const payload = { body: 'edit' };
    const mockData = { id: 5, body: 'edit' };
    nock(base)
      .put('/api/v4/projects/123/merge_requests/1/notes/5', payload)
      .reply(200, mockData);

    const res = await request(app)
      .put('/projects/123/merge_requests/1/notes/5')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('deletes a merge request note', async () => {
    nock(base)
      .delete('/api/v4/projects/123/merge_requests/1/notes/5')
      .reply(204);

    const res = await request(app).delete(
      '/projects/123/merge_requests/1/notes/5',
    );
    expect(res.status).toBe(204);
  });

  it('sets merge request labels', async () => {
    const payload = { labels: 'bug,confirmed' };
    const mockData = { id: 1, labels: ['bug', 'confirmed'] };
    nock(base)
      .put('/api/v4/projects/123/merge_requests/1', payload)
      .reply(200, mockData);

    const res = await request(app)
      .put('/projects/123/merge_requests/1')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
