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

    this.insertArrow(selectedHeader);
    this.initEventListeners();
  }

  initEventListeners() {
    const headerElements = this.subElements.header.children;

    Array.from(headerElements).forEach((headerElement) => {
      headerElement.addEventListener("pointerdown", () =>
        this.handleHeaderClick(headerElement)
      );
    });
  }

  handleHeaderClick(headerElement) {
    const currentOrder = headerElement.dataset.order;
    const newOrder = currentOrder === "asc" ? "desc" : "asc";

    // console.log(currentOrder);
    // console.log(newOrder);

    // Проверяем, есть ли уже стрелочка на текущем заголовке
    const arrowElement = headerElement.querySelector('[data-element="arrow"]');

    if (arrowElement) {
      // Если стрелочка уже есть, просто меняем порядок сортировки
      headerElement.dataset.order = newOrder;
    } else {
      // Если стрелочка не на текущем заголовке, удаляем её у всех заголовков
      const allHeaders = this.subElements.header.children;
      Array.from(allHeaders).forEach((header) => {
        header.dataset.order = "";
        const existingArrow = header.querySelector('[data-element="arrow"]');
        if (existingArrow) {
          existingArrow.remove();
        }
      });

      // Устанавливаем новый порядок сортировки и добавляем стрелочку
      headerElement.dataset.order = newOrder;
      this.insertArrow(headerElement);
      return;
    }

    // Вызываем сортировку данных
    this.sort(headerElement.dataset.id, newOrder);
  }

  insertArrow(headerElement) {
    if (headerElement) {
      const spanElement = headerElement.querySelector("span");
      spanElement.insertAdjacentElement("afterend", this.arrowElement);

      this.sort(headerElement.dataset.id, headerElement.dataset.order);
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
