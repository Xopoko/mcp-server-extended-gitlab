import fs from 'fs';
import path from 'path';

describe('package.json dependencies', () => {
  const pkgPath = path.join(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  it('should include zod as a dependency', () => {
    expect(pkg.dependencies && pkg.dependencies.zod).toBeDefined();
  });

  it('should include @modelcontextprotocol/sdk as a dependency', () => {
    expect(pkg.dependencies && pkg.dependencies['@modelcontextprotocol/sdk']).toBeDefined();
  });
});
