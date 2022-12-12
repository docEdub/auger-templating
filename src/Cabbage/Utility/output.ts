
export class Output {
    public static Optional(key: string, value: string | number | boolean) {
        let output = ``;
        if (value !== null && value !== undefined) {
            if (typeof value === `string`) {
                output += ` ${key}("${value}")`;
            }
            else {
                output += ` ${key}(${value})`;
            }
        }
        return output;
    }

    public static Rounded(value: number) {
        return Math.round(value * 1000) / 1000;
    }
}
