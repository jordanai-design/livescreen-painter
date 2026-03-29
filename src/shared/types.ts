export type ToolType = 'pen' | 'rect' | 'circle' | 'line' | 'arrow' | 'text' | 'eraser';

export interface DrawState {
  tool: ToolType;
  color: string;
  strokeWidth: number;
  isDrawMode: boolean;
}

export type IpcChannel =
  | 'set-draw-mode'
  | 'set-tool'
  | 'set-color'
  | 'set-stroke-width'
  | 'undo'
  | 'redo'
  | 'clear-all'
  | 'save-image'
  | 'tool-changed'
  | 'color-changed'
  | 'stroke-width-changed'
  | 'draw-mode-changed'
  | 'do-undo'
  | 'do-redo'
  | 'do-clear'
  | 'do-save'
  | 'canvas-data';
