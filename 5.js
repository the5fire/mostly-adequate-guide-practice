var R = require('ramda')

var compose = function(f,g) {
    return function(x) {
        return f(g(x));
    };
};

var head = function(x) { 
    console.log(x);
    return x[0]; 
};
var reverse = R.reduce(function(acc, x){ 
    console.log(acc + ', ' + x);
    var result = [x].concat(acc); 
    console.log(result);
    return result;
}, []);
var last = compose(head, reverse);

var l = last(['jumpkick', 'roundhouse', 'uppercut']);
console.log(l);


// pointfree
var toUpperCase = function(x) { return x.toUpperCase(); };
var initials = R.compose(R.join('. '), R.map(R.compose(toUpperCase, head)), R.split(' '));

var i = initials("hunter stockton thompson");
console.log(i);

// 正确做法：每个函数都接受一个实际参数。
var latin = R.compose(R.map(toUpperCase), reverse);

latin(["frog", "eyes"]);


console.log('=================');
/*
 * 练习题
 */

// require('../../support');
var _ = require('ramda');
//var accounting = require('accounting');

// 示例数据
var CARS = [
    {name: "Ferrari FF", horsepower: 660, dollar_value: 700000, in_stock: true},
    {name: "Spyker C12 Zagato", horsepower: 650, dollar_value: 648000, in_stock: false},
    {name: "Jaguar XKR-S", horsepower: 550, dollar_value: 132000, in_stock: false},
    {name: "Audi R8", horsepower: 525, dollar_value: 114200, in_stock: false},
    {name: "Aston Martin One-77", horsepower: 750, dollar_value: 1850000, in_stock: true},
    {name: "Pagani Huayra", horsepower: 700, dollar_value: 1300000, in_stock: false}
];

// 练习1
// 使用 _.compose() 重写下面这个函数。提示：_.prop() 是 curry 函数
var isLastInStock = function(cars) {
    var lastCar = _.last(cars);
    return _.prop('in_stock', lastCar);
}

console.log(isLastInStock(CARS));

// 练习1. Answer
var isLastInStock = _.compose(_.prop('in_stock'), _.last)
console.log(isLastInStock(CARS));

// 练习2
// 使用 _.compose()、_.prop() 和 _.head() 获取第一个 car 的 name
var nameOfFirstCar = undefined;

// 练习2.Answer
var nameOfFirstCar = _.compose(_.prop('name'), _.head)
console.log(nameOfFirstCar(CARS));


// 练习3
// 使用帮助函数 _average 重构 averageDollarValue 使之成为一个组合
var _average = function(xs) { return _.reduce(_.add, 0, xs) / xs.length; };

var averageDollarValue = function(cars) {
    var dollar_values = _.map(function(c) { return c.dollar_value; }, cars);
    return _average(dollar_values);
}

console.log(averageDollarValue(CARS));


// 练习3. Answer
var averageDollarValue = _.compose(_average, _.map(_.prop('dollar_value')));
console.log(averageDollarValue(CARS));


// 练习4
// 使用 compose 写一个 sanitizeNames() 函数，返回一个下划线连接的小写字符串：例如：sanitizeNames(["Hello World"]) //=> ["hello_world"]。
var _underscore = _.replace(/\W+/g, '_')

var sanitizeNames = undefined;

// 练习4.Answer
var sanitizeNames = _.compose(_.map(_underscore), _.map(_.toLower))
console.log(sanitizeNames(["Hello World", "Hi Again"]));


// 彩蛋1
// 使用 compose 重构 availablePrices
var availablePricess = function(cars) {
    var available_cars = _.filter(_.prop('in_stock'), cars);
    return available_cars.map(function(x) {
        //return accounting.formatMoney(x.dollar_value);
        return x.dollar_value;
    }).join(', ');
};

console.log(availablePricess(CARS));

// 彩蛋1.Answer
var availablePricess = _.compose(_.join(', '), _.map(_.prop('dollar_value')), _.filter(_.prop('in_stock')));
console.log(availablePricess(CARS));

// 彩蛋2
// 重构使之成为 pointfree 函数。提示：可以使用 _.flip()
var fastestCar = function(cars) {
    var sorted = _.sortBy(function(car){ return car.horsepower; }, cars);
    var fastest = _.last(sorted);
    return fastest.name + ' is the fastest';
}
console.log(fastestCar(CARS));

// 彩蛋2.Answer
var append = _.flip(_.concat);
var fastestCar = _.compose(append(' is the fastest'), _.prop('name'), _.last, _.sortBy(_.prop('horsepower')));
console.log(fastestCar(CARS));
