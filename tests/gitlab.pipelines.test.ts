import request from 'supertest';
import { createApp } from '../src/createApp';
import nock from 'nock';

describe('GitLab pipelines endpoints', () => {
  const app = createApp();
  const base = 'https://gitlab.example.com';

  beforeAll(() => {
    process.env.GITLAB_BASE_URL = base + '/api/v4';
    process.env.GITLAB_TOKEN = 'testtoken';
  });

  afterEach(() => nock.cleanAll());

  it('returns pipelines list from GitLab', async () => {
    const mockData = [{ id: 1, status: 'success' }];
    nock(base)
      .get('/api/v4/projects/123/pipelines')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/pipelines');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('returns a pipeline', async () => {
    const mockData = { id: 1, status: 'success' };
    nock(base)
      .get('/api/v4/projects/123/pipelines/1')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/pipelines/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('creates a pipeline', async () => {
    const payload = { ref: 'main' };
    const mockData = { id: 2, status: 'pending' };
    nock(base)
      .post('/api/v4/projects/123/pipelines', payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/pipelines')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('cancels a pipeline', async () => {
    const mockData = { id: 1, status: 'canceled' };
    nock(base)
      .post('/api/v4/projects/123/pipelines/1/cancel')
      .reply(200, mockData);

    const res = await request(app).post('/projects/123/pipelines/1/cancel');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('retries a pipeline', async () => {
    const mockData = { id: 1, status: 'pending' };
    nock(base)
      .post('/api/v4/projects/123/pipelines/1/retry')
      .reply(200, mockData);

    const res = await request(app).post('/projects/123/pipelines/1/retry');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('deletes a pipeline', async () => {
    nock(base)
      .delete('/api/v4/projects/123/pipelines/1')
      .reply(204);

    const res = await request(app).delete('/projects/123/pipelines/1');
    expect(res.status).toBe(204);
  });

  it('returns pipeline jobs', async () => {
    const mockData = [{ id: 1, name: 'build' }];
    nock(base)
      .get('/api/v4/projects/123/pipelines/1/jobs')
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/pipelines/1/jobs');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('downloads pipeline artifacts', async () => {
    const artifact = 'zipcontent';
    nock(base)
      .get('/api/v4/projects/123/pipelines/1/artifacts')
      .reply(200, artifact);

    const res = await request(app).get('/projects/123/pipelines/1/artifacts');
    expect(res.status).toBe(200);
    expect(res.text).toBe(artifact);
  });
});
