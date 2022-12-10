
export type cssNumber = number | string;

export class CssNumber {
    public static AsNumber(cssNumber: cssNumber, referenceUnit?: number): number {
        if (typeof cssNumber == `number`) {
            return cssNumber as number;
        }
        else if (typeof cssNumber == `string`) {
            const cssNumberString = cssNumber as string;
            if (cssNumberString.endsWith(`px`)) {
                return Number.parseFloat(cssNumberString.replace("px", "")) || 0;
            }
            else if (cssNumberString.endsWith(`%`)) {
                const percentage = (Number.parseFloat(cssNumberString.replace(`%`, ``)) || 0) / 100;
                return percentage * referenceUnit || 0;
            }
            else {
                return Number.parseFloat(cssNumberString) || 0;
            }
        }
        return 0;
    }
}

if (global.testing) {
    global.CssNumber = CssNumber;
}
