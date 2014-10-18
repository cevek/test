var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wrike;
(function (wrike) {
    var TaskFullView = (function (_super) {
        __extends(TaskFullView, _super);
        function TaskFullView(attrs, task) {
            _super.call(this, attrs);
            this.task = task;
        }
        TaskFullView.prototype.template = function () {
            var _this = this;
            return ag.$('div.full-task', null, [
                ag.$('div.id', null, 'ID: ', function () { return _this.task.get().id; }),
                ag.$('div.summary', null, 'Summary: ', function () { return _this.task.get().summary; }),
                ag.$('div.description', null, 'Description: ', function () { return _this.task.get().description; }),
            ]);
        };
        return TaskFullView;
    })(wrike.Component);
    wrike.TaskFull = TaskFullView;
})(wrike || (wrike = {}));
//# sourceMappingURL=TaskFullView.js.map