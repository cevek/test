"use strict";
var Atomic = (function () {
    function Atomic(obj, key) {
    }
    Atomic.prototype.get = function () {
        return this.value;
    };
    Atomic.prototype.set = function (val) {
        this.value = val;
    };
    return Atomic;
})();
function ab(obj, key) {
    if (!obj[key])
        obj[key] = new Atomic();
    return obj[key].value;
}
var Atom = function (val) {
    return val;
};
var A = (function () {
    function A() {
        this.a = Atom('Hello');
    }
    A.atomized = Atomizer(A);
    return A;
})();
function Atomizer(fn) {
    var code = fn.toString();
    var reg = /this.(\w+) = Atom/g;
    var m;
    while (m = reg.exec(code)) {
        var key = m[1];
        console.log(key);
        var props = {
            enumerable: true,
            get: new Function("if (!this.$" + key + ") this.$" + key + " = new Atomic(); return this.$" + key + ".get()"),
            set: new Function("val", "if (val === Atom) return; if (!this.$" + key + ") this.$" + key + " = new Atomic(); this.$" + key + ".value = val")
        };
        Object.defineProperty(fn.prototype, key, props);
    }
}
var p = [];
function test() {
    console.time('perf');
    var a = new A();
    for (var i = 0; i < 1000000; i++) {
        p[i] = new A();
    }
    console.timeEnd('perf');
}
var a = new A();
var b = new A();
console.log(a.a, b.a);
test();
//# sourceMappingURL=test.js.map