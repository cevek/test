/// <reference path="all.ts"/>
module wrike {
    export class Task {
        id:number;
        summary:string;
        description:string;
        assignee:User;
        subtasks:Task[];
        comments: Comment[];
    }
}
