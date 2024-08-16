export default class SortableTable {
  constructor(headerConfig = [], props) {
    this.headers = headerConfig;
    this.data = props.data;
    this.sorted = props.sorted;

    this.arrowElement = this.createArrow();

    this.element = this.createElement(this.createTemplate());
    this.subElements = this.getSubElements(this.element);

    const selectedHeader = Array.from(this.subElements.header.children).find(
      (element) => element.dataset.id === `${this.sorted.id}`
    );

    this.headerPointerDownHandle = this.handleHeaderPointerDown.bind(this);

    this.insertArrow(selectedHeader);
    this.sort(selectedHeader.dataset.id, selectedHeader.dataset.order);
    this.initEventListeners();
  }

  initEventListeners() {
    this.subElements.header.addEventListener(
      "pointerdown",
      this.headerPointerDownHandle
    );
  }

  removeEventListeners() {
    this.subElements.header.removeEventListener(
      "pointerdown",
      this.headerPointerDownHandle
    );
  }

  handleHeaderPointerDown(event) {
    const headerElement = event.target.closest('.sortable-table__cell[data-sortable="true"]');
    if (headerElement) {
      this.handleHeaderClick(headerElement);
    }
  }

  handleHeaderClick(headerElement) {
    const currentOrder = headerElement.dataset.order;
    const newOrder = currentOrder === "asc" ? "desc" : "asc";

    const arrowElement = headerElement.querySelector('[data-element="arrow"]');

    if (!arrowElement) this.insertArrow(headerElement);

    headerElement.dataset.order = newOrder;

    this.sort(headerElement.dataset.id, newOrder);
  }

  insertArrow(headerElement) {
    if (headerElement) {
      headerElement.appendChild(this.arrowElement);
    }
  }

  createArrow() {
    const arrowTemplate = `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = arrowTemplate;
    return tempDiv.firstElementChild;
  }

  createHeader() {
    return this.headers
      .map(
        (item) =>
          `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="asc">
          <span>${item.title}</span>
        </div>`
      )
      .join("");
  }

  createTableCell(item) {
    return this.headers
      .map((header) => {
        if (header.hasOwnProperty("template")) {
          return header.template(item[header.id]);
        } else {
          return `<div class="sortable-table__cell">${item[header.id]}</div>`;
        }
      })
      .join("");
  }

  createBody() {
    return this.data
      .map(
        (item) =>
          `<a href="/products/${item.id}" class="sortable-table__row">
          ${this.createTableCell(item)}
        </a>`
      )
      .join("");
  }

  createTemplate() {
    return ` 
        <div data-element="productsContainer" class="products-list__container">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.createHeader()}
          </div>
          <div data-element="body" class="sortable-table__body">
            ${this.createBody()}
          </div>
        </div>
      `;
  }

  createElement(template) {
    const element = document.createElement("div");
    element.innerHTML = template;
    return element.firstElementChild;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll("[data-element]");
    const subElements = {};

    elements.forEach((subElement) => {
      const name = subElement.dataset.element;
      subElements[name] = subElement;
    });

    return subElements;
  }

  remove() {
    this.removeEventListeners();
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  sort(field, order) {
    const header = this.headers.find((item) => item.id === field);
    if (!header || !header.sortable) return;

    const direction = order === "asc" ? 1 : -1;
    const { sortType } = header;

    this.headers.forEach((header) => {
      if (header.id === field) {
        header.order = order;
      } else {
        delete header.order;
      }
    });

    const sortedData = [...this.data].sort((a, b) => {
      switch (sortType) {
        case "number":
          return direction * (b[field] - a[field]);
        case "string":
          return direction * a[field].localeCompare(b[field], ["ru", "en"]);
        case "custom":
          return direction * header.customSorting(a, b);
        default:
          return direction * (a[field] - b[field]);
      }
    });

    this.data = sortedData;
    this.subElements.body.innerHTML = this.createBody();

    const allColumns = this.element.querySelectorAll(
      ".sortable-table__cell[data-id]"
    );
    allColumns.forEach((column) => {
      column.dataset.order = "";
    });

    const currentColumn = this.element.querySelector(
      `.sortable-table__cell[data-id="${field}"]`
    );
    currentColumn.dataset.order = order;
  }
}
