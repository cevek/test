module wrike {
    export interface IAttrs {
        onClick?: (e:MouseEvent)=>void;
    }
    export class Component {
        domEl:HTMLElement;

        constructor(attrs:IAttrs) {
        }

        afterRender() {
        }

        template() {
        }
    }
}