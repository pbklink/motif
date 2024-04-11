/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    AdaptedRevgridBehavioredColumnSettings,
    AssertInternalError,
    Badness,
    CellPainterFactoryService,
    DataSourceDefinition,
    DataSourceOrReference,
    DataSourceOrReferenceDefinition,
    GridField,
    Integer,
    LockOpenListItem,
    RankedLitIvemIdListDirectory,
    RankedLitIvemIdListDirectoryItemTableRecordSource,
    RankedLitIvemIdListDirectoryItemTableRecordSourceDefinition,
    ReferenceableDataSourcesService,
    ReferenceableGridLayoutsService,
    RenderValueRecordGridCellPainter,
    ScansService,
    SettingsService,
    StringId,
    Strings,
    TableFieldSourceDefinitionCachingFactoryService,
    TableRecordSourceFactory,
    TextHeaderCellPainter,
    TextRenderValueCellPainter
} from '@motifmarkets/motif-core';
import { RevFieldCustomHeadingsService, RevGridLayoutOrReferenceDefinition } from '@xilytix/rev-data-source';
import { DatalessViewCell } from '@xilytix/revgrid';
import { ToastService } from 'component-services-internal-api';
import { GridSourceFrame } from '../../grid-source/internal-api';
import { TableRecordSourceDefinitionFactoryService } from '../../table-record-source-definition-factory-service';

export class SymbolListDirectoryGridFrame extends GridSourceFrame {
    listFocusedEventer: SymbolListDirectoryGridFrame.listFocusedEventer | undefined;

    private _listDirectory: RankedLitIvemIdListDirectory;

    private _gridHeaderCellPainter: TextHeaderCellPainter;
    private _gridMainCellPainter: RenderValueRecordGridCellPainter<TextRenderValueCellPainter>;

    constructor(
        settingsService: SettingsService,
        private readonly _scansService: ScansService,
        gridFieldCustomHeadingsService: RevFieldCustomHeadingsService,
        referenceableGridLayoutsService: ReferenceableGridLayoutsService,
        tableFieldSourceDefinitionCachingFactoryService: TableFieldSourceDefinitionCachingFactoryService,
        tableRecordSourceDefinitionFactoryService: TableRecordSourceDefinitionFactoryService,
        tableRecordSourceFactory: TableRecordSourceFactory,
        referenceableGridSourcesService: ReferenceableDataSourcesService,
        cellPainterFactoryService: CellPainterFactoryService,
        toastService: ToastService,
        private readonly _frameOpener: LockOpenListItem.Opener,
    ) {
        super(
            settingsService,
            gridFieldCustomHeadingsService,
            referenceableGridLayoutsService,
            tableFieldSourceDefinitionCachingFactoryService,
            tableRecordSourceDefinitionFactoryService,
            tableRecordSourceFactory,
            referenceableGridSourcesService,
            cellPainterFactoryService,
            toastService,
        );
    }

    focusList(idOrName: string) {
        const upperName = idOrName.toUpperCase();
        const directory = this._listDirectory;
        const count = directory.count;
        for (let i = 0; i < count; i++) {
            const list = directory.getAt(i);
            const listName = list.name;
            if (listName.toUpperCase() === upperName) {
                this.grid.tryFocusYAndEnsureInView(i);
                return listName;
            }
        }
        for (let i = 0; i < count; i++) {
            const list = directory.getAt(i);
            if (list.id === idOrName) {
                this.grid.tryFocusYAndEnsureInView(i);
                return list.name;
            }
        }
        this.grid.focus.clear();
        return undefined;
    }

    override createGridAndCellPainters(gridHostElement: HTMLElement) {
        const grid = this.createGrid(
            gridHostElement,
            {
                fixedColumnCount: 1,
                mouseColumnSelectionEnabled: false,
                switchNewRectangleSelectionToRowOrColumn: 'row',
            },
            (columnSettings) => this.customiseSettingsForNewGridColumn(columnSettings),
            (viewCell) => this.getGridMainCellPainter(viewCell),
            (viewCell) => this.getGridHeaderCellPainter(viewCell),
        );

        this._gridHeaderCellPainter = this.cellPainterFactoryService.createTextHeader(grid, grid.headerDataServer);
        this._gridMainCellPainter = this.cellPainterFactoryService.createTextRenderValueRecordGrid(grid, grid.mainDataServer);
        return grid;
    }

    protected override getDefaultGridSourceOrReferenceDefinition() {
        return this.createListGridSourceOrReferenceDefinition(undefined);
    }

    protected override processGridSourceOpenedEvent(_gridSourceOrReference: DataSourceOrReference) {
        const table = this.openedTable;
        const recordSource = table.recordSource as RankedLitIvemIdListDirectoryItemTableRecordSource;
        this._listDirectory = recordSource.recordList;
    }

    protected override setBadness(value: Badness) {
        if (!Badness.isUsable(value)) {
            throw new AssertInternalError('GLECFSB42112', Badness.generateText(value));
        }
    }

    protected override hideBadnessWithVisibleDelay(_badness: Badness) {
        // always hidden as never bad
    }

    protected override processRecordFocusedEvent(newRecordIndex: Integer | undefined, _oldRecordIndex: Integer | undefined) {
        if (this.listFocusedEventer !== undefined) {
            if (newRecordIndex === undefined) {
                this.listFocusedEventer(undefined, undefined);
            } else {
                const list = this._listDirectory.getAt(newRecordIndex);
                this.listFocusedEventer(list.id, list.name);
            }
        }
    }

    private createListGridSourceOrReferenceDefinition(layoutDefinition: RevGridLayoutOrReferenceDefinition | undefined) {
        const namedSourceList: RankedLitIvemIdListDirectory.NamedSourceList = {
            name: Strings[StringId.Scan],
            list: this._scansService.scanList,
        }
        const listDirectory = new RankedLitIvemIdListDirectory([namedSourceList], this._frameOpener);
        const tableRecordSourceDefinition = new RankedLitIvemIdListDirectoryItemTableRecordSourceDefinition(
            this.gridFieldCustomHeadingsService,
            this.tableFieldSourceDefinitionCachingFactoryService,
            listDirectory
        );
        const gridSourceDefinition = new DataSourceDefinition(tableRecordSourceDefinition, layoutDefinition, undefined);
        return new DataSourceOrReferenceDefinition(gridSourceDefinition);
    }

    private customiseSettingsForNewGridColumn(_columnSettings: AdaptedRevgridBehavioredColumnSettings) {
        // no customisation
    }

    private getGridHeaderCellPainter(_viewCell: DatalessViewCell<AdaptedRevgridBehavioredColumnSettings, GridField>) {
        return this._gridHeaderCellPainter;
    }

    private getGridMainCellPainter(viewCell: DatalessViewCell<AdaptedRevgridBehavioredColumnSettings, GridField>) {
        return this._gridMainCellPainter;
    }
}

export namespace SymbolListDirectoryGridFrame {
    export type listFocusedEventer = (this: void, id: string | undefined, name: string | undefined) => void;
}