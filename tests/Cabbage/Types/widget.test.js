global.testing = true;
require("../../../.build/.root/src/Cabbage/cabbageTemplateHelper");

describe(`Widget`, () => {
    describe(`parent`, () => {
        test(`is initialized to null`, () => {
            const child = new Widget;
            expect(child.parent).toBe(null);
        });
        test(`returns parent when set`, () => {
            const child = new Widget;
            const parent = new Widget;
            child.parent = parent;
            expect(child.parent).toBe(parent);
        });
        test(`adds child when set`, () => {
            const child = new Widget;
            const parent = new Widget;
            child.parent = parent;
            expect(parent.children.indexOf(child)).toBe(0);
        });
        test(`removes child when unset`, () => {
            const child = new Widget;
            const parent = new Widget;
            child.parent = parent;
            child.parent = null;
            expect(parent.children.indexOf(child)).toBe(-1);
        });
    });
    describe(`children`, () => {
        test(`is initialized to an empty array`, () => {
            const parent = new Widget;
            expect(parent.children.length).toBe(0);
        });
    });
});
