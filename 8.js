var _ = require('ramda');

var Container = function(x) {
    this.__value = x;
}

Container.of = function(x) {
    return new Container(x);
}

console.log(Container.of(3));
console.log(Container.of(Container.of(3)));

Container.prototype.map = function(f) {
    return Container.of(f(this.__value));
}

console.log(Container.of(2).map(function(two){ return two + 2; }));


var Maybe = function(x) {
    this.__value = x;
}

Maybe.of = function(x) {
    return new Maybe(x);
}

Maybe.prototype.isNothing = function() {
    return (this.__value === null || this.__value === undefined);
}

Maybe.prototype.map = function(f) {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
}

console.log(Maybe.of("Malkovich Malkovich").map(_.match(/a/ig)));

console.log(Maybe.of(null).map(_.match(/a/ig)));

// 
//
// safeHead :: [a] -> Maybe(a)
var safeHead = function(xs) {
    return Maybe.of(xs[0]);
}

var streetName = _.compose(_.map(_.prop('street')), safeHead, _.prop('addresses'));

console.log(streetName({addresses: []}));

console.log(streetName({addresses: [{street: "shady ln.", number: 4201}]}));


// withdraw :: Number -> Account -> Maybe(Account)
var withdraw = _.curry(function(amount, account) {
    return account.balance >= amount ?
        Maybe.of({balance: account.balance - amount}) :
        Maybe.of(null);
});

var remainingBalance = function() {};
var updateLedger = function() {};

// finishTransaction :: Account -> String
var finishTransaction = _.compose(remainingBalance, updateLedger);

// getTwenty :: Account -> Maybe(String)
var getTwenty = _.compose(_.map(finishTransaction), withdraw(20));

var log = console.log;

log(getTwenty({ balance: 200.00 }));

log(getTwenty({ balance: 10.00 }));


// maybe :: b -> (a -> b) -> Maybe a -> b
var maybe = _.curry(function(x, f, m) {
    return m.isNothing ? x : f(m.__value);
});

// getTwenty :: Account -> String
var getTwenty = _.compose(
    maybe("You're broke!", finishTransaction), withdraw(20)
);
    
log(getTwenty({ balance: 200.00 }));

log(getTwenty({ balance: 10.00 }));


// 纯 错误处理
var Left = function(x) {
    this.__value = x;
}
Left.of = function(x) {
    return new Left(x);
}

Left.prototype.map = function(f) {
    return this;
}

var Right = function(x) {
    this.__value = x;
}
Right.of = function(x) {
    return new Right(x);
}

Right.prototype.map = function(f) {
    return Right.of(f(this.__value));
}


log(Right.of("rain").map(function(str){ return "b"+str; }));

log(Left.of("rain").map(function(str){ return "b"+str}));

log(Right.of({host: 'localhost', port: 80}).map(_.prop('host')));

log(Left.of("rolls eyes...").map(_.prop("host")));


var moment = require('moment');

// getAge :: Date -> User -> Either(String, Number)
var getAge = _.curry(function(now, user) {
    var birthdate = moment(user.birthdate, 'YYYY-MM-DD');
    if (!birthdate.isValid()) return Left.of("Birth date could not be parsed");
    return Right.of(now.diff(birthdate, 'years'));
});

var result = getAge(moment(), {birthdate: '2005-1-1'});
log(result);
var result = getAge(moment(), {birthdate: 'aaaa'});  // 按照书上的例子貌似moment已经能处理了
log(result);

// fortune :: Number -> String
var fortune = _.compose(_.concat("If you survive, you will be "), _.add(1));

// zoltar :: User -> Either(String, _)
var zoltar = _.compose(_.map(console.log), _.map(fortune), getAge(moment()));

var result = zoltar({birthdate: '2005-12-12'});
log(result);

var result = zoltar({birthdate: 'balloons!'});
log(result);

log('==============either===============');

// either :: (a -> c) -> (b -> c) -> Either a b -> c
var either = _.curry(function(f, g, e) {
    switch(e.constructor) {
        case Left: return f(e.__value);
        case Right: return g(e.__value);
    }
});


// zoltar :: User -> _
var zoltar = _.compose(console.log, either(_.identity, fortune), getAge(moment()));

var result = zoltar({birthdate: '2005-12-12'});
log(result);
var result = zoltar({birthdate: 'balloons!'});
log(result);


log('========王老先生=========');

// getFromStorage :: String -> (_ -> String)
var getFromStorage = function(key) {
    return function() {
        return localStorage[key];
    }
}


var IO = function(f) {
    this.__value = f;
}

IO.of = function(x) {
    return new IO(function() {
        return x;
    });
}

IO.prototype.map = function(f) {
    return new IO(_.compose(f, this.__value));
}

/*
// io_window_ :: IO Window
var io_window = new IO(function() { return window; });
io_window.map(function(win) {return win.innerWidth });

io_window.map(_.prop('location')).map(_.prop('href')).map(split('/'));


// $ :: String -> IO [DOM]
var $ = function(selector) {
    return new IO(function() { return document.querySelectorAll(selector); });
}

$('#myDiv').map(head).map(function(div) { return div.innerHTML; });
*/


/// 纯代码库
// url :: IO String
var url = new IO(function() { return 'https://www.the5fire.com?page=1&quer=test'; });

// toPairs :: String -> [[String]]
var toPairs = _.compose(_.map(_.split('=')), _.split('&'));


// params :: String -> [[String]]
var params = _.compose(toPairs, _.last, _.split('?'));

// findParam :: String -> IO Maybe [String]
var findParam = function(key) {
    return _.map(_.compose(Maybe.of, _.filter(_.compose(_.equals(key), _.head)), params), url);
}


// 非纯调用代码

var result = findParam('query').__value();
log(result);
// 上面的纯函数确实很纯，但是findParam理解起来也很费脑
