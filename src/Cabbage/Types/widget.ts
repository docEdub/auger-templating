
import { Group } from './group';

import { Css } from '../../Utility/css';
import { cssFrame, CssFrame } from '../../Utility/cssFrame';
import { cssLength, CssLength } from '../../Utility/cssLength';

export class Widget {
    constructor(json: any) {
        this._position.fill(0);
        this._margin.fill(0);
        if (!json) {
            return;
        }
        if (json.position) {
            this.position = json.position;
        }
        if (json.top) {
            this.top = json.top;
        }
        if (json.left) {
            this.left = json.left;
        }
        if (json.bottom) {
            this.bottom = json.bottom;
        }
        if (json.right) {
            this.right = json.right;
        }
        if (json.height) {
            this.height = json.height;
        }
        if (json.width) {
            this.width = json.width;
        }
        if (json.margin) {
            this.margin = json.margin;
        }
        if (json.marginTop) {
            this.marginTop = json.marginTop;
        }
        if (json.marginLeft) {
            this.marginLeft = json.marginLeft;
        }
        if (json.marginBottom) {
            this.marginBottom = json.marginBottom;
        }
        if (json.marginRight) {
            this.marginRight = json.marginRight;
        }
    }

    public get parent(): Group {
        return this._parent;
    }

    public set parent(parent: Group) {
        if (this._parent == parent) {
            return;
        }
        if (this._parent) {
            this._parent.removeChild(this);
        }
        this._parent = parent;
        this._parent?.addChild(this);
    }

    public get position() {
        return this._position;
    }

    public set position(value: cssFrame) {
        this._position = CssFrame.AsNumberArray(value, this.parent?.width, this.parent?.height);
        this._isHeightSet = false;
        this._isWidthSet = false;
    }

    public get top(): number {
        return this._position[Css.Top];
    }

    public set top(value: cssLength) {
        const top = CssLength.AsNumber(value, this.parent?.height);
        if (this._isHeightSet) {
            this._position[Css.Bottom] = top + this.height;
        }
        this._position[Css.Top] = top;
    }

    public get left(): number {
        return this._position[Css.Left];
    }

    public set left(value: cssLength) {
        const left = CssLength.AsNumber(value, this.parent?.width);
        if (this._isWidthSet) {
            this._position[Css.Right] = left + this.width;
        }
        this._position[Css.Left] = left;
    }

    public get bottom(): number {
        return this._position[Css.Bottom];
    }

    public set bottom(value: cssLength) {
        const bottom = CssLength.AsNumber(value, this.parent?.height);
        if (this._isHeightSet) {
            this._position[Css.Top] = bottom - this.height;
        }
        this._position[Css.Bottom] = bottom;
    }

    public get right(): number {
        return this._position[Css.Right];
    }

    public set right(value: cssLength) {
        const right = CssLength.AsNumber(value, this.parent?.width);
        if (this._isWidthSet) {
            this._position[Css.Left] = right - this.width;
        }
        this._position[Css.Right] = right;
    }

    public get height(): number {
        return this.bottom - this.top;
    }

    public set height(value: cssLength) {
        this.bottom = this.top + CssLength.AsNumber(value);
        this._isHeightSet = true;
    }

    public get width(): number {
        return this.right - this.left;
    }

    public set width(value: cssLength) {
        this.right = this.left + CssLength.AsNumber(value);
        this._isWidthSet = true;
    }

    public get margin() {
        return this._margin;
    }

    public set margin(value: cssFrame) {
        this._margin = CssFrame.AsNumberArray(value, this.parent?.width, this.parent?.height);
    }

    public get marginTop(): number {
        return this._margin[Css.Top];
    }

    public set marginTop(value: cssLength) {
        this._margin[Css.Top] = CssLength.AsNumber(value, this.parent?.height);
    }

    public get marginLeft(): number {
        return this._margin[Css.Left];
    }

    public set marginLeft(value: cssLength) {
        this._margin[Css.Left] = CssLength.AsNumber(value, this.parent?.width);
    }

    public get marginBottom(): number {
        return this._margin[Css.Bottom];
    }

    public set marginBottom(value: cssLength) {
        this._margin[Css.Bottom] = CssLength.AsNumber(value, this.parent?.height);
    }

    public get marginRight(): number {
        return this._margin[Css.Right];
    }

    public set marginRight(value: cssLength) {
        this._margin[Css.Right] = CssLength.AsNumber(value, this.parent?.width);
    }

    public output(): string {
        // NB: We don't output x, y, width, or height because the format varies between form boxes and widget boxes.
        return "";
    }

    private _parent: Group = null;
    private _position = new Array<number>(4);
    private _margin = new Array<number>(4);

    private _isHeightSet = false;
    private _isWidthSet = false;
}

if (global.testing) {
    global.Widget = Widget;
}
