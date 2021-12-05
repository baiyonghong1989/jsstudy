# [ts学习记录](https://ts.xcatliu.com/basics/type-of-array.html)
## 基础类型
   包括null,undefined,string,number,void,boolean,any
```ts
const num: number = 123;
let str: string = "tom";
let isTs: boolean = true;

// 函数返回空可以使用void
let newFun = function():void{
    console.log('123')
}

// null and undefined 是两个原始数据类型，是任意类型的子类型，可以赋值给其他任意类型不报错
let p:undefined = undefined;
let c:null = null;
let p1:number = undefined;
let c1:string = null;

// any 任意类型可以允许在赋值过程中改变
let anyVal:any = 12;
anyVal = {};

// 变量在声明时未指明类型，会被识别为任意类型
let anyVal;
```

## 联合类型
```ts
// 联合类型,取多种类型中的一个
let myFavoriteNumber: string | number;
myFavoriteNumber = 1234;
myFavoriteNumber = '1234';
// 当ts能够确认值的类型时ok
console.log(myFavoriteNumber.length)

// 当ts无法确认值的类型时，只能访问联合类型的共有属性或者api，下面会报错
function getLength(something: string | number): number {
    return something.length;
}
```
## 接口 interfaces
  一般首字母大写,主要包括可选属性、任意属性、只读属性的功能
```ts
// 可选属性通过？控制
interface Person{
    name?:string,
    age:number,
}
// 下面都可以
let tom:Person = {
    name:'tom',
    age:25
}

let tom1:Person = {
    age:18,
}

// 定义interface的任意属性，注意任意属性的类型必须是其他确认属性和可选类型的合集,不然会报错。任意类型代码可以拓展多个属性的场景
interface Person {
    name: string;
    age?: number;
    isAdult:boolean;
    [propName: string]: string | number | boolean;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male',
    isAdult: true,
    isPerson: false
};

// 定义interface的只读属性:id 以及getName：function
interface Person {
    readonly id: number;
    getName:(id:number)=>Person
}
let byh:Person = {
    id:3
}
byh.id = 5;  // 此时会报错
```
## 数组
```ts
// 类型+ 方括号形式定义数组
let personList : string[];
personList.push('Tom','LiLei')

// 数据泛型Array<elemType>
let personList:Array<string> = ['Tom']

// interface 可以用来表示数组，经常用来表示类数组
interface IArguments {
    [index: number]: any;
    length: number;
    callee: Function;
}
// ts内置的类数组 IArguments :数组内部的arguments,
   NodeList:
function testFun(){
    let args:IArguments = arguments;
}
```

## 函数
```ts
// 函数声明
function sum(x: number, y: number): number {
    return x + y;
}

// 函数表达式
// mySum是从右边的匿名函数中的类型定义推断出来的
let mySum = function (x: number, y: number): number {
    return x + y;
};
// 可以写成下面的形式严格定义,让ts自己推断也够了
let mySum : (x:number,y:number)=>number;


// 接口定义函数
interface muFun{
    (id:string,age:number):boolean
}
// 注意接口定义函数与接口内部的函数属性区别
interface Person{
    getName:(id:string)=>string
}

let myF:muFun = (id,age)=>{
    return false;
}

// es6 参数默认值.ts会将添加参数默认值的参数识别为可选参数
function buildName(firstName: string, lastName: string = 'Cat') {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');

// ts 重载 ,前两个是定义，最后一个是实现。通过这种方式，用户使用reverse时能够实时的根据x的类型匹配相应的提示是返回number还是string，
// TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}

```

## 断言 
联合类型可以被断言为其中一个类型
父类可以被断言为子类
任何类型都可以被断言为 any
any 可以被断言为任何类型
断言的两种形式:
1. 值 as 类型
2. <类型>值
推荐使用第一种
```ts
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
}

function isFish(animal: Cat | Fish) {
    if (typeof (animal as Fish).swim === 'function') {
        return true;
    }
    return false;
}
```

## 声明语句
 注意声明语句是声明类型，不能定义具体的实现
- declare var 声明全局变量
- declare function 声明全局方法
- declare class 声明全局类
- declare enum 全局枚举
- declare namespace 声明（含有子属性的）全局对象
- interface 和 type 声明全局类型
- export 导出变量
- export namespace 导出（含有子属性的）对象
- export default ES6 默认导出
- export = commonjs 导出模块
- export as namespace UMD 库声明全局变量
- declare global 扩展全局变量
- declare module 扩展模块
- /// <reference /> 三斜线指令

```ts
declare const name: string;   // 声明全局变量
// 注意在module中使用declare就不是全局的啦
export {name};   // 导出变量

// declare global


// 三斜线指令。在全局的声明文件中引入一个库时使用，不能直接使用import会被视为mpm库或者UMD库，里面的全局变量就变为局部的啦

/// <reference types="jquery" />
declare function foo(options: JQuery.AjaxSettings): string;
```

## 类型别名
```ts
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```
## 字符串类型字面量
```ts
type EventNames = 'click' | 'scroll' | 'mousemove';
```

## 元组
定义不同类型的对象
```ts
let tom: [number,string] = ['Tom', 25];
tom.push('Tom')
```

## 枚举
```ts
// 常数枚举
declare const enum Directions{
    Up,
    Down,
    Left,
    Right
}
```

## class
TypeScript 可以使用三种访问修饰符（Access Modifiers），分别是 public、private 和 protected。

- public 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的
- private 修饰的属性或方法是私有的，不能在声明它的类的外部访问
- protected 修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的
```ts
class Animal {
  protected name;
  public constructor(name) {
    this.name = name;
  }
}

class Cat extends Animal {
  constructor(name) {
    super(name);
    console.log(this.name);
  }
}

// 修饰符和readonly还可以使用在构造函数参数中，等同于类中定义该属性同时给该属性赋值，使代码更简洁。
class Animal {
  // public name: string;
  public constructor(public name) {
    // this.name = name;
  }
}

// 类继承、实现
interface Alarm {
    alert(): void;
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}

class Car implements Alarm {
    alert() {
        console.log('Car alert');
    }
}

// 注意接口可以继承类，实际上接口继承类就是集成类的实例
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface PointInstanceType {
    x: number;
    y: number;
}

// 等价于 interface Point3d extends PointInstanceType
interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

## 泛型
泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

```ts
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

// 多个类型参数
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}
swap([7, 'seven']); // ['seven', 7]

// 泛型约束，T必须包含length属性
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

// 多个类型参数之间互相约束
function copyFields<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
        target[id] = (<T>source)[id];
    }
    return target;
}
let x = { a: 1, b: 2, c: 3, d: 4 };
copyFields(x, { b: 10, d: 20 });

// 泛型接口，CreateArrayFunc定义了个api。另外，<T>可以提到interface的前面
interface CreateArrayFunc {
    <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']

// 还有泛型参数的默认类型。在 TypeScript 2.3 以后，我们可以为泛型中的类型参数指定默认类型。当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```

## 声明合并
   接口合并/类合并/function合并
```ts
// 接口合并、类合并同样规则
interface Alarm {
    price: number;
}
interface Alarm {
    weight: number;
}
// 上方等同于
interface Alarm {
    price: number;
    weight: number;
}
// function合并，并非合并而是重载
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```