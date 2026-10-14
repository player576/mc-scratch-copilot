const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 980,
    minWidth: 1200,
    minHeight: 800,
    backgroundColor: '#191c24',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.setMenuBarVisibility(false);
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('build-mod', (event) => {
  const modRoot = path.resolve(__dirname, '../forge-mdk');
  const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
  const child = spawn(gradlew, ['build'], {
    cwd: modRoot,
    shell: true,
    env: { ...process.env, JAVA_HOME: process.env.JAVA_HOME || '' }
  });

  let log = '';
  child.stdout.on('data', (data) => {
    log += data.toString();
    event.sender.send('build-log', data.toString());
  });

  child.stderr.on('data', (data) => {
    log += data.toString();
    event.sender.send('build-log', data.toString());
  });

  child.on('close', (code) => {
    event.sender.send('build-finished', { code, log });
  });
});
