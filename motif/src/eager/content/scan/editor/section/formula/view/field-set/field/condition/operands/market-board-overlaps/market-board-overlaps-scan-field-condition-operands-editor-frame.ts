/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { MarketBoardId } from '@motifmarkets/motif-core';
import { NegatableOperator } from '../negatableOperator';
import { OverlapsScanFieldConditionOperandsEditorFrame } from '../overlaps/internal-api';

export interface MarketBoardOverlapsScanFieldConditionOperandsEditorFrame extends OverlapsScanFieldConditionOperandsEditorFrame, NegatableOperator {
    values: readonly MarketBoardId[];
}
