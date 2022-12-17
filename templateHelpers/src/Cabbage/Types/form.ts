import { Group } from "./group";

import { Output } from "../Utility/output";

export class Form extends Group {
    constructor(json: any) {
        super(json);
    }

    public output(): string {
        let output = ``;
        output += this.commentOutput();
        output += `form`;
        // We use json.width and json.height because the widget's width and height may have been changed by padding.
        output += ` size(${this.json.width}, ${this.json.height})`
        output += super.preOutput();
        output += Output.Optional(`caption`, this.json['name']);
        output += Output.Optional(`pluginId`, this.json['id']);
        output += ` guiMode("queue")`;
        output +=   super.postOutput();
        return output;
    }
}
