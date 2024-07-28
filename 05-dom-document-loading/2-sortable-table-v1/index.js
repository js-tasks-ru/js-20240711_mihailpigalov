export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headers = headerConfig;
    this.data = data;

    this.element = this.createElement(this.createTemplate());
    this.subElements = this.getSubElements(this.element);
  }

  createHeader() {
    return this.headers.map(item => (
      `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
        <span>${item.title}</span>
      </div>`
    )).join("");
  }

  createTableCell(item) {
    return this.headers.map(header => {
      if (header.hasOwnProperty("template")) {
        return header.template(item[header.id]);
      } else {
        return `<div class="sortable-table__cell">${item[header.id]}</div>`;
      }
    }).join("");
  }

  createBody() {
    return this.data.map(item => (
      `<a href="/products/${item.id}" class="sortable-table__row">
        ${this.createTableCell(item)}
      </a>`
    )).join("");
  }

  createTemplate() {
    return (` 
      <div data-element="productsContainer" class="products-list__container">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.createHeader()}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.createBody()}
        </div>
      </div>
    `);
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    const subElements = {};

    elements.forEach(subElement => {
      const name = subElement.dataset.element;
      subElements[name] = subElement;
    });

    return subElements;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  sort(field, order) {
    const header = this.headers.find(item => item.id === field);
    if (!header || !header.sortable) return;

    const direction = order === 'asc' ? 1 : -1;
    const { sortType } = header;

    this.headers.forEach(header => {
      if (header.id === field) {
        header.order = order;
      } else {
        delete header.order;
      }
    });

    const sortedData = [...this.data].sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], ['ru', 'en']);
        case 'custom':
          return direction * header.customSorting(a, b);
        default:
          return direction * (a[field] - b[field]);
      }
    });

    this.data = sortedData;
    this.subElements.body.innerHTML = this.createBody();

    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);
    currentColumn.dataset.order = order;
  }
}
