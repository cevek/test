/// <reference path="all.ts"/>
module wrike {
    export class TaskItem extends Component {

        constructor(private attrs:any, private task:ATask, private activeTask:ATask) {
            super(attrs);
        }

        clickTask() {
            this.activeTask.set(this.task.get());
        }

        template() {
            return ag.$('div.task', {
                    onclick: this.clickTask.bind(this),
                    classSet: {
                        active: ()=>this.activeTask.get() === this.task.get(),
                        completed: ()=>this.task.get().completed.get()
                    },
                    style: {
                        //height: ()=>this.task.get().height,
                        top: ()=>this.task.get().top
                    }
                },
                //ag.$('div.id', null, ()=>this.task.get().id),
                ag.$('div.summary', null, ()=>this.task.get().summary)
                //ag.$('div.description', null, ()=>this.task.get().description),
                /*
                 ag.$('div.subtasks', null,
                 ag.map<Task>(this.task.get().subtasks, task=>
                 new TaskItemView(null, new ag.Atomic<Task>(task)))),
                 */

                /*
                 ag.$('div.comments', null,
                 ag.map<Comment>(this.task.get().comments, comment=>
                 ag.$('div.comment', null, comment.author)))
                 */
            );
        }
    }
}





