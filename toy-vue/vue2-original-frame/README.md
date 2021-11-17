# vue2源码基础框架实现解析
## 基础框架类说明
- class Watcher
- class Observer && function observe 
- class Dep

### Watcher:
观察者类，为常规观察者模式中的Observer，数据变化时通知的对象。数据变化时触发vue组件的更新。数据改变时Watcher触发update，watcher的update进行component的render和update。
Watcher的更新可参考官网图，如下
![](https://raw.githubusercontent.com/baiyonghong1989/study/main/toy-vue/toy-vue2/Watcher_update.png)

**vue2源码中核心Watcher的挂载如下：**

```javascript

 // Vue2 源码实现关键方法，在Vue的init阶段
 new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)

 // updateComponent先渲染vnode，然后更新
 updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }

// 工程实现简易版
export class Vue {
    constructor(opt) {
      this.opt = opt;
      observe(opt.data);
      let ele = document.querySelector(opt.el);
      this.nodeMap = new Map();
      this.crateTemplateMap(ele);
      new Watcher(this,this.updateComponent);
    }

    // 遍历vue的template，将节点及数据对应关系存储起来。简易版本的updateComponent的核心实现
    crateTemplateMap(node) {
      [].forEach.call(node.childNodes, (child) => {
        if (!child.firstElementChild && /\{\{(.*)\}\}/.test(child.innerHTML)) {
          let key = RegExp.$1.trim();
          this.nodeMap.set(child,key);
        } else if (child.firstElementChild) this.compile(child);
      });
    }
    updateComponent(){
        for (let node of this.nodeMap.keys()){
            node.innerHTML = this.opt.data[this.nodeMap.get(node)];
        }
    }
  }
  
```
Watcher的代码可以参考工程中的简易实现，如下：
```javascript
import { popTarget, pushTarget } from "./Dep.js";

let uid = 0
export class Watcher{
    constructor(vm,expOrFn,cb){
        this.vm = vm;
        // vm._watchers.push(this);
        this.id =  ++uid;
        this.deps = new Set();
        this.dpeIds = new Set();
        this.getter = expOrFn;   // watcher更新时执行的function
        this.cb = cb;
        this.value = this.get();
    }
    get(){
        pushTarget(this);
        const vm = this.vm;
        let value = this.getter.call(vm,vm);
        popTarget();
        return value;
    }

    addDep(dep){
        const id = dep.id;
        this.dpeIds.add(id);
        this.deps.add(dep);
        dep.addSubs(this);
    }

    update(){
        this.run();
    }
    run(){
        const value = this.get();
        this.value = value;
        // this.cb.call(this.vm, value, oldValue)  // 生命周期钩子函数执行
    }
}

```
Vue在初始化时，new Watcher将updateComponent传入class中。Watcher在构造函数时会执行get方法。Watcher的get方法如下。get方法内部会执行this.getter,即vue的updateComponent方法，**updateComponent会触发对data数据的get，此次会触发相关数据的dep的watcher的收集**。具体看下方Observer的defineReactive。

工程中的updateComponnet代码为简易版没有vnode的版本，参考即可。

### Observer类与observe function:
observe是为对象添加响应式，双向绑定的主函数入口。observe与Observer的主代码如下：

```javascript
import Dep from "./Dep.js";
import { arrayMethods } from "./array.js";
export function observe(value) {
  if (Object.prototype.toString.call(value) !== '[object Object]' && !Array.isArray(value)){
      return;
  }
  let ob = new Observer(value);
  return ob;
}

export class Observer {
  constructor(value) {
    this.value = value;
    this.dep = new Dep();
    console.log('observer dep id',this.dep.id)
    // 将__ob__对象挂载到data上
    value.__ob__ = this;
    if (Array.isArray(value)){
        value.__proto__ = arrayMethods;
        this.observeArray(value);
    }
    this.walk(value);
  }

  walk(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== '__ob__'){
        defineReactive(obj, keys[i]);
      }
    }
  }
  observeArray(items){
    for (let i = 0, l = items.length; i < l; i++) {
        observe(items[i])
      }
  }
}

/**
 * Define a reactive property on an Object.
 */
export function defineReactive(obj,key){
    const dep = new Dep();
    let val = obj[key];
    // 遍历生成子元素的reactive observer
    let childOb = observe(val);
    Object.defineProperty(obj,key,{
        enumerable:true,
        configurable:true,
        get:function(){
            if (Dep.target){
                dep.depend();
                // 元素的getter、setter内部新建一个dep依赖，同时元素若是对象或者数组的话，元素的__ob__挂载的Observer内的dep也同步收集依赖。主要是给数组使用
                if (childOb){
                    childOb.dep.depend();
                }
            }
            return val;
        },
        set:function(newVal){
            val = newVal;
            childOb = observe(newVal);
            dep.notify();
        }
    })
}
```

Vue主入口中首先将data数据进行双向绑定的初始化get、set。循环初始化vue实例data的数据child,对所有字段的get和set闭包环境内生成Dep依赖。在updateComponent阶段触发data的get时，会触发dep的依赖收集。

```javascript
   // Watcher的get方法会在构造时执行，执行过程中通过pushTarget将Watcher设置到Dep.tartget上
   get(){
        pushTarget(this);
        const vm = this.vm;  // vm即vue实例
        let value = this.getter.call(vm,vm);
        popTarget();
        return value;
    }
```

附：Watcher的get阶段会将Watcher设置到Dep.target中，然后执行updateComponent时触发相应数据的get，然后数据初始化get阶段的闭包内的Dep及__ob__会将Watcher添加到Dep的监听列表中。

```javascript
// Observer中的defineReactive
export function defineReactive(obj,key){
    const dep = new Dep();
    let val = obj[key];
    // 遍历生成子元素的reactive observer
    let childOb = observe(val);
    Object.defineProperty(obj,key,{
        enumerable:true,
        configurable:true,
        get:function(){
            if (Dep.target){
                dep.depend();
                // 元素的getter、setter内部新建一个dep依赖，同时元素若是对象或者数组的话，元素的__ob__挂载的Observer内的dep也同步收集依赖。主要是给数组使用
                if (childOb){
                    childOb.dep.depend();
                }
            }
            return val;
        },
        set:function(newVal){
            val = newVal;
            childOb = observe(newVal);
            dep.notify();
        }
    })
}


```

由代码可以看出，在初始化data的get、set时已经初始化了一个Dep,正常的对象使用这个Dep进行依赖收集即可。但是实际上假如data是对象的话，还会对对象的__ob__的dep进行依赖收集。
以数据obj为例，
```javascript
let obj = {
    a:{
        b:1
    }
}
observe(obj);
```
添加响应式后的dep绑定如下：
![](https://raw.githubusercontent.com/baiyonghong1989/study/main/toy-vue/toy-vue2/object_after_reactive.png)

数据改变时，defineReactive中的dep实例已经足够通知相应的watcher进行update了。那么为啥还要在对象a中添加__ob__这个observer呢。

**这个实际上主要是为了兼容数组使用的**。因为数组时没有办法劫持get、set的，没有办法在defineReactive中创建闭包中的dep。

observe在数组的处理中，劫持了数组的相关api，在触发相关的api时会主动通知数组的__ob__的notify，触发相关Watcher的更新。


```javascript
    // Observer的constructor类中针对array做了特殊处理。修改了数组原型上的push等api
    if (Array.isArray(value)){
        value.__proto__ = arrayMethods;
        this.observeArray(value);
    }

    // arrayMethods的处理，array.js中。methodsToPatch中有['push','pop','shift','unshift','splice','sort','reverse']
    /**
     * Intercept mutating methods and emit events
     */

    const methodsToPatch = ['push','pop','shift','unshift','splice','sort','reverse'];
    methodsToPatch.forEach(function (method) {
        // cache original method
        const original = arrayProto[method]
        def(arrayMethods, method, function mutator (...args) {
            const result = original.apply(this, args)
            const ob = this.__ob__
            let inserted
            switch (method) {
                case 'push':
                case 'unshift':
                    inserted = args
                    break
                case 'splice':
                    inserted = args.slice(2)
                    break
                }
            if (inserted) ob.observeArray(inserted)
            // notify change
            ob.dep.notify()
            return result
        })
    })
```

### Dep
Dep为常规的观察者模式中的Subject，主要负责listener的收集及通知更新
```javascript
let uid = 0;
export default class Dep {
  static target; // 当前的watcher
  id;
  subs; // watcher list
  constructor() {
    this.id = uid++;
    this.subs = new Set();
  }

  addSubs(sub) {
    this.subs.add(sub);
  }

  removeSubs(sub) {
    this.subs.delete(sub);
  }
  // 收集依赖，Dep.target为Watcher，Watcher将Dep存入自己的deps中，同时调用Dep的addSubs方法，将watcher同步存入dep的subs中
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
  // dep发生改变时，通知相应watcher做更新。调用watcher的update方法
  notify() {
    for(let sub of this.subs){
        sub.update();
    }
  }
}


// 当前的目标watcher，同一时间只有一个，系统级变量
Dep.target = null
const targetStack = []

export function pushTarget (target) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget () {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

```

注意：关于Dep.target是一个全局变量。所有的Watcher在初始化时会将这个值置为watcher自身。