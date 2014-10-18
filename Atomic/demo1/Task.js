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
            this.id = obj.id;
            this.summary = obj.summary;
            this.description = obj.description;
        }
        return Task;
    })();
    wrike.Task = Task;
})(wrike || (wrike = {}));
//# sourceMappingURL=Task.js.map