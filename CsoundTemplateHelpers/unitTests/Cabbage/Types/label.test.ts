
import { Label } from "../../../src/Cabbage/Types/label";

const defaults = `corners(0)`;

describe(`Label`, () => {
    describe(`output`, () => {
        test(`contains given json['text']`, () => {
            const label = new Label(JSON.parse(`{
                "text": "test"
            }`));
            expect(label.output()).toBe(`label bounds(0, 0, 0, 0) text("test") ${defaults}\n`);
        });
        test(`contains given json['color']`, () => {
            const label = new Label(JSON.parse(`{
                "color": "test"
            }`));
            expect(label.output()).toBe(`label bounds(0, 0, 0, 0) fontColour("test") ${defaults}\n`);
        });
    });
});
