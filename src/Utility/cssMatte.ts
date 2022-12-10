
import { Css } from './css';
import { cssNumber, CssNumber } from './cssNumber';

export type cssMatte = Array<cssNumber>;

export class CssMatte {
    public static AsNumberArray(cssMatte: cssMatte, referenceWidth?: number, referenceHeight?: number) {
        const array = new Array<number>(4);
        array.fill(0);
        if (!cssMatte) {
            return array;
        }
        if (cssMatte.length === 0) {
            return array;
        }
        array[Css.Top] = CssNumber.AsNumber(cssMatte[Css.Top], referenceHeight);
        if (cssMatte.length === 1) {
            array[Css.Left] = CssNumber.AsNumber(cssMatte[Css.Top], referenceWidth);
            array[Css.Bottom] = array[Css.Top];
            array[Css.Right] = array[Css.Left];
        }
        else if (cssMatte.length === 2) {
            array[Css.Left] = CssNumber.AsNumber(cssMatte[Css.Left], referenceWidth);
            array[Css.Bottom] = array[Css.Top];
            array[Css.Right] = array[Css.Left];
        }
        else if (cssMatte.length === 3) {
            array[Css.Left] = CssNumber.AsNumber(cssMatte[Css.Left], referenceWidth);
            array[Css.Bottom] = CssNumber.AsNumber(cssMatte[Css.Bottom], referenceHeight);
            array[Css.Right] = array[Css.Left];
        }
        else {
            array[Css.Left] = CssNumber.AsNumber(cssMatte[Css.Left], referenceWidth);
            array[Css.Bottom] = CssNumber.AsNumber(cssMatte[Css.Bottom], referenceHeight);
            array[Css.Right] = CssNumber.AsNumber(cssMatte[Css.Right], referenceWidth);
        }
        return array;
    }
}

if (global.testing) {
    global.CssMatte = CssMatte;
}
