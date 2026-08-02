/**
 * Kills whatever process is listening on the given port.
 * Used as a predev hook so `npm run dev` never fails with EADDRINUSE.
 * Works on Windows and Unix without any extra packages.
 */
const { execSync } = require('child_process');
const port = process.argv[2] || '5173';

try {
  if (process.platform === 'win32') {
    execSync(
      `for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port} ^| findstr LISTENING') do taskkill /f /pid %a`,
      { stdio: 'ignore', shell: true },
    );
  } else {
    execSync(`lsof -t -i:${port} | xargs kill -9`, { stdio: 'ignore' });
  }
} catch {
  // Port was already free — nothing to do
}
