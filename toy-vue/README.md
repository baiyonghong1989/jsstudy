# toyVue vue基础双向绑定实现

**toy-vue2**：get set 使用观察者模式完成简单的vue2双向绑定
**toy-vue3**：proxy reactive 完成vue3的基础指令的双向绑定

##模拟vue2代码实现(vue2)
```javascript
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

```

##模拟代码实现(vue3)
```javascript
export class ToyVue {
  constructor(config) {
    this.template = document.querySelector(config.el);
    this.data = reactive(config.data);
    for (let methodName in config.methods) {
      this[methodName] = () => {
        config.methods[methodName].apply(this.data);
      };
    }
    this.traversal(this.template);
  }

  traversal(node) {
    this.travelsalDoubleBracket(node);
    this.travelsalVModel(node);
    this.travelsalVBind(node);
    this.travelsalVOn(node);
    if (node.childNodes && node.childNodes.length > 0) {
      for (let child of node.childNodes) {
        this.traversal(child);
      }
    }
  }

  // 处理双括号{{}}
  travelsalDoubleBracket(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.trim().match(/^{{([\d\D]+)}}$/)) {
        let name = RegExp.$1.trim();
        effect(() => (node.textContent = this.data[name]));
      }
    }
  }

  // 处理v-model
  travelsalVModel(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      for (let attr of node.attributes) {
        if (attr.name === 'v-model') {
          node.addEventListener('input', () => {
            this.data[attr.value] = node.value;
          });
          effect(() => {
            node.value = this.data[attr.value];
          });
        }
      }
    }
  }
  // 处理v-bind
  travelsalVBind(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      for (let attr of node.attributes) {
        if (attr.name.match(/^v-bind:([\s\S]+)$/)) {
          let attrName = RegExp.$1.trim();
          let value = attr.value;
          effect(() => {
            node.setAttribute(attrName, this.data[value]);
          });
        }
      }
    }
  }

  // 处理v-on
  travelsalVOn(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      for (let attr of node.attributes) {
        if (attr.name.match(/^v-on:([\s\S]+)$/)) {
          let eventName = RegExp.$1.trim();
          let funName = attr.value;
          node.addEventListener(eventName, this[funName]);
        }
      }
    }
  }
}

export function reactive(object) {
  let observed = new Proxy(object, {
    get(obj, prop) {
      if (currentEffect) {
        if (!effects.has(obj)) {
          effects.set(obj, new Map());
        }
        if (!effects.get(obj).get(prop)) {
          effects.get(obj).set(prop, []);
        }
        effects.get(obj).get(prop).push(currentEffect);
      }
      if(Object.prototype.toString.call(obj[prop]) === '[object Object]'){
        // get时假如数据是obj，再进行深一层的reactive
        return reactive(obj[prop]);
      } else {
        return obj[prop];
      }
    },
    set(obj, prop, val) {
      obj[prop] = val;
      if (effects.get(obj) && effects.get(obj).get(prop)) {
        for (effect of effects.get(obj).get(prop)) {
          effect();
        }
      }
      return val;
    },
  });
  return observed;
}
let currentEffect = null;
let effects = new Map();
function effect(fn) {
  currentEffect = fn;
  fn();
  currentEffect = null;
}

```


VUE3中的reactive实现数据的绑定主要结构。vue3中的proxy是对整个对象进行代理，而vue2中是针对每个对象的属性进行get、set的监听。

[vue2源码解读](https://www.cnblogs.com/polk6/p/13687213.html)

[vue2源码走读](https://segmentfault.com/a/1190000017969385)