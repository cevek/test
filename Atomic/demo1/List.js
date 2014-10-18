var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wrike;
(function (wrike) {
    var List = (function (_super) {
        __extends(List, _super);
        function List(attrs) {
            _super.call(this, attrs);
            this.tasks = [];
            for (var i = 0; i < 100; i++) {
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
//# sourceMappingURL=List.js.map