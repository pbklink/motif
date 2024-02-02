/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { ChangeSubscribableComparableList, ScanField, ScanFieldCondition, ScanFormula, TextEqualsScanField } from '@motifmarkets/motif-core';
import { ScanFieldConditionEditorFrame, TextEqualsScanFieldConditionEditorFrame } from './condition/internal-api';
import { NotSubbedScanFieldEditorFrame } from './not-subbed-scan-field-editor-frame';
import { ScanFieldEditorFrame } from './scan-field-editor-frame';

export class TextEqualsScanFieldEditorFrame extends NotSubbedScanFieldEditorFrame implements TextEqualsScanField {
    declare readonly typeId: TextEqualsScanFieldEditorFrame.TypeId;
    declare readonly fieldId: TextEqualsScanFieldEditorFrame.FieldId;
    declare readonly conditions: TextEqualsScanFieldEditorFrame.Conditions;
    declare readonly conditionTypeId: TextEqualsScanFieldEditorFrame.ConditionTypeId;

    constructor(
        fieldId: TextEqualsScanFieldEditorFrame.FieldId,
        name: string,
        removeMeEventer: ScanFieldEditorFrame.RemoveMeEventHandler,
        changedEventer: ScanFieldEditorFrame.ChangedEventHandler,
    ) {
        super(
            TextEqualsScanFieldEditorFrame.typeId,
            fieldId,
            name,
            new TextEqualsScanFieldEditorFrame.conditions(),
            TextEqualsScanFieldEditorFrame.conditionTypeId,
            removeMeEventer,
            changedEventer,
        );
    }
}

export namespace TextEqualsScanFieldEditorFrame {
    export type TypeId = ScanField.TypeId.TextEquals;
    export const typeId = ScanField.TypeId.TextEquals;
    export type FieldId = ScanFormula.TextEqualsFieldId;
    export type Conditions = ChangeSubscribableComparableList<TextEqualsScanFieldConditionEditorFrame, ScanFieldConditionEditorFrame>;
    export const conditions = ChangeSubscribableComparableList<TextEqualsScanFieldConditionEditorFrame, ScanFieldConditionEditorFrame>;
    export type ConditionTypeId = ScanFieldCondition.TypeId.TextEquals;
    export const conditionTypeId = ScanFieldCondition.TypeId.TextEquals;
}
