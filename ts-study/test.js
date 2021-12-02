var num = 123;
var str = "tom";
var isTs = true;
// 函数返回空可以使用void
var newFun = function () {
    console.log('123');
};
// null and undefined 是两个原始数据类型，是任意类型的子类型，可以赋值给其他任意类型不报错
var p = undefined;
var c = null;
var p1 = undefined;
var c1 = null;
// 联合类型,取多种类型中的一个
var myFavoriteNumber;
myFavoriteNumber = 1234;
myFavoriteNumber = '1234';
// 当ts能够确认值的类型时ok
console.log(myFavoriteNumber.length);
var tom = {
    name: 'Tom',
    age: 25,
    gender: 'male'
};
