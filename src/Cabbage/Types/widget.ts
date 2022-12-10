
import { Box } from './box';

export class Widget extends Box {
    constructor(json: any) {
        super(json);
    }

    public get parent(): Widget {
        return this._parent as Widget;
    }

    public set parent(widget: Widget) {
        this._setParent(widget);
    }

    public get children() {
        return this._children as Array<Widget>;
    }
}

if (global.testing) {
    global.Widget = Widget;
}
