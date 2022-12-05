import { Box } from "./box";

export class Form extends Box {
    constructor(json: any) {
        super(json);
        this._json = json;
    }

    public output(): string {
        const json = this._json;
        let output = "";
        output += `<label>${json.name}</label>\n`;
        output += super.output();
        return output;
    }

    private _json: any = null;
}
