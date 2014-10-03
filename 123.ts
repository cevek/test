class Atom<T> {
    private slaves:Atom<any>[] = [];
    value:T;

    constructor(private valueFn:{(...deps:Atom<any>[]):T}, ...private deps:Atom<T>[]) {
        for (var i = 0; i < deps.length; i++) {
            deps[i].slaves.push(this);
        }
        this.value = valueFn.apply(this, deps);
    }

    refresh() {
        this.value = this.valueFn.apply(this, this.deps);
        for (var i = 0; i < this.slaves.length; i++) {
            var slave = this.slaves[i];
            slave.refresh();
        }
    }

    setValue(value:T):T {
        this.value = value;
        for (var i = 0; i < this.slaves.length; i++) {
            var slave = this.slaves[i];
            slave.refresh();
        }
        return value;

    }

    /* toString() {
     return this.valueFn(this.deps);
     }*/

    getValue():T {
        return this.valueFn.apply(this, this.deps);
    }
}
/*


 function getVVVValue() {
 console.log(getVVVValue.caller, this);
 return this.value;
 }

 function setValue(value) {
 this.value = value;
 for (var i = 0; i < this.slaves.length; i++) {
 this.slaves[i].update();
 }
 }

 function update() {
 this.value = this();
 for (var i = 0; i < this.slaves.length; i++) {
 this.slaves[i].update();
 }
 }

 function Atomic2(valueFn, ...deps) {
 //valueFn.deps = deps;
 for (var i = 0; i < deps.length; i++) {
 deps[i].slaves.push(valueFn);
 }
 valueFn.slaves = [];
 valueFn.value = valueFn();
 valueFn.toString = getVVVValue;
 valueFn.valueOf = getVVVValue;
 valueFn.setValue = setValue;
 valueFn.update = update;
 return valueFn;
 }
 */


declare function Atomic(...a):any

//var g = {a: Atomic(()=>'hello'), b: Atomic(()=>'boom')};
//var d = Atomic(()=>g.a + g.b);


var count = 1000000;


var u = [Atomic(v=>1)];
var aa = Atomic(v=>1);
var ab = Atomic(v=>aa + 10);
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

span('', v=>model.firstName + ' ' + model.lastName);



function start() {
    gc();
//    console.profile('AA0');
    console.time('AA0');

    for (var i = 1; i < count; i++) {
        u[i] = Atomic(v=>u[0] + 1);
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
    var a:Atom<any>[] = [new Atom(()=>0)];
    for (var i = 1; i < count; i++) {
        a[i] = new Atom<number>((g:Atom<number>)=>g.value + 1, a[i - 1]);
    }
    console.timeEnd('AA');
}








