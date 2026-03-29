// CanvasManager is loaded globally from canvas-manager.js
const manager = new (window as any).CanvasManager('draw-canvas');

window.api.onToolChanged((tool: string) => {
  manager.setTool(tool);
});

window.api.onColorChanged((color: string) => {
  manager.setColor(color);
});

window.api.onStrokeWidthChanged((width: number) => {
  manager.setStrokeWidth(width);
});

window.api.onUndo(() => {
  manager.undo();
});

window.api.onRedo(() => {
  manager.redo();
});

window.api.onClear(() => {
  manager.clearAll();
});

window.api.onSave(() => {
  const dataUrl = manager.toDataURL();
  window.api.sendCanvasData(dataUrl);
});

// Save with screenshot: composite screen capture + drawings
window.api.onSaveWithScreenshot((screenshotDataUrl: string) => {
  const drawingDataUrl = manager.toDataURL();

  const compositeCanvas = document.createElement('canvas');
  compositeCanvas.width = window.innerWidth * window.devicePixelRatio;
  compositeCanvas.height = window.innerHeight * window.devicePixelRatio;
  const ctx = compositeCanvas.getContext('2d')!;

  const screenshotImg = new Image();
  screenshotImg.onload = () => {
    // Draw the screenshot first
    ctx.drawImage(screenshotImg, 0, 0, compositeCanvas.width, compositeCanvas.height);

    // Draw the annotations on top
    const drawingImg = new Image();
    drawingImg.onload = () => {
      ctx.drawImage(drawingImg, 0, 0, compositeCanvas.width, compositeCanvas.height);
      const compositeDataUrl = compositeCanvas.toDataURL('image/png');
      window.api.sendCanvasData(compositeDataUrl);
    };
    drawingImg.src = drawingDataUrl;
  };
  screenshotImg.src = screenshotDataUrl;
});
