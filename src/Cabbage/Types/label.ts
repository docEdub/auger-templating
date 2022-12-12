
import { Group } from "./group";
import { Widget } from "./widget";

import { Output } from "../Utility/output";

export class Label extends Widget {
    constructor(json, parent: Group = null) {
        super(json, parent);
    }

    public preOutput(indent: string = ``): string {
        let output = ``;
        output += `${indent}label`
        output += super.preOutput();
        return output;
    }

    public postOutput(indent: string = ``): string {
        let output = ``;
        output += super.postOutput();
        output += Output.Optional(`text`, this.json['text']);
        output += Output.Optional(`fontColour`, this.json['color']);
        output += Output.Optional(`corners`, this.json['corner-radius'], 0);
        output += `\n`;
        return output;
    }
}

if (global.testing) {
    global.Label = Label;
}
