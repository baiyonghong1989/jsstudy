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

// 联合类型,取多种类型中的一个
let myFavoriteNumber: string | number;
myFavoriteNumber = 1234;
myFavoriteNumber = '1234';
// 当ts能够确认值的类型时ok
console.log(myFavoriteNumber.length)

// 当ts无法确认值的类型时，只能访问联合类型的共有属性或者api，下面会报错
// function getLength(something: string | number): number {
//     return something.length;
// }

// interface Person{
//     name?:string,
//     age:number,
// }

// let tom:Person = {
//     name:'tom',
//     age:25
// }

// let tom1:Person = {
//     age:18,
// }

// // 任意类型的属性
// interface Pers{
//     name:string,
//     age?:number,
//     [propName:string]:any
// }
// let jone:Pers = {
//     name:'jone',
//     age1:'12'
// }

// interface Person {
//     name: string;
//     age?: number;
//     [propName: string]: string|number;
// }

// let tom: Person = {
//     name: 'Tom',
//     age: 25,
//     gender: 'male'
// };

// interface Person {
//     name: string;
//     age?: number;
//     isAdult:boolean;
//     [propName: string]: string | number | boolean;
// }

// let tom: Person = {
//     name: 'Tom',
//     age: 25,
//     gender: 'male',
//     isAdult: true
// };

interface Person {
    readonly id: number;
}
let byh:Person = {
    id:3
}