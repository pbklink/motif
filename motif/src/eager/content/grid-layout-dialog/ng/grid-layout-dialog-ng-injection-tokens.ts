/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { InjectionToken } from '@angular/core';
import { AllowedGridField, AllowedSourcedFieldsColumnLayoutDefinition, BidAskColumnLayoutDefinitions, BidAskPair, EditableColumnLayoutDefinitionColumnList } from '@motifmarkets/motif-core';


export type BidAskAllowedGridFields = BidAskPair<readonly AllowedGridField[]>;

const allowedFieldsTokenName = 'allowedFields';
export const allowedFieldsInjectionToken = new InjectionToken<AllowedGridField[]>(allowedFieldsTokenName);
const oldLayoutDefinitionTokenName = 'oldLayoutDefinition';
export const oldLayoutDefinitionInjectionToken = new InjectionToken<AllowedSourcedFieldsColumnLayoutDefinition>(oldLayoutDefinitionTokenName);
const definitionColumnListTokenName = 'definitionColumnList';
export const definitionColumnListInjectionToken = new InjectionToken<EditableColumnLayoutDefinitionColumnList>(definitionColumnListTokenName);
const bidAskAllowedFieldsTokenName = 'bidAskAllowedFields';
export const bidAskAllowedFieldsInjectionToken = new InjectionToken<BidAskAllowedGridFields>(bidAskAllowedFieldsTokenName);
const oldBidAskLayoutDefinitionTokenName = 'bidAskOldLayoutDefinition';
export const oldBidAskLayoutDefinitionInjectionToken = new InjectionToken<BidAskColumnLayoutDefinitions>(oldBidAskLayoutDefinitionTokenName);
