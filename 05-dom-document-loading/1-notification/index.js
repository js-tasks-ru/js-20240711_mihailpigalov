export default class NotificationMessage { 

    static lastShownComponent;

    constructor(title, props = {}){
         const { duration = 2000, type = "success" } = props;

         this.duration = duration;
         this.type = type;
         this.title = title;

        this.element = this.createElement(this.createTemplate());
    }

    calculateDuration(){
        return Math.round(this.duration/1000);
    }

    createTemplate(){
        return (`
    <div class="notification ${this.type}" style="--value:${this.calculateDuration()}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">
                ${this.title}
            </div>
        </div>
    </div>`);
    }

    createElement(template){
        const element = document.createElement('div');
        element.innerHTML = template;
    
        return element.firstElementChild;
    }

    show(container = document.body) {
        if(NotificationMessage.lastShownComponent)
            NotificationMessage.lastShownComponent.hide();

        NotificationMessage.lastShownComponent = this;

        this.timerId = setTimeout(() => {
            this.remove();
        }, this.duration);
        
        container.append(this.element);
    }

    hide(){
        this.element.remove();
    }

    remove(){
        this.element.remove();
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
    }

    destroy(){
        this.remove();
    } 
}
