/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { ChangeSubscribableComparableList, DateInRangeScanField, ScanField, ScanFieldCondition, ScanFormula } from '@motifmarkets/motif-core';
import { DateScanFieldConditionEditorFrame, ScanFieldConditionEditorFrame } from './condition/internal-api';
import { NotSubbedScanFieldEditorFrame } from './not-subbed-scan-field-editor-frame';
import { ScanFieldEditorFrame } from './scan-field-editor-frame';

export class DateInRangeScanFieldEditorFrame extends NotSubbedScanFieldEditorFrame implements DateInRangeScanField {
    declare readonly typeId: DateInRangeScanFieldEditorFrame.TypeId;
    declare readonly fieldId: DateInRangeScanFieldEditorFrame.FieldId;
    declare readonly conditionTypeId: DateInRangeScanFieldEditorFrame.ConditionTypeId;

    override conditions =
        new ChangeSubscribableComparableList<DateScanFieldConditionEditorFrame, ScanFieldConditionEditorFrame>()

    constructor(fieldId: DateInRangeScanFieldEditorFrame.FieldId,
        removeMeEventer: ScanFieldEditorFrame.RemoveMeEventHandler,
        changedEventer: ScanFieldEditorFrame.ChangedEventHandler,
    ) {
        super(
            DateInRangeScanFieldEditorFrame.typeId,
            fieldId,
            DateInRangeScanFieldEditorFrame.conditionTypeId,
            removeMeEventer,
            changedEventer,
        );
    }
}

export namespace DateInRangeScanFieldEditorFrame {
    export type TypeId = ScanField.TypeId.DateInRange;
    export const typeId = ScanField.TypeId.DateInRange;
    export type FieldId = ScanFormula.DateRangeFieldId;
    export type ConditionTypeId = ScanFieldCondition.TypeId.Date;
    export const conditionTypeId = ScanFieldCondition.TypeId.Date;
}
