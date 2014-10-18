function Atomize(obj) {
    console.log("Atomize", obj);
    if (obj.props) {
        return;
    }
    var code = obj.toString();
    var regexp = /this.(\w+) = Att/g;
    var res = null;
    var props = {};
    obj.props = [];
    while (res = regexp.exec(code)) {
        void function (key) {
            var atomKey = key + '$';
            console.log(key);
            var atom = new Atomic();
            function setter(val) {
                if (val !== AttO) {
                    if (!this[atomKey]) {
                        this[atomKey] = new Atomic();
                    }
                    this[atomKey].value = val;
                }
                else {
                    this.$id = ++Atomic.counter;
                }
            }
            function getter() {
                if (!this[atomKey]) {
                    this[atomKey] = new Atomic();
                }
                return this[atomKey].value;
            }
            props[key] = {
                enumerable: true,
                configurable: false,
                get: getter,
                set: setter
            };
            obj.props.push(key);
        }(res[1]);
    }
    Object.defineProperties(obj.prototype, props);
    return true;
}
var AttO = {};
function Att(val) {
    return AttO;
}
var AB = (function () {
    function AB() {
        this.name = Att();
        this.firstName = Att();
        this.lastName = Att();
        this.a = Att();
        this.b = Att();
        this.c = Att();
        this.d = Att();
        this.e = Att();
        this.f = Att();
        this.g = Att();
    }
    AB.atomized = Atomize(AB);
    return AB;
})();
function test() {
    console.time('perf');
    var a = new AB();
    for (var i = 0; i < 1000000; i++) {
        new AB();
    }
    console.timeEnd('perf');
}
test();
var ab1 = new AB();
var ab2 = new AB();
//# sourceMappingURL=tester.js.map