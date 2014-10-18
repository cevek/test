/// <reference path="all.ts"/>
module wrike {
    export class List extends Component {
        activeTask = new ATask(new Task());

        tasks:Task[] = [];

        constructor(attrs?:IAttrs) {
            super(attrs);
            for (var i = 0; i < 1000; i++) {
                this.tasks.push(new Task({id: i, summary: "Task #" + i, description: "Description " + i}));
            }
        }

        template() {
            return ag.$('div.list', null,
                new TaskList(null, this.tasks, this.activeTask),
                new TaskFull(null, this.activeTask));
        }
    }
}


