/// <reference path="all.ts"/>
module wrike {
    export class TaskItemView extends Component {
        task:Task;

        constructor(attrs:IAttrs, task?:Task) {
            super(attrs);
            this.task = task;
        }

        updateTask(task:Task) {
            this.task = task
        }

        template() {
            return ag.$('div.task', null, [
                ag.$('div.id', ()=>this.task.id),
                ag.$('div.summary', ()=>this.task.summary),
                ag.$('div.description', ()=>this.task.description),
                ag.$('div.subtasks',
                    ag.map(this.task.subtasks, (task:Task)=>
                        new TaskListView(task))),
                ag.$('div.comments',
                    ag.map(this.task.comments, (comment:Comment)=>
                        ag.$('div', comment.author)))
            ]);
        }
    }
}

