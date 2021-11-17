import { observe } from "./Observer.js";
import { Watcher } from "./Watcher.js";
let obj = {
    a:{
        b:1
    }
}
observe(obj);
window.obj = obj;
export class Vue {
    constructor(opt) {
      this.opt = opt;
      observe(opt.data);
      let ele = document.querySelector(opt.el);
      this.nodeMap = new Map();
      this.crateTemplateMap(ele);
      new Watcher(this,this.updateComponent);
    }

    // 遍历vue的template，将节点及数据对应关系存储起来。建议版本的updateComponent的核心实现
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