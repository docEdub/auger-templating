
import { Box } from './box';
import { Form } from './form';

export class Widget extends Box {
    constructor(json: any) {
        super(json);
    }

    public get parent(): Form | Widget {
        return this._parent.constructor == Form.constructor ? this._parent as Form : this._parent as Widget;
    }

    public set parent(widget: Form | Widget) {
        this._setParent(widget);
    }

    public get children() {
        return this._children as Array<Widget>;
    }
}
