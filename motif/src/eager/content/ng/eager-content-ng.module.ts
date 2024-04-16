/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { EagerControlsNgModule } from 'controls-ng-api';
import { RowDataArrayGridNgComponent } from '../adapted-revgrid/ng-api';
import {
    AdvertTickerNgComponent, AdvertWebPageNgComponent, BannerAdvertNgComponent
} from '../advert/ng-api';
import { BalancesNgComponent } from '../balances/ng-api';
import { BrokerageAccountsNgComponent } from '../brokerage-accounts/ng-api';
import { CashHoldingsNgComponent } from '../cash-holdings/ng-api';
import { ColorControlsNgComponent } from '../color-controls/ng-api';
import { ColorSchemeGridNgComponent } from '../color-scheme-grid/ng-api';
import { ColorSchemeItemPropertiesNgComponent } from '../color-scheme-item-properties/ng-api';
import { ColorSchemePresetCodeNgComponent } from '../color-scheme-preset-code/ng-api';
import { DelayedBadnessNgComponent } from '../delayed-badness/ng-api';
import { DepthAndSalesColumnLayoutsDialogNgComponent } from '../depth-and-sales-grid-layouts-dialog/ng-api';
import { DepthColumnLayoutsDialogNgComponent } from '../depth-grid-layouts-dialog/ng-api';
import { DepthSideNgComponent } from '../depth-side/ng-api';
import { DepthNgComponent } from '../depth/ng-api';
import { ExchangeSettingsNgComponent } from '../exchange-settings/ng-api';
import { ExpandableCollapsibleLinedHeadingNgComponent } from '../expandable-collapsible-lined-heading/ng-api';
import {
    AvailableExtensionListNgComponent,
    ExtensionDetailNgComponent,
    ExtensionListInfoItemNgComponent,
    ExtensionListRegisteredItemNgComponent,
    ExtensionListsNgComponent,
    ExtensionsSearchNgComponent,
    ExtensionsSidebarNgComponent,
    InstalledExtensionListNgComponent
} from '../extensions/ng-api';
import { FeedsNgComponent } from '../feeds/ng-api';
import {
    ColumnLayoutDialogNgComponent,
    ColumnLayoutEditorAllowedFieldsNgComponent,
    ColumnLayoutEditorColumnsNgComponent,
    ColumnLayoutEditorFieldControlsNgComponent,
    ColumnLayoutEditorNgComponent,
    ColumnLayoutEditorSearchGridNgComponent
} from '../grid-layout-dialog/ng-api';
import { HoldingsColumnLayoutsDialogNgComponent } from '../holdings-grid-layouts-dialog/ng-api';
import { HoldingsNgComponent } from '../holdings/ng-api';
import { IvemHoldingsNgComponent } from '../ivem-holdings/ng-api';
import { LitIvemIdListEditorDialogNgComponent, LitIvemIdListEditorNgComponent } from '../lit-ivem-id-list-editor/ng-api';
import { LitIvemIdListNgComponent } from '../lit-ivem-id-list/ng-api';
import { LockOpenNotificationChannelPropertiesNgComponent, LockOpenNotificationChannelsGridNgComponent } from '../lock-open-notification-channels/ng-api';
import { MarketsNgComponent } from '../markets/ng-api';
import { MultiColorPickerNgComponent } from '../multi-color-picker/ng/multi-color-picker-ng.component';
import { NameableColumnLayoutEditorDialogNgComponent } from '../nameable-grid-layout-editor-dialog/ng-api';
import { OpenWatchlistDialogNgComponent, SymbolListDirectoryGridNgComponent } from '../open-watchlist/ng-api';
import { OrderAuthoriseNgComponent } from '../order-authorise/ng-api';
import {
    PadOrderRequestStepNgComponent,
    ResultOrderRequestStepNgComponent,
    ReviewAmendOrderRequestNgComponent,
    ReviewCancelOrderRequestNgComponent,
    ReviewMoveOrderRequestNgComponent,
    ReviewOrderRequestStepNgComponent,
    ReviewOrderRequestZenithMessageNgComponent,
    ReviewPlaceOrderRequestNgComponent
} from '../order-request-step/ng-api';
import { OrdersNgComponent } from '../orders/ng-api';
import { SaveWatchlistDialogNgComponent } from '../save-watchlist/dialog/ng-api';
import {
    CategoryValueScanFieldConditionOperandsEditorNgComponent,
    ConditionSetScanFormulaViewNgComponent,
    CriteriaZenithScanFormulaViewNgComponent,
    CurrencyOverlapsScanFieldConditionOperandsEditorNgComponent,
    DateRangeScanFieldConditionOperandsEditorNgComponent,
    DateValueScanFieldConditionOperandsEditorNgComponent,
    DeleteScanFieldConditionNgComponent,
    ExchangeOverlapsScanFieldConditionOperandsEditorNgComponent,
    FormulaScanEditorSectionNgComponent,
    GeneralScanEditorSectionNgComponent,
    HasValueScanFieldConditionOperandsEditorNgComponent,
    MarketBoardOverlapsScanFieldConditionOperandsEditorNgComponent,
    MarketOverlapsScanFieldConditionOperandsEditorNgComponent,
    NumericComparisonValueScanFieldConditionOperandsEditorNgComponent,
    NumericRangeScanFieldConditionOperandsEditorNgComponent,
    NumericValueScanFieldConditionOperandsEditorNgComponent,
    RankZenithScanFormulaViewNgComponent,
    ScanEditorAttachedNotificationChannelPropertiesNgComponent,
    ScanEditorAttachedNotificationChannelsGridNgComponent,
    ScanEditorAttachedNotificationChannelsNgComponent,
    ScanEditorNgComponent,
    ScanEditorTargetsNgComponent,
    ScanFieldEditorFramesGridNgComponent,
    ScanFieldEditorNgComponent,
    ScanFieldSetEditorNgComponent,
    ScanListNgComponent,
    ScanTestMatchesNgComponent,
    ScanTestNgComponent,
    ScanTypeDescriptionNgComponent,
    ScanTypesControlsNgComponent,
    ScanTypesGridNgComponent,
    StringOverlapsScanFieldConditionOperandsEditorNgComponent,
    TextContainsScanFieldConditionOperandsEditorNgComponent,
    TextValueScanFieldConditionOperandsEditorNgComponent,
    ZenithScanFormulaViewDecodeProgressNgComponent,
} from '../scan/ng-api';
import { SearchSymbolsConditionNgComponent } from '../search-symbols-condition/ng-api';
import { SearchSymbolsNgComponent } from '../search-symbols/ng-api';
import { ExchangesSettingsNgComponent } from '../settings/exchanges-settings/ng-api';
import {
    ColorSettingsNgComponent,
    GeneralSettingsNgComponent,
    GridSettingsNgComponent,
    OrderPadSettingsNgComponent
} from '../settings/ng-api';
import { StaticInitialise } from '../static-initialise';
import { StatusSummaryNgComponent } from '../status-summary/ng-api';
import { TradesNgComponent } from '../trades/ng-api';
import { WatchlistNgComponent } from '../watchlist/ng-api';
import { ZenithStatusNgComponent } from '../zenith-status/ng-api';

