/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    AdiService,
    AppStorageService,
    LockOpenListItem,
    NamedGridLayoutDefinitionsService,
    NamedGridSourceDefinitionsService,
    ScansService,
    SessionInfoService,
    SettingsService,
    SharedGridSourcesService,
    SymbolsService,
    TableRecordSourceFactoryService,
    TextFormatterService
} from '@motifmarkets/motif-core';
import { ContentFrame } from './content-frame';
import { DepthSideFrame } from './depth-side/internal-api';
import { DepthFrame } from './depth/internal-api';
import { FeedsFrame } from './feeds/internal-api';
import { GridSourceFrame } from './grid-source/internal-api';
import { MarketsFrame } from './markets/internal-api';
import { PadOrderRequestStepFrame, ResultOrderRequestStepFrame, ReviewOrderRequestStepFrame } from './order-request-step/internal-api';
import { ScansFrame } from './scan/internal-api';
import { StatusSummaryFrame } from './status-summary/internal-api';
import { TradesFrame } from './trades/internal-api';
import { ZenithStatusFrame } from './zenith-status/internal-api';

export class ContentService {
    constructor(
        private _settingsService: SettingsService,
        private readonly _symbolsService: SymbolsService,
        private readonly _appStorageService: AppStorageService,
        private readonly _adiService: AdiService,
        private readonly _textFormatterService: TextFormatterService,
        private readonly _tableRecordSourceFactoryService: TableRecordSourceFactoryService,
        private readonly _namedGridLayoutDefinitionsService: NamedGridLayoutDefinitionsService,
        private readonly _namedGridSourceDefinitionsService: NamedGridSourceDefinitionsService,
        private readonly _sharedGridSourcesService: SharedGridSourcesService,
) { }

    createZenithStatusFrame(componentAccess: ZenithStatusFrame.ComponentAccess, zenithEndpoints: readonly string[]) {
        return new ZenithStatusFrame(componentAccess, this._adiService, zenithEndpoints);
    }

    createFeedsFrame(componentAccess: FeedsFrame.ComponentAccess) {
        return new FeedsFrame(componentAccess, this._namedGridSourceDefinitionsService);
    }

    createMarketsFrame(componentAccess: MarketsFrame.ComponentAccess) {
        return new MarketsFrame(componentAccess, this._settingsService.core, this._adiService, this._textFormatterService);
    }

    createGridSourceFrame(componentAccess: GridSourceFrame.ComponentAccess, opener: LockOpenListItem.Opener) {
        return new GridSourceFrame(
            componentAccess,
            this._settingsService,
            this._tableRecordSourceFactoryService,
            this._namedGridLayoutDefinitionsService,
            this._namedGridSourceDefinitionsService,
            this._sharedGridSourcesService,
        );
    }

    createStatusSummaryFrame(componentAccess: StatusSummaryFrame.ComponentAccess, sessionInfoService: SessionInfoService) {
        return new StatusSummaryFrame(componentAccess, this._adiService, sessionInfoService);
    }

    createDepthSideFrame(componentAccess: DepthSideFrame.ComponentAccess) {
        return new DepthSideFrame(componentAccess);
    }

    createDepthFrame(componentAccess: DepthFrame.ComponentAccess) {
        return new DepthFrame(componentAccess, this._adiService);
    }

    createScansFrame(componentAccess: ScansFrame.ComponentAccess, scansService: ScansService) {
        return new ScansFrame(componentAccess, scansService, this._adiService);
    }

    createTradesFrame(componentAccess: TradesFrame.ComponentAccess) {
        return new TradesFrame(componentAccess, this._adiService);
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

    finaliseContentFrame(contentFrame: ContentFrame): void {
        contentFrame.finalise();
    }
}
