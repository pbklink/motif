/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    AdaptedRevgridGridSettings,
    AdiService,
    AppStorageService,
    CellPainterFactoryService,
    EditableGridLayoutDefinitionColumnList,
    GridField,
    LockOpenListItem,
    NotificationChannelsService,
    ReferenceableDataSourceDefinitionsStoreService,
    ReferenceableDataSourcesService,
    ReferenceableGridLayoutsService,
    SessionInfoService,
    SettingsService,
    SymbolsService,
    TableFieldSourceDefinitionCachingFactoryService,
    TableRecordSourceFactory,
    TextFormatterService
} from '@motifmarkets/motif-core';
import { RevFieldCustomHeadingsService } from '@xilytix/rev-data-source';
import { ToastService } from 'component-services-internal-api';
import { BalancesFrame } from './balances/internal-api';
import { BrokerageAccountsFrame } from './brokerage-accounts/internal-api';
import { DepthSideFrame } from './depth-side/internal-api';
import { DepthFrame } from './depth/internal-api';
import { FeedsFrame } from './feeds/internal-api';
import { GridLayoutEditorAllowedFieldsFrame, GridLayoutEditorColumnsFrame } from './grid-layout-dialog/internal-api';
import { HoldingsFrame } from './holdings/internal-api';
import { LitIvemIdListFrame } from './lit-ivem-id-list/lit-ivem-id-list-frame';
import { LockOpenNotificationChannelsGridFrame } from './lock-open-notification-channels/internal-api';
import { MarketsFrame } from './markets/internal-api';
import { OrderAuthoriseFrame } from './order-authorise/internal-api';
import { PadOrderRequestStepFrame, ResultOrderRequestStepFrame, ReviewOrderRequestStepFrame } from './order-request-step/internal-api';
import { OrdersFrame } from './orders/internal-api';
import { ScanEditorAttachedNotificationChannelsGridFrame, ScanFieldEditorFramesGridFrame, ScanListFrame, ScanTestMatchesFrame } from './scan/internal-api';
import { SearchSymbolsFrame } from './search-symbols/internal-api';
import { StatusSummaryFrame } from './status-summary/internal-api';
import { TableRecordSourceDefinitionFactoryService } from './table-record-source-definition-factory-service';
import { TradesFrame } from './trades/internal-api';
import { WatchlistFrame } from './watchlist/internal-api';
import { ZenithStatusFrame } from './zenith-status/internal-api';

export class ContentService {
    constructor(
        private readonly _settingsService: SettingsService,
        private readonly _appStorageService: AppStorageService,
        private readonly _adiService: AdiService,
        private readonly _symbolsService: SymbolsService,
        private readonly _notificationChannelsService: NotificationChannelsService,
        private readonly _textFormatterService: TextFormatterService,
        private readonly _gridFieldCustomHeadingsService: RevFieldCustomHeadingsService,
        private readonly _referenceableGridLayoutsService: ReferenceableGridLayoutsService,
        private readonly _tableFieldSourceDefinitionCachingFactoryService: TableFieldSourceDefinitionCachingFactoryService,
        private readonly _tableRecordSourceDefinitionFactoryService: TableRecordSourceDefinitionFactoryService,
        private readonly _tableRecordSourceFactory: TableRecordSourceFactory,
        private readonly _referenceableDataSourceDefinitionsStoreService: ReferenceableDataSourceDefinitionsStoreService,
        private readonly _referenceableDataSourcesService: ReferenceableDataSourcesService,
        private readonly _sessionInfoService: SessionInfoService,
        private readonly _cellPainterFactoryService: CellPainterFactoryService,
        private readonly _toastService: ToastService,
) { }

    createZenithStatusFrame(componentAccess: ZenithStatusFrame.ComponentAccess, zenithEndpoints: readonly string[]) {
        return new ZenithStatusFrame(componentAccess, this._adiService, zenithEndpoints);
    }

