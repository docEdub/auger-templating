
import { Form } from "../../../src/Cabbage/Types/form";

import { LayoutBuilder } from "../../../src/Cabbage/Utility/layoutBuilder";
import { WidgetFactory } from "../../../src/Cabbage/Utility/widgetFactory";

const createFormAndBuildLayout = (jsonString) => {
    const widgetFactory = new WidgetFactory;
    const form = widgetFactory.create(JSON.parse(jsonString).ui) as Form;
    const layoutBuilder = new LayoutBuilder;
    layoutBuilder.build(form);
    return form;
}

describe(`LayoutBuilder`, () => {
    describe(`build`, () => {
        test(`sets marginedTop equal to top when no margin is set`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "width": 100,
                    "height": 200,
                    "children": [
                        {
                            "type": "group",
                            "top": 10
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.marginedTop).toBe(10);
        });
        test(`sets marginedTop correctly when marginTop is set`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "width": 100,
                    "height": 200,
                    "children": [
                        {
                            "type": "group",
                            "top": 10,
                            "marginTop": 1
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.marginedTop).toBe(11);
        });
        test(`sets marginedLeft equal to left when no margin is set`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "width": 100,
                    "height": 200,
                    "children": [
                        {
                            "type": "group",
                            "left": 10
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.marginedLeft).toBe(10);
        });
        test(`sets marginedLeft correctly when marginLeft is set`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "width": 100,
                    "height": 200,
                    "children": [
                        {
                            "type": "group",
                            "left": 10,
                            "marginLeft": 1
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.marginedLeft).toBe(11);
        });
        test(`sets marginedHeight equal to height when no margin is set`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group",
                            "height": 10
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.marginedHeight).toBe(10);
        });
        test(`sets marginedHeight correctly when marginTop is set`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group",
                            "height": 10,
                            "marginTop": 1
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.marginedHeight).toBe(11);
        });
        test(`sets marginedHeight correctly when marginBottom is set`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group",
                            "height": 10,
                            "marginBottom": 1
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.marginedHeight).toBe(11);
        });
        test(`sets marginedHeight correctly when marginTop and marginBottom are set`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group",
                            "height": 10,
                            "marginTop": 1,
                            "marginBottom": 2
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.marginedHeight).toBe(13);
        });
        test(`sets marginedWidth equal to width when no margin is set`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group",
                            "width": 10
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.marginedWidth).toBe(10);
        });
        test(`sets marginedWidth correctly when marginLeft is set`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group",
                            "width": 10,
                            "marginLeft": 1
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.marginedWidth).toBe(11);
        });
        test(`sets marginedWidth correctly when marginRight is set`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group",
                            "width": 10,
                            "marginRight": 1
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.marginedWidth).toBe(11);
        });
        test(`sets marginedWidth correctly when marginLeft and marginRight are set`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "children": [
                        {
                            "type": "group",
                            "width": 10,
                            "marginLeft": 1,
                            "marginRight": 2
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.marginedWidth).toBe(13);
        });
        test(`does not move children when layout is "None"`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
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
                "ui": {
                    "type": "form",
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
        test(`wraps child to second row when layout is "LeftToRight" and first row is full`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
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
        test(`wraps child to second row when layout is "LeftToRight" and first row is full because of margins`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "width": 100,
                    "height": 100,
                    "layout": "LeftToRight",
                    "children": [
                        {
                            "type": "group",
                            "height": 50,
                            "width": 49,
                            "marginLeft": 1
                        },
                        {
                            "type": "group",
                            "height": 50,
                            "width": 49,
                            "marginRight": 1
                        },
                        {
                            "type": "group",
                            "height": 50,
                            "width": 50
                        }
                    ]
                }
            }`);
            const child2 = form.children[2];
            expect(child2.left).toBe(0);
            expect(child2.top).toBe(50);
        });
        test(`lays out children from top to bottom when layout is "TopToBottom"`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
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
        test(`wraps child to second row with top set to tallest child when layout is "LeftToRight" and first row is full`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
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
        test(`wraps child to second row with top set to tallest child with margins when layout is "LeftToRight" and first row is full`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
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
                            "height": 10,
                            "width": 50,
                            "marginTop": 10
                        },
                        {
                            "type": "group",
                            "height": 10,
                            "width": 50
                        }
                    ]
                }
            }`);
            const child2 = form.children[2];
            expect(child2.top).toBe(20);
            expect(child2.left).toBe(0);
        });
        test(`wraps child to second column when layout is "TopToBottom" and first column is full`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
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
        test(`wraps child to second column when layout is "TopToBottom" and first column is full because of margins`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "width": 100,
                    "height": 100,
                    "layout": "TopToBottom",
                    "children": [
                        {
                            "type": "group",
                            "height": 49,
                            "width": 50,
                            "marginTop": 1
                        },
                        {
                            "type": "group",
                            "height": 49,
                            "width": 50,
                            "marginBottom": 1
                        },
                        {
                            "type": "group",
                            "height": 50,
                            "width": 50
                        }
                    ]
                }
            }`);
            const child2 = form.children[2];
            expect(child2.top).toBe(0);
            expect(child2.left).toBe(50);
        });
        test(`wraps child to second column with left set to widest child when layout is "TopToBottom" and first column is full`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
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
        test(`wraps child to second column with left set to widest child with margins when layout is "TopToBottom" and first column is full`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
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
                            "width": 10,
                            "marginLeft": 10
                        },
                        {
                            "type": "group",
                            "height": 50,
                            "width": 10
                        }
                    ]
                }
            }`);
            const child2 = form.children[2];
            expect(child2.top).toBe(0);
            expect(child2.left).toBe(20);
        });
        test(`wraps child to third row when layout is "TopToBottom" and second row is full`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "name": "Test",
                    "height": 200,
                    "width": 100,
                    "layout": "LeftToRight",
                    "background-color": "black",
                    "id": "0001",
                    "children": [
                        {
                            "type": "group",
                            "width": "50px",
                            "height": "50px",
                            "background-color": "red"
                        },
                        {
                            "type": "group",
                            "width": "50px",
                            "height": "50px",
                            "background-color": "green"
                        },
                        {
                            "type": "group",
                            "width": "50px",
                            "height": "50px",
                            "background-color": "blue"
                        },
                        {
                            "type": "group",
                            "width": "50px",
                            "height": "50px",
                            "background-color": "purple"
                        },
                        {
                            "type": "group",
                            "width": "50px",
                            "height": "50px",
                            "background-color": "white"
                        }
                    ]
                }
            }`);
            const child4 = form.children[4];
            expect(child4.top).toBe(100);
            expect(child4.left).toBe(0);
        });
        test(`wraps child to third column when layout is "TopToBottom" and second column is full`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "name": "Test",
                    "height": 100,
                    "width": 200,
                    "layout": "TopToBottom",
                    "background-color": "black",
                    "id": "0001",
                    "children": [
                        {
                            "type": "group",
                            "width": "50px",
                            "height": "50px",
                            "background-color": "red"
                        },
                        {
                            "type": "group",
                            "width": "50px",
                            "height": "50px",
                            "background-color": "green"
                        },
                        {
                            "type": "group",
                            "width": "50px",
                            "height": "50px",
                            "background-color": "blue"
                        },
                        {
                            "type": "group",
                            "width": "50px",
                            "height": "50px",
                            "background-color": "purple"
                        },
                        {
                            "type": "group",
                            "width": "50px",
                            "height": "50px",
                            "background-color": "white"
                        }
                    ]
                }
            }`);
            const child4 = form.children[4];
            expect(child4.top).toBe(0);
            expect(child4.left).toBe(100);
        });
        test(`sets child width to parent width when child width is "100%"`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "width": 100,
                    "children": [
                        {
                            "type": "group",
                            "width": "100%"
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.width).toBe(form.width);
        });
        test(`sets group top, left, width and height correctly when width and height are "100%" and padding is "10%"`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "height": 100,
                    "width": 200,
                    "padding": "10%",
                    "layout": "LeftToRight",
                    "children": [
                        {
                            "type": "group",
                            "height": "100%",
                            "width": "100%"
                        }
                    ]
                }
            }`);
            const child0 = form.children[0];
            expect(child0.top).toBe(10);
            expect(child0.left).toBe(20);
            expect(child0.height).toBe(80);
            expect(child0.width).toBe(160);
        });
        test(`sets nested label bounds correctly when form and group layouts are both LeftToRight and form has padding`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "name": "Test",
                    "height": 200,
                    "width": 200,
                    "padding": "5px",
                    "layout": "LeftToRight",
                    "background-color": "black",
                    "id": "0001",
                    "columns": 2,
                    "rows": 2,
                    "childHeight": "((1 / json.rows) * 100)",
                    "childWidth": "((1 / json.columns) * 100)",
                    "childColor": "DarkRed",
                    "children": [
                        {
                            "type": "group",
                            "height": "100%",
                            "width": "100%",
                            "layout": "(inherit())",
                            "children": [
                                {
                                    "type": "label",
                                    "text": "(\`\${childNumber}\`)",
                                    "width": "(\`\${1 * inherit('childWidth')}%\`)",
                                    "height": "(\`\${1 * inherit('childHeight')}%\`)",
                                    "background-color": "Pink",
                                    "color": "(inherit('childColor'))"
                                },
                                {
                                    "type": "label",
                                    "text": "(\`\${childNumber}\`)",
                                    "width": "(\`\${1 * inherit('childWidth')}%\`)",
                                    "height": "(\`\${1 * inherit('childHeight')}%\`)",
                                    "background-color": "LightGreen",
                                    "color": "(parent.json.childColor)"
                                }
                            ]
                        }
                    ]
                }
            }`);
            const childLabel0 = form.children[0].children[0];
            const childLabel1 = form.children[0].children[1];
            expect(childLabel0.top).toBe(0);
            expect(childLabel0.left).toBe(0);
            expect(childLabel0.width).toBe(95);
            expect(childLabel0.height).toBe(95);
            expect(childLabel1.top).toBe(0);
            expect(childLabel1.left).toBe(95);
            expect(childLabel1.width).toBe(95);
            expect(childLabel1.height).toBe(95);
        });
        test(`Lays out nested label bounds correctly when form and group layouts are both LeftToRight and children have varying widths`, () => {
            const form = createFormAndBuildLayout(`{
                "ui": {
                    "type": "form",
                    "name": "Test",
                    "height": 300,
                    "width": 400,
                    "padding": "5px",
                    "layout": "LeftToRight",
                    "background-color": "black",
                    "id": "0001",
                    "columns": 3,
                    "rows": 3,
                    "childHeight": "((1 / json.rows) * 100)",
                    "childWidth": "((1 / json.columns) * 100)",
                    "childColor": "DarkRed",
                    "children": [
                        {
                            "type": "group",
                            "height": "100%",
                            "width": "100%",
                            "layout": "(inherit())",
                            "children": [
                                {
                                    "type": "label",
                                    "text": "(\`\${childNumber}\`)",
                                    "width": "(\`\${1 * inherit('childWidth')}%\`)",
                                    "height": "(\`\${1 * inherit('childHeight')}%\`)",
                                    "background-color": "Pink",
                                    "color": "(inherit('childColor'))"
                                },
                                {
                                    "type": "label",
                                    "text": "(\`\${childNumber}\`)",
                                    "width": "(\`\${2 * inherit('childWidth')}%\`)",
                                    "height": "(\`\${1 * inherit('childHeight')}%\`)",
                                    "background-color": "LightGreen",
                                    "color": "(parent.json.childColor)"
                                },
                                {
                                    "type": "label",
                                    "text": "(\`\${childNumber}\`)",
                                    "width": "(\`\${1.5 * inherit('childWidth')}%\`)",
                                    "height": "(\`\${1 * inherit('childHeight')}%\`)",
                                    "background-color": "LightBlue",
                                    "color": "(inherit('childColor'))"
                                },
                                {
                                    "type": "label",
                                    "text": "(\`\${childNumber}\`)",
                                    "width": "(\`\${1.5 * inherit('childWidth')}%\`)",
                                    "height": "(\`\${1 * inherit('childHeight')}%\`)",
                                    "background-color": "Plum",
                                    "color": "(inherit('childColor'))"
                                },
                                {
                                    "type": "label",
                                    "text": "(\`\${childNumber}\`)",
                                    "width": "(\`\${2 * inherit('childWidth')}%\`)",
                                    "height": "(\`\${1 * inherit('childHeight')}%\`)",
                                    "background-color": "HotPink",
                                    "color": "(inherit('childColor'))"
                                },
                                {
                                    "type": "label",
                                    "text": "(\`\${childNumber}\`)",
                                    "width": "(\`\${1 * inherit('childWidth')}%\`)",
                                    "height": "(\`\${1 * inherit('childHeight')}%\`)",
                                    "background-color": "DarkOrange",
                                    "color": "(inherit('childColor'))"
                                }
                            ]
                        }
                    ]
                }
            }`);
            // console.log(form.output());
            const childLabel0 = form.children[0].children[0];
            const childLabel1 = form.children[0].children[1];
            const childLabel2 = form.children[0].children[2];
            const childLabel3 = form.children[0].children[3];
            const childLabel4 = form.children[0].children[4];
            const childLabel5 = form.children[0].children[5];
            expect(childLabel0.left).toBeCloseTo(0, 0);
            expect(childLabel0.top).toBeCloseTo(0, 0);
            expect(childLabel0.width).toBeCloseTo(130, 0);
            expect(childLabel0.height).toBeCloseTo(97, 0);
            expect(childLabel1.left).toBeCloseTo(130, 0);
            expect(childLabel1.top).toBeCloseTo(0, 0);
            expect(childLabel1.width).toBeCloseTo(260, 0);
            expect(childLabel1.height).toBeCloseTo(97, 0);
            expect(childLabel2.left).toBeCloseTo(0, 0);
            expect(childLabel2.top).toBeCloseTo(97, 0);
            expect(childLabel2.width).toBeCloseTo(195, 0);
            expect(childLabel2.height).toBeCloseTo(97, 0);
            expect(childLabel3.left).toBeCloseTo(195, 0);
            expect(childLabel3.top).toBeCloseTo(97, 0);
            expect(childLabel3.width).toBeCloseTo(195, 0);
            expect(childLabel3.height).toBeCloseTo(97, 0);
            expect(childLabel4.left).toBeCloseTo(0, 0);
            expect(childLabel4.top).toBeCloseTo(193, 0);
            expect(childLabel4.width).toBeCloseTo(260, 0);
            expect(childLabel4.height).toBeCloseTo(97, 0);
            expect(childLabel5.left).toBeCloseTo(260, 0);
            expect(childLabel5.top).toBeCloseTo(193, 0);
            expect(childLabel5.width).toBeCloseTo(130, 0);
            expect(childLabel5.height).toBeCloseTo(97, 0);
        });
    });
});
