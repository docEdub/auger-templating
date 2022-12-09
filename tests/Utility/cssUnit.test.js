global.testing = true;
require("../../.build/.root/src/Cabbage/cabbageTemplateHelper");

describe(`CssUnit`, () => {
    describe(`ToNumber`, () => {
        test(`returns correct number given a number`, () => {
            expect(CssUnit.ToNumber(1)).toBe(1);
        });
        test(`returns correct number given a "px" string`, () => {
            expect(CssUnit.ToNumber("10px")).toBe(10);
        });
        test(`returns correct number given a "%" string`, () => {
            expect(CssUnit.ToNumber("50%", 100)).toBe(50);
        });
        test(`returns zero given a "%" string and no reference unit`, () => {
            expect(CssUnit.ToNumber("50%")).toBe(0);
        });
        test(`returns correct negative number given a negative number`, () => {
            expect(CssUnit.ToNumber(-1)).toBe(-1);
        });
        test(`returns correct negative number given a negative "px" string`, () => {
            expect(CssUnit.ToNumber("-10px")).toBe(-10);
        });
        test(`returns correct negative number given a negative "%" string`, () => {
            expect(CssUnit.ToNumber("-50%", 100)).toBe(-50);
        });
        test(`returns zero given a negative "%" string and no reference unit`, () => {
            expect(CssUnit.ToNumber("-50%")).toBe(0);
        });
        test(`returns correct negative number given a "%" string and a negative reference unit`, () => {
            expect(CssUnit.ToNumber("50%", -100)).toBe(-50);
        });
        test(`returns correct positive number given a negative "%" string and a negative reference unit`, () => {
            expect(CssUnit.ToNumber("-50%", -100)).toBe(50);
        });
    });
});
