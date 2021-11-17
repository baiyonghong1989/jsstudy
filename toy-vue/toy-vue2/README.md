# vue2源码基础框架实现解析
## 基础框架类说明
- class Watcher
- class Observer && function observe 
- class Dep

### Watcher:
观察者类，主要承载vue component的render刷新。数据改变时Watcher触发update，watcher的update进行component的render和update。

**vue2源码中主要的挂载如下：**

```javascript

 // Vue2 源码实现关键方法
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
Vue在初始化时，new Watcher将updateComponent传入class中。Watcher在构造函数时会执行get方法。Watcher的get方法如下。get方法内部会执行this.getter,即vue的updateComponent方法，**updateComponent会触发对data数据的get，此次会触发相关数据的dep的watcher的收集**。具体看下方Observer的defineReactive

```javascript
   get(){
        pushTarget(this);
        const vm = this.vm;  // vm即vue实例
        let value = this.getter.call(vm,vm);
        popTarget();
        return value;
    }
```

工程中的updateComponnet代码为简易版没有vnode的版本，参考即可。
Watcher的更新可参考官网图
![](https://raw.githubusercontent.com/baiyonghong1989/study/main/toy-vue/toy-vue2/Watcher_update.png)


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

附：Watcher的get阶段会将Watcher设置到Dep.target中，然后执行updateComponent时触发相应数据的get，然后数据初始化get阶段的闭包内的Dep及__ob__会将Watcher添加到Dep的监听列表中。

```javascript
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



这个主要是兼容数组的场景使用的。因为数组时没有办法劫持get、set的。
