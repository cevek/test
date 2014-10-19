/// <reference path="all.ts"/>
module wrike {
    export class TaskFull extends Component {
        constructor(attrs:IAttrs, private task:ATask) {
            super(attrs);
        }

        setComplete() {
            this.task.get().completed.set(!this.task.get().completed.get());
        }

        template() {

            return Arg.dom('div.full-task', null, [
                Arg.dom('div.id', null, 'ID: ', ()=>this.task.get().id),
                Arg.dom('div.summary', null, 'Summary: ', ()=>this.task.get().summary),
                Arg.dom('div.description', null, 'Description: ', ()=>this.task.get().description),
                Arg.dom('label', null,
                    Arg.dom('input', {
                        type: "checkbox",
                        checked: new Arg.Atomic(v=>this.task.get().completed.get()),
                        onclick: this.setComplete.bind(this)
                    }),
                    v=>this.task.get().completed.get() ? 'Completed' : 'Complete'
                ),
                Arg.map(new Arg.Atomic(v=>this.task.get().subtasks), subtask=>
                    new TaskItem(null, new ATask(subtask), this.task))
            ])
        }

    }
}

