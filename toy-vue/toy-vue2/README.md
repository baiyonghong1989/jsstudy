# vue2源码基础框架实现解析
## 基础框架类说明
- Watcher
- Observer
- Dep

### Watcher:
    观察者类，主要承载vue component的render刷新。数据改变时触发dep中的Watcher触发update，watcher的update进行component的render和update。
**vue2源码中主要的挂载如下：**

```javascript

 // 源码实现
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
  
```
工程中的updateComponnet代码为简易版没有vnode的版本，参考即可。
Watcher的更新可参考官网图


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
        this.getter = expOrFn;
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
Watcher类在初始化时，会触发get，执行
