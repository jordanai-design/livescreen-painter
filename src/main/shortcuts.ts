import { globalShortcut, BrowserWindow } from 'electron';

export function registerShortcuts(
  overlayWindow: BrowserWindow,
  toolbarWindow: BrowserWindow,
  toggleDrawMode: () => void
) {
  globalShortcut.register('CommandOrControl+Shift+D', toggleDrawMode);

  globalShortcut.register('Escape', () => {
    overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    overlayWindow.webContents.send('draw-mode-changed', false);
    toolbarWindow.webContents.send('draw-mode-changed', false);
  });
}

export function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}
