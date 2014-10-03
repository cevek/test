var Atom = (function () {
    function Atom(valueFn) {
        var deps = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            deps[_i] = arguments[_i + 1];
        }
        this.valueFn = valueFn;
        this.deps = deps;
        this.slaves = [];
        for (var i = 0; i < deps.length; i++) {
            deps[i].slaves.push(this);
        }
        this.value = valueFn.apply(this, deps);
    }
    Atom.prototype.refresh = function () {
        this.value = this.valueFn.apply(this, this.deps);
        for (var i = 0; i < this.slaves.length; i++) {
            var slave = this.slaves[i];
            slave.refresh();
        }
    };

    Atom.prototype.setValue = function (value) {
        this.value = value;
        for (var i = 0; i < this.slaves.length; i++) {
            var slave = this.slaves[i];
            slave.refresh();
        }
        return value;
    };

    /* toString() {
    return this.valueFn(this.deps);
    }*/
    Atom.prototype.getValue = function () {
        return this.valueFn.apply(this, this.deps);
    };
    return Atom;
})();


//var g = {a: Atomic(()=>'hello'), b: Atomic(()=>'boom')};
//var d = Atomic(()=>g.a + g.b);
var count = 1000000;

var u = [Atomic(function (v) {
        return 1;
    })];
var aa = Atomic(function (v) {
    return 1;
});
var ab = Atomic(function (v) {
    return aa + 10;
});
aa.setValue(100);
console.log(ab);

var model = {
    firstName: Atomic('Anton'),
    lastName: Atomic('Kamolov')
};

var ff;

function changed(val) {
    console.log("VALUE", val);
}
function span(s, fn) {
    fn = Atomic(fn);
    changed(fn);
    fn.afterUpdate = changed;
}

span('', function (v) {
    return model.firstName + ' ' + model.lastName;
});

function start() {
    gc();

    //    console.profile('AA0');
    console.time('AA0');

    for (var i = 1; i < count; i++) {
        u[i] = Atomic(function (v) {
            return u[0] + 1;
        });
    }

    console.timeEnd('AA0');

    //    console.profileEnd('AA0');
    gc();
}

//start();
function start_plain() {
    console.time('AA');

    var c = [0];
    for (var i = 1; i < count; i++) {
        c[i] = c[i - 1] + 1;
    }
    console.timeEnd('AA');
}

function start_obj() {
    console.time('AA');
    var a = [new Atom(function () {
            return 0;
        })];
    for (var i = 1; i < count; i++) {
        a[i] = new Atom(function (g) {
            return g.value + 1;
        }, a[i - 1]);
    }
    console.timeEnd('AA');
}
//# sourceMappingURL=123.js.map
