
export class Output {
    public static Optional(key: string, value: string | number, defaultValue: string | number = null) {
        let output = ``;
        if (value !== null && value !== undefined) {
            if (typeof value === `string`) {
                output += ` ${key}("${value}")`;
            }
            else {
                output += ` ${key}(${value})`;
            }
        }
        else if (defaultValue != null && defaultValue != undefined) {
            if (typeof value === `string`) {
                output += ` ${key}("${defaultValue}")`;
            }
            else {
                output += ` ${key}(${defaultValue})`;
            }
        }
        return output;
    }

    public static Rounded(value: number) {
        return Math.round(value);
    }
}
