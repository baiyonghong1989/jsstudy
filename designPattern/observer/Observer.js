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