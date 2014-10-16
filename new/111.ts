class Atom <T> {
    private value:T;
    private owner:Object;
    private displayName:string;

    constructor(defaultValue?:T, owner?:Object, displayName?:string) {
        /*this.value = defaultValue;
         this.owner = owner;
         this.displayName = displayName;*/

    }

    get():T {
        return this.value;
    }

    set(val:T) {
        this.value = val;
    }
}
class AtomHelper {
    static atomized = false;

    constructor() {
        if (this.constructor["atomized"]) {
            return;
        }
        this.constructor["atomized"] = true;
        var proto = this.constructor.prototype;
        var keys = Object.keys(proto);
        keys.forEach((key) => {
            var descr = Object.getOwnPropertyDescriptor(proto, key);
            var atomKey = key + '$';
            var oldAtom = proto[key];
            if (descr.get && oldAtom.constructor === Atom) {
                var defaultValue = oldAtom.get();
                Object.defineProperty(proto, key, {
                    get: ()=> {
                        if (this[atomKey])
                            return this[atomKey];
                        else
                            return this[atomKey] = new Atom(defaultValue);
                    }
                });
            }
        });
    }
}
class A extends AtomHelper {
    get updated() {return new Atom<string>('asdfasfd')}

    get b() {return new Atom<string>('asdfaf')}

    get c() {return new Atom<string>('sadfasdf')}

    get d() {return new Atom<string>('asdfsa')}

    get e() {return new Atom<string>('sdfasdf')}

    get f() {return new Atom<string>('asdfasf')}

    get g() {return new Atom<string>('sadffasdg')}


    constructor() {
        super();
    }

}


//new A().updated.get();

class B {
    updated = new Atom<string>('asdfasfd')
    a = new Atom<string>('asdfasfd')
    b = new Atom<string>('asdfasfd')
    c = new Atom<string>('asdfasfd')
    d = new Atom<string>('asdfasfd')
    e = new Atom<string>('asdfasfd')
    f = new Atom<string>('asdfasfd')
    g = new Atom<string>('asdfasfd')

    constructor(private value:string) {

    }
}

class A1 {
    bbb() {}
}

class A2 {
    bbb() {}
}

class A33 {
    bbb() {}
}

var a1 = new A1();
a1.bbb();

var a2 = new A2();
a2.bbb();

var a3 = new A33();
a3.bbb();


console.time('perf');
var a = new A();
var b = new B('Hsfafasfd');
for (var i = 0; i < 1000000; i++) {
    b.a.get();
    //a.updated.get();
    //a.b.get();
    //new B('1231');
    //new A();
    //var cc = b.a;
}

console.timeEnd('perf');

