/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { DateScanFieldCondition, ScanFieldCondition, SourceTzOffsetDateTime } from '@motifmarkets/motif-core';
import { NegatableOperator } from '../negatableOperator';
import { ScanFieldConditionOperandsEditorFrame } from '../scan-field-condition-operands-editor-frame';

export interface DateValueScanFieldConditionOperandsEditorFrame extends ScanFieldConditionOperandsEditorFrame, NegatableOperator {
    readonly operandsTypeId: ScanFieldCondition.Operands.TypeId.DateValue,
    operatorId: DateValueScanFieldConditionOperandsEditorFrame.OperatorId;
    value: SourceTzOffsetDateTime | undefined;
}

export namespace DateValueScanFieldConditionOperandsEditorFrame {
    export type OperatorId = DateScanFieldCondition.ValueOperands.OperatorId;
}
