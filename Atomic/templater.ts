"use strict";

class Atomic<T> {
    private fn:()=>T;

    private id:number;
    private value:T;

    constructor(val?:any) {
        this.id = ++Atomic.counter;

        if (val && val.constructor === Function) {
            var temp = Atomic.prevLastCalled;
            Atomic.prevLastCalled = Atomic.lastCalled;
            Atomic.lastCalled = this;
            this.fn = val;
            this.value = val();
            Atomic.lastCalled = Atomic.prevLastCalled;
            Atomic.prevLastCalled = temp;
        }
        else {
            this.value = val;
        }
    }

    private static counter = 0;
    private static prevLastCalled:Atomic<any> = null;
    private static lastCalled:Atomic<any> = null;

    get get():T {
        var ff = Atomic.lastCalled;
        if (ff) {
            if (!this.slaves) {
                this.slaves = {};
            }

            this.slaves[ff.id] = ff;
            if (!ff.deps) {
                ff.deps = {};
            }

            ff.deps[this.id] = this;
        }

        return this.value;
    }

    set set(val:T) {
        this.value = val;
        this.update(false);
    }

    private slaves:{[index: number]: Atomic<any>};
    private deps:{[index: number]: Atomic<any>};
    private listeners:Array<(value:T)=>void>;

    addListener(fn:(value:T)=>void) {
        if (!this.listeners) {
            this.listeners = [];
        }
        var id = this.listeners.length;
        this.listeners[id] = fn;
        fn["$id"] = id;
    }

    removeListener(fn:(value:T)=>void) {
        this.listeners[fn["$id"]] = null;
    }

    private update(calcThisVal) {
        if (calcThisVal) {
            this.value = this.fn();
        }

        for (var i in this.slaves) {
            this.slaves[i].update(true);
        }

        if (this.listeners) {
            for (i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i]) {
                    this.listeners[i](this.value);
                }
            }
        }

    }

}

window['ANumber'] = Atomic;
window['AString'] = Atomic;
window['ABool'] = Atomic;
window['ADate'] = Atomic;
declare class ANumber extends Atomic<number> {}
declare class AString extends Atomic<string> {}
declare class ABool extends Atomic<boolean> {}
declare class ADate extends Atomic<Date> {}

class AList<T> {
    length = 0;

    constructor(values?:T[]) {
        if (values) {
            for (var i = 0; i < values.length; i++) {
                this[i] = values[i];
            }
            this.length = values.length;
        }
    }

    add(value:T) {
        this[this.length++] = value;
        this.onChange('added', this.length - 1);
    }

    set set(array:T[]) {
        for (var i = 0; i < array.length; i++) {
            this[i] = array[i];
        }
        for (var i = array.length; i < this.length; i++) {
            this[i] = null;
        }
        this.length = array.length;
        this.onChange('setted');
    }

    setItem(item:number, value:T) {
        this[item] = value;
        if (this.length < item) {
            this.length = item + 1;
        }
        this.onChange('updated', item);
    }

    push(value:T) {
        this[this.length++] = value;
        this.onChange('added', this.length - 1);
    }

    get(item:number):T {
        return this[item];
    }

    remove(item:number) {

    }

    splice() {

    }

    slice() {
    }

    map(fn:(val:T, item:number)=>any, split:any) {
        var newArray = [];
        for (var i = 0, len = this.length; i < len; i++) {
            newArray.push(fn(this[i], i));
            if (split && i + 1 < len) {
                newArray.push(split);
            }
        }
        return newArray;
    }

    private onChange(event:string, item?:number) {
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i]) {
                this.listeners[i](event, item);
            }
        }
    }

    private listeners = [];

    addListener(fn:(event:string, value:T)=>void) {
        var id = this.listeners.length;
        this.listeners[id] = fn;
        fn["$id"] = id;
    }

    removeListener(fn:(event:string, value:T)=>void) {
        this.listeners[fn["$id"]] = null;
    }

}

function render(node, tree) {
    if (tree.length && tree.constructor !== String) {
        for (var j = 0; j < tree.length; j++) {
            render(node, tree[j]);
        }
    }
    else if (tree.domNode) {
        node.appendChild(tree.domNode);
        if (tree.children) {
            for (var i = 0; i < tree.children.length; i++) {
                render(tree.domNode, tree.children[i]);
            }
        }
    }
    else {
        render(node, text(tree));
    }
}

function text(text) {
    var domNode;
    if (text.constructor === Function) {
        var atom = new Atomic<string>(text);
        domNode = document.createTextNode(atom.get || '');
        atom.addListener(function () {
            domNode.textContent = atom.get || '';
        });
    }
    else {
        domNode = document.createTextNode(text || '');
    }
    return {domNode: domNode};
}

function $a(tagExpr:string, attrs?:{[key: string]: string}, ...children:any[]) {
    var tag = '';
    var className = '';
    var lastDot = -1;
    var len = tagExpr.length;
    for (var i = 0; i < len + 1; i++) {
        if (i === len || tagExpr[i] === '.') {
            if (lastDot == -1) {
                tag = tagExpr.substring(0, i);
            }
            else {
                className += tagExpr.substring(lastDot + 1, i);
                if (i != len) {
                    className += ' ';
                }
            }
            lastDot = i;
        }
    }
    var domNode = document.createElement(tag);
    if (!attrs && className) {
        attrs = {className: className};
    }

    if (attrs) {
        for (var key in attrs) {
            domNode[key] = attrs[key];
        }
    }
    return {domNode: domNode, attrs: attrs, children: children};
}



