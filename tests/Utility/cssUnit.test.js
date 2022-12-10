global.testing = true;
require("../../.build/.root/src/Cabbage/cabbageTemplateHelper");

describe(`CssUnit`, () => {
    describe(`AsNumber`, () => {
        test(`returns correct number given a number`, () => {
            expect(CssUnit.AsNumber(1)).toBe(1);
        });
        test(`returns correct number given a "px" string`, () => {
            expect(CssUnit.AsNumber("10px")).toBe(10);
        });
        test(`returns correct number given a "%" string`, () => {
            expect(CssUnit.AsNumber("50%", 100)).toBe(50);
        });
        test(`returns zero given a "%" string and no reference unit`, () => {
            expect(CssUnit.AsNumber("50%")).toBe(0);
        });
        test(`returns correct negative number given a negative number`, () => {
            expect(CssUnit.AsNumber(-1)).toBe(-1);
        });
        test(`returns correct negative number given a negative "px" string`, () => {
            expect(CssUnit.AsNumber("-10px")).toBe(-10);
        });
        test(`returns correct negative number given a negative "%" string`, () => {
            expect(CssUnit.AsNumber("-50%", 100)).toBe(-50);
        });
        test(`returns zero given a negative "%" string and no reference unit`, () => {
            expect(CssUnit.AsNumber("-50%")).toBe(0);
        });
        test(`returns correct negative number given a "%" string and a negative reference unit`, () => {
            expect(CssUnit.AsNumber("50%", -100)).toBe(-50);
        });
        test(`returns correct positive number given a negative "%" string and a negative reference unit`, () => {
            expect(CssUnit.AsNumber("-50%", -100)).toBe(50);
        });
    });
});
