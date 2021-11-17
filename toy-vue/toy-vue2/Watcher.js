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