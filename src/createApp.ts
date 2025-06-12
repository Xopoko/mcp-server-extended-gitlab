import express, { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { GitLabService } from './services/GitLabService';

export function createApp() {
  const app = express();
  app.use(express.json());

  // Health-check
  app.get('/health', (_req: any, res: any) => {
    res.status(200).json({ status: 'ok' });
  });

  app.post('/groups', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const group = await svc.createGroup(req.body);
      res.status(201).json(group);
    } catch (err) {
      next(err);
    }
  });

  app.get('/groups/:id', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.getGroup(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.delete('/groups/:id', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const result = await svc.deleteGroup(req.params.id);
      if (result) {
        res.status(202).json(result);
      } else {
        res.status(202).end();
      }
    } catch (err) {
      next(err);
    }
  });

  app.get('/groups/:id/members', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listGroupMembers(req.params.id));
    } catch (err) {
      next(err);
    }
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

  app.post('/projects/:id/merge_requests', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const mr = await svc.createMergeRequest(req.params.id, req.body);
      res.status(201).json(mr);
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

  app.put('/projects/:id/merge_requests/:iid/merge', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.acceptMergeRequest(req.params.id, req.params.iid));
    } catch (err) {
      next(err);
    }
  });

  app.put('/projects/:id/merge_requests/:iid/close', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.closeMergeRequest(req.params.id, req.params.iid));
    } catch (err) {
      next(err);
    }
  });

  app.put('/projects/:id/merge_requests/:iid/reopen', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.reopenMergeRequest(req.params.id, req.params.iid));
    } catch (err) {
      next(err);
    }
  });

  app.put('/projects/:id/merge_requests/:iid/rebase', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.rebaseMergeRequest(req.params.id, req.params.iid));
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/merge_requests/:iid/changes', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.getMergeRequestChanges(req.params.id, req.params.iid));
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

  app.post('/projects/:id/branches', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const branch = await svc.createBranch(req.params.id, req.body);
      res.status(201).json(branch);
    } catch (err) {
      next(err);
    }
  });

  app.get(
    '/projects/:id/branches/:branch',
    async (req, res, next: NextFunction) => {
      try {
        const svc = new GitLabService();
        res.json(await svc.getBranch(req.params.id, req.params.branch));
      } catch (err) {
        next(err);
      }
    },
  );

  app.delete(
    '/projects/:id/branches/:branch',
    async (req, res, next: NextFunction) => {
      try {
        const svc = new GitLabService();
        await svc.deleteBranch(req.params.id, req.params.branch);
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },
  );

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

  app.get('/projects/:id/issues/:iid', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.getIssue(req.params.id, req.params.iid));
    } catch (err) {
      next(err);
    }
  });

  app.put('/projects/:id/issues/:iid', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(
        await svc.updateIssue(req.params.id, req.params.iid, req.body),
      );
    } catch (err) {
      next(err);
    }
  });

  app.put('/projects/:id/issues/:iid/close', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.closeIssue(req.params.id, req.params.iid));
    } catch (err) {
      next(err);
    }
  });

  app.put('/projects/:id/issues/:iid/reopen', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.reopenIssue(req.params.id, req.params.iid));
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

  app.get('/projects/:id/merge_requests/:iid/discussions/:discussionId', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(
        await svc.getMergeRequestDiscussion(
          req.params.id,
          req.params.iid,
          req.params.discussionId,
        ),
      );
    } catch (err) {
      next(err);
    }
  });

  app.post('/projects/:id/merge_requests/:iid/discussions/:discussionId/notes', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const note = await svc.addNoteToDiscussion(
        req.params.id,
        req.params.iid,
        req.params.discussionId,
        req.body,
      );
      res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  });

  app.post('/projects/:id/merge_requests/:iid/discussions', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const discussion = await svc.createMergeRequestDiscussion(
        req.params.id,
        req.params.iid,
        req.body,
      );
      res.status(201).json(discussion);
    } catch (err) {
      next(err);
    }
  });

  app.delete('/projects/:id/merge_requests/:iid/discussions/:discussionId', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      await svc.deleteMergeRequestDiscussion(
        req.params.id,
        req.params.iid,
        req.params.discussionId,
      );
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  app.put('/projects/:id/merge_requests/:iid/discussions/:discussionId', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const discussion = await svc.updateMergeRequestDiscussion(
        req.params.id,
        req.params.iid,
        req.params.discussionId,
        req.body,
      );
      res.json(discussion);
    } catch (err) {
      next(err);
    }
  });

  app.put('/projects/:id/merge_requests/:iid/discussions/:discussionId/resolve', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(
        await svc.resolveDiscussion(
          req.params.id,
          req.params.iid,
          req.params.discussionId,
        ),
      );
    } catch (err) {
      next(err);
    }
  });

  app.put(
    '/projects/:id/merge_requests/:iid/discussions/:discussionId/unresolve',
    async (req, res, next: NextFunction) => {
      try {
        const svc = new GitLabService();
        res.json(
          await svc.unresolveDiscussion(
            req.params.id,
            req.params.iid,
            req.params.discussionId,
          ),
        );
      } catch (err) {
        next(err);
      }
    },
  );

  app.get('/projects/:id/merge_requests/:iid/notes/:noteId', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(
        await svc.getMergeRequestNote(
          req.params.id,
          req.params.iid,
          req.params.noteId,
        ),
      );
    } catch (err) {
      next(err);
    }
  });

  app.post('/projects/:id/merge_requests/:iid/notes', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const note = await svc.createMergeRequestNote(
        req.params.id,
        req.params.iid,
        req.body,
      );
      res.status(201).json(note);
    } catch (err) {
      next(err);
    }
  });

  app.put('/projects/:id/merge_requests/:iid/notes/:noteId', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(
        await svc.updateMergeRequestNote(
          req.params.id,
          req.params.iid,
          req.params.noteId,
          req.body,
        ),
      );
    } catch (err) {
      next(err);
    }
  });

  app.delete('/projects/:id/merge_requests/:iid/notes/:noteId', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      await svc.deleteMergeRequestNote(
        req.params.id,
        req.params.iid,
        req.params.noteId,
      );
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  app.put('/projects/:id/merge_requests/:iid', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.setMergeRequestLabels(req.params.id, req.params.iid, req.body));
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/files', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listFiles(req.params.id, req.query));
    } catch (err) {
      next(err);
    }
  });

  app.post(/^\/projects\/(\d+)\/files\/(.+)$/, async (req, res, next: NextFunction) => {
    try {
      const params = req.params as unknown as { 0: string; 1: string };
      const svc = new GitLabService();
      const file = await svc.createFile(params[0], params[1], req.body);
      res.status(201).json(file);
    } catch (err) {
      next(err);
    }
  });

  app.put(/^\/projects\/(\d+)\/files\/(.+)$/, async (req, res, next: NextFunction) => {
    try {
      const params = req.params as unknown as { 0: string; 1: string };
      const svc = new GitLabService();
      res.json(await svc.updateFile(params[0], params[1], req.body));
    } catch (err) {
      next(err);
    }
  });

  app.delete(/^\/projects\/(\d+)\/files\/(.+)$/, async (req, res, next: NextFunction) => {
    try {
      const params = req.params as unknown as { 0: string; 1: string };
      const svc = new GitLabService();
      await svc.deleteFile(params[0], params[1], req.query);
      res.status(204).end();
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

  // --- SSE Transport -------------------------------------------------
  type Client = { res: Response; keepAlive: NodeJS.Timeout };
  const clients = new Map<string, Client>();

  app.get('/sse', (req: Request, res: Response) => {
    const id = randomUUID();
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.flushHeaders();

    // inform client of the message endpoint
    res.write(`event: endpoint\n`);
    res.write(`data: /messages/${id}\n\n`);

    const keepAlive = setInterval(() => {
      res.write(`: keep-alive ${Date.now()}\n\n`);
    }, 15000);
    keepAlive.unref();

    clients.set(id, { res, keepAlive });

    req.on('close', () => {
      clearInterval(keepAlive);
      clients.delete(id);
    });
  });

  app.post('/messages/:id', (req: Request, res: Response) => {
    const client = clients.get(req.params.id);
    if (!client) {
      res.status(404).json({ error: 'session not found' });
      return;
    }
    client.res.write(`event: message\n`);
    client.res.write(`data: ${JSON.stringify(req.body)}\n\n`);
    res.status(204).end();
  });

  return app;
}
