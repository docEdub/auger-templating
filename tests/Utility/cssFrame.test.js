global.testing = true;
require("../../.build/.root/src/Cabbage/cabbageTemplateHelper");

describe(`CssFrame`, () => {
    describe(`AsNumberArray`, () => {
        test(`returns [0, 0, 0, 0] when given null`, () => {
            expect(CssFrame.AsNumberArray(null)).toStrictEqual([0, 0, 0, 0]);
        });
        test(`returns [0, 0, 0, 0] when given undefined`, () => {
            expect(CssFrame.AsNumberArray(undefined)).toStrictEqual([0, 0, 0, 0]);
        });
        test(`returns [1, 1, 1, 1] when given [1]`, () => {
            expect(CssFrame.AsNumberArray([1])).toStrictEqual([1, 1, 1, 1]);
        });
        test(`returns [1, 2, 1, 2] when given [1, 2]`, () => {
            expect(CssFrame.AsNumberArray([1, 2])).toStrictEqual([1, 2, 1, 2]);
        });
        test(`returns [1, 2, 3, 2] when given [1, 2, 3]`, () => {
            expect(CssFrame.AsNumberArray([1, 2, 3])).toStrictEqual([1, 2, 3, 2]);
        });
        test(`returns [1, 2, 3, 4] when given [1, 2, 3, 4]`, () => {
            expect(CssFrame.AsNumberArray([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
        });
        test(`returns [1, 2, 3, 4] when given [1, 2, 3, 4, 5]`, () => {
            expect(CssFrame.AsNumberArray([1, 2, 3, 4, 5])).toStrictEqual([1, 2, 3, 4]);
        });
        test(`returns [1, 1, 1, 1] when given "1"`, () => {
            expect(CssFrame.AsNumberArray(`1`)).toStrictEqual([1, 1, 1, 1]);
        });
        test(`returns [1, 2, 1, 2] when given "1 2"`, () => {
            expect(CssFrame.AsNumberArray(`1 2`)).toStrictEqual([1, 2, 1, 2]);
        });
        test(`returns [1, 2, 3, 2] when given "1 2 3"`, () => {
            expect(CssFrame.AsNumberArray(`1 2 3`)).toStrictEqual([1, 2, 3, 2]);
        });
        test(`returns [1, 2, 3, 4] when given "1 2 3 4"`, () => {
            expect(CssFrame.AsNumberArray("1 2 3 4")).toStrictEqual([1, 2, 3, 4]);
        });
    });
});
