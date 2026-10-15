const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const generator = require('./generator/index');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('generate-project', async (event, xml, options) => {
  try {
    const out = await generator.generate(xml, options);
    return { ok: true, out };
  } catch (e) {
    return { ok: false, error: e.message || String(e) };
  }
});

ipcMain.handle('build-mod', async (event, projectPath) => {
  return new Promise((resolve) => {
    // If gradlew exists in projectPath, run it; otherwise instruct user
    const platform = process.platform;
    const gradleWrapper = platform === 'win32' ? 'gradlew.bat' : './gradlew';
    const cmd = path.join(projectPath, gradleWrapper);

    const build = spawn(cmd, ['build'], { cwd: projectPath, shell: true });
    let stdout = '';
    let stderr = '';
    build.stdout.on('data', (d) => { stdout += d.toString(); event.sender.send('build-log', d.toString()); });
    build.stderr.on('data', (d) => { stderr += d.toString(); event.sender.send('build-log', d.toString()); });
    build.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
});
