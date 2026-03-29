import { BrowserWindow, screen } from 'electron';
import * as path from 'path';
import { TOOLBAR_WIDTH, TOOLBAR_HEIGHT } from '../shared/constants';

export function createOverlayWindow(): BrowserWindow {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.bounds;

  const overlay = new BrowserWindow({
    x: 0,
    y: 0,
    width,
    height,
    transparent: true,
    frame: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  overlay.setAlwaysOnTop(true, 'screen-saver');
  overlay.setIgnoreMouseEvents(true, { forward: true });
  overlay.setVisibleOnAllWorkspaces(true);
  overlay.loadFile(path.join(__dirname, '..', '..', 'src', 'renderer', 'overlay', 'overlay.html'));

  return overlay;
}

export function createToolbarWindow(): BrowserWindow {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.bounds;
  const x = Math.round((width - TOOLBAR_WIDTH) / 2);

  const toolbar = new BrowserWindow({
    x,
    y: 20,
    width: TOOLBAR_WIDTH,
    height: TOOLBAR_HEIGHT,
    transparent: false,
    frame: false,
    hasShadow: true,
    alwaysOnTop: true,
    resizable: false,
    movable: true,
    skipTaskbar: true,
    fullscreenable: false,
    webPreferences: {
      preload: path.join(__dirname, '..', 'preload', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  toolbar.setAlwaysOnTop(true, 'screen-saver', 1);
  toolbar.setVisibleOnAllWorkspaces(true);
  toolbar.loadFile(path.join(__dirname, '..', '..', 'src', 'renderer', 'toolbar', 'toolbar.html'));

  return toolbar;
}
