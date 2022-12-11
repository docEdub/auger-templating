
import { Group } from './group';

import { Css } from '../../Utility/css';
import { cssFrame, CssFrame } from '../../Utility/cssFrame';
import { cssNumber, CssNumber } from '../../Utility/cssNumber';

export class Widget {
    constructor(json: any) {
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

    public set top(value: cssNumber) {
        const top = CssNumber.AsNumber(value, this.parent?.height);
        if (this._isHeightSet) {
            this._position[Css.Bottom] = top + this.height;
        }
        this._position[Css.Top] = top;
    }

    public get left(): number {
        return this._position[Css.Left];
    }

    public set left(value: cssNumber) {
        const left = CssNumber.AsNumber(value, this.parent?.width);
        if (this._isWidthSet) {
            this._position[Css.Right] = left + this.width;
        }
        this._position[Css.Left] = left;
    }

    public get bottom(): number {
        return this._position[Css.Bottom];
    }

    public set bottom(value: cssNumber) {
        const bottom = CssNumber.AsNumber(value, this.parent?.height);
        if (this._isHeightSet) {
            this._position[Css.Top] = bottom - this.height;
        }
        this._position[Css.Bottom] = bottom;
    }

    public get right(): number {
        return this._position[Css.Right];
    }

    public set right(value: cssNumber) {
        const right = CssNumber.AsNumber(value, this.parent?.width);
        if (this._isWidthSet) {
            this._position[Css.Left] = right - this.width;
        }
        this._position[Css.Right] = right;
    }

    public get height(): number {
        return this.bottom - this.top;
    }

    public set height(value: cssNumber) {
        this.bottom = this.top + CssNumber.AsNumber(value);
        this._isHeightSet = true;
    }

    public get width(): number {
        return this.right - this.left;
    }

    public set width(value: cssNumber) {
        this.right = this.left + CssNumber.AsNumber(value);
        this._isWidthSet = true;
    }

    public get margin() {
        return this._margin;
    }

    public set margin(value: cssFrame) {
        this._margin = CssFrame.AsNumberArray(value, this.parent?.width, this.parent?.height);
    }

    public set marginTop(value: cssNumber) {
        this._margin[Css.Top] = CssNumber.AsNumber(value, this.parent?.height);
    }

    public set marginLeft(value: cssNumber) {
        this._margin[Css.Left] = CssNumber.AsNumber(value, this.parent?.width);
    }

    public set marginBottom(value: cssNumber) {
        this._margin[Css.Bottom] = CssNumber.AsNumber(value, this.parent?.height);
    }

    public set marginRight(value: cssNumber) {
        this._margin[Css.Right] = CssNumber.AsNumber(value, this.parent?.width);
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
