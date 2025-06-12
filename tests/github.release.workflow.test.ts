import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

describe('GitHub release workflow', () => {
  it('should publish to npm on release', () => {
    const workflowPath = path.join(__dirname, '../.github/workflows/release.yml');
    expect(fs.existsSync(workflowPath)).toBe(true);
    const content = fs.readFileSync(workflowPath, 'utf8');
    const workflow = yaml.load(content) as any;
    expect(workflow).toHaveProperty('jobs.release');
    const steps = workflow.jobs.release.steps || [];
    const stepNames = steps.map((s: any) => s.name).filter(Boolean);
    expect(stepNames).toContain('Run lint if script exists');
    expect(stepNames).toContain('Publish to npm');
  });
});
