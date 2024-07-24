export default class ColumnChart {
    chartHeight = 50;

    constructor(props = {}){
        const { data = [], label = '', value = 0, link = '', formatHeading = data => data } = props;
        
        this.data = data;
        this.label = label;
        this.link = link;
        this.value = value;
        this.formatHeading = formatHeading;

        this.element = this.createElement(this.createTemplate());
    }

createElement(template){
    const element = document.createElement('div');
    element.innerHTML = template;

    return element.firstElementChild;
}

createLinkTemplate(){

    if(!this.link)
        return '';

    return `<a href="${this.link}" class="column-chart__link">View all</a>`;

}

createHeaderValueTemplate(){
    return this.formatHeading(this.value);
}

createBodyChartTemplate(){
    return this.getColumnProps(this.data).map(({value, percent}) => (
        `<div style="--value: ${value}" data-tooltip="${percent}"></div>`
    )).join('');
}

getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;
  
    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }
  
createChartClass(){
    return this.data.length ? 'column-chart' : 'colunn-chart column-chart_loading';
}

update(newData){
    this.data = newData;

    const bodyElement = this.element.querySelector('[data-element="body"]');
    bodyElement.innerHTML = this.createBodyChartTemplate();
}

createTemplate(){
    return (`<div class="${this.createChartClass()}" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        ${this.label}   
        ${this.createLinkTemplate()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">
            ${this.createHeaderValueTemplate()}
        </div>
        <div data-element="body" class="column-chart__chart">
          ${this.createBodyChartTemplate()}
        </div>
      </div>
    </div>`);
}

remove(){
    this.element.remove();
}

destroy(){
    this.remove();
}

}