@NgModule({
    declarations: [
        AdvertTickerNgComponent,
        AdvertWebPageNgComponent,
        AvailableExtensionListNgComponent,
        BalancesNgComponent,
        BannerAdvertNgComponent,
        BrokerageAccountsNgComponent,
        CashHoldingsNgComponent,
        CategoryValueScanFieldConditionOperandsEditorNgComponent,
        ColorControlsNgComponent,
        ColorSchemeGridNgComponent,
        ColorSchemeItemPropertiesNgComponent,
        ColorSchemePresetCodeNgComponent,
        ColorSettingsNgComponent,
        ConditionSetScanFormulaViewNgComponent,
        CriteriaZenithScanFormulaViewNgComponent,
        CurrencyOverlapsScanFieldConditionOperandsEditorNgComponent,
        DateRangeScanFieldConditionOperandsEditorNgComponent,
        DateValueScanFieldConditionOperandsEditorNgComponent,
        DelayedBadnessNgComponent,
        DeleteScanFieldConditionNgComponent,
        DepthAndSalesColumnLayoutsDialogNgComponent,
        DepthColumnLayoutsDialogNgComponent,
        DepthNgComponent,
        DepthSideNgComponent,
        ExchangeOverlapsScanFieldConditionOperandsEditorNgComponent,
        ExchangeSettingsNgComponent,
        ExchangesSettingsNgComponent,
        ExpandableCollapsibleLinedHeadingNgComponent,
        ExtensionDetailNgComponent,
        ExtensionListInfoItemNgComponent,
        ExtensionListRegisteredItemNgComponent,
        ExtensionListsNgComponent,
        ExtensionsSearchNgComponent,
        ExtensionsSidebarNgComponent,
        FeedsNgComponent,
        FormulaScanEditorSectionNgComponent,
        GeneralScanEditorSectionNgComponent,
        GeneralSettingsNgComponent,
        ColumnLayoutDialogNgComponent,
        ColumnLayoutEditorAllowedFieldsNgComponent,
        ColumnLayoutEditorColumnsNgComponent,
        ColumnLayoutEditorFieldControlsNgComponent,
        ColumnLayoutEditorNgComponent,
        ColumnLayoutEditorSearchGridNgComponent,
        GridSettingsNgComponent,
        HasValueScanFieldConditionOperandsEditorNgComponent,
        HoldingsColumnLayoutsDialogNgComponent,
        HoldingsNgComponent,
        InstalledExtensionListNgComponent,
        IvemHoldingsNgComponent,
        LitIvemIdListEditorDialogNgComponent,
        LitIvemIdListEditorNgComponent,
        LitIvemIdListNgComponent,
        LockOpenNotificationChannelPropertiesNgComponent,
        LockOpenNotificationChannelsGridNgComponent,
        MarketBoardOverlapsScanFieldConditionOperandsEditorNgComponent,
        MarketOverlapsScanFieldConditionOperandsEditorNgComponent,
        MarketsNgComponent,
        MultiColorPickerNgComponent,
        NameableColumnLayoutEditorDialogNgComponent,
        NumericComparisonValueScanFieldConditionOperandsEditorNgComponent,
        NumericRangeScanFieldConditionOperandsEditorNgComponent,
        NumericValueScanFieldConditionOperandsEditorNgComponent,
        ScanEditorAttachedNotificationChannelsGridNgComponent,
        ScanEditorAttachedNotificationChannelPropertiesNgComponent,
        ScanEditorAttachedNotificationChannelsNgComponent,
        OpenWatchlistDialogNgComponent,
        OrderAuthoriseNgComponent,
        OrderPadSettingsNgComponent,
        OrdersNgComponent,
        PadOrderRequestStepNgComponent,
        RankZenithScanFormulaViewNgComponent,
        ResultOrderRequestStepNgComponent,
        ReviewAmendOrderRequestNgComponent,
        ReviewCancelOrderRequestNgComponent,
        ReviewMoveOrderRequestNgComponent,
        ReviewOrderRequestStepNgComponent,
        ReviewOrderRequestZenithMessageNgComponent,
        ReviewPlaceOrderRequestNgComponent,
        RowDataArrayGridNgComponent,
        SaveWatchlistDialogNgComponent,
        ScanEditorNgComponent,
        ScanEditorTargetsNgComponent,
        ScanFieldEditorFramesGridNgComponent,
        ScanFieldEditorNgComponent,
        ScanFieldSetEditorNgComponent,
        ScanListNgComponent,
        ScanTestMatchesNgComponent,
        ScanTestNgComponent,
        ScanTypeDescriptionNgComponent,
        ScanTypesControlsNgComponent,
        ScanTypesGridNgComponent,
        SearchSymbolsConditionNgComponent,
        SearchSymbolsNgComponent,
        StatusSummaryNgComponent,
        StringOverlapsScanFieldConditionOperandsEditorNgComponent,
        SymbolListDirectoryGridNgComponent,
        TextContainsScanFieldConditionOperandsEditorNgComponent,
        TextValueScanFieldConditionOperandsEditorNgComponent,
        TradesNgComponent,
        WatchlistNgComponent,
        ZenithScanFormulaViewDecodeProgressNgComponent,
        ZenithStatusNgComponent,
    ],
    exports: [
        AdvertTickerNgComponent,
        AdvertWebPageNgComponent,
        BalancesNgComponent,
        BannerAdvertNgComponent,
        BrokerageAccountsNgComponent,
        ColorSettingsNgComponent,
        DelayedBadnessNgComponent,
        DepthAndSalesColumnLayoutsDialogNgComponent,
        DepthColumnLayoutsDialogNgComponent,
        DepthNgComponent,
        ExtensionDetailNgComponent,
        ExtensionsSidebarNgComponent,
        FeedsNgComponent,
        GeneralSettingsNgComponent,
        ColumnLayoutDialogNgComponent,
        ColumnLayoutEditorNgComponent,
        GridSettingsNgComponent,
        HoldingsColumnLayoutsDialogNgComponent,
        HoldingsNgComponent,
        LockOpenNotificationChannelPropertiesNgComponent,
        LockOpenNotificationChannelsGridNgComponent,
        MarketsNgComponent,
        NameableColumnLayoutEditorDialogNgComponent,
        OpenWatchlistDialogNgComponent,
        OrderAuthoriseNgComponent,
        OrdersNgComponent,
        PadOrderRequestStepNgComponent,
        ResultOrderRequestStepNgComponent,
        ReviewOrderRequestStepNgComponent,
        RowDataArrayGridNgComponent,
        SaveWatchlistDialogNgComponent,
        ScanEditorNgComponent,
        ScanListNgComponent,
        SearchSymbolsNgComponent,
        StatusSummaryNgComponent,
        TradesNgComponent,
        WatchlistNgComponent,
        ZenithStatusNgComponent,
    ],
    imports: [
        AngularSplitModule,
        AngularSvgIconModule,
        CommonModule,
        EagerControlsNgModule
    ]
})

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class EagerContentNgModule {
    constructor() {
        StaticInitialise.initialise();
    }
}
