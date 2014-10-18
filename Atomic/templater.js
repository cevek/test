"use strict";
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Atomic = (function () {
    function Atomic(val) {
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
    Atomic.prototype.get = function () {
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
    };
    Atomic.prototype.set = function (val) {
        this.value = val;
        this.update(false);
    };
    Atomic.prototype.addListener = function (fn) {
        if (!this.listeners) {
            this.listeners = [];
        }
        var id = this.listeners.length;
        this.listeners[id] = fn;
        fn["$id"] = id;
    };
    Atomic.prototype.removeListener = function (fn) {
        this.listeners[fn["$id"]] = null;
    };
    Atomic.prototype.update = function (calcThisVal) {
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
    };
    Atomic.createGetters = function (obj) {
        var keys = Object.keys(obj);
        var properties = {};
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key[0] === '$') {
                properties[key.substring(1)] = {
                    get: Atomic.prototype.get.bind(obj[key]),
                    set: Atomic.prototype.set.bind(obj[key]),
                    enumerable: true,
                    configurable: true
                };
                properties[key] = {
                    enumerable: false,
                    configurable: false,
                    writable: false
                };
            }
            if (obj[key].constructor === AList) {
                properties[key] = {
                    enumerable: true,
                    configurable: false,
                    writable: false
                };
            }
        }
        Object.defineProperties(obj, properties);
    };
    Atomic.counter = 0;
    Atomic.prevLastCalled = null;
    Atomic.lastCalled = null;
    return Atomic;
})();
window['ANumber'] = Atomic;
window['AString'] = Atomic;
window['ABool'] = Atomic;
window['ADate'] = Atomic;
var AList = (function () {
    function AList(values) {
        this.length = 0;
        this.listeners = [];
        if (values) {
            for (var i = 0; i < values.length; i++) {
                this[i] = values[i];
            }
            this.length = values.length;
        }
    }
    AList.prototype.add = function (value) {
        this[this.length++] = value;
        this.onChange('added', this.length - 1);
    };
    Object.defineProperty(AList.prototype, "set", {
        set: function (array) {
            for (var i = 0; i < array.length; i++) {
                this[i] = array[i];
            }
            for (var i = array.length; i < this.length; i++) {
                this[i] = null;
            }
            this.length = array.length;
            this.onChange('setted');
        },
        enumerable: true,
        configurable: true
    });
    AList.prototype.setItem = function (item, value) {
        this[item] = value;
        if (this.length < item) {
            this.length = item + 1;
        }
        this.onChange('updated', item);
    };
    AList.prototype.push = function (value) {
        this[this.length++] = value;
        this.onChange('added', this.length - 1);
    };
    AList.prototype.get = function (item) {
        return this[item];
    };
    AList.prototype.remove = function (item) {
    };
    AList.prototype.splice = function () {
    };
    AList.prototype.slice = function () {
    };
    AList.prototype.map = function (fn, split) {
        var newArray = [];
        for (var i = 0, len = this.length; i < len; i++) {
            newArray.push(fn(this[i], i));
            if (split && i + 1 < len) {
                newArray.push(split);
            }
        }
        return newArray;
    };
    AList.prototype.onChange = function (event, item) {
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i]) {
                this.listeners[i](event, item);
            }
        }
    };
    AList.prototype.addListener = function (fn) {
        var id = this.listeners.length;
        this.listeners[id] = fn;
        fn["$id"] = id;
    };
    AList.prototype.removeListener = function (fn) {
        this.listeners[fn["$id"]] = null;
    };
    return AList;
})();
function renderMap(node, tree) {
    tree.domNode = document.createTextNode('');
    node.appendChild(tree.domNode);
    var array = tree.$map;
    if (array) {
        tree.children = [];
        for (var i = 0; i < array.length; i++) {
            tree.children[i] = tree.fn(array[i], i);
            render(node, tree.children[i], tree.domNode);
            if (tree.$split && i > 0) {
                node.insertBefore(document.createTextNode(tree.$split), tree.children[i].domNode);
            }
        }
        array.addListener(function (event, item) {
            if (event === 'added') {
                var val = array.get(item);
                tree.children[item] = tree.fn(val, item);
                render(node, [tree.children.length > 0 ? tree.$split : '', tree.children[item]], item < tree.children.length - 1 ? tree.children[item + 1].domNode : tree.domNode);
                console.log(event, item, val);
            }
        });
    }
}
function walkArray(node, tree) {
    for (var j = 0; j < tree.length; j++) {
        if (tree[j]) {
            render(node, tree[j]);
        }
    }
}
function renderTag(node, tree, nodeBefore) {
    tree.domNode = document.createElement(tree.tag);
    if (tree.attrs) {
        for (var key in tree.attrs) {
            tree.domNode[key] = tree.attrs[key];
        }
    }
    node.insertBefore(tree.domNode, nodeBefore);
    var childrenLen = tree.children.length;
    if (childrenLen == 1) {
        var textNode = tree.children[0];
        if (textNode.constructor === Function) {
            var atom = new Atomic(textNode);
            tree.domNode.textContent = atom.value || '';
            atom.addListener(function () {
                tree.domNode.textContent = atom.value || '';
            });
            return;
        }
        if (!textNode.tag) {
            tree.domNode.textContent = textNode || '';
            return;
        }
    }
    for (var i = 0; i < childrenLen; i++) {
        render(tree.domNode, tree.children[i]);
    }
}
function render(node, tree, nodeBefore) {
    if (nodeBefore === void 0) { nodeBefore = null; }
    if (tree.constructor === Array) {
        walkArray(node, tree);
        return;
    }
    if (tree.$map) {
        renderMap(node, tree);
        return;
    }
    if (tree.tag) {
        renderTag(node, tree, nodeBefore);
        return;
    }
    text(node, tree, nodeBefore);
}
function text(node, text, nodeBefore) {
    var domNode;
    if (text.constructor === Function) {
        var atom = new Atomic(text);
        domNode = document.createTextNode(atom.get() || '');
        atom.addListener(function () {
            domNode.textContent = atom.get() || '';
        });
    }
    else {
        domNode = document.createTextNode(text || '');
    }
    node.insertBefore(domNode, nodeBefore);
}
function prepareTag(tagExpr, obj) {
    var className = '';
    var lastDot = -1;
    var len = tagExpr.length;
    for (var i = 0; i < len + 1; i++) {
        if (i === len || tagExpr[i] === '.') {
            if (lastDot == -1) {
                obj.tag = tagExpr.substring(0, i);
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
    if (!obj.attrs && className) {
        obj.attrs = { className: className };
    }
}
function $a(tagExpr, attrs) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var obj = { tag: '', domNode: null, attrs: attrs, children: children };
    prepareTag(tagExpr, obj);
    return obj;
}
function map(array, fn, split) {
    if (split === void 0) { split = ''; }
    return { tag: 'map', attrs: null, $map: array, $split: split, fn: fn, children: null };
}
var At = (function () {
    function At() {
        if (this.constructor["atomized"]) {
            return;
        }
        this.constructor["atomized"] = true;
    }
    return At;
})();
var FFF = (function () {
    function FFF() {
    }
    return FFF;
})();
var ABC = (function (_super) {
    __extends(ABC, _super);
    function ABC() {
        _super.call(this);
    }
    Object.defineProperty(ABC.prototype, "a", {
        get: function () {
            return new AString;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ABC.prototype, "b", {
        get: function () {
            return new Atomic();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ABC.prototype, "c", {
        get: function () {
            return;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ABC.prototype, "d", {
        get: function () {
            return;
        },
        enumerable: true,
        configurable: true
    });
    return ABC;
})(At);
var abc = new ABC();
//# sourceMappingURL=templater.js.map