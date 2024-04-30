/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    AdaptedRevgridBehavioredColumnSettings,
    AssertInternalError,
    DataSourceDefinition,
    DataSourceOrReferenceDefinition,
    GridField,
    Integer,
    LitIvemBaseDetail,
    LitIvemDetailFromSearchSymbolsTableRecordSource,
    SearchSymbolsDataDefinition,
    StringId,
    Strings,
    TextFormattableValueRecordGridCellPainter,
    TextHeaderCellPainter,
    TextTextFormattableValueCellPainter
} from '@motifmarkets/motif-core';
import { RevDatalessViewCell } from '@xilytix/revgrid';
import { DelayedBadnessGridSourceFrame } from '../delayed-badness-grid-source/internal-api';

export class SearchSymbolsFrame extends DelayedBadnessGridSourceFrame {
    gridSourceOpenedEventer: SearchSymbolsFrame.GridSourceOpenedEventer | undefined;
    recordFocusedEventer: SearchSymbolsFrame.RecordFocusedEventer | undefined

    private _recordList: LitIvemBaseDetail[];

    private _gridHeaderCellPainter: TextHeaderCellPainter;
    private _gridMainCellPainter: TextFormattableValueRecordGridCellPainter<TextTextFormattableValueCellPainter>;

    private _showFull: boolean;

    get recordList() { return this._recordList; }

    override createGridAndCellPainters(gridHostElement: HTMLElement) {
        const grid = this.createGrid(
            gridHostElement,
            {},
            (columnSettings) => this.customiseSettingsForNewGridColumn(columnSettings),
            (viewCell) => this.getGridMainCellPainter(viewCell),
            (viewCell) => this.getGridHeaderCellPainter(viewCell),
        );

        this._gridHeaderCellPainter = this.cellPainterFactoryService.createTextHeader(grid, grid.headerDataServer);
        this._gridMainCellPainter = this.cellPainterFactoryService.createTextTextFormattableValueRecordGrid(grid, grid.mainDataServer);

        return grid;
    }

    executeRequest(dataDefinition: SearchSymbolsDataDefinition) {
        this.keepPreviousLayoutIfPossible = dataDefinition.fullSymbol === this._showFull;
        this._showFull = dataDefinition.fullSymbol;

        const gridSourceOrReferenceDefinition = this.createDefaultLayoutGridSourceOrReferenceDefinition(dataDefinition);

        const openPromise = this.tryOpenGridSource(gridSourceOrReferenceDefinition, false);
        openPromise.then(
            (result) => {
                if (result.isErr()) {
                    this._toastService.popup(`${Strings[StringId.ErrorOpening]} ${Strings[StringId.SearchSymbols]}: ${result.error}`);
                }
            },
            (reason) => { throw AssertInternalError.createIfNotError(reason, 'SSFER13971') }
        );
    }

    protected override getDefaultGridSourceOrReferenceDefinition() {
        throw new AssertInternalError('SSFGDGSORD44218');
        return new DataSourceOrReferenceDefinition(''); // Invalid definition - should never be returned
    }

    protected override processGridSourceOpenedEvent() {
        const recordSource = this.grid.openedRecordSource as LitIvemDetailFromSearchSymbolsTableRecordSource;
        this._recordList = recordSource.recordList;
        const dataDefinition = recordSource.dataDefinition;
        if (this.gridSourceOpenedEventer !== undefined) {
            this.gridSourceOpenedEventer(dataDefinition);
        }
    }

    protected override processRecordFocusedEvent(newRecordIndex: Integer | undefined, _oldRecordIndex: Integer | undefined) {
        if (this.recordFocusedEventer !== undefined) {
            this.recordFocusedEventer(newRecordIndex);
        }
    }

    private createDefaultLayoutGridSourceOrReferenceDefinition(dataDefinition: SearchSymbolsDataDefinition) {
        const tableRecordSourceDefinition = this.tableRecordSourceDefinitionFactoryService.createLitIvemIdFromSearchSymbols(dataDefinition);
        const gridSourceDefinition = new DataSourceDefinition(tableRecordSourceDefinition, undefined, undefined);
        return new DataSourceOrReferenceDefinition(gridSourceDefinition);
    }

    private customiseSettingsForNewGridColumn(_columnSettings: AdaptedRevgridBehavioredColumnSettings) {
        // no customisation
    }

    private getGridHeaderCellPainter(_viewCell: RevDatalessViewCell<AdaptedRevgridBehavioredColumnSettings, GridField>) {
        return this._gridHeaderCellPainter;
    }

    private getGridMainCellPainter(viewCell: RevDatalessViewCell<AdaptedRevgridBehavioredColumnSettings, GridField>) {
        return this._gridMainCellPainter;
    }
}

export namespace SearchSymbolsFrame {
    export type GridSourceOpenedEventer = (this: void, dataDefinition: SearchSymbolsDataDefinition) => void;
    export type RecordFocusedEventer = (this: void, newRecordIndex: Integer | undefined) => void;
}
