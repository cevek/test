/// <reference path="all.ts"/>
module wrike {
    export class List {
        activeTask:Task;

        constructor() {
        }

        template() {
            ag.render(TaskListView.getSingleton(), TaskFullView.getSingleton());
        }
    }
}

