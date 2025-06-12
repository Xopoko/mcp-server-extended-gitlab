import express, { NextFunction } from 'express';
import { GitLabService } from './services/GitLabService';

export function createApp() {
  const app = express();
  app.use(express.json());

  // Health-check
  app.get('/health', (_req: any, res: any) => {
    res.status(200).json({ status: 'ok' });
  });

  // List merge requests
  app.get('/projects/:id/merge_requests', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listMergeRequests(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  // Get a single merge request
  app.get('/projects/:id/merge_requests/:iid', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.getMergeRequest(req.params.id, req.params.iid));
    } catch (err) {
      next(err);
    }
  });

  // List branches of a project
  app.get('/projects/:id/branches', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listBranches(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  // List commits of a project
  app.get('/projects/:id/commits', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listCommits(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  // List pipelines of a project
  app.get('/projects/:id/pipelines', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listPipelines(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  // Get a single pipeline
  app.get('/projects/:id/pipelines/:pipelineId', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.getPipeline(req.params.id, req.params.pipelineId));
    } catch (err) {
      next(err);
    }
  });

  // List issues of a project
  app.get('/projects/:id/issues', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listIssues(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  // Create an issue
  app.post('/projects/:id/issues', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const issue = await svc.createIssue(req.params.id, req.body);
      res.status(201).json(issue);
    } catch (err) {
      next(err);
    }
  });

  // List discussions of a merge request
  app.get('/projects/:id/merge_requests/:iid/discussions', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listDiscussions(req.params.id, req.params.iid));
    } catch (err) {
      next(err);
    }
  });

  // Raw file content – RegExp route avoids path-to-regexp parsing issues
  app.get(/^\/projects\/(\d+)\/files\/(.+)$/, async (req, res, next: NextFunction) => {
    try {
      const params = req.params as unknown as { 0: string; 1: string };
      const projectId = params[0];
      const filePath = params[1];
      const ref = typeof req.query.ref === 'string' ? req.query.ref : 'main';
      const svc = new GitLabService();
      const content = await svc.getFile(projectId, filePath, ref);
      res.type('text/plain').send(content);
    } catch (err) {
      next(err);
    }
  });

  // Get project metadata
  app.get('/projects/:id', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.getProject(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  return app;
}
