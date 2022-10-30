
export class Widget {
    public get width() {
        return this._width;
    }

    public set width(value: Number) {
        this._width = value;
    }

    public get height() {
        return this._height;
    }

    public set height(value: Number) {
        this._height = value;
    }

    private _width: Number = 0;
    private _height: Number = 0;
}
