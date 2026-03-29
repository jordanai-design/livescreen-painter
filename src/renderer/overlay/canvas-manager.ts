declare const fabric: any;

type ToolType = 'pen' | 'rect' | 'circle' | 'line' | 'arrow' | 'text' | 'eraser';

class CanvasManager {
  private canvas: any;
  private currentTool: ToolType = 'pen';
  private currentColor: string = '#ff0000';
  private currentStrokeWidth: number = 3;
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private isDrawing = false;
  private shapeOrigin: { x: number; y: number } = { x: 0, y: 0 };
  private activeShape: any = null;

  constructor(canvasId: string) {
    const el = document.getElementById(canvasId) as HTMLCanvasElement;
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.canvas = new fabric.Canvas(el, {
      isDrawingMode: false,
      selection: false,
      backgroundColor: 'rgba(0,0,0,0)',
      width: w,
      height: h,
    });

    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.color = this.currentColor;
    this.canvas.freeDrawingBrush.width = this.currentStrokeWidth;

    this.saveState();

    this.canvas.on('mouse:down', (opt: any) => this.onMouseDown(opt));
    this.canvas.on('mouse:move', (opt: any) => this.onMouseMove(opt));
    this.canvas.on('mouse:up', () => this.onMouseUp());
    this.canvas.on('path:created', () => this.saveState());
  }

  setTool(tool: ToolType) {
    this.currentTool = tool;

    if (tool === 'pen') {
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.canvas.freeDrawingBrush.color = this.currentColor;
      this.canvas.freeDrawingBrush.width = this.currentStrokeWidth;
    } else if (tool === 'eraser') {
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
      this.canvas.freeDrawingBrush.color = 'rgba(0,0,0,0)';
      this.canvas.freeDrawingBrush.width = 20;
      (this.canvas.freeDrawingBrush as any).globalCompositeOperation = 'destination-out';
    } else {
      this.canvas.isDrawingMode = false;
    }
  }

  setColor(color: string) {
    this.currentColor = color;
    if (this.canvas.freeDrawingBrush && this.currentTool === 'pen') {
      this.canvas.freeDrawingBrush.color = color;
    }
  }

  setStrokeWidth(width: number) {
    this.currentStrokeWidth = width;
    if (this.canvas.freeDrawingBrush && this.currentTool === 'pen') {
      this.canvas.freeDrawingBrush.width = width;
    }
  }

  private onMouseDown(opt: any) {
    if (this.currentTool === 'pen' || this.currentTool === 'eraser') return;

    const pointer = this.canvas.getScenePoint(opt.e);
    this.isDrawing = true;
    this.shapeOrigin = { x: pointer.x, y: pointer.y };

    if (this.currentTool === 'rect') {
      this.activeShape = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: 'transparent',
        stroke: this.currentColor,
        strokeWidth: this.currentStrokeWidth,
        selectable: false,
      });
      this.canvas.add(this.activeShape);
    } else if (this.currentTool === 'circle') {
      this.activeShape = new fabric.Ellipse({
        left: pointer.x,
        top: pointer.y,
        rx: 0,
        ry: 0,
        fill: 'transparent',
        stroke: this.currentColor,
        strokeWidth: this.currentStrokeWidth,
        selectable: false,
      });
      this.canvas.add(this.activeShape);
    } else if (this.currentTool === 'line' || this.currentTool === 'arrow') {
      this.activeShape = new fabric.Line(
        [pointer.x, pointer.y, pointer.x, pointer.y],
        {
          stroke: this.currentColor,
          strokeWidth: this.currentStrokeWidth,
          selectable: false,
        }
      );
      this.canvas.add(this.activeShape);
    } else if (this.currentTool === 'text') {
      const text = new fabric.IText('Type here', {
        left: pointer.x,
        top: pointer.y,
        fontSize: Math.max(16, this.currentStrokeWidth * 6),
        fill: this.currentColor,
        fontFamily: 'Arial',
        selectable: true,
        editable: true,
      });
      this.canvas.add(text);
      this.canvas.setActiveObject(text);
      text.enterEditing();
      this.saveState();
      this.isDrawing = false;
    }
  }

  private onMouseMove(opt: any) {
    if (!this.isDrawing || !this.activeShape) return;

    const pointer = this.canvas.getScenePoint(opt.e);

    if (this.currentTool === 'rect') {
      const left = Math.min(this.shapeOrigin.x, pointer.x);
      const top = Math.min(this.shapeOrigin.y, pointer.y);
      const width = Math.abs(pointer.x - this.shapeOrigin.x);
      const height = Math.abs(pointer.y - this.shapeOrigin.y);
      this.activeShape.set({ left, top, width, height });
    } else if (this.currentTool === 'circle') {
      const rx = Math.abs(pointer.x - this.shapeOrigin.x) / 2;
      const ry = Math.abs(pointer.y - this.shapeOrigin.y) / 2;
      const left = Math.min(this.shapeOrigin.x, pointer.x);
      const top = Math.min(this.shapeOrigin.y, pointer.y);
      this.activeShape.set({ left, top, rx, ry });
    } else if (this.currentTool === 'line' || this.currentTool === 'arrow') {
      this.activeShape.set({ x2: pointer.x, y2: pointer.y });
    }

    this.canvas.renderAll();
  }

  private onMouseUp() {
    if (!this.isDrawing) return;
    this.isDrawing = false;

    if (this.currentTool === 'arrow' && this.activeShape) {
      this.addArrowHead();
    }

    this.activeShape = null;
    this.saveState();
  }

  private addArrowHead() {
    const line = this.activeShape;
    const x1 = line.x1, y1 = line.y1, x2 = line.x2, y2 = line.y2;
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLen = 15;

    const triangle = new fabric.Triangle({
      left: x2,
      top: y2,
      width: headLen,
      height: headLen,
      fill: this.currentColor,
      selectable: false,
      angle: (angle * 180) / Math.PI + 90,
      originX: 'center',
      originY: 'center',
    });

    this.canvas.add(triangle);
  }

  private saveState() {
    const json = JSON.stringify(this.canvas.toJSON());
    this.undoStack.push(json);
    this.redoStack = [];
    if (this.undoStack.length > 50) {
      this.undoStack.shift();
    }
  }

  undo() {
    if (this.undoStack.length <= 1) return;
    const current = this.undoStack.pop()!;
    this.redoStack.push(current);
    const previous = this.undoStack[this.undoStack.length - 1];
    this.canvas.loadFromJSON(previous, () => {
      this.canvas.renderAll();
    });
  }

  redo() {
    if (this.redoStack.length === 0) return;
    const next = this.redoStack.pop()!;
    this.undoStack.push(next);
    this.canvas.loadFromJSON(next, () => {
      this.canvas.renderAll();
    });
  }

  clearAll() {
    this.canvas.clear();
    this.canvas.backgroundColor = 'rgba(0,0,0,0)';
    this.canvas.renderAll();
    this.saveState();
  }

  toDataURL(): string {
    return this.canvas.toDataURL({
      format: 'png',
      multiplier: 1,
    });
  }
}

// Make globally accessible
(window as any).CanvasManager = CanvasManager;
