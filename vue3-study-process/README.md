# Vue3 学习记录
## 安装
1. vue-cli  (默认webpack)
```bash
      npm install -g @vue-cli
      vue create my-vue-next-app
      ## choose vue3 eslint
      npm install
```
2. vite-cli  (vite +  roolup)
```bash
      npm install -g create-vite-app
      vue create my-vite-app
      npm install
      npm run dev
```

## composition api
1. setup composition入口，在beforeCreate之前调用，返回的内容作为模板渲染的上下文。
2. reactive 对象的响应式api
3. ref 基本数据的响应式

## Fragment/Teleport/Suspense
1. Fragment  template中不需要根节点了，可以这么写
   
```html
<template>
    <h1>哈喽</h1>
    <div>我真棒</div>
</template>
```
2. Teleport
   将vue渲染内容到指定的dom上，而不是在app内。
3. Suspense
   异步的实现,用法如下：
```html
<Suspense>
  <template #default>
    异步的组件
  </template>
  <template #fallback>
    加载状态的组件
  </template>
</Suspense>
```