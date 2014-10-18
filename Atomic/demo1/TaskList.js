var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wrike;
(function (wrike) {
    var TaskListView = (function (_super) {
        __extends(TaskListView, _super);
        function TaskListView(attrs, tasks, activeTask) {
            _super.call(this, attrs);
            this.tasks = tasks;
            this.activeTask = activeTask;
            this.reUseItemsCount = 10;
            for (var i = 0; i < this.reUseItemsCount; i++) {
                this.visibleTaskAtoms.push(new wrike.ATask());
            }
        }
        TaskListView.prototype.afterRender = function () {
            this.domEl.addEventListener('scroll', this.onScroll.bind(true));
        };
        TaskListView.prototype.onScroll = function (e) {
            console.log(e);
            for (var i = 0; i < this.reUseItemsCount; i++) {
                var task = this.tasks[Math.random() * this.tasks.length | 0];
                this.visibleTaskAtoms[i].set(task);
            }
        };
        TaskListView.prototype.template = function () {
            return ag.$('div.tasklist', null, ag.map(this.visibleTaskAtoms, function (taskAtom) { return new wrike.TaskItem(null, taskAtom); }));
        };
        return TaskListView;
    })(wrike.Component);
    wrike.TaskList = TaskListView;
})(wrike || (wrike = {}));
//# sourceMappingURL=TaskListView.js.map