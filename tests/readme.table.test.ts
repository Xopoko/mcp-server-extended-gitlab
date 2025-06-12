import fs from 'fs';
import path from 'path';

describe('README GitLab route table', () => {
  it('lists GitLab routes in a markdown table', () => {
    const readmePath = path.join(__dirname, '..', 'README.md');
    const readme = fs.readFileSync(readmePath, 'utf8');
    expect(readme).toContain('| Method | Endpoint |');
    expect(readme).not.toMatch(/^\- `GET/m);
  });
});
