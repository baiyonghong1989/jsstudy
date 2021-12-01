# vue2学习记录
## 安装项目
```bash
## vue2的cli命令被vue3占用，需要安装vue/cli-init使用vue2的cli命令
npm install -g @vue/cli-init
## 创建webpack的标准项目
vue init webpack    
```

## 常见模板语法
  1. {{}}
```html
<!-- mustache语法，双大括号,支持表达式,不支持语句、流程控制等 -->
<span>{{msg}}</span>
<span>{{isMsg?'yes':'no'}}</span>
```
  2. v-bind,简写:
```html
<!-- 响应式更新 -->
<a v-bind:href='url'>url</a>
<!-- 缩写 -->
<a :href="url">...</a>
<!-- 2.6.0新增,attributeName为变量 -->
<a v-bind:[attributeName]="url"> url </a>
```
  3. v-on,简写@
```html
<!-- 监听dom事件 -->
<a v-on:click='sendClick()'>url</a>
<!-- 2.6.0新增,eventName为变量 -->
<a v-on:[eventName]="doSomething"> url </a>
<!-- 缩写 -->
<a @[event]="doSomething"> ... </a>
<!-- .prevent 修饰符告诉 v-on 指令对于触发的事件调用 event.preventDefaul() -->
<form v-on:submit.prevent="onSubmit">...</form>
```
  4. v-model
    text 和 textarea 元素使用 value property 和 input 事件；
    checkbox 和 radio 使用 checked property 和 change 事件；
    select 字段将 value 作为 prop 并将 change 作为事件。
  5. v-once 
```html
<!-- 执行一次性地插值，当数据改变时，插值处的内容不会更新 -->
<span v-once>这个将不会改变: {{ msg }}</span>
```
  6. v-html
  7. v-if
  8. v-show
  9. v-for,注意v-for 建议匹配:key=
```html
<li v-for="item in items" :key="item.message">
    {{ item.message }}
</li>
<!-- v-for还可以遍历对象 -->
<ul id="v-for-object" class="demo">
    <li v-for="value in object">
        {{ value }}
    </li>
</ul>
```
  10. v-else-if
  11. 
## computed
```javascript
var vm = new Vue({
    el: '#example',
    data: {
        message: 'Hello'
    },
    computed: {
        // 计算属性的 getter
        reversedMessage: function () {
        // `this` 指向 vm 实例
        return this.message.split('').reverse().join('')
        }
    }
})
```
    **计算属性vs方法**
    我们可以将同一函数定义为一个方法而不是一个计算属性。两种方式的最终结果确实是完全相同的。然而，不同的是计算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值。这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数
## watch
```javascript
var vm = new Vue({
    el: '#demo',
    data: {
        firstName: 'Foo',
        lastName: 'Bar',
        fullName: 'Foo Bar'
    },
    watch: {
        firstName: function (val) {
        this.fullName = val + ' ' + this.lastName
        },
        lastName: function (val) {
        this.fullName = this.firstName + ' ' + val
        }
    }
})
```
## 组件通信(https://segmentfault.com/a/1190000019208626)
  1. 父组件与子组件 props 与 $emit
  2. $emit/$on  中央事件总线
  3. vuex
  4. $attrs/$listeners
     $attrs：包含了父作用域中不被 prop 所识别 (且获取) 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 prop 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind="$attrs" 传入内部组件。通常配合 interitAttrs 选项一起使用。
    $listeners：包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件
  5. provide/inject
    常用于组件库、高阶插件中
  6. $parent / $children与 ref

## slot
 1. 基础插槽
```html
<!-- place to use navigation-link -->
<navigation-link url="/profile">
Your Profile
</navigation-link>

<!-- template of component navigation-link -->
<a v-bind:href="url" class="nav-link">
    <slot></slot>
</a>
```
  2. 具名插槽
```html
<!-- place to use base-layout -->
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>

<!-- template of component base-layout -->
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```
  3. 作用域插槽
```html
<!-- place to use Test, make slot content use the variable in child component -->
<Test>
    <template v-slot:header="slotProps">
    {{ slotProps.user.firstName }}
    </template>
</Test>
<!-- 用法改进,直接作用在组件或者dom上，独占默认插槽的写法 -->
<Test v-slot='slotProps'>
    {{ slotProps.user.firstName }}
</Test>
<!-- template of component Test -->
<slot name='header' v-bind:user="user">
    {{ user.lastName }}
</slot>
```
## 动态组件 & 异步组件
```html
<component v-bind:is="currentTabComponent"></component>

<!-- 失活的组件将会被缓存！-->
<keep-alive>
  <component v-bind:is="currentTabComponent"></component>
</keep-alive>
```
## 动画 & 过度
// todo study

## 可复用性 & 组合
1. mixin
2. extend
3. directive
4. render 渲染函数 jsx
5. 函数式组件/递归组件

## 关于测试
 1. 框架测试
    - Jest 专注于简易型的js测试框架
    - Mocha 专注于灵活性的js测试框架，可以在浏览器运行而不仅是node
 2. 组件测试
    - Vue Testing Library (@testing-library/vue)  推荐
    - Vue Test Utils   不推荐，偏底层
 3. e2e测试
    - Cypress.io 推荐
    - Nightwatch.js 
    - Puppeteer
    - TestCafe
## 路由
   - vue router
    附:[官方简易版路由实现](https://github.com/chrisvfritz/vue-2.0-simple-routing-example)
## 状态管理
   - vuex
## ssr
   - nuxt.js