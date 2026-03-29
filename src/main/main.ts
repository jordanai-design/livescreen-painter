import { app, BrowserWindow, ipcMain } from 'electron';
import { createOverlayWindow, createToolbarWindow } from './windows';
import { registerShortcuts, unregisterShortcuts } from './shortcuts';
import { setupFileExport } from './file-export';

let overlayWindow: BrowserWindow;
let toolbarWindow: BrowserWindow;
let isDrawMode = false;

function toggleDrawMode() {
  isDrawMode = !isDrawMode;

  if (isDrawMode) {
    overlayWindow.setIgnoreMouseEvents(false);
    overlayWindow.focus();
  } else {
    overlayWindow.setIgnoreMouseEvents(true, { forward: true });
  }

  overlayWindow.webContents.send('draw-mode-changed', isDrawMode);
  toolbarWindow.webContents.send('draw-mode-changed', isDrawMode);
}

app.whenReady().then(() => {
  overlayWindow = createOverlayWindow();
  toolbarWindow = createToolbarWindow();

  // IPC: draw mode toggle from toolbar
  ipcMain.on('set-draw-mode', (_event, enabled: boolean) => {
    isDrawMode = enabled;

    if (isDrawMode) {
      overlayWindow.setIgnoreMouseEvents(false);
      overlayWindow.focus();
    } else {
      overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    }

    overlayWindow.webContents.send('draw-mode-changed', isDrawMode);
    toolbarWindow.webContents.send('draw-mode-changed', isDrawMode);
  });

  // IPC: relay tool/color/size changes from toolbar to overlay
  ipcMain.on('set-tool', (_event, tool: string) => {
    overlayWindow.webContents.send('tool-changed', tool);
  });

  ipcMain.on('set-color', (_event, color: string) => {
    overlayWindow.webContents.send('color-changed', color);
  });

  ipcMain.on('set-stroke-width', (_event, width: number) => {
    overlayWindow.webContents.send('stroke-width-changed', width);
  });

  // IPC: relay actions from toolbar to overlay
  ipcMain.on('undo', () => {
    overlayWindow.webContents.send('do-undo');
  });

  ipcMain.on('redo', () => {
    overlayWindow.webContents.send('do-redo');
  });

  ipcMain.on('clear-all', () => {
    overlayWindow.webContents.send('do-clear');
  });

  ipcMain.on('save-image', () => {
    overlayWindow.webContents.send('do-save');
  });

  ipcMain.on('quit-app', () => {
    app.quit();
  });

  // File export
  setupFileExport(overlayWindow, toolbarWindow);

  // Global shortcuts
  registerShortcuts(overlayWindow, toolbarWindow, toggleDrawMode);

  // Refocus overlay after toolbar interaction when in draw mode
  toolbarWindow.on('blur', () => {
    if (isDrawMode) {
      setTimeout(() => {
        if (isDrawMode && !overlayWindow.isDestroyed()) {
          overlayWindow.focus();
        }
      }, 100);
    }
  });
});

app.on('will-quit', () => {
  unregisterShortcuts();
});

app.on('window-all-closed', () => {
  app.quit();
});
