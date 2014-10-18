/// <reference path="all.ts"/>
module wrike {
    export class TaskList extends Component {
        private visibleTaskAtoms:ATask[] = [];
        private reUseItemsCount = 20;
        private allDur = 0;
        private allDurLen = 0;
        allHeight = new ag.Atomic<number>(0);

        constructor(attrs:IAttrs, private tasks:Task[], private activeTask?:ATask) {
            super(attrs);
            for (var i = 0; i < this.reUseItemsCount; i++) {
                this.visibleTaskAtoms[i] = new ATask();
            }

            var h = 0;
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                h += 40;
            }
            this.allHeight.set(h);

            this.onScroll(null);
            setInterval(()=> {
                //console.log("Perfomance", this.allDurLen, this.allDur / this.allDurLen);

                /*
                 this.allDur = 0;
                 this.allDurLen = 0;
                 */
            }, 1000);
        }

        /*
         updateTasks(tasks:Task[]) {
         this.tasks = tasks;
         }

         taskClick(task:Task) {
         //TaskFullView.updateTask(task);
         }*/

        afterRender() {
            //this.domEl.addEventListener('scroll', this.onScroll.bind(true));
        }

        onScroll(e:UIEvent) {
            var scrollTop = 0;
            if (e) {
                scrollTop = e.srcElement.scrollTop;
            }

            var k = scrollTop / 40 | 0;

            var start = performance.now();
            for (var i = 0; i < this.reUseItemsCount; i++) {
                var task = this.tasks[k + i];
                //task.height = Math.random() * 100 | 0;
                task.top = (k + i) * 40;
                this.visibleTaskAtoms[i].set(task);
                this.allDurLen++;
            }
            this.allDur += performance.now() - start;

        }



        template() {
            return ag.$('div.tasklist', {onscroll: this.onScroll.bind(this)},
                ag.$('div.wrapper', {style: {height: ()=>this.allHeight.get()}},
                    ag.map<ATask>(this.visibleTaskAtoms, taskAtom=>
                        new TaskItem(null, taskAtom, this.activeTask))))
        }
    }
}


