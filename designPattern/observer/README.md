# js 观察者模式与发布订阅模式
##Observer.js 观察者模式

基本要素：

- observer 观察者
- subject  被观察对象
  
```javascript
// 目标类，被观察者
class Subject {
    constructor() {
      this.observers = new Set();
    }
    // 被订阅
    add(observer) {
      this.observers.add(observer);
    }
    // 取消订阅
    remove(observer) {
      this.observers.delete(observer);
    }
  
    // 通知
    notify(newVal) {
      for (let observer of this.observers) {
        observer.update(newVal);
      }
    }
  }
  
  // 观察者
  class Observer {
    constructor(name) {
        this.name = name;
    }
    update(newVal) {
      console.log(`我是${this.name},被观察者已更新，值为${newVal}`);
    }
  }
  let obs1 = new Observer('小明');
  let obs2 = new Observer('小红');
  let sub1 = new Subject();
  sub1.add(obs1);
  sub1.add(obs2);
  sub1.notify(123);
```

## 发布订阅模式
基本要素：
- Event 消息通道
- handler 消息订阅处理逻辑

```javascript
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
```


**图注**
![]()