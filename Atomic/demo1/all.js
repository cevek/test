var ag;
(function (ag) {
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
            if (fn['_inAtoms']) {
                if (fn['_inAtoms'][this.id]) {
                    return;
                }
            }
            else {
                fn['_inAtoms'] = {};
            }
            fn['_inAtoms'][this.id] = this;
            this.listeners.push(fn);
        };
        Atomic.prototype.removeListener = function (fn) {
            if (this.listeners) {
                var i = this.listeners.indexOf(fn);
                if (i > -1) {
                    this.listeners[i] = null;
                }
            }
        };
        Atomic.prototype.update = function (calcThisVal) {
            if (calcThisVal) {
                var temp = Atomic.prevLastCalled;
                Atomic.prevLastCalled = Atomic.lastCalled;
                Atomic.lastCalled = this;
                this.value = this.fn();
                Atomic.lastCalled = Atomic.prevLastCalled;
                Atomic.prevLastCalled = temp;
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
    ag.Atomic = Atomic;
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
    ag.AList = AList;
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
            array.addListener && array.addListener(function (event, item) {
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
    function prepareStyleProperty(prop, value) {
        if (value === +value && (prop === 'height' || prop === 'width' || prop === 'top' || prop === 'left')) {
            return value + 'px';
        }
        return value;
    }
    function applyStyle(node, styles) {
        for (var i in styles) {
            if (styles[i].constructor === Function) {
                var atom = new Atomic(styles[i]);
                node.style[i] = prepareStyleProperty(i, atom.get());
                atom.addListener(function (newVal) {
                    node.style[i] = prepareStyleProperty(i, newVal);
                });
            }
            else {
                node.style[i] = prepareStyleProperty(i, styles[i]);
            }
        }
    }
    function applyClassSet(node, cls, classSet) {
        var className = cls;
        for (var i in classSet) {
            var val = classSet[i];
            if (classSet[i].constructor === Function) {
                classSet[i] = new Atomic(classSet[i]);
                classSet[i].addListener(function () {
                    applyClassSet(node, cls, classSet);
                });
            }
            if (classSet[i].constructor === Atomic) {
                val = classSet[i].get();
            }
            if (val) {
                className += ' ' + i;
            }
        }
        node.className = className;
    }
    function renderTag(node, tree, nodeBefore) {
        tree.domNode = document.createElement(tree.tag);
        if (tree.attrs) {
            for (var key in tree.attrs) {
                if (key === "style") {
                    applyStyle(tree.domNode, tree.attrs.style);
                    continue;
                }
                if (key === 'classSet') {
                    applyClassSet(tree.domNode, tree.attrs.className, tree.attrs.classSet);
                    continue;
                }
                if (tree.attrs[key].constructor === Atomic) {
                    tree.domNode[key] = tree.attrs[key].get();
                    tree.attrs[key].addListener(function (key) {
                        tree.domNode[key] = tree.attrs[key].get();
                    }.bind(this, key));
                    continue;
                }
                tree.domNode[key] = tree.attrs[key];
            }
        }
        node.insertBefore(tree.domNode, nodeBefore);
        var childrenLen = tree.children.length;
        if (childrenLen == 1 && tree.children[0].constructor !== Array) {
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
                console.log("textNode", textNode);
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
        if (tree instanceof wrike.Component) {
            render(node, tree.template());
            return;
        }
        text(node, tree, nodeBefore);
    }
    ag.render = render;
    function text(node, text, nodeBefore) {
        var domNode;
        if (text.constructor === Function) {
            var atom = new Atomic(text);
            text.atom = atom;
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
        if (className) {
            if (obj.attrs) {
                obj.attrs.className = className;
            }
            else {
                obj.attrs = { className: className };
            }
        }
    }
    function $(tagExpr, attrs) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        var obj = { tag: '', domNode: null, attrs: attrs, children: children };
        prepareTag(tagExpr, obj);
        return obj;
    }
    ag.$ = $;
    function map(array, fn, split) {
        if (split === void 0) { split = ''; }
        return { tag: 'map', attrs: null, $map: array, $split: split, fn: fn, children: null };
    }
    ag.map = map;
})(ag || (ag = {}));
var wrike;
(function (wrike) {
    var Component = (function () {
        function Component(attrs) {
        }
        Component.prototype.afterRender = function () {
        };
        Component.prototype.template = function () {
        };
        return Component;
    })();
    wrike.Component = Component;
})(wrike || (wrike = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wrike;
(function (wrike) {
    var ATask = (function (_super) {
        __extends(ATask, _super);
        function ATask() {
            _super.apply(this, arguments);
        }
        return ATask;
    })(ag.Atomic);
    wrike.ATask = ATask;
    var Task = (function () {
        function Task(obj) {
            if (obj === void 0) { obj = {}; }
            this.assignee = null;
            this.subtasks = [];
            this.comments = [];
            this.height = 30;
            this.top = 0;
            this.completed = new ag.Atomic(false);
            this.id = obj.id;
            this.summary = obj.summary;
            this.description = obj.description;
        }
        return Task;
    })();
    wrike.Task = Task;
})(wrike || (wrike = {}));
var wrike;
(function (wrike) {
    var List = (function (_super) {
        __extends(List, _super);
        function List(attrs) {
            _super.call(this, attrs);
            this.activeTask = new wrike.ATask(new wrike.Task());
            this.tasks = [];
            for (var i = 0; i < 1000; i++) {
                this.tasks.push(new wrike.Task({ id: i, summary: "Task #" + i, description: "Description " + i }));
            }
        }
        List.prototype.template = function () {
            return ag.$('div.list', null, new wrike.TaskList(null, this.tasks, this.activeTask), new wrike.TaskFull(null, this.activeTask));
        };
        return List;
    })(wrike.Component);
    wrike.List = List;
})(wrike || (wrike = {}));
var wrike;
(function (wrike) {
    var TaskList = (function (_super) {
        __extends(TaskList, _super);
        function TaskList(attrs, tasks, activeTask) {
            _super.call(this, attrs);
            this.tasks = tasks;
            this.activeTask = activeTask;
            this.visibleTaskAtoms = [];
            this.reUseItemsCount = 20;
            this.allDur = 0;
            this.allDurLen = 0;
            this.allHeight = new ag.Atomic(0);
            for (var i = 0; i < this.reUseItemsCount; i++) {
                this.visibleTaskAtoms[i] = new wrike.ATask();
            }
            var h = 0;
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                h += 40;
            }
            this.allHeight.set(h);
            this.onScroll(null);
            setInterval(function () {
            }, 1000);
        }
        TaskList.prototype.afterRender = function () {
        };
        TaskList.prototype.onScroll = function (e) {
            var scrollTop = 0;
            if (e) {
                scrollTop = e.srcElement.scrollTop;
            }
            var k = scrollTop / 40 | 0;
            var start = performance.now();
            for (var i = 0; i < this.reUseItemsCount; i++) {
                var task = this.tasks[k + i];
                task.top = (k + i) * 40;
                this.visibleTaskAtoms[i].set(task);
                this.allDurLen++;
            }
            this.allDur += performance.now() - start;
        };
        TaskList.prototype.template = function () {
            var _this = this;
            return ag.$('div.tasklist', { onscroll: this.onScroll.bind(this) }, ag.$('div.wrapper', { style: { height: function () { return _this.allHeight.get(); } } }, ag.map(this.visibleTaskAtoms, function (taskAtom) { return new wrike.TaskItem(null, taskAtom, _this.activeTask); })));
        };
        return TaskList;
    })(wrike.Component);
    wrike.TaskList = TaskList;
})(wrike || (wrike = {}));
var wrike;
(function (wrike) {
    var TaskItem = (function (_super) {
        __extends(TaskItem, _super);
        function TaskItem(attrs, task, activeTask) {
            _super.call(this, attrs);
            this.attrs = attrs;
            this.task = task;
            this.activeTask = activeTask;
        }
        TaskItem.prototype.clickTask = function () {
            this.activeTask.set(this.task.get());
        };
        TaskItem.prototype.template = function () {
            var _this = this;
            return ag.$('div.task', {
                onclick: this.clickTask.bind(this),
                classSet: {
                    active: function () { return _this.activeTask.get() === _this.task.get(); },
                    completed: function () { return _this.task.get().completed.get(); }
                },
                style: {
                    top: function () { return _this.task.get().top; }
                }
            }, ag.$('div.summary', null, function () { return _this.task.get().summary; }));
        };
        return TaskItem;
    })(wrike.Component);
    wrike.TaskItem = TaskItem;
})(wrike || (wrike = {}));
var wrike;
(function (wrike) {
    var TaskFull = (function (_super) {
        __extends(TaskFull, _super);
        function TaskFull(attrs, task) {
            _super.call(this, attrs);
            this.task = task;
        }
        TaskFull.prototype.setComplete = function () {
            this.task.get().completed.set(!this.task.get().completed.get());
        };
        TaskFull.prototype.template = function () {
            var _this = this;
            return ag.$('div.full-task', null, [
                ag.$('div.id', null, 'ID: ', function () { return _this.task.get().id; }),
                ag.$('div.summary', null, 'Summary: ', function () { return _this.task.get().summary; }),
                ag.$('div.description', null, 'Description: ', function () { return _this.task.get().description; }),
                ag.$('label', null, ag.$('input', {
                    type: "checkbox",
                    checked: new ag.Atomic(function () { return _this.task.get().completed.get(); }),
                    onclick: this.setComplete.bind(this)
                }), function () { return _this.task.get().completed.get() ? 'Completed' : 'Complete'; })
            ]);
        };
        return TaskFull;
    })(wrike.Component);
    wrike.TaskFull = TaskFull;
})(wrike || (wrike = {}));
var wrike;
(function (wrike) {
    var User = (function () {
        function User() {
        }
        return User;
    })();
    wrike.User = User;
})(wrike || (wrike = {}));
var wrike;
(function (wrike) {
    var File = (function () {
        function File() {
        }
        return File;
    })();
    wrike.File = File;
})(wrike || (wrike = {}));
var wrike;
(function (wrike) {
    var Comment = (function () {
        function Comment() {
        }
        return Comment;
    })();
    wrike.Comment = Comment;
})(wrike || (wrike = {}));
var wrike;
(function (wrike) {
    ag.render(document.body, new wrike.List());
})(wrike || (wrike = {}));
//# sourceMappingURL=all.js.map