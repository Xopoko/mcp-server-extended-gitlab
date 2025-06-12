import fs from 'fs';
import path from 'path';

describe('package.json bin', () => {
  it('should expose CLI command', () => {
    const pkgPath = path.join(__dirname, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    expect(pkg.bin && pkg.bin['mcp-server-extended-gitlab']).toBe('dist/index.js');
  });
});
