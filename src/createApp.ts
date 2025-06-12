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
      const [projectId, filePath] = req.params as unknown as [string, string];
      const ref = typeof req.query.ref === 'string' ? req.query.ref : 'main';
      const svc = new GitLabService();
      const content = await svc.getFile(projectId, filePath, ref);
      res.type('text/plain').send(content);
    } catch (err) {
      next(err);
    }
  });

  return app;
}
