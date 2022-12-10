
import { cssMatte, CssMatte } from '../../Utility/cssMatte';
import { Widget } from './widget';

enum GroupLayout {
    None = 0,
    LeftToRight,
    TopToBottom,
    RightToLeft,
    BottomToTop
}

export class Group extends Widget {

    constructor(json: any) {
        super(json);
    }

    public get layout() {
        return this._layout;
    }

    public set layout(value: GroupLayout) {
        this._layout = value;
    }

    public get padding() {
        return this._padding;
    }

    public set padding(value: cssMatte) {
        this._padding = CssMatte.AsNumberArray(value, this.width, this.height);
    }

    public addChild(child: Widget) {
        this._addChild(child);
    }

    public removeChild(child: Widget) {
        this._removeChild(child);
    }

    public updateLayout() {
    }

    private _layout = GroupLayout.None;
    private _padding = new Array<number>(4);

    private _doLeftToRightLayout() {
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.children.length; i++) {

        }
    }
}

if (global.testing) {
    global.Group = Group;
}
