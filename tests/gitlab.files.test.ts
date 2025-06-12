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

  it('creates a file in the repository', async () => {
    const payload = {
      branch: 'main',
      content: 'hello',
      commit_message: 'add file',
    };
    const encodedPath = encodeURIComponent('new/file.txt');
    const mockData = { file_path: 'new/file.txt' };
    nock(base)
      .post(`/api/v4/projects/123/repository/files/${encodedPath}`, payload)
      .reply(201, mockData);

    const res = await request(app)
      .post('/projects/123/files/new/file.txt')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockData);
  });

  it('updates a repository file', async () => {
    const payload = {
      branch: 'main',
      content: 'updated',
      commit_message: 'update file',
    };
    const encodedPath = encodeURIComponent('src/index.ts');
    const mockData = { file_path: 'src/index.ts' };
    nock(base)
      .put(`/api/v4/projects/123/repository/files/${encodedPath}`, payload)
      .reply(200, mockData);

    const res = await request(app)
      .put('/projects/123/files/src/index.ts')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  it('deletes a repository file', async () => {
    const payload = {
      branch: 'main',
      commit_message: 'remove file',
    };
    const encodedPath = encodeURIComponent('old/file.txt');
    nock(base)
      .delete(`/api/v4/projects/123/repository/files/${encodedPath}`)
      .query(payload)
      .reply(204);

    const res = await request(app)
      .delete('/projects/123/files/old/file.txt')
      .query(payload);
    expect(res.status).toBe(204);
  });

  it('lists repository files', async () => {
    const mockData = [{ id: 'file1' }];
    nock(base)
      .get('/api/v4/projects/123/repository/tree')
      .query({ path: 'src', ref: 'main' })
      .reply(200, mockData);

    const res = await request(app).get('/projects/123/files?path=src&ref=main');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