    createFeedsFrame() {
        return new FeedsFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
        );
    }

    createMarketsFrame(componentAccess: MarketsFrame.ComponentAccess) {
        return new MarketsFrame(componentAccess, this._settingsService.scalar, this._adiService, this._textFormatterService);
    }

    // createGridSourceFrame(
    //     componentAccess: GridSourceFrame.ComponentAccess,
    //     hostElement: HTMLElement,
    //     customGridSettings: AdaptedRevgrid.CustomGridSettings,
    //     customiseSettingsForNewColumnEventer: AdaptedRevgrid.CustomiseSettingsForNewColumnEventer,
    //     getMainCellPainterEventer: Subgrid.GetCellPainterEventer<AdaptedRevgridBehavioredColumnSettings, GridField>,
    //     getHeaderCellPainterEventer: Subgrid.GetCellPainterEventer<AdaptedRevgridBehavioredColumnSettings, GridField>,
    // ) {
    //     return new GridSourceFrame(
    //         this._settingsService,
    //         this._namedGridLayoutDefinitionsService,
    //         this._tableRecordSourceFactoryService,
    //         this._namedGridSourcesService,
    //         componentAccess,
    //         hostElement,
    //         customGridSettings,
    //         customiseSettingsForNewColumnEventer,
    //         getMainCellPainterEventer,
    //         getHeaderCellPainterEventer,
    //     );
    // }

    createLitIvemIdListFrame(initialCustomGridSettings: Partial<AdaptedRevgridGridSettings> | undefined) {
        return new LitIvemIdListFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
            initialCustomGridSettings,
        );
    }

    createWatchlistFrame() {
        return new WatchlistFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
        );
    }

    createScanTestMatchesFrame() {
        return new ScanTestMatchesFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
        );
    }

    createBrokerageAccountsFrame() {
        return new BrokerageAccountsFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
        );
    }

    createOrdersFrame() {
        return new OrdersFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
        );
    }

    createOrderAuthoriseFrame() {
        return new OrderAuthoriseFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
        );
    }

    createHoldingsFrame() {
        return new HoldingsFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
        );
    }

    createBalancesFrame() {
        return new BalancesFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
        );
    }

    createSearchSymbolsFrame() {
        return new SearchSymbolsFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
        );
    }

    createScanListFrame() {
        return new ScanListFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
        );
    }

    createScanFieldEditorFramesGridFrame() {
        return new ScanFieldEditorFramesGridFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
        );
    }

    createScanEditorAttachedNotificationChannelsGridFrame(opener: LockOpenListItem.Opener) {
        return new ScanEditorAttachedNotificationChannelsGridFrame(
            this._settingsService,
            this._notificationChannelsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
            opener,
        );
    }

    createLockOpenNotificationChannelsGridFrame(opener: LockOpenListItem.Opener) {
        return new LockOpenNotificationChannelsGridFrame(
            this._settingsService,
            this._notificationChannelsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
            opener,
        );
    }

    createGridLayoutEditorAllowedFieldsFrame(allowedFields: readonly GridField[], columnList: EditableGridLayoutDefinitionColumnList) {
        return new GridLayoutEditorAllowedFieldsFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
            allowedFields,
            columnList,
        );
    }

    createGridLayoutEditorColumnsFrame(columnList: EditableGridLayoutDefinitionColumnList) {
        return new GridLayoutEditorColumnsFrame(
            this._settingsService,
            this._gridFieldCustomHeadingsService,
            this._referenceableGridLayoutsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this._tableRecordSourceDefinitionFactoryService,
            this._tableRecordSourceFactory,
            this._referenceableDataSourcesService,
            this._cellPainterFactoryService,
            this._toastService,
            columnList,
        );
    }

    createStatusSummaryFrame(sessionInfoService: SessionInfoService, componentAccess: StatusSummaryFrame.ComponentAccess) {
        return new StatusSummaryFrame(this._adiService, sessionInfoService, componentAccess,);
    }

    createDepthSideFrame(hostElement: HTMLElement) {
        return new DepthSideFrame(
            this._settingsService,
            this._sessionInfoService,
            this._cellPainterFactoryService,
            hostElement
        );
    }

    createDepthFrame(componentAccess: DepthFrame.ComponentAccess) {
        return new DepthFrame(componentAccess, this._adiService);
    }

    createTradesFrame(componentAccess: TradesFrame.ComponentAccess) {
        return new TradesFrame(this._settingsService, this._adiService, this._cellPainterFactoryService, componentAccess);
    }

    createPadOrderRequestStepFrame(componentAccess: PadOrderRequestStepFrame.ComponentAccess) {
        return new PadOrderRequestStepFrame(componentAccess, this._symbolsService);
    }

    createResultOrderRequestStepFrame(componentAccess: ResultOrderRequestStepFrame.ComponentAccess) {
        return new ResultOrderRequestStepFrame(componentAccess, this._adiService);
    }

    createReviewOrderRequestStepFrame(componentAccess: ReviewOrderRequestStepFrame.ComponentAccess) {
        return new ReviewOrderRequestStepFrame(componentAccess);
    }
}
