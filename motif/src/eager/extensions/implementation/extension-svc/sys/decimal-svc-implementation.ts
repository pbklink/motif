/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { SysDecimal, cloneDecimal, newDecimal } from '@motifmarkets/motif-core';
import { Decimal as DecimalApi, DecimalSvc } from '../../../api/extension-api';
import { DecimalImplementation } from '../../exposed/sys/decimal-implementation';

export class DecimalSvcImplementation implements DecimalSvc {
    get ROUND_UP() { return SysDecimal.ROUND_UP; }
    get ROUND_DOWN() { return SysDecimal.ROUND_DOWN; }
    get ROUND_CEIL() { return SysDecimal.ROUND_CEIL; }
    get ROUND_FLOOR() { return SysDecimal.ROUND_FLOOR; }
    get ROUND_HALF_UP() { return SysDecimal.ROUND_HALF_UP; }
    get ROUND_HALF_DOWN() { return SysDecimal.ROUND_HALF_DOWN; }
    get ROUND_HALF_EVEN() { return SysDecimal.ROUND_HALF_EVEN; }
    get ROUND_HALF_CEIL() { return SysDecimal.ROUND_HALF_CEIL; }
    get ROUND_HALF_FLOOR() { return SysDecimal.ROUND_HALF_FLOOR; }

    // The maximum number of significant digits of the result of a calculation or base conversion.
    // E.g. `Decimal.config({ precision: 20 });`
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    get precision() { return SysDecimal.getPrecision(); }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    set precision(value: number) { SysDecimal.setPrecision(value); }

    // The rounding mode used by default by `toInteger`, `toDecimalPlaces`, `toExponential`,
    // `toFixed`, `toPrecision` and `toSignificantDigits`.
    //
    // E.g.
    // `Decimal.rounding = 4;`
    // `Decimal.rounding = Decimal.ROUND_HALF_UP;`
    // eslint-disable-next-line @typescript-eslint/member-ordering
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    get rounding(): SysDecimal.Rounding { return SysDecimal.getRounding(); }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    set rounding(value: SysDecimal.Rounding) { SysDecimal.setRounding(value); }

    // The exponent value at and beneath which `toString` returns exponential notation.
    // JavaScript numbers: -7
    // 0 to MAX_E
    // eslint-disable-next-line @typescript-eslint/member-ordering
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    get toExpNeg() { return SysDecimal.getToExpNeg(); }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    set toExpNeg(value: number) { SysDecimal.setToExpNeg(value); }

    // The exponent value at and above which `toString` returns exponential notation.
    // JavaScript numbers: 21
    // 0 to MAX_E
    // eslint-disable-next-line @typescript-eslint/member-ordering
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    get toExpPos() { return SysDecimal.getToExpPos(); }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    set toExpPos(value: number) { SysDecimal.setToExpPos(value); }

    // The natural logarithm of 10.
    // eslint-disable-next-line @typescript-eslint/member-ordering
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    get LN10() { return SysDecimal.getLN10(); }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    set LN10(value: SysDecimal) { SysDecimal.setLN10(value); }

    /**
     * The Decimal constructor and exported function.
     * Return a new Decimal instance.
     *
     * @param value {number|string|SysDecimal} A numeric value.
     *
     */
    create(value: DecimalApi.Numeric, config?: DecimalSvc.Config): DecimalApi {
        let actual: SysDecimal;
        if (config === undefined) {
            actual = newDecimal(value);
        } else {
            const decimalConstructor = cloneDecimal(config);
            actual = new decimalConstructor(value);
        }
        return new DecimalImplementation(actual);
    }

    /**
     * Configure global settings for a Decimal constructor.
     */
    config(config: DecimalSvc.Config) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        SysDecimal.config(config);
    }

    /**
     * Configure global settings for a Decimal constructor.
     */
    set(config: DecimalSvc.Config) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        SysDecimal.set(config);
    }
}
