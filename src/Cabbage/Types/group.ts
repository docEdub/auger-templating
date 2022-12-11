
import { Widget } from './widget';

import { Css } from '../../Utility/css';
import { cssFrame, CssFrame } from '../../Utility/cssFrame';
import { cssLength, CssLength } from '../../Utility/cssLength';

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
        this._padding.fill(0);
        if (!json) {
            return;
        }
        if (json.padding) {
            this.padding = json.padding;
        }
        if (json.paddingTop) {
            this.paddingTop = json.paddingTop;
        }
        if (json.paddingLeft) {
            this.paddingLeft = json.paddingLeft;
        }
        if (json.paddingBottom) {
            this.paddingBottom = json.paddingBottom;
        }
        if (json.paddingRight) {
            this.paddingRight = json.paddingRight;
        }
    }

    public get padding(): Array<number> {
        return this._padding;
    }

    public set padding(value: cssFrame) {
        this._padding = CssFrame.AsNumberArray(value, this.parent?.width, this.parent?.height);
    }

    public get paddingTop(): number {
        return this._padding[Css.Top];
    }

    public set paddingTop(value: cssLength) {
        this._padding[Css.Top] = CssLength.AsNumber(value, this.parent?.height);
    }

    public get paddingLeft(): number {
        return this._padding[Css.Left];
    }

    public set paddingLeft(value: cssLength) {
        this._padding[Css.Left] = CssLength.AsNumber(value, this.parent?.width);
    }

    public get paddingBottom(): number {
        return this._padding[Css.Bottom];
    }

    public set paddingBottom(value: cssLength) {
        this._padding[Css.Bottom] = CssLength.AsNumber(value, this.parent?.height);
    }

    public get paddingRight(): number {
        return this._padding[Css.Right];
    }

    public set paddingRight(value: cssLength) {
        this._padding[Css.Right] = CssLength.AsNumber(value, this.parent?.width);
    }

    public get layout() {
        return this._layout;
    }

    public set layout(value: GroupLayout) {
        this._layout = value;
    }

    public get children() {
        return this._children;
    }

    public hasChild(child: Widget) {
        return this._children?.indexOf(child) !== -1;
    }

    public addChild(child: Widget) {
        if (!child) {
            return;
        }
        if (this.hasChild(child)) {
            return;
        }
        this._children.push(child);
        child.parent = this;
    }

    public removeChild(child: Widget) {
        if (!child) {
            return;
        }
        if (!this.hasChild(child)) {
            return;
        }
        const i = this._children.indexOf(child);
        this._children.splice(i, 1);
        child.parent = null;
    }

    private _padding = new Array<number>(4);
    private _layout = GroupLayout.None;
    private _children = new Array<Widget>;
}

if (global.testing) {
    global.Group = Group;
}
