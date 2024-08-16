export default class DoubleSlider {
  element; // Это будет наш главный элемент слайдера
  draggingThumb; // Это будет элемент, который мы перемещаем
  subElements = {}; // Это будут подэлементы слайдера

  // Эти переменные будут хранить смещение при перемещении ползунков
  positionLeftThumb = {
    shiftX: 0,
  };
  positionRightThumb = {
    shiftX: 0,
  };

  // Этот метод вызывается, когда пользователь нажимает на ползунок
  onPointerDown(event) {
    const thumb = event.target; // Получаем элемент, на который нажали
    event.preventDefault(); // Предотвращаем стандартное поведение браузера
    this.draggingThumb = thumb; // Устанавливаем переменную для перемещаемого ползунка

    const { left } = thumb.getBoundingClientRect(); // Получаем координату left ползунка
    const { leftThumb, rightThumb } = this.subElements; // Получаем элементы левого и правого ползунков

    // Определяем, какой ползунок перемещаем и сохраняем смещение
    if (this.draggingThumb === leftThumb) {
      this.positionLeftThumb.shiftX = event.clientX - left;
    }
    if (this.draggingThumb === rightThumb) {
      this.positionRightThumb.shiftX = event.clientX - left;
    }

    this.element.classList.add('range-slider_dragging'); // Добавляем класс для стилизации во время перемещения
    document.addEventListener('pointermove', this.onPointerMove); // Добавляем слушатель для перемещения мыши
    document.addEventListener('pointerup', this.onPointerUp); // Добавляем слушатель для отпускания кнопки мыши
  }

  // Этот метод вызывается, когда пользователь перемещает мышь
  onPointerMove = event => {
    event.preventDefault(); // Предотвращаем стандартное поведение браузера

    const { clientX } = event; // Получаем координату X курсора
    const { from, to, leftThumb, rightThumb } = this.subElements; // Получаем элементы
    const { left: sliderLeft, right: sliderRight, width } = this.subElements.sliderInner.getBoundingClientRect(); // Получаем координаты и ширину внутреннего элемента слайдера

    // Определяем, какой ползунок перемещаем и вычисляем новую позицию
    if (this.draggingThumb === leftThumb) {
      let newLeft = (clientX - sliderLeft - this.positionLeftThumb.shiftX) / width;

      if (newLeft < 0) {
        newLeft = 0;
      }

      newLeft *= 100;

      const right = parseFloat(rightThumb.style.right);

      if (newLeft + right > 100) {
        newLeft = 100 - right;
      }

      this.draggingThumb.style.left = this.subElements.progress.style.left = newLeft + '%';
      from.innerHTML = this.formatValue(this.getValue().newFromValue);
    }

    if (this.draggingThumb === rightThumb) {
      let newRight = (sliderRight - clientX - this.positionRightThumb.shiftX) / width;

      if (newRight < 0) {
        newRight = 0;
      }

      newRight *= 100;

      const left = parseFloat(leftThumb.style.left);
      if (left + newRight > 100) {
        newRight = 100 - left;
      }

      this.draggingThumb.style.right = this.subElements.progress.style.right = newRight + '%';
      to.innerHTML = this.formatValue(this.getValue().newToValue);
    }
  }

  // Этот метод вызывается, когда пользователь отпускает кнопку мыши
  onPointerUp = () => {
    this.element.classList.remove('range-slider_dragging'); // Убираем класс стилизации

    const spanDetails = {
      from: this.getValue().newFromValue,
      to: this.getValue().newToValue
    }

    const thumbUpEvent = new CustomEvent('range-select', {
      detail: spanDetails,
      bubbles: true
    });

    this.element.dispatchEvent(thumbUpEvent); // Отправляем событие с новыми значениями
    this.removeFirstEventListeners(); // Удаляем слушатели событий
  }

  // Этот метод вычисляет текущие значения ползунков
  getValue() {
    const allRange = this.max - this.min;
    const { leftThumb, rightThumb } = this.subElements;
    const { left } = leftThumb.style;
    const { right } = rightThumb.style;

    const newFromValue = Math.round(this.min + (allRange * parseFloat(left) / 100));
    const newToValue = Math.round(this.max - (allRange * parseFloat(right) / 100));
    return { newFromValue, newToValue };
  }

  // Этот метод устанавливает начальное состояние ползунков
  setCurrentState() {
    const { leftThumb, rightThumb, progress } = this.subElements;

    const allRange = this.max - this.min;
    const fromDiff = this.selected.from - this.min;
    const toDiff = this.max - this.selected.to;

    const leftPercent = Math.floor(fromDiff * 100 / allRange) + '%';
    const rightPercent = Math.floor(toDiff * 100 / allRange) + '%';

    progress.style.left = leftPercent;
    progress.style.right = rightPercent;

    leftThumb.style.left = leftPercent;
    rightThumb.style.right = rightPercent;
  }

  // Конструктор класса
  constructor({ min = 100, max = 200, formatValue = value => '$' + value, selected = { from: min, to: max } } = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;

    this.render(); // Рендерим слайдер
    this.initEventListeners(); // Инициализируем слушатели событий
  }

  // Шаблон HTML для слайдера
  createTemplate() {
    const { from, to } = this.selected;

    return `
       <div class="range-slider">
        <span data-element="from">${this.formatValue(from)}</span>
        <div data-element="sliderInner" class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress" style="left: 20%; right: 0%"></span>
          <span data-element="leftThumb" class="range-slider__thumb-left" style="left: 50%"></span>
          <span data-element="rightThumb" class="range-slider__thumb-right" style="right: 0%"></span>
        </div>
        <span data-element="to">${this.formatValue(to)}</span>
        </div>
    `;
  }

  // Инициализация слушателей событий
  initEventListeners() {
    const { leftThumb, rightThumb } = this.subElements;

    leftThumb.addEventListener('pointerdown', (event) => {
      this.onPointerDown(event);
    });
    rightThumb.addEventListener('pointerdown', (event) => {
      this.onPointerDown(event);
    });
  }

  // Удаление слушателей событий
  removeFirstEventListeners() {
    document.removeEventListener('pointerup', this.onPointerUp);
    document.removeEventListener('pointermove', this.onPointerMove);
  }

  removeSecondEventListeners(){
    const { leftThumb, rightThumb } = this.subElements;

    leftThumb.removeEventListener('pointerdown', this.onPointerDown);
    rightThumb.removeEventListener('pointerdown', this.onPointerDown);
  }

  // Рендеринг слайдера
  render() {
    const sliderElement = document.createElement('div');
    sliderElement.innerHTML = this.createTemplate();
    this.element = sliderElement.firstElementChild;

    this.subElements = this.getSubElements(this.element);
    this.setCurrentState();
  }

  // Получение подэлементов слайдера
  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  // Удаление слайдера
  remove() {
    this.element.remove();
  }

  // Уничтожение слайдера
  destroy() {
    this.remove();
    this.removeFirstEventListeners();  
    this.removeSecondEventListeners();  
  }

}