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
