import { jest } from '@jest/globals';

jest.mock('../src/mcpServer', () => ({
  createMcpServer: () => Promise.reject(new Error('fail')),
  parseArgs: () => ({}),
}));

describe('CLI error handling', () => {
  it('exits with code 1 when createMcpServer rejects', async () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { runCli } = await import('../src/index');
    await expect(runCli()).rejects.toThrow('exit');
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
    (console.error as jest.Mock).mockRestore();
  });
});
