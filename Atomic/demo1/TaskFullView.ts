/// <reference path="all.ts"/>
module wrike {
    export class TaskFullView extends Component {
        task:Task;

        private static singleton:TaskFullView;

        static getSingleton(attrs?:IAttrs, task?:Task) {
            return TaskFullView.singleton || (TaskFullView.singleton = new TaskFullView(attrs, task));
        }

        constructor(attrs:IAttrs, task?:Task) {
            super(attrs);
            this.task = task;
        }

        updateTask(task:Task) {
            this.task = task;
        }
    }
}
