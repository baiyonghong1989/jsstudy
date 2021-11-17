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
    console.log('dep.id' ,dep.id)
    // 遍历生成子元素的reactive observer
    let childOb = observe(val);
    Object.defineProperty(obj,key,{
        enumerable:true,
        configurable:true,
        get:function(){
            if (Dep.target){
                dep.depend();
                // 元素有watcher依赖的话，元素的同样会依赖
                if (childOb){
                    childOb.dep.depend();
                }
            }
            return val;
        },
        set:function(newVal){
            console.log(dep.id);
            val = newVal;
            childOb = observe(newVal);
            dep.notify();
        }
    })
}
