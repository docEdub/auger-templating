
import { cssNumber, CssNumber } from '../../Utility/cssNumber';

export class Box {
    constructor(json: any) {
        if (!json) {
            return;
        }
        this.x = json.x;
        this.y = json.y;
        this.width = json.width;
        this.height = json.height;
    }

    public get x(): number {
        return this._x;
    }

    public set x(value: cssNumber) {
        this._x = CssNumber.AsNumber(value, this._parent?.width);
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: cssNumber) {
        this._y = CssNumber.AsNumber(value, this._parent?.width);
    }

    public get width(): number {
        return this._width;
    }

    public set width(value: cssNumber) {
        this._width = CssNumber.AsNumber(value, this._parent?.width);
    }

    public get height(): number {
        return this._height;
    }

    public set height(value: cssNumber) {
        this._height = CssNumber.AsNumber(value, this._parent?.width);
    }

    public output(): string {
        // NB: We don't output x, y, width, or height because the format varies between form boxes and widget boxes.
        return "";
    }

    protected _setParent(parent: Box) {
        if (this._parent == parent) {
            return;
        }
        if (this._parent) {
            this._parent._removeChild(this);
        }
        this._parent = parent;
        this._parent?._addChild(this);
    }

    protected _hasChild(child: Box) {
        return this._children?.indexOf(child) !== -1;
    }

    protected _addChild(child: Box) {
        if (!child) {
            return;
        }
        if (this._hasChild(child)) {
            return;
        }
        this._children.push(child);
        child._setParent(this);
    }

    protected _removeChild(child: Box) {
        if (!child) {
            return;
        }
        child._parent = null;
        if (!this._hasChild(child)) {
            return;
        }
        const i = this._children.indexOf(child);
        this._children.splice(i, 1);
    }

    protected _parent: Box = null;
    protected _children = new Array<Box>;
    private _x = 0
    private _y = 0
    private _width = 0
    private _height = 0
}

if (global.testing) {
    global.Box = Box;
}
