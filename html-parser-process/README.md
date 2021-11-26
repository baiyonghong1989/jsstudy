### 验证html 解析过程中js、css对dom渲染的解析作用
附：[掘金文章：html的渲染过程](https://juejin.cn/post/6844904040346681358)
1. 启动
   ```javascript
   cd /html-parser-process
   npm install 
   node index.js
   ```
2. css对html的阻塞一览: http://localhost:3000/index_css_block.html
3. async js的加载：http://localhost:3000/index_async.html
4. defer js的加载：http://localhost:3000/index_defer.html
   