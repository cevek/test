var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wrike;
(function (wrike) {
    var TaskItemView = (function (_super) {
        __extends(TaskItemView, _super);
        function TaskItemView(attrs, task) {
            _super.call(this, attrs);
            this.task = task;
        }
        TaskItemView.prototype.template = function () {
            var _this = this;
            return ag.$('div.task', null, [
                ag.$('div.id', null, function () { return _this.task.get().id; }),
                ag.$('div.summary', null, function () { return _this.task.get().summary; }),
                ag.$('div.description', null, function () { return _this.task.get().description; }),
                ag.$('div.comments', null, ag.map(this.task.get().comments, function (comment) { return ag.$('div.comment', null, comment.author); }))
            ]);
        };
        return TaskItemView;
    })(wrike.Component);
    wrike.TaskItem = TaskItemView;
})(wrike || (wrike = {}));
//# sourceMappingURL=TaskItemView.js.map