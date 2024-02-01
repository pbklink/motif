/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { AltCodeSubbedScanField, ChangeSubscribableComparableList, ScanField, ScanFieldCondition, ScanFormula } from '@motifmarkets/motif-core';
import { ScanFieldEditorFrame } from './scan-field-editor-frame';
import { ScanFieldConditionEditorFrame, TextHasValueContainsScanFieldConditionEditorFrame } from './condition/internal-api';

export class AltCodeSubbedScanFieldEditorFrame extends ScanFieldEditorFrame implements AltCodeSubbedScanField {
    declare readonly typeId: AltCodeSubbedScanFieldEditorFrame.TypeId;
    declare readonly fieldId: AltCodeSubbedScanFieldEditorFrame.FieldId;
    declare readonly subFieldId: AltCodeSubbedScanFieldEditorFrame.SubFieldId;
    declare readonly conditionTypeId: AltCodeSubbedScanFieldEditorFrame.ConditionTypeId;

    override conditions =
        new ChangeSubscribableComparableList<TextHasValueContainsScanFieldConditionEditorFrame, ScanFieldConditionEditorFrame>()

    constructor(subFieldId: AltCodeSubbedScanFieldEditorFrame.SubFieldId,
        removeMeEventer: ScanFieldEditorFrame.RemoveMeEventHandler,
        changedEventer: ScanFieldEditorFrame.ChangedEventHandler,
    ) {
        super(
            AltCodeSubbedScanFieldEditorFrame.typeId,
            AltCodeSubbedScanFieldEditorFrame.fieldId,
            subFieldId,
            AltCodeSubbedScanFieldEditorFrame.conditionTypeId,
            removeMeEventer,
            changedEventer,
        );
    }
}

export namespace AltCodeSubbedScanFieldEditorFrame {
    export type TypeId = ScanField.TypeId.AltCodeSubbed;
    export const typeId = ScanField.TypeId.AltCodeSubbed;
    export type FieldId = ScanFormula.FieldId.AltCodeSubbed;
    export const fieldId = ScanFormula.FieldId.AltCodeSubbed;
    export type SubFieldId = ScanFormula.AltCodeSubFieldId;
    export type ConditionTypeId = ScanFieldCondition.TypeId.TextHasValueContains;
    export const conditionTypeId = ScanFieldCondition.TypeId.TextHasValueContains;
}
