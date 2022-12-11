
import { Box } from './box';
import { Group } from './group';

import { cssMatte, CssMatte } from '../../Utility/cssMatte';

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

    public get margin() {
        return this._margin;
    }

    public set margin(value: cssMatte) {
        this._margin = CssMatte.AsNumberArray(value, this.width, this.height);
    }

    private _margin = new Array<number>(4);
}

if (global.testing) {
    global.Widget = Widget;
}
