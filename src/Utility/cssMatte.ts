
import { Css } from './css';
import { cssNumber, CssNumber } from './cssNumber';

export type cssMatte = Array<cssNumber> | string;

export class CssMatte {
    public static AsNumberArray(cssMatte: cssMatte, referenceWidth?: number, referenceHeight?: number) {
        const outputArray = new Array<number>(4);
        outputArray.fill(0);
        if (!cssMatte) {
            return outputArray;
        }
        let inputArray: Array<cssNumber> = null;
        if (Array.isArray(cssMatte)) {
            inputArray = cssMatte;
        }
        else if (typeof cssMatte === `string`) {
            const inputString = cssMatte as string;
            const inputStringArray = inputString.split(` `);
            inputArray = new Array<cssNumber>();
            for (let i = 0; i < Math.min(4, inputStringArray.length); i++) {
                inputArray[i] = inputStringArray[i];
            }
        }
        if (inputArray.length === 0) {
            return outputArray;
        }
        outputArray[Css.Top] = CssNumber.AsNumber(inputArray[Css.Top], referenceHeight);
        if (inputArray.length === 1) {
            outputArray[Css.Left] = CssNumber.AsNumber(inputArray[Css.Top], referenceWidth);
            outputArray[Css.Bottom] = outputArray[Css.Top];
            outputArray[Css.Right] = outputArray[Css.Left];
        }
        else if (inputArray.length === 2) {
            outputArray[Css.Left] = CssNumber.AsNumber(inputArray[Css.Left], referenceWidth);
            outputArray[Css.Bottom] = outputArray[Css.Top];
            outputArray[Css.Right] = outputArray[Css.Left];
        }
        else if (inputArray.length === 3) {
            outputArray[Css.Left] = CssNumber.AsNumber(inputArray[Css.Left], referenceWidth);
            outputArray[Css.Bottom] = CssNumber.AsNumber(inputArray[Css.Bottom], referenceHeight);
            outputArray[Css.Right] = outputArray[Css.Left];
        }
        else {
            outputArray[Css.Left] = CssNumber.AsNumber(inputArray[Css.Left], referenceWidth);
            outputArray[Css.Bottom] = CssNumber.AsNumber(inputArray[Css.Bottom], referenceHeight);
            outputArray[Css.Right] = CssNumber.AsNumber(inputArray[Css.Right], referenceWidth);
        }
        return outputArray;
    }
}

if (global.testing) {
    global.CssMatte = CssMatte;
}
