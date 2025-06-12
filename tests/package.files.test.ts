import fs from 'fs';
import path from 'path';

describe('package.json files', () => {
  it('should include dist directory', () => {
    const pkgPath = path.join(__dirname, '../package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    expect(pkg.files).toContain('dist');
  });
});
