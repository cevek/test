/// <reference path="all.ts"/>
module wrike {
    export class TaskListView extends Component {
        tasks:Task[];
        reUseTaskViews:TaskItemView[];
        reUseTaskViewsCount = 10;
        private static singleton:TaskListView;

        static getSingleton(attrs?:IAttrs, tasks?:Task[]) {
            return TaskListView.singleton || (TaskListView.singleton = new TaskListView(attrs, tasks));
        }

        constructor(attrs:IAttrs, tasks?:Task[]) {
            super(attrs);
            this.tasks = tasks;
            for (var i = 0; i < this.reUseTaskViewsCount; i++) {
                var taskItemView = new TaskItemView({
                    onClick: this.taskClick.bind(this)
                });
                this.reUseTaskViews.push(taskItemView);
            }                                                                                      2
        }

        updateTasks(tasks:Task[]) {
            this.tasks = tasks;
        }

        taskClick(task:Task) {
            TaskFullView.getSingleton().updateTask(task);
        }

        afterRender() {
            this.domEl.addEventListener('scroll', this.onScroll.bind(this));
        }

        onScroll() {
            for (var i = 0; i < this.reUseTaskViewsCount; i++) {
                var task = this.tasks[Math.random() * this.tasks.length | 0];
                this.reUseTaskViews[i].updateTask(task);
            }
        }

        template() {
            return ag.$('div.tasklist', ag.map(this.reUseTaskViews, (taskView:Task)=>taskView))
        }
    }
}