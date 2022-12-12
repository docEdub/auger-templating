
import { Group } from './group';

import { Output } from '../Utility/output';

import { Css } from '../../Utility/css';
import { cssFrame, CssFrame } from '../../Utility/cssFrame';
import { cssLength, CssLength } from '../../Utility/cssLength';

export class Widget {
    constructor(json: any, parent: Group = null) {
        this.parent = parent;
        this._position.fill(0);
        this._margin.fill(0);
        if (!json) {
            return;
        }
        this._json = json;
        Object.keys(json).forEach((key: string) => {
           json[key] = this.eval(json[key]);
        });
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

    public get type(): string {
        return this._json?.type;
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
        this.bottom = this.top + CssLength.AsNumber(value, this.parent?.height);
        this._isHeightSet = true;
    }

    public get width(): number {
        return this.right - this.left;
    }

    public set width(value: cssLength) {
        this.right = this.left + CssLength.AsNumber(value, this.parent?.width);
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

    public get marginedTop(): number {
        return this._marginedTop;
    }

    public set marginedTop(value: number) {
        this._marginedTop = value;
    }

    public get marginedLeft(): number {
        return this._marginedLeft;
    }

    public set marginedLeft(value: number) {
        this._marginedLeft = value;
    }

    public get marginedBottom(): number {
        return this.top + this.marginedHeight;
    }

    public get marginedRight(): number {
        return this.left + this.marginedWidth;
    }

    public get marginedHeight(): number {
        return this._marginedHeight;
    }

    public set marginedHeight(value: number) {
        this._marginedHeight = value;
    }

    public get marginedWidth(): number {
        return this._marginedWidth;
    }

    public set marginedWidth(value: number) {
        this._marginedWidth = value;
    }

    public get paddingTop(): number {
        return 0;
    }

    public get paddingLeft(): number {
        return 0;
    }

    public get paddingBottom(): number {
        return 0;
    }

    public get paddingRight(): number {
        return 0;
    }

    public isA(Type: any) {
        return Type === this.constructor || Type.isPrototypeOf(this.constructor);
    }

    public updateMarginedProperties() {
        this.marginedTop = this.top + this.marginTop;
        this.marginedLeft = this.left + this.marginLeft;
        this.marginedHeight = this.height + this.marginTop + this.marginBottom;
        this.marginedWidth = this.width + this.marginLeft + this.marginRight;
        if (this.isA(Group)) {
            const group = this as unknown as Group;
            for (let i = 0; i < group.children.length; i++) {
                group.children[i].updateMarginedProperties();
            }
        }
    }

    protected commentOutput(indent: string = ``): string {
        let output = ``;
        const comment = this.json['comment'];
        if (comment) {
            output += `${indent}; ${comment}\n`;
        }
        const comments = this.json['comments'];
        if (comments && Array.isArray(comments)) {
            for (let i = 0; i < comments.length; i++) {
                const comment = comments[i];
                output += `${indent}; ${comment}\n`;
            }
        }
        return output;
    }

    protected preOutput(indent: string = ``): string {
        let output = ``;
        if (this.type !== `form`) {
            output += ` bounds(`
            output +=   `${Output.Rounded(this.marginedLeft)}, `;
            output +=   `${Output.Rounded(this.marginedTop)}, `;
            output +=   `${Output.Rounded(this.width)}, `;
            output +=   `${Output.Rounded(this.height)})`;
        }
        output += Output.Optional(`colour`, this.json['background-color']);
        return output;
    }

    protected postOutput(indent: string = ``): string {
        let output = ``;
        return output;
    }

    public output(indent: string = ``) {
        return `${this.commentOutput(indent)}${this.preOutput(indent)}${this.postOutput(indent)}`;
    }

    protected get json() {
        return this._json;
    }

    protected clearHeightSetAndWidthSetFlags() {
        this._isHeightSet = false;
        this._isWidthSet = false;
    }

    protected eval(value) {
        if (typeof value === `string`) {
            const s = value as string;
            if (s.startsWith(`(`) && s.endsWith(`)`)) {
                return eval(s);
            }
        }
        return value;
    }

    private _json: any = null;

    private _parent: Group = null;
    private _position = new Array<number>(4);
    private _margin = new Array<number>(4);
    private _marginedTop = 0;
    private _marginedLeft = 0;
    private _marginedHeight = 0;
    private _marginedWidth = 0;

    private _isHeightSet = false;
    private _isWidthSet = false;
}

if (global.testing) {
    global.Widget = Widget;
}
