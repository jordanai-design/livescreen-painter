import { dialog, BrowserWindow, ipcMain, desktopCapturer, screen } from 'electron';
import * as fs from 'fs';

export function setupFileExport(overlayWindow: BrowserWindow, toolbarWindow: BrowserWindow) {
  ipcMain.on('canvas-data', async (_event, dataUrl: string) => {
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: `annotation-${Date.now()}.png`,
      filters: [{ name: 'PNG Image', extensions: ['png'] }],
    });

    if (filePath) {
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    }
  });

  ipcMain.on('save-image', async () => {
    // Hide overlay and toolbar so they don't appear in the screenshot
    overlayWindow.hide();
    toolbarWindow.hide();

    // Wait for windows to fully hide
    await new Promise(resolve => setTimeout(resolve, 300));

    // Capture the screen
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.size;
    const scaleFactor = primaryDisplay.scaleFactor;

    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: {
        width: Math.round(width * scaleFactor),
        height: Math.round(height * scaleFactor),
      },
    });

    // Show overlay and toolbar again
    overlayWindow.show();
    toolbarWindow.show();
    overlayWindow.setAlwaysOnTop(true, 'screen-saver');
    toolbarWindow.setAlwaysOnTop(true, 'screen-saver', 1);

    if (sources.length > 0) {
      const screenshotDataUrl = sources[0].thumbnail.toDataURL();
      // Send screenshot to overlay renderer for compositing with drawings
      overlayWindow.webContents.send('do-save-with-screenshot', screenshotDataUrl);
    }
  });
}
