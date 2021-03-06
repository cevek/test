/// <reference path="all.ts"/>
module wrike {
    export class ATask extends Arg.Atomic<Task> {}
    export class Task {
        id:number;
        summary:string;
        description:string;
        assignee:User = null;
        subtasks:Task[] = [];
        comments:Comment[] = [];
        height = 30;
        top = 0;

        completed = new Arg.Atomic(false);

        constructor(obj:any = {}) {
            this.id = obj.id;
            this.summary = obj.summary;
            this.description = obj.description;
        }
    }

}


