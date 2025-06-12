import fs from 'fs';
import path from 'path';

describe('source entry file', () => {
  it('should include src/index.ts for CLI entrypoint', () => {
    const filePath = path.join(__dirname, '../src/index.ts');
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
