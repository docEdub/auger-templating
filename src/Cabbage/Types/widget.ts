
import { Box } from './box';
import { Group } from './group';

export class Widget extends Box {
    constructor(json: any) {
        super(json);
    }

    public get parent(): Group {
        return this._parent as Group;
    }

    public set parent(widget: Group) {
        this._setParent(widget);
    }

    public get children() {
        return this._children as Array<Widget>;
    }
}

if (global.testing) {
    global.Widget = Widget;
}
