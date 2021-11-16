# js 观察者模式与发布订阅模式
## Observer.js 观察者模式

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
![](https://raw.githubusercontent.com/baiyonghong1989/study/main/designPattern/observer/assets/observer%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F.png)
图1：观察者模式
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


![](https://raw.githubusercontent.com/baiyonghong1989/study/main/designPattern/observer/assets/%E5%8F%91%E5%B8%83%E8%AE%A2%E9%98%85.png)
图2：发布订阅模式

附：[知乎-观察者模式vs发布订阅模式](https://zhuanlan.zhihu.com/p/51357583)
![](https://raw.githubusercontent.com/baiyonghong1989/study/main/designPattern/observer/assets/zhihu-%E5%8F%91%E5%B8%83%E8%80%85%E6%A8%A1%E5%BC%8FVS%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F.jpg)

###个人总结
两种场景的使用跟实际情况相关，订阅者是订阅一个发布者还是一类发布者，**若是一类发布者应该使用发布订阅模式。另外，在整个运行周期内发布者和订阅者是否能够互相感知，或者能否保证订阅者发起订阅时发布者是否已经准备就绪等场景。**

使用发布订阅模式，解耦出来的event队列能够做更多的事情，比如调整执行顺序和过滤等等，再扩展就是消息队列。