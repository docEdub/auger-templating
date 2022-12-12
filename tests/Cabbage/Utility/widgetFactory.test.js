global.testing = true;
require("../../../.build/.root/src/Cabbage/cabbageTemplateHelper");

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
            const widgetFactory = new WidgetFactory;
            const form = widgetFactory.create(JSON.parse(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group"
                        }
                    ]
                }
            }`));
            expect(form.children.length).toBe(1);
        });
        test(`creates a form with a multiple children`, () => {
            const widgetFactory = new WidgetFactory;
            const form = widgetFactory.create(JSON.parse(`{
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
            }`));
            expect(form.children.length).toBe(2);
        });
        test(`creates a form with a nested children`, () => {
            const widgetFactory = new WidgetFactory;
            const form = widgetFactory.create(JSON.parse(`{
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
            }`));
            const child = form.children[0];
            expect(child.children.length).toBe(2);
        });
    });
});
