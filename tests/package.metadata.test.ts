import fs from 'fs';
import path from 'path';

describe('package.json metadata', () => {
  const pkgPath = path.join(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  it('should have MIT license', () => {
    expect(pkg.license).toBe('MIT');
  });

  it('should describe GitLab MCP server', () => {
    expect(pkg.description).toMatch(/GitLab.*Model-Context-Protocol/);
  });
});

describe('README version badge', () => {
  const readmePath = path.join(__dirname, '../README.md');
  const readme = fs.readFileSync(readmePath, 'utf8');
  it('should show version 1.0.2', () => {
    expect(readme).toContain('project-v1.0.2');
  });
});
