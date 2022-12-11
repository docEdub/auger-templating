
export type cssLength = number | string;

export class CssLength {
    public static AsNumber(cssLength: cssLength, referenceUnit?: number): number {
        if (typeof cssLength == `number`) {
            return cssLength as number;
        }
        else if (typeof cssLength == `string`) {
            const cssLengthString = cssLength as string;
            if (cssLengthString.endsWith(`px`)) {
                return Number.parseFloat(cssLengthString.replace("px", "")) || 0;
            }
            else if (cssLengthString.endsWith(`%`)) {
                const percentage = (Number.parseFloat(cssLengthString.replace(`%`, ``)) || 0) / 100;
                return percentage * referenceUnit || 0;
            }
            else {
                return Number.parseFloat(cssLengthString) || 0;
            }
        }
        return 0;
    }
}

if (global.testing) {
    global.CssLength = CssLength;
}
