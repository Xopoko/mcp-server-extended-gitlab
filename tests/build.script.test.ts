import fs from 'fs';
import path from 'path';

describe('package.json build script', () => {
  it('should run "tsc && mcp-build"', () => {
    const pkgPath = path.join(__dirname, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    expect(pkg.scripts.build).toBe('tsc && mcp-build');
  });
});
