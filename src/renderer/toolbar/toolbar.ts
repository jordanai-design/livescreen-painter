let isDrawMode = false;
let currentTool = 'pen';

// Mode toggle
const modeToggle = document.getElementById('mode-toggle')!;
modeToggle.addEventListener('click', () => {
  isDrawMode = !isDrawMode;
  window.api.setDrawMode(isDrawMode);
  updateModeButton();
});

function updateModeButton() {
  if (isDrawMode) {
    modeToggle.className = 'draw-mode';
    modeToggle.textContent = 'NORMAL';
  } else {
    modeToggle.className = 'normal-mode';
    modeToggle.textContent = 'DRAW';
  }
}

// Listen for mode changes from main (e.g., keyboard shortcut)
window.api.onDrawModeChanged((enabled: boolean) => {
  isDrawMode = enabled;
  updateModeButton();
});

// Tool buttons
const toolButtons = document.querySelectorAll('.tool-btn');
toolButtons.forEach((btn: Element) => {
  btn.addEventListener('click', () => {
    const toolId = btn.id.replace('tool-', '');
    currentTool = toolId;
    window.api.setTool(toolId);

    // Auto-enable draw mode when selecting a tool
    if (!isDrawMode) {
      isDrawMode = true;
      window.api.setDrawMode(true);
      updateModeButton();
    }

    // Update active state
    toolButtons.forEach((b: Element) => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Color buttons
const colorButtons = document.querySelectorAll('.color-btn');
colorButtons.forEach((btn: Element) => {
  btn.addEventListener('click', () => {
    const color = (btn as HTMLElement).dataset.color!;
    window.api.setColor(color);
    colorButtons.forEach((b: Element) => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// Custom color picker
const customColor = document.getElementById('custom-color') as HTMLInputElement;
customColor.addEventListener('input', () => {
  window.api.setColor(customColor.value);
  colorButtons.forEach((b: Element) => b.classList.remove('selected'));
});

// Stroke size slider
const sizeSlider = document.getElementById('stroke-size') as HTMLInputElement;
sizeSlider.addEventListener('input', () => {
  window.api.setStrokeWidth(parseInt(sizeSlider.value, 10));
});

// Action buttons
document.getElementById('btn-undo')!.addEventListener('click', () => {
  window.api.undo();
});

document.getElementById('btn-redo')!.addEventListener('click', () => {
  window.api.redo();
});

document.getElementById('btn-save')!.addEventListener('click', () => {
  window.api.saveImage();
});

document.getElementById('btn-clear')!.addEventListener('click', () => {
  window.api.clearAll();
});

document.getElementById('btn-quit')!.addEventListener('click', () => {
  window.api.quit();
});
