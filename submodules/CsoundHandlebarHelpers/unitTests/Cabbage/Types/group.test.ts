
import { Group, GroupLayout } from "../../../src/Cabbage/Types/group";
import { Widget } from "../../../src/Cabbage/Types/widget";

describe(`Group`, () => {
    describe(`constructor`, () => {
        test(`sets padding from given json`, () => {
            const group = new Group({
                padding: "1px 2px 3px 4px"
            });
            expect(group.padding).toStrictEqual([1, 2, 3, 4]);
        });
        test(`sets paddingTop from given json`, () => {
            const group = new Group({
                paddingTop: "1px"
            });
            expect(group.paddingTop).toBe(1);
        });
        test(`sets paddingLeft from given json`, () => {
            const group = new Group({
                paddingLeft: "1px"
            });
            expect(group.paddingLeft).toBe(1);
        });
        test(`sets paddingBottom from given json`, () => {
            const group = new Group({
                paddingBottom: "1px"
            });
            expect(group.paddingBottom).toBe(1);
        });
        test(`sets paddingRight from given json`, () => {
            const group = new Group({
                paddingRight: "1px"
            });
            expect(group.paddingRight).toBe(1);
        });
        test(`sets layout to None from given json`, () => {
            const group = new Group({
                layout: "None"
            });
            expect(group.layout).toBe(GroupLayout.None);
        });
        test(`sets layout to LeftToRight from given json`, () => {
            const group = new Group({
                layout: "LeftToRight"
            });
            expect(group.layout).toBe(GroupLayout.LeftToRight);
        });
        test(`sets layout to TopToBottom from given json`, () => {
            const group = new Group({
                layout: "TopToBottom"
            });
            expect(group.layout).toBe(GroupLayout.TopToBottom);
        });
    });
    describe(`padding`, () => {
        test(`is initialized to [0, 0, 0, 0]`, () => {
            const group = new Group;
            expect(group.padding).toStrictEqual([0, 0, 0, 0]);
        });
        test(`changes top when paddingTop is set`, () => {
            const group = new Group(JSON.parse(`{
                "top": 0,
                "paddingTop": 10
            }`));
            expect(group.top).toBe(10);
        });
        test(`changes left when paddingLeft is set`, () => {
            const group = new Group(JSON.parse(`{
                "left": 0,
                "paddingLeft": 10
            }`));
            expect(group.left).toBe(10);
        });
        test(`changes bottom when paddingBottom is set`, () => {
            const group = new Group(JSON.parse(`{
                "bottom": 10,
                "paddingBottom": 10
            }`));
            expect(group.left).toBe(0);
        });
        test(`changes right when paddingRight is set`, () => {
            const group = new Group(JSON.parse(`{
                "right": 10,
                "paddingRight": 10
            }`));
            expect(group.left).toBe(0);
        });
        test(`changes top, left, bottom and right when padding is set to number`, () => {
            const group = new Group(JSON.parse(`{
                "top": 1,
                "left": 1,
                "bottom": 9,
                "right": 9,
                "padding": 1
            }`));
            expect(group.top).toBe(2);
            expect(group.left).toBe(2);
            expect(group.bottom).toBe(8);
            expect(group.right).toBe(8);
        });
        test(`changes top, left, bottom and right when padding is set to percentage`, () => {
            const group = new Group(JSON.parse(`{
                "top": 0,
                "left": 0,
                "bottom": 100,
                "right": 200,
                "padding": "10%"
            }`));
            expect(group.top).toBe(10);
            expect(group.left).toBe(20);
            expect(group.bottom).toBe(90);
            expect(group.right).toBe(180);
        });
        test(`changes top, left, bottom and right when height and with are set, and padding is set to percentage`, () => {
            const group = new Group(JSON.parse(`{
                "height": 100,
                "width": 200,
                "padding": "10%"
            }`));
            expect(group.top).toBe(10);
            expect(group.left).toBe(20);
            expect(group.bottom).toBe(90);
            expect(group.right).toBe(180);
        });
        test(`changes top, left, bottom and right when height and with are set to percentages, and padding is set to percentage`, () => {
            const parent = new Group;
            parent.height = 100;
            parent.width = 200;
            const group = new Group(JSON.parse(`{
                "height": "100%",
                "width": "100%",
                "padding": "10%"
            }`), parent);
            expect(group.top).toBe(10);
            expect(group.left).toBe(20);
            expect(group.bottom).toBe(90);
            expect(group.right).toBe(180);
        });
    });
    describe(`layout`, () => {
        test(`is initialized to GroupLayout.None`, () => {
            const group = new Group;
            expect(group.layout).toBe(GroupLayout.None);
        });
    });
    describe(`children`, () => {
        test(`is initialized to an empty array`, () => {
            const parent = new Group;
            expect(parent.children.length).toBe(0);
        });
    });
    describe(`addChild`, () => {
        test(`adds the child`, () => {
            const child = new Widget;
            const group = new Group;
            group.addChild(child);
            expect(group.children.indexOf(child)).toBe(0);
        });
        test(`does not add a null child`, () => {
            const group = new Group;
            group.addChild(null);
            expect(group.children.length).toBe(0);
        });
        test(`does not add an undefined child`, () => {
            const group = new Group;
            group.addChild(undefined);
            expect(group.children.length).toBe(0);
        });
        test(`does not add the same child twice`, () => {
            const child = new Widget;
            const group = new Group;
            group.addChild(child);
            group.addChild(child);
            expect(group.children.length).toBe(1);
        });
    });
    describe(`removeChild`, () => {
        test(`removes the child`, () => {
            const child = new Widget;
            const group = new Group;
            group.addChild(child);
            group.removeChild(child);
            expect(group.children.length).toBe(0);
        });
        test(`removes the child from index 0`, () => {
            const child0 = new Widget;
            const child1 = new Widget;
            const group = new Group;
            group.addChild(child0);
            group.addChild(child1);
            group.removeChild(child0);
            expect(group.children[0]).toBe(child1);
        });
        test(`removes the child from index 1`, () => {
            const child0 = new Widget;
            const child1 = new Widget;
            const group = new Group;
            group.addChild(child0);
            group.addChild(child1);
            group.removeChild(child1);
            expect(group.children[0]).toBe(child0);
        });
        test(`does nothing when given null`, () => {
            const child = new Widget;
            const group = new Group;
            group.addChild(child);
            group.removeChild(null);
            expect(group.children.length).toBe(1);
        });
        test(`does nothing when given undefined`, () => {
            const child = new Widget;
            const group = new Group;
            group.addChild(child);
            group.removeChild(undefined);
            expect(group.children.length).toBe(1);
        });
        test(`does nothing when given a child not belonging to the group`, () => {
            const child0 = new Widget;
            const child1 = new Widget;
            const group = new Group;
            group.addChild(child0);
            group.removeChild(child1);
            expect(group.children[0]).toBe(child0);
        });
    });
});
