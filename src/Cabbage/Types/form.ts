import { Widget } from "./widget";

export class Form extends Widget {
    constructor(json: any) {
        super(json);
        this._json = json;
    }

    public output(): string {
        const json = this._json;
        let output = "";
        output += `form`;
        output += ` size(${this.width}, ${this.height})`
        output +=   super.output();
        output += ` caption("${json.name}")`;
        output += ` pluginId("${json.id}")`;
        output += `\n`;
        return output;
    }

    private _json: any = null;
}
