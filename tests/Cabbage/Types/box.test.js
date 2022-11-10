global.testing = true;
require("../../../.build/.root/src/Cabbage/cabbageTemplateHelper");

describe("box", () => {
    test("x should match given number", () => {
        const box = new Box({ x: 1 });
        expect(box.x).toBe(1);
    });
});
