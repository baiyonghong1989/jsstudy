class Event {
  constructor() {
    this.handlers = Object.create(null);
  }

  // 添加监听
  addEventlistener(type, handler) {
    this.handlers[type] = this.handlers[type] || new Set();
    this.handlers[type].add(handler);
  }

  // 事件移除参数（事件名，删除的事件，若无第二个参数则删除该事件的订阅和发布）
  removeEventListener(type, handler) {
    if (!this.handlers[type]) {
      console.error("event", type, "not register!");
      return false;
    }
    if (!handler) {
      delete this.handlers[type];
    } else {
      this.handlers[type].delete(handler);
    }
  }
  // 事件派发
  dispatchEvent(type, ...params) {
    if (type in this.handlers) {
      for (let handler of this.handlers[type]) {
        handler(...params);
      }
    }
  }
}

let publishEvent = new Event();
publishEvent.addEventlistener('click',()=>{
    console.log('click');
})
publishEvent.dispatchEvent('click',12)


// 发布订阅者模式下 没有明显的被观察着，通过订阅渠道进行统一的消息发布