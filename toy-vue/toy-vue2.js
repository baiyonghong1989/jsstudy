let currentHandler = null;
export class Vue {
  constructor(opt) {
    this.opt = opt;
    this.observe(opt.data);
    let root = document.querySelector(opt.el);
    this.compile(root);
  }
  // 为响应式对象 data 里的每一个 key 绑定一个观察者对象
  observe(data) {
    Object.keys(data).forEach((key) => {
      let subject = new Subject();
      data["_" + key] = data[key];
      // 通过 getter setter 暴露 for 循环中作用域下的 obv，闭包产生
      Object.defineProperty(data, key, {
        get() {
          currentHandler && subject.add(currentHandler);
          return data["_" + key];
        },
        set(newVal) {
          subject.notify(newVal);
          data["_" + key] = newVal;
        },
      });
    });
  }
  // 初始化页面，遍历 DOM，收集每一个key变化时，随之调整的位置，以观察者方法存放起来
  compile(node) {
    [].forEach.call(node.childNodes, (child) => {
      if (!child.firstElementChild && /\{\{(.*)\}\}/.test(child.innerHTML)) {
        let key = RegExp.$1.trim();
        let handler = (val) => {
          child.innerHTML = val;
        };
        handler(this.opt.data[key]);
        currentHandler = new Observer(handler);
        // 通过触发对象的get完成subject的订阅
        this.opt.data[key];
        currentHandler = null;
      } else if (child.firstElementChild) this.compile(child);
    });
  }
}
// 被观察者
class Subject {
  constructor() {
    this.observers = [];
  }
  add(observer) {
    this.observers.push(observer);
  }
  notify(newVal) {
    this.observers.forEach((observer) => {
      observer.update(newVal);
    });
  }
}

class Observer {
  constructor(handler) {
    this.handler = handler;
  }
  
  update(...params) {
    this.handler(...params);
  }
}

