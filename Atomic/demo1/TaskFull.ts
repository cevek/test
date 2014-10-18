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

            return ag.$('div.full-task', null, [
                ag.$('div.id', null, 'ID: ', ()=>this.task.get().id),
                ag.$('div.summary', null, 'Summary: ', ()=>this.task.get().summary),
                ag.$('div.description', null, 'Description: ', ()=>this.task.get().description),
                ag.$('label', null,
                    ag.$('input', {
                        type: "checkbox",
                        checked: new ag.Atomic(()=> this.task.get().completed.get()),
                        onclick: this.setComplete.bind(this)
                    }),
                    ()=> this.task.get().completed.get() ? 'Completed' : 'Complete'
                )
            ])
        }

    }
}
