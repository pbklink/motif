/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { ChangeSubscribableComparableList, ScanField, ScanFieldCondition, ScanFormula, StringOverlapsScanField, UnreachableCaseError } from '@motifmarkets/motif-core';
import { OverlapsScanFieldConditionEditorFrame, ScanFieldConditionEditorFrame, StringOverlapsScanFieldConditionEditorFrame } from './condition/internal-api';
import { NotSubbedScanFieldEditorFrame } from './not-subbed-scan-field-editor-frame';
import { ScanFieldEditorFrame } from './scan-field-editor-frame';

export class StringOverlapsScanFieldEditorFrame extends NotSubbedScanFieldEditorFrame implements StringOverlapsScanField {
    declare readonly typeId: StringOverlapsScanFieldEditorFrame.TypeId;
    declare readonly fieldId: StringOverlapsScanFieldEditorFrame.FieldId;
    declare readonly conditions: StringOverlapsScanFieldEditorFrame.Conditions;
    declare readonly conditionTypeId: StringOverlapsScanFieldEditorFrame.ConditionTypeId;

    constructor(
        fieldId: StringOverlapsScanFieldEditorFrame.FieldId,
        name: string,
        removeMeEventer: ScanFieldEditorFrame.RemoveMeEventHandler,
        changedEventer: ScanFieldEditorFrame.ChangedEventHandler,
    ) {
        super(
            StringOverlapsScanFieldEditorFrame.typeId,
            fieldId,
            name,
            new StringOverlapsScanFieldEditorFrame.conditions(),
            StringOverlapsScanFieldEditorFrame.conditionTypeId,
            removeMeEventer,
            changedEventer,
        );
    }

    override get supportedOperatorIds() { return OverlapsScanFieldConditionEditorFrame.supportedOperatorIds; }

    override addCondition(operatorId: StringOverlapsScanFieldEditorFrame.OperatorId) {
        const conditionEditorFrame = this.createCondition(operatorId);
        this.conditions.add(conditionEditorFrame);
    }

    private createCondition(operatorId: StringOverlapsScanFieldEditorFrame.OperatorId): StringOverlapsScanFieldConditionEditorFrame {
        const { removeMeEventer, changedEventer } = this.createConditionEditorFrameEventers();
        switch (operatorId) {
            case ScanFieldCondition.OperatorId.Overlaps:
            case ScanFieldCondition.OperatorId.NotOverlaps:
                return new StringOverlapsScanFieldConditionEditorFrame(operatorId, [], removeMeEventer, changedEventer);
            default:
                throw new UnreachableCaseError('SOSFEFCC22298', operatorId);
        }
    }
}

export namespace StringOverlapsScanFieldEditorFrame {
    export type TypeId = ScanField.TypeId.StringOverlaps;
    export const typeId = ScanField.TypeId.StringOverlaps;
    export type FieldId = ScanFormula.StringOverlapsFieldId;
    export type Conditions = ChangeSubscribableComparableList<StringOverlapsScanFieldConditionEditorFrame, ScanFieldConditionEditorFrame>;
    export const conditions = ChangeSubscribableComparableList<StringOverlapsScanFieldConditionEditorFrame, ScanFieldConditionEditorFrame>;
    export type ConditionTypeId = ScanFieldCondition.TypeId.StringOverlaps;
    export const conditionTypeId = ScanFieldCondition.TypeId.StringOverlaps;
    export type OperatorId = OverlapsScanFieldConditionEditorFrame.OperatorId;
}
