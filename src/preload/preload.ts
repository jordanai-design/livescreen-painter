import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  // Toolbar -> Main
  setDrawMode: (enabled: boolean) => ipcRenderer.send('set-draw-mode', enabled),
  setTool: (tool: string) => ipcRenderer.send('set-tool', tool),
  setColor: (color: string) => ipcRenderer.send('set-color', color),
  setStrokeWidth: (width: number) => ipcRenderer.send('set-stroke-width', width),
  undo: () => ipcRenderer.send('undo'),
  redo: () => ipcRenderer.send('redo'),
  clearAll: () => ipcRenderer.send('clear-all'),
  saveImage: () => ipcRenderer.send('save-image'),
  quit: () => ipcRenderer.send('quit-app'),
  sendCanvasData: (dataUrl: string) => ipcRenderer.send('canvas-data', dataUrl),

  // Main -> Renderer listeners
  onDrawModeChanged: (cb: (enabled: boolean) => void) => {
    ipcRenderer.on('draw-mode-changed', (_event, enabled) => cb(enabled));
  },
  onToolChanged: (cb: (tool: string) => void) => {
    ipcRenderer.on('tool-changed', (_event, tool) => cb(tool));
  },
  onColorChanged: (cb: (color: string) => void) => {
    ipcRenderer.on('color-changed', (_event, color) => cb(color));
  },
  onStrokeWidthChanged: (cb: (width: number) => void) => {
    ipcRenderer.on('stroke-width-changed', (_event, width) => cb(width));
  },
  onUndo: (cb: () => void) => {
    ipcRenderer.on('do-undo', () => cb());
  },
  onRedo: (cb: () => void) => {
    ipcRenderer.on('do-redo', () => cb());
  },
  onClear: (cb: () => void) => {
    ipcRenderer.on('do-clear', () => cb());
  },
  onSave: (cb: () => void) => {
    ipcRenderer.on('do-save', () => cb());
  },
  onSaveWithScreenshot: (cb: (screenshotDataUrl: string) => void) => {
    ipcRenderer.on('do-save-with-screenshot', (_event, dataUrl) => cb(dataUrl));
  },
});
