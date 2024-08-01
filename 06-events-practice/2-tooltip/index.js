class Tooltip {
  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    this.element = null;
    Tooltip.instance = this;
  }

  initialize() {
    document.body.addEventListener('pointerover', (event) => this.showTooltip(event));
    document.body.addEventListener('pointerout', (event) => this.hideTooltip(event));
  }

  showTooltip(event) {
    const target = event.target;
    const tooltipText = target.dataset.tooltip;

    if (tooltipText) {
      this.render(tooltipText);
      document.body.addEventListener('pointermove', (event) => this.moveTooltip(event));
      this.moveTooltip(event);
    }
  }

  hideTooltip(event) {
    const target = event.target;
    const tooltipText = target.dataset.tooltip;

    if (tooltipText) {
      this.removeTooltip();
      document.body.removeEventListener('pointermove', (event) => this.moveTooltip(event));
    }
  }

  moveTooltip(event) {
    const shift = 10;
    const x = event.clientX + shift;
    const y = event.clientY + shift;

    if (this.element) {
      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
    }
  }

  render(text) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.textContent = text;
    document.body.append(this.element);
  }

  removeTooltip() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  destroy() {
    this.removeTooltip();
  }

}

export default Tooltip;