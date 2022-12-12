global.testing = true;
require("../../../.build/.root/src/Cabbage/cabbageTemplateHelper");

describe(`Label`, () => {
    describe(`output`, () => {
        test(`contains given json['text']`, () => {
            const label = new Label(JSON.parse(`{
                "text": "test"
            }`));
            expect(label.output()).toBe(`label bounds(0, 0, 0, 0) text("test")\n`);
        });
        test(`contains given json['color']`, () => {
            const label = new Label(JSON.parse(`{
                "color": "test"
            }`));
            expect(label.output()).toBe(`label bounds(0, 0, 0, 0) fontColour("test")\n`);
        });
    });
});
