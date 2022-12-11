import { Form } from "../Types/form";
import { Group } from "../Types/group";
import { Widget } from "../Types/widget";

export class WidgetFactory {
    public create(json: any): Form {
        return this.createWidget(`form`, json?.form) as Form;
    }

    private createWidget(type: string, json: any): Widget {
        if (!json) {
            json = {};
        }
        switch (type) {
            case `form`: return this.createFormWidget(json);
            case `group`: return this.createGroupWidget(json);
        }
        return null;
    }

    private createFormWidget(json: any): Form {
        const form = new Form(json);
        this.createChildWidgets(form, json.children);
        return form;
    }

    private createGroupWidget(json: any): Group {
        const group = new Group(json);
        this.createChildWidgets(group, json.children);
        return group;
    }

    private createChildWidgets(group: Group, json: any): void {
        if (!json) {
            return;
        }
        if (!Array.isArray(json)) {
            throw new Error(`WidgetFactory.createChildWidgets json is not an array`);
        }
        for (let i = 0; i < json.length; i++) {
            const childJson = json[i];
            const child = this.createWidget(childJson.type, childJson);
            group.addChild(child);
        }
    }
}

if (global.testing) {
    global.WidgetFactory = WidgetFactory;
}
