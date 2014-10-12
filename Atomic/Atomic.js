function getValue() {

	/*var ff = getValue;
	 while ((ff = ff.caller) && !ff.$id) {
	 //            console.dir(ff);
	 }*/
	var ff = Atomic.lastCalled;
//        console.log(this.value, "depends on", ff && ff.$id);
	if (ff) {
		if (!this.slaves) {
			this.slaves = {};
		}
		//if (!this.slaves[ff.$id])
		this.slaves[ff.$id] = ff;
		if (!ff.deps) {
			ff.deps = {};
		}

		ff.deps[this.$id] = this;
	}

	return this.value;
}

function afterUpdate(callback) {
	if (!this.listeners) {
		this.listeners = [];
	}
	this.listeners.push(callback);
}


function update() {
	this.value = arguments.length ? arguments[0] : this();
	for (var i in this.slaves) {
		this.slaves[i].update();
	}

	if (this.listeners) {
		for (i = 0; i < this.listeners.length; i++) {
			this.listeners[i](this.value, arguments[0]);
		}
	}
}

function destroy() {
	this.slave = [];
	if (this.deps) {
		for (var i = 0; i < this.deps.length; i++) {
			var dep = this.deps[i];
			dep.slaves[this.$id] = null;
		}
		this.deps = null;
	}
}

Atomic.prototype.valueOf = getValue;
Atomic.prototype.update = update;
Atomic.prototype.afterUpdate = afterUpdate;
Atomic.prototype.toString = afterUpdate;


function Atomic(valueFn, parentAtom) {
	if (valueFn.constructor === Function) {
//    valueFn.toString = getValue;
		var temp = Atomic.prevLastCalled;
		Atomic.prevLastCalled = Atomic.lastCalled;
		Atomic.lastCalled = valueFn;

		valueFn.$id = ++Atomic.counter;
		valueFn.value = valueFn();
		valueFn.valueOf = getValue;
		valueFn.update = update;
		valueFn.afterUpdate = afterUpdate;

		Atomic.lastCalled = Atomic.prevLastCalled;
		Atomic.prevLastCalled = temp;
		if (parentAtom && parentAtom.constructor === Atomic) {
			valueFn.parent = parentAtom;
		}

		return valueFn;
	}
	else {
		this.value = valueFn;
		this.$id = ++Atomic.counter;
		this.valueOf = getValue;
		this.update = update;
		if (parentAtom && parentAtom.constructor === Atomic) {
			this.parent = parentAtom;
		}
		this.afterUpdate = afterUpdate;
	}

}
Atomic.counter = 0;