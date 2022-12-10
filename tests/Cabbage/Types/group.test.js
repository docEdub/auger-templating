global.testing = true;
require("../../../.build/.root/src/Cabbage/cabbageTemplateHelper");

describe(`Group`, () => {
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
