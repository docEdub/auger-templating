
import { Group } from "../../../src/Cabbage/Types/group";
import { Widget } from "../../../src/Cabbage/Types/widget";

describe(`Widget`, () => {
    describe(`constructor`, () => {
        test(`sets position from given json`, () => {
            const widget = new Widget({
                position: "1px 2px 3px 4px"
            });
            expect(widget.position).toStrictEqual([1, 2, 3, 4]);
        });
        test(`sets top from given json`, () => {
            const widget = new Widget({
                top: "1px"
            });
            expect(widget.top).toBe(1);
        });
        test(`sets left from given json`, () => {
            const widget = new Widget({
                left: "1px"
            });
            expect(widget.left).toBe(1);
        });
        test(`sets bottom from given json`, () => {
            const widget = new Widget({
                bottom: "1px"
            });
            expect(widget.bottom).toBe(1);
        });
        test(`sets right from given json`, () => {
            const widget = new Widget({
                right: "1px"
            });
            expect(widget.right).toBe(1);
        });
        test(`sets height from given json`, () => {
            const widget = new Widget({
                height: "1px"
            });
            expect(widget.height).toBe(1);
        });
        test(`sets width from given json`, () => {
            const widget = new Widget({
                width: "1px"
            });
            expect(widget.width).toBe(1);
        });
        test(`sets margin from given json`, () => {
            const widget = new Widget({
                margin: "1px 2px 3px 4px"
            });
            expect(widget.margin).toStrictEqual([1, 2, 3, 4]);
        });
        test(`sets marginTop from given json`, () => {
            const widget = new Widget({
                marginTop: "1px"
            });
            expect(widget.marginTop).toBe(1);
        });
        test(`sets marginLeft from given json`, () => {
            const widget = new Widget({
                marginLeft: "1px"
            });
            expect(widget.marginLeft).toBe(1);
        });
        test(`sets marginBottom from given json`, () => {
            const widget = new Widget({
                marginBottom: "1px"
            });
            expect(widget.marginBottom).toBe(1);
        });
        test(`sets marginRight from given json`, () => {
            const widget = new Widget({
                marginRight: "1px"
            });
            expect(widget.marginRight).toBe(1);
        });
    });
    describe(`parent`, () => {
        test(`is initialized to null`, () => {
            const child = new Widget;
            expect(child.parent).toBe(null);
        });
        test(`returns parent when set`, () => {
            const child = new Widget;
            const parent = new Group;
            child.parent = parent;
            expect(child.parent).toBe(parent);
        });
        test(`adds child when set`, () => {
            const child = new Widget;
            const parent = new Group;
            child.parent = parent;
            expect(parent.children.indexOf(child)).toBe(0);
        });
        test(`removes child when unset`, () => {
            const child = new Widget;
            const parent = new Group;
            child.parent = parent;
            child.parent = null;
            expect(parent.children.indexOf(child)).toBe(-1);
        });
    });
    describe(`position`, () => {
        test(`is initialized to [0, 0, 0, 0]`, () => {
            const widget = new Widget;
            expect(widget.position).toStrictEqual([0, 0, 0, 0]);
        });
        test(`when set, turns off changing the top value to match the height when the bottom value changes`, () => {
            const widget = new Widget;
            widget.height = 1;
            widget.position = "0 0 1px 1px";
            widget.bottom = 2;
            expect(widget.top).toBe(0);
        });
        test(`when set, turns off changing the bottom value to match the height when the top value changes`, () => {
            const widget = new Widget;
            widget.height = 1;
            widget.position = "0 0 1px 1px";
            widget.top = 2;
            expect(widget.bottom).toBe(1);
        });
        test(`when set, turns off changing the left value to match the width when the right value changes`, () => {
            const widget = new Widget;
            widget.width = 1;
            widget.position = "0 0 1px 1px";
            widget.right = 2;
            expect(widget.left).toBe(0);
        });
        test(`when set, turns off changing the right value to match the width when the left value changes`, () => {
            const widget = new Widget;
            widget.width = 1;
            widget.position = "0 0 1px 1px";
            widget.left = 2;
            expect(widget.right).toBe(1);
        });
    });
    describe(`height`, () => {
        test(`when set, turns on changing the top value to match the height when the bottom value changes`, () => {
            const widget = new Widget;
            widget.position = "0 0 1px 1px";
            widget.height = 2;
            widget.bottom = 3;
            expect(widget.top).toBe(1);
        });
        test(`when set, turns on changing the bottom value to match the height when the top value changes`, () => {
            const widget = new Widget;
            widget.position = "0 0 1px 1px";
            widget.height = 2;
            widget.top = 1;
            expect(widget.bottom).toBe(3);
        });
    });
    describe(`width`, () => {
        test(`when set, turns on changing the left value to match the height when the right value changes`, () => {
            const widget = new Widget;
            widget.position = "0 0 1px 1px";
            widget.width = 2;
            widget.right = 3;
            expect(widget.left).toBe(1);
        });
        test(`when set, turns on changing the right value to match the height when the left value changes`, () => {
            const widget = new Widget;
            widget.position = "0 0 1px 1px";
            widget.width = 2;
            widget.left = 1;
            expect(widget.right).toBe(3);
        });
    });
    describe(`margin`, () => {
        test(`is initialized to [0, 0, 0, 0]`, () => {
            const widget = new Widget;
            expect(widget.margin).toStrictEqual([0, 0, 0, 0]);
        });
    });
});