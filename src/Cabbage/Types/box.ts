
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

    public set x(value: number | string) {
        if (typeof value == "number") {
            this._x = value as number;
        }
        else if (typeof value == "string") {
            const stringValue = value as string;
            if (stringValue.endsWith("px")) {
                this._x = Number.parseFloat(stringValue.replace("px", "")) || 0;
            }
            else if (stringValue.endsWith("%")) {
                const percentage = (Number.parseFloat(stringValue.replace("%", "")) || 0) / 100;
                this._x = percentage * this._parent?.width || 0;
            }
            else {
                this._x = Number.parseFloat(stringValue) || 0;
            }
        }
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: number | string) {
        if (typeof value == "number") {
            this._y = value as number;
        }
        else if (typeof value == "string") {
            const stringValue = value as string;
            if (stringValue.endsWith("px")) {
                this._y = Number.parseFloat(stringValue.replace("px", "")) || 0;
            }
            else if (stringValue.endsWith("%")) {
                const percentage = (Number.parseFloat(stringValue.replace("%", "")) || 0) / 100;
                this._y = percentage * this._parent?.height || 0;
            }
            else {
                this._y = Number.parseFloat(stringValue) || 0;
            }
        }
    }

    public get width(): number {
        return this._width;
    }

    public set width(value: number | string) {
        if (typeof value == "number") {
            this._width = value as number;
        }
        else if (typeof value == "string") {
            const stringValue = value as string;
            if (stringValue.endsWith("px")) {
                this._width = Number.parseFloat(stringValue.replace("px", "")) || 0;
            }
            else if (stringValue.endsWith("%")) {
                if (!this._parent) {
                    this._width = 0;
                    return;
                }
                const percentage = (Number.parseFloat(stringValue.replace("%", "")) || 0) / 100;
                this._width = percentage * this._parent?.width || 0;
            }
            else {
                this._width = Number.parseFloat(stringValue) || 0;
            }
        }
    }

    public get height(): number {
        return this._height;
    }

    public set height(value: number | string) {
        if (typeof value == "number") {
            this._height = value as number;
        }
        else if (typeof value == "string") {
            const stringValue = value as string;
            if (stringValue.endsWith("px")) {
                this._height = Number.parseFloat(stringValue.replace("px", "")) || 0;
            }
            else if (stringValue.endsWith("%")) {
                const percentage = (Number.parseFloat(stringValue.replace("%", "")) || 0) / 100;
                this._height = percentage * this._parent?.height || 0;
            }
            else {
                this._height = Number.parseFloat(stringValue) || 0;
            }
        }
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
