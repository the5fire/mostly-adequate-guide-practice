var _ = require('ramda');

// 1. 通过局部调用（partial apply）移除所有参数

var words = function(str) {
    console.log('be called');
    return _.split(' ', str);
}

// 1. anwser
var words = _.split(' ');
console.log(words('test test'));


// 1a. 使用 `map` 创建一个新的 `words` 函数，使之能够操作字符串数组
var sentences = undefined;

// 1a. answer
var sentences = _.map(words)
console.log(sentences(['test', ' ', 'ddd', 'ddd ddd']));


// 2. 通过局部调用（partial apply）移除所有参数
var filterQs = function(xs) {
    return _.filter(function(x){return match(/q/i, x); }, xs);
}

// 2. answer
var filterQs = _.filter(function(x) {return match(/q/i, x); });

// 3. 使用帮助函数 `_keepHighest` 重构 `max` 使之成为 curry 函数
// 无须改动:
var _keepHighest = function(x,y){ return x >= y ? x : y; };

//重构这段代码:
var max = function(items) {
    return _.reduce(function(acc, item) {
        return _keepHighest(acc, item);
    }, -Infinity, items);
}

// 3. answer
var max = _.reduce(function(acc, x) { return _keepHighest(acc, x); }, -Infinity)

console.log(max([1, 2, 3, 5555, 2, 5, 6]));


// 彩蛋 1
// 包裹数组的 `slice` 函数使之成为 curry 函数
//[1,2,3].slice(0, 2)
var slice = undefined;

// 彩蛋 1. answer
var slice = _.curry(function(start, end, xs) {return xs.slice(start, end);});

// 彩蛋 2
// 借助 `slice` 定义一个 `take` curry 函数，接受 n 个元素为参数。
var take = undefined;

// 菜单 2.answer
var take = _.curry(function(start, end, xs) {_.slice(start, end, xs);});
