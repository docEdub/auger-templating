
export type cssUnit = number | string;

export class CssUnit {
    static AsNumber(cssUnit: cssUnit, referenceUnit?: number): number {
        if (typeof cssUnit == `number`) {
            return cssUnit as number;
        }
        else if (typeof cssUnit == `string`) {
            const cssUnitString = cssUnit as string;
            if (cssUnitString.endsWith(`px`)) {
                return Number.parseFloat(cssUnitString.replace("px", "")) || 0;
            }
            else if (cssUnitString.endsWith(`%`)) {
                const percentage = (Number.parseFloat(cssUnitString.replace(`%`, ``)) || 0) / 100;
                return percentage * referenceUnit || 0;
            }
            else {
                return Number.parseFloat(cssUnitString) || 0;
            }
        }
        return 0;
    }
}

if (global.testing) {
    global.CssUnit = CssUnit;
}
