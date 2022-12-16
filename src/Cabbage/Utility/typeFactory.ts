
import { IWidgetFactory } from "../../Interfaces/IWidgetFactory";

import { Label } from "../Types/label";
import { Widget } from "../Types/widget";

export class TypeFactory {
    constructor(widgetFactory: IWidgetFactory) {
        this._widgetFactory = widgetFactory;
    }

    public get types(): Array<Widget> {
        return this._types;
    }

    public addTypes(json: any) {

    }

    public create(typeName: string): Widget {
        return null;
    }

    private _types: Array<Widget> = new Array<Widget>;
    private _widgetFactory: IWidgetFactory = null;
}
