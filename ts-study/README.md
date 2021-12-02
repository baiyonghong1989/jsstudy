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

// 定义interface的任意属性，注意任意属性的类型必须是其他确认属性和可选类型的合集,不然会报错
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
    isAdult: true
};

// 定义interface的只读属性
interface Person {
    readonly id: number;
}
let byh:Person = {
    id:3
}
byh.id = 5;  // 此时会报错
```
