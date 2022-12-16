
import { Form } from "../Types/form";
import { Group } from "../Types/group";
import { Label } from "../Types/label";
import { Widget } from "../Types/widget";

export class WidgetFactory {
    public create(json: any, type?: string): Widget {
        if (!type) {
            type = json?.type;
        }
        if (!type) {
            type = `form`;
        }
        return this.createWidget(type, json);
    }

    public addTypes(json: any) {
        if (!Array.isArray(json)) {
            throw new Error(`Given json is not an array`);
        }
        for (let i = 0; i < json.length; i++) {
            const item = json[i];
            const typeName = item['type'];
            if (!typeName) {
                throw new Error(`No 'type' key found`);
            }
            if (!item['baseType']) {
                throw new Error(`No 'baseType' key found`);
            }
            this._typeMap[typeName] = item;
        }
    }

    public createType(typeName: string): Widget {
        return null;
    }

    public createWidget(type: string, json: any, parent: Group = null): Widget {
        if (!json) {
            json = {};
        }
        switch (type) {
            case `form`: return this.createFormWidget(json);
            case `group`: return this.createGroupWidget(json, parent);
            case `label`: return new Label(json, parent);
        }
        return null;
    }

    private createFormWidget(json: any): Form {
        const form = new Form(json);
        this.createChildWidgets(form, json.children);
        return form;
    }

    private createGroupWidget(json: any, parent: Group = null): Group {
        const group = new Group(json, parent);
        this.createChildWidgets(group, json.children);
        return group;
    }

    private createChildWidgets(group: Group, json: any): void {
        if (!json) {
            return;
        }
        if (!Array.isArray(json)) {
            throw new Error(`Given json is not an array`);
        }
        for (let i = 0; i < json.length; i++) {
            const childJson = json[i];
            const child = this.createWidget(childJson.type, childJson, group);
            group.addChild(child);
        }
    }

    private _typeMap = new Map<string, any>;
}
