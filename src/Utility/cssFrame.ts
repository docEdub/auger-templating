
import { Css } from './css';
import { cssLength, CssLength } from './cssLength';

export type cssFrame = Array<cssLength> | string;

export class CssFrame {
    public static AsNumberArray(cssFrame: cssFrame, referenceWidth?: number, referenceHeight?: number) {
        const outputArray = new Array<number>(4);
        outputArray.fill(0);
        if (!cssFrame) {
            return outputArray;
        }
        let inputArray: Array<cssLength> = null;
        if (Array.isArray(cssFrame)) {
            inputArray = cssFrame;
        }
        else if (typeof cssFrame === `string`) {
            const inputString = cssFrame as string;
            const inputStringArray = inputString.split(` `);
            inputArray = new Array<cssLength>();
            for (let i = 0; i < Math.min(4, inputStringArray.length); i++) {
                inputArray[i] = inputStringArray[i];
            }
        }
        if (inputArray.length === 0) {
            return outputArray;
        }
        outputArray[Css.Top] = CssLength.AsNumber(inputArray[Css.Top], referenceHeight);
        if (inputArray.length === 1) {
            outputArray[Css.Left] = CssLength.AsNumber(inputArray[Css.Top], referenceWidth);
            outputArray[Css.Bottom] = outputArray[Css.Top];
            outputArray[Css.Right] = outputArray[Css.Left];
        }
        else if (inputArray.length === 2) {
            outputArray[Css.Left] = CssLength.AsNumber(inputArray[Css.Left], referenceWidth);
            outputArray[Css.Bottom] = outputArray[Css.Top];
            outputArray[Css.Right] = outputArray[Css.Left];
        }
        else if (inputArray.length === 3) {
            outputArray[Css.Left] = CssLength.AsNumber(inputArray[Css.Left], referenceWidth);
            outputArray[Css.Bottom] = CssLength.AsNumber(inputArray[Css.Bottom], referenceHeight);
            outputArray[Css.Right] = outputArray[Css.Left];
        }
        else {
            outputArray[Css.Left] = CssLength.AsNumber(inputArray[Css.Left], referenceWidth);
            outputArray[Css.Bottom] = CssLength.AsNumber(inputArray[Css.Bottom], referenceHeight);
            outputArray[Css.Right] = CssLength.AsNumber(inputArray[Css.Right], referenceWidth);
        }
        return outputArray;
    }
}

if (global.testing) {
    global.CssFrame = CssFrame;
}
