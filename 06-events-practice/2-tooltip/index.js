class Tooltip {
  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    this.element = null;
    Tooltip.instance = this;
  }

  initialize() {
    document.body.addEventListener("pointerover", (event) =>
      this.handleDocumentPointerover(event)
    );
    document.body.addEventListener("pointerout", (event) =>
      this.handleDocumentPointerout(event)
    );
  }

  handleDocumentPointerover(event) {
    const target = event.target;
    const tooltipText = target.dataset.tooltip;

    if (tooltipText) {
      this.render(tooltipText);
      document.body.addEventListener("pointermove", (event) =>
        this.handleDocumentPointerMove(event)
      );
      this.handleDocumentPointerMove(event);
    }
  }

  handleDocumentPointerout(event) {
    const target = event.target;
    const tooltipText = target.dataset.tooltip;

    if (tooltipText) {
      this.removeTooltip();
      document.body.removeEventListener("pointermove", (event) =>
        this.handleDocumentPointerMove(event)
      );
    }
  }

  removeAllListeners() {
    document.body.removeEventListener("pointermove", (event) =>
      this.handleDocumentPointerMove(event)
    );

    document.body.removeEventListener("pointerover", (event) =>
      this.handleDocumentPointerover(event)
    );

    document.body.removeEventListener("pointerout", (event) =>
      this.handleDocumentPointerout(event)
    );
    
  }

  handleDocumentPointerMove(event) {
    const shift = 10;
    const x = event.clientX + shift;
    const y = event.clientY + shift;

    if (this.element) {
      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
    }
  }

  render(text) {
    this.element = document.createElement("div");
    this.element.className = "tooltip";
    this.element.textContent = text;
    document.body.append(this.element);
  }

  removeTooltip() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.removeTooltip();
    this.removeAllListeners();
  }
}

export default Tooltip;
