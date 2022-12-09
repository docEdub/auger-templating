
import { cssUnit, CssUnit } from '../../Utility/cssUnit';

export class Box {
    constructor(json: any) {
        this.x = json.x;
        this.y = json.y;
        this.width = json.width;
        this.height = json.height;
    }

    public get x(): number {
        return this._x;
    }

    public set x(value: cssUnit) {
        this._x = CssUnit.AsNumber(value, this._parent?.width);
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: cssUnit) {
        this._y = CssUnit.AsNumber(value, this._parent?.width);
    }

    public get width(): number {
        return this._width;
    }

    public set width(value: cssUnit) {
        this._width = CssUnit.AsNumber(value, this._parent?.width);
    }

    public get height(): number {
        return this._height;
    }

    public set height(value: cssUnit) {
        this._height = CssUnit.AsNumber(value, this._parent?.width);
    }

    public output(): string {
        // NB: We don't output x, y, width, or height because the format varies between form boxes and widget boxes.
        return "";
    }

    private _parent: Box = null;
    private _children: Array<Box> = null;
    private _x: number = 0
    private _y: number = 0
    private _width: number = 0
    private _height: number = 0
}

if (global.testing) {
    global.Box = Box;
}
