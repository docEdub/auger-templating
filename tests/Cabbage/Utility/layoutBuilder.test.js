global.testing = true;
require("../../../.build/.root/src/Cabbage/cabbageTemplateHelper");

const createFormAndBuildLayout = (jsonString) => {
    const widgetFactory = new WidgetFactory;
    const form = widgetFactory.create(JSON.parse(jsonString));
    const layoutBuilder = new LayoutBuilder;
    layoutBuilder.build(form);
    return form;
}

describe(`LayoutBuilder`, () => {
    describe(`build`, () => {
        test(`does not move children when layout is "None"`, () => {
            const form = createFormAndBuildLayout(`{
                "form": {
                    "width": 100,
                    "height": 100,
                    "layout": "None",
                    "children": [
                        {
                            "type": "group",
                            "position": "1px 2px"
                        },
                        {
                            "type": "group",
                            "position": "3px 4px"
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            const child1 = form.children[1];
            expect(child0.top).toBe(1);
            expect(child0.left).toBe(2);
            expect(child1.top).toBe(3);
            expect(child1.left).toBe(4);
        });
        test(`lays out children from left to right when layout is "LeftToRight"`, () => {
            const form = createFormAndBuildLayout(`{
                "form": {
                    "width": 100,
                    "height": 100,
                    "layout": "LeftToRight",
                    "children": [
                        {
                            "type": "group",
                            "height": 50,
                            "width": 50
                        },
                        {
                            "type": "group",
                            "height": 50,
                            "width": 50
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            const child1 = form.children[1];
            expect(child0.top).toBe(0);
            expect(child0.left).toBe(0);
            expect(child1.top).toBe(0);
            expect(child1.left).toBe(50);
        });
        test(`wraps child to second row when layout is "LeftToRight" and the first row is full`, () => {
            const form = createFormAndBuildLayout(`{
                "form": {
                    "width": 100,
                    "height": 100,
                    "layout": "LeftToRight",
                    "children": [
                        {
                            "type": "group",
                            "height": 50,
                            "width": 50
                        },
                        {
                            "type": "group",
                            "height": 50,
                            "width": 50
                        },
                        {
                            "type": "group",
                            "height": 50,
                            "width": 50
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            const child1 = form.children[1];
            const child2 = form.children[2];
            expect(child0.top).toBe(0);
            expect(child0.left).toBe(0);
            expect(child1.top).toBe(0);
            expect(child1.left).toBe(50);
            expect(child2.left).toBe(0);
            expect(child2.top).toBe(50);
        });
        test(`lays out children from top to bottom when layout is "TopToBottom"`, () => {
            const form = createFormAndBuildLayout(`{
                "form": {
                    "width": 100,
                    "height": 100,
                    "layout": "TopToBottom",
                    "children": [
                        {
                            "type": "group",
                            "height": 50,
                            "width": 50
                        },
                        {
                            "type": "group",
                            "height": 50,
                            "width": 50
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            const child1 = form.children[1];
            expect(child0.top).toBe(0);
            expect(child0.left).toBe(0);
            expect(child1.top).toBe(50);
            expect(child1.left).toBe(0);
        });
        test(`wraps child to second row with top set to tallest child when layout is "LeftToRight" and the first row is full`, () => {
            const form = createFormAndBuildLayout(`{
                "form": {
                    "width": 100,
                    "height": 100,
                    "layout": "LeftToRight",
                    "children": [
                        {
                            "type": "group",
                            "height": 10,
                            "width": 50
                        },
                        {
                            "type": "group",
                            "height": 20,
                            "width": 50
                        },
                        {
                            "type": "group",
                            "height": 10,
                            "width": 50
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            const child1 = form.children[1];
            const child2 = form.children[2];
            expect(child0.top).toBe(0);
            expect(child0.left).toBe(0);
            expect(child1.top).toBe(0);
            expect(child1.left).toBe(50);
            expect(child2.top).toBe(20);
            expect(child2.left).toBe(0);
        });
        test(`wraps child to second column when layout is "TopToBottom" and the first column is full`, () => {
            const form = createFormAndBuildLayout(`{
                "form": {
                    "width": 100,
                    "height": 100,
                    "layout": "TopToBottom",
                    "children": [
                        {
                            "type": "group",
                            "height": 50,
                            "width": 50
                        },
                        {
                            "type": "group",
                            "height": 50,
                            "width": 50
                        },
                        {
                            "type": "group",
                            "height": 50,
                            "width": 50
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            const child1 = form.children[1];
            const child2 = form.children[2];
            expect(child0.top).toBe(0);
            expect(child0.left).toBe(0);
            expect(child1.top).toBe(50);
            expect(child1.left).toBe(0);
            expect(child2.top).toBe(0);
            expect(child2.left).toBe(50);
        });
        test(`wraps child to second column with left set to widest child when layout is "TopToBottom" and the first column is full`, () => {
            const form = createFormAndBuildLayout(`{
                "form": {
                    "width": 100,
                    "height": 100,
                    "layout": "TopToBottom",
                    "children": [
                        {
                            "type": "group",
                            "height": 50,
                            "width": 10
                        },
                        {
                            "type": "group",
                            "height": 50,
                            "width": 20
                        },
                        {
                            "type": "group",
                            "height": 50,
                            "width": 10
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            const child1 = form.children[1];
            const child2 = form.children[2];
            expect(child0.top).toBe(0);
            expect(child0.left).toBe(0);
            expect(child1.top).toBe(50);
            expect(child1.left).toBe(0);
            expect(child2.top).toBe(0);
            expect(child2.left).toBe(20);
        });
    });
});
