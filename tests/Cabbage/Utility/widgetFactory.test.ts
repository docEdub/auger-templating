
import { Form } from "../../../src/Cabbage/Types/form";

import { WidgetFactory } from "../../../src/Cabbage/Utility/widgetFactory";

const createForm = (jsonString): Form => {
    const widgetFactory = new WidgetFactory;
    return widgetFactory.create(JSON.parse(jsonString).ui) as Form;
}

const createFormWithTypes = (jsonString): Form => {
    const widgetFactory = new WidgetFactory;
    const json = JSON.parse(jsonString);
    widgetFactory.addTypes(json.uiTypes);
    return widgetFactory.create(json.ui) as Form;
}

describe(`WidgetFactory`, () => {
    describe(`create`, () => {
        test(`creates a form when the given json is null`, () => {
            const widgetFactory = new WidgetFactory;
            const form = widgetFactory.create(null);
            expect(form).not.toBeNull();
        });
        test(`creates a form when the given json is undefined`, () => {
            const widgetFactory = new WidgetFactory;
            const form = widgetFactory.create(undefined);
            expect(form).not.toBeNull();
        });
        test(`creates a form when the given json is empty`, () => {
            const widgetFactory = new WidgetFactory;
            const form = widgetFactory.create(JSON.parse(`{}`));
            expect(form).not.toBeNull();
        });
        test(`creates a form with a child`, () => {
            const form = createForm(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group"
                        }
                    ]
                }
            }`);
            expect(form.children.length).toBe(1);
        });
        test(`creates a form with a multiple children`, () => {
            const form = createForm(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group"
                        },
                        {
                            "type": "group"
                        }
                    ]
                }
            }`);
            expect(form.children.length).toBe(2);
        });
        test(`creates a form with a nested children`, () => {
            const form = createForm(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group",
                            "children": [
                                {
                                    "type": "group"
                                },
                                {
                                    "type": "group"
                                }
                            ]
                        }
                    ]
                }
            }`);
            const child = form.children[0];
            expect(child.children.length).toBe(2);
        });
        test(`creates a group`, () => {
            const form = createForm(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group"
                        }
                    ]
                }
            }`);
            const child = form.children[0];
            expect(child.constructor.name).toBe(`Group`);
        });
        test(`creates a label`, () => {
            const form = createForm(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "label"
                        }
                    ]
                }
            }`);
            const child = form.children[0];
            expect(child.constructor.name).toBe(`Label`);
        });
        test(`creates a user defined type widget`, () => {
            const form = createFormWithTypes(`{
                "uiTypes": [
                    {
                        "type": "small-label",
                        "extends": "label",
                        "width": "1px",
                        "height": "2px"
                    }
                ],
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "small-label"
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.constructor.name).toBe(`Label`);
            expect(child0.width).toBe(1);
            expect(child0.height).toBe(2);
        });
        test(`creates a nested user defined type widget that extends a group`, () => {
            const form = createFormWithTypes(`{
                "uiTypes": [
                    {
                        "type": "group-a",
                        "extends": "group",
                        "children": [
                            {
                                "type": "label"
                            }
                        ]
                    }
                ],
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group-a"
                        }
                    ]
                }
            }`);
            const group = form.children[0];
            const child0 = group.children[0];
            expect(group.constructor.name).toBe(`Group`);
            expect(child0.constructor.name).toBe(`Label`);
        });
        test(`creates a user defined type widget with its width and height overridden`, () => {
            const form = createFormWithTypes(`{
                "uiTypes": [
                    {
                        "type": "small-label",
                        "extends": "label",
                        "width": "1px",
                        "height": "2px"
                    }
                ],
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "small-label",
                            "width": "3px",
                            "height": "4px"
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.width).toBe(3);
            expect(child0.height).toBe(4);
        });
    });
});
