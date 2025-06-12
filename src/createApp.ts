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

  app.get('/personal_access_tokens', async (_req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listPersonalAccessTokens());
    } catch (err) {
      next(err);
    }
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

  app.get('/groups/:id/epics', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listGroupEpics(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/access_tokens', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listProjectAccessTokens(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/access_requests', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listProjectAccessRequests(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.get('/groups/:id/access_tokens', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listGroupAccessTokens(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.get('/groups/:id/access_requests', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listGroupAccessRequests(req.params.id));
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

  app.get('/projects/:id/deploy_keys', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listDeployKeys(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.post('/projects/:id/deploy_tokens', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const token = await svc.createDeployToken(req.params.id, req.body);
      res.status(201).json(token);
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/deployments', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listDeployments(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/registry/repositories', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listRegistryRepositories(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/registry/protection/repository/rules', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listRegistryProtectionRules(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.post('/projects/:id/feature_flags', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const flag = await svc.createFeatureFlag(req.params.id, req.body);
      res.status(201).json(flag);
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/feature_flags', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listFeatureFlags(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.delete('/projects/:id/feature_flags/:flagId', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      await svc.deleteFeatureFlag(req.params.id, req.params.flagId);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/freeze_periods', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listFreezePeriods(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.post('/projects/:id/variables', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const variable = await svc.createProjectVariable(req.params.id, req.body);
      res.status(201).json(variable);
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/variables', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listProjectVariables(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.delete('/projects/:id/variables/:key', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      await svc.deleteProjectVariable(req.params.id, req.params.key);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/protected_branches', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listProtectedBranches(req.params.id));
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

  app.post('/projects/:id/pipelines', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const pipeline = await svc.createPipeline(req.params.id, req.body);
      res.status(201).json(pipeline);
    } catch (err) {
      next(err);
    }
  });

  app.post(
    '/projects/:id/pipelines/:pipelineId/cancel',
    async (req, res, next: NextFunction) => {
      try {
        const svc = new GitLabService();
        const result = await svc.cancelPipeline(
          req.params.id,
          req.params.pipelineId,
        );
        res.json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  app.post(
    '/projects/:id/pipelines/:pipelineId/retry',
    async (req, res, next: NextFunction) => {
      try {
        const svc = new GitLabService();
        const result = await svc.retryPipeline(
          req.params.id,
          req.params.pipelineId,
        );
        res.json(result);
      } catch (err) {
        next(err);
      }
    },
  );

  app.delete('/projects/:id/pipelines/:pipelineId', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      await svc.deletePipeline(req.params.id, req.params.pipelineId);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/pipelines/:pipelineId/jobs', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.getPipelineJobs(req.params.id, req.params.pipelineId));
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/pipelines/:pipelineId/artifacts', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const data = await svc.downloadPipelineArtifacts(req.params.id, req.params.pipelineId);
      res.send(data);
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

  app.get('/projects/:id/issues/:iid/discussions', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listIssueDiscussions(req.params.id, req.params.iid));
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/issues/:iid/discussions/:discussionId', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(
        await svc.getIssueDiscussion(
          req.params.id,
          req.params.iid,
          req.params.discussionId,
        ),
      );
    } catch (err) {
      next(err);
    }
  });

  app.post('/projects/:id/issues/:iid/discussions', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const discussion = await svc.createIssueDiscussion(
        req.params.id,
        req.params.iid,
        req.body,
      );
      res.status(201).json(discussion);
    } catch (err) {
      next(err);
    }
  });

  app.post('/projects/:id/issues/:iid/discussions/:discussionId/notes', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const note = await svc.addNoteToIssueDiscussion(
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

  app.put('/projects/:id/issues/:iid/discussions/:discussionId/notes/:noteId', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const note = await svc.updateIssueDiscussion(
        req.params.id,
        req.params.iid,
        req.params.discussionId,
        req.params.noteId,
        req.body,
      );
      res.json(note);
    } catch (err) {
      next(err);
    }
  });

  app.delete('/projects/:id/issues/:iid/discussions/:discussionId/notes/:noteId', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      await svc.deleteIssueDiscussion(
        req.params.id,
        req.params.iid,
        req.params.discussionId,
        req.params.noteId,
      );
      res.status(204).end();
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

  app.get('/projects', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listProjects(req.query));
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/search', async (req, res, next: NextFunction) => {
    try {
      const q = typeof req.query.q === 'string' ? req.query.q : '';
      const svc = new GitLabService();
      res.json(await svc.searchProjects(q));
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/releases', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listReleases(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/releases/:tag', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.getRelease(req.params.id, req.params.tag));
    } catch (err) {
      next(err);
    }
  });

  app.post('/projects/:id/releases', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const release = await svc.createRelease(req.params.id, req.body);
      res.status(201).json(release);
    } catch (err) {
      next(err);
    }
  });

  app.put('/projects/:id/releases/:tag', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.updateRelease(req.params.id, req.params.tag, req.body));
    } catch (err) {
      next(err);
    }
  });

  app.delete('/projects/:id/releases/:tag', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      await svc.deleteRelease(req.params.id, req.params.tag);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/tags', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.listTags(req.params.id));
    } catch (err) {
      next(err);
    }
  });

  app.get('/projects/:id/tags/:tag', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      res.json(await svc.getTag(req.params.id, req.params.tag));
    } catch (err) {
      next(err);
    }
  });

  app.post('/projects/:id/tags', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const tag = await svc.createTag(req.params.id, req.body);
      res.status(201).json(tag);
    } catch (err) {
      next(err);
    }
  });

  app.delete('/projects/:id/tags/:tag', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      await svc.deleteTag(req.params.id, req.params.tag);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  app.post('/api/graphql', async (req, res, next: NextFunction) => {
    try {
      const svc = new GitLabService();
      const data = await svc.graphqlQuery(req.body);
      res.json(data);
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
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // inform client of the message endpoint
    res.write(`event: endpoint\n`);
    res.write(`data: /messages/${id}\n\n`);
    if (typeof (res as any).flush === 'function') {
      (res as any).flush();
    }

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
    if (typeof (client.res as any).flush === 'function') {
      (client.res as any).flush();
    }
    res.status(204).end();
  });

  return app;
}
