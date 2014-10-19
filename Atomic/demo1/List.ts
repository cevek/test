/// <reference path="all.ts"/>
module wrike {
    export class List extends Component {
        activeTask = new ATask(new Task());

        tasks:Task[] = [];

        constructor(attrs?:IAttrs) {
            super(attrs);
            for (var i = 0; i < 1000; i++) {

                var task = new Task({id: i, summary: "Task #" + i, description: "Description " + i});
                for (var j = 0; j < 10; j++) {
                    task.subtasks.push(new Task({
                        id: 10000 + i + j,
                        summary: "Task #" + 10000 * i + j,
                        description: "Description " + 10000 * i + j
                    }));
                }
                this.tasks.push(task);
            }
        }

        template() {
            return Arg.dom('div.list', null,
                new TaskList(null, this.tasks, this.activeTask),
                new TaskFull(null, this.activeTask));
        }
    }
}


