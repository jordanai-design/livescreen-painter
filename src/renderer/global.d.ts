interface Window {
  api: {
    setDrawMode: (enabled: boolean) => void;
    setTool: (tool: string) => void;
    setColor: (color: string) => void;
    setStrokeWidth: (width: number) => void;
    undo: () => void;
    redo: () => void;
    clearAll: () => void;
    saveImage: () => void;
    quit: () => void;
    sendCanvasData: (dataUrl: string) => void;
    onDrawModeChanged: (cb: (enabled: boolean) => void) => void;
    onToolChanged: (cb: (tool: string) => void) => void;
    onColorChanged: (cb: (color: string) => void) => void;
    onStrokeWidthChanged: (cb: (width: number) => void) => void;
    onUndo: (cb: () => void) => void;
    onRedo: (cb: () => void) => void;
    onClear: (cb: () => void) => void;
    onSave: (cb: () => void) => void;
    onSaveWithScreenshot: (cb: (screenshotDataUrl: string) => void) => void;
  };
}
