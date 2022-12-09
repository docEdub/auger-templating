
import { Widget } from './widget';

export class Group extends Widget {
    constructor(json: any) {
        super(json);
    }

    public addChild(child: Widget) {
        this._addChild(child);
    }

    public removeChild(child: Widget) {
        this._removeChild(child);
    }
}
