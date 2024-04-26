/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    AdiService,
    AllowedSourcedFieldsColumnLayoutDefinition,
    AssertInternalError,
    Badness,
    CellPainterFactoryService,
    ColumnLayoutDefinition,
    CorrectnessId,
    DayTradesDataDefinition,
    DayTradesDataItem,
    DayTradesGridField,
    DayTradesGridRecordStore,
    JsonElement,
    LitIvemId,
    MultiEvent,
    RecordGrid,
    RenderValueRecordGridCellPainter,
    SettingsService,
    SourcedFieldGrid,
    TextHeaderCellPainter,
    TextRenderValueCellPainter
} from '@motifmarkets/motif-core';
import { RevColumnLayout, RevColumnLayoutDefinition } from '@xilytix/revgrid';
import { ContentFrame } from '../content-frame';

export class TradesFrame extends ContentFrame {
    private _grid: RecordGrid;
    private _recordStore: DayTradesGridRecordStore;

    private _dataItem: DayTradesDataItem | undefined;
    private _dataItemBadnessChangeEventSubscriptionId: MultiEvent.SubscriptionId;
    private _dataItemDataCorrectnessChangeEventSubscriptionId: MultiEvent.SubscriptionId;
    private _dataItemDataCorrectnessId = CorrectnessId.Suspect;

    private _gridHeaderCellPainter: TextHeaderCellPainter;
    private _gridMainCellPainter: RenderValueRecordGridCellPainter<TextRenderValueCellPainter>;

    private _columnLayout: RevColumnLayout;

    constructor(
        private readonly _settingsService: SettingsService,
        protected readonly adiService: AdiService,
        private readonly _cellPainterFactoryService: CellPainterFactoryService,
        private readonly _componentAccess: TradesFrame.ComponentAccess,
    ) {
        super();
        this._recordStore = new DayTradesGridRecordStore();
    }

    get opened() { return this._dataItem !== undefined; }

    setupGrid(gridHost: HTMLElement) {
        this._grid = this.createGridAndCellPainters(gridHost);
        // this.applySettings();
        this._grid.activate();
        this._grid.rowOrderReversed = true;
    }

    initialise(tradesFrameElement: JsonElement | undefined) {
        if (tradesFrameElement === undefined) {
            this._columnLayout = this.createDefaultColumnLayout();
        } else {
            const tryGetElementResult = tradesFrameElement.tryGetElement(TradesFrame.JsonName.layout);
            if (tryGetElementResult.isErr()) {
                this._columnLayout = this.createDefaultColumnLayout();
            } else {
                const definitionResult = ColumnLayoutDefinition.tryCreateFromJson(tryGetElementResult.value);
                if (definitionResult.isErr()) {
                    this._columnLayout = this.createDefaultColumnLayout();
                } else {
                    this._columnLayout = new RevColumnLayout(definitionResult.value);
                }
            }
        }

        const fieldCount = DayTradesGridField.idCount;
        const fields = new Array<DayTradesGridField>(fieldCount);

        for (let id = 0; id < fieldCount; id++) {
            const gridField = DayTradesGridField.createField(id, () => this.handleGetDataItemCorrectnessIdEvent());
            fields[id] = gridField;
        }

        this._grid.initialiseAllowedFields(fields);

        this._recordStore.recordsLoaded();
    }

    override finalise() {
        if (!this.finalised) {
            this._grid.destroy();
            this.checkClose();
            super.finalise();
        }
    }

    saveLayoutToConfig(element: JsonElement) {
        const layoutElement = element.newElement(TradesFrame.JsonName.layout);
        const definition = this._grid.createColumnLayoutDefinition();
        definition.saveToJson(layoutElement);
    }

    open(litIvemId: LitIvemId, historicalDate: Date | undefined): void {
        this.checkClose();
        this._grid.resetUsable();
        const definition = new DayTradesDataDefinition();
        definition.litIvemId = litIvemId;
        definition.date = historicalDate;
        this._dataItem = this.adiService.subscribe(definition) as DayTradesDataItem;
        this._recordStore.setDataItem(this._dataItem);

        this._dataItemDataCorrectnessChangeEventSubscriptionId = this._dataItem.subscribeCorrectnessChangedEvent(
            () => this.handleDataItemDataCorrectnessChangeEvent()
        );
        this._dataItemDataCorrectnessId = this._dataItem.correctnessId;

        this._dataItemBadnessChangeEventSubscriptionId = this._dataItem.subscribeBadnessChangedEvent(
            () => this.handleDataItemBadnessChangeEvent()
        );
        this._componentAccess.hideBadnessWithVisibleDelay(this._dataItem.badness);

        if (this._dataItem.usable) {
            this._grid.applyFirstUsable(undefined, undefined, this._columnLayout);
        }
    }

    close() {
        this.checkClose();
    }

    createAllowedSourcedFieldsColumnLayoutDefinition(): AllowedSourcedFieldsColumnLayoutDefinition {
        const allowedFields = DayTradesGridField.createAllowedFields();
        return this._grid.createAllowedSourcedFieldsColumnLayoutDefinition(allowedFields);
    }

    applyColumnLayoutDefinition(layoutDefinition: RevColumnLayoutDefinition) {
        this._grid.applyColumnLayoutDefinition(layoutDefinition);
    }

    autoSizeAllColumnWidths(widenOnly: boolean) {
        this._grid.autoSizeActiveColumnWidths(widenOnly);
    }

    // private handleRecordFocusEvent(newRecordIndex: Integer | undefined, oldRecordIndex: Integer | undefined) {
    // }

    // private handleGridClickEvent(fieldIndex: Integer, recordIndex: Integer) {
    // }

    // private handleGridDblClickEvent(fieldIndex: Integer, recordIndex: Integer) {
    // }

    // adviseColumnWidthChanged(columnIndex: Integer) {
    //     if (this.activeWidthChangedEvent !== undefined) {
    //         this.activeWidthChangedEvent(); // advise PariDepth frame
    //     }
    // }

    // getRenderedActiveWidth() {
    //     return this._componentAccess.gridGetRenderedActiveWidth();
    // }

    private handleDataItemDataCorrectnessChangeEvent() {
        if (this._dataItem === undefined) {
            throw new AssertInternalError('TFHDIDCCE4554594722');
        } else {
            this._dataItemDataCorrectnessId = this._dataItem.correctnessId;
        }
    }

    private handleDataItemBadnessChangeEvent() {
        if (this._dataItem === undefined) {
            throw new AssertInternalError('TFHDIBCE23000447878');
        } else {
            if (this._dataItem.usable && !this._grid.beenUsable) {
                this._grid.applyFirstUsable(undefined, undefined, this._columnLayout);
            }
            this._componentAccess.setBadness(this._dataItem.badness);
        }
    }

    private handleGetDataItemCorrectnessIdEvent() {
        return this._dataItemDataCorrectnessId;
    }

    private createGridAndCellPainters(gridHostElement: HTMLElement) {
        const grid = this.createGrid(gridHostElement);

        this._gridHeaderCellPainter = this._cellPainterFactoryService.createTextHeader(grid, grid.headerDataServer);
        this._gridMainCellPainter = this._cellPainterFactoryService.createTextRenderValueRecordGrid(grid, grid.mainDataServer);

        return grid;
    }

    private createGrid(gridHostElement: HTMLElement) {
        const customGridSettings: SourcedFieldGrid.CustomGridSettings = {
            sortOnClick: false,
            sortOnDoubleClick: false,
        }

        const grid = new RecordGrid(
            this._settingsService,
            gridHostElement,
            this._recordStore,
            customGridSettings,
            () => this.customiseSettingsForNewColumn(),
            () => this.getMainCellPainter(),
            () => this.getHeaderCellPainter(),
            this,
        );

        return grid;
    }

    private createDefaultColumnLayout() {
        const definition = DayTradesGridField.createDefaultColumnLayoutDefinition();
        return new RevColumnLayout(definition);
    }

    private checkClose() {
        if (this._dataItem !== undefined) {
            this._dataItem.unsubscribeCorrectnessChangedEvent(this._dataItemDataCorrectnessChangeEventSubscriptionId);
            this._dataItem.unsubscribeBadnessChangedEvent(this._dataItemBadnessChangeEventSubscriptionId);
            this._recordStore.clearDataItem();
            this.adiService.unsubscribe(this._dataItem);
            this._dataItem = undefined;
            this._dataItemDataCorrectnessId = CorrectnessId.Suspect;
        }
    }

    private customiseSettingsForNewColumn() {
        // no customisation required
    }

    private getMainCellPainter() {
        return this._gridMainCellPainter;
    }

    private getHeaderCellPainter() {
        return this._gridHeaderCellPainter;
    }
}

export namespace TradesFrame {
    export class TradesSubscriptionIds {
        beginChanges: MultiEvent.SubscriptionId;
        endChanges: MultiEvent.SubscriptionId;
        statusChange: MultiEvent.SubscriptionId;
        listChange: MultiEvent.SubscriptionId;
    }

    export interface ComponentAccess {
        readonly id: string;

        setBadness(value: Badness): void;
        hideBadnessWithVisibleDelay(badness: Badness): void;
    }

    export namespace JsonName {
        export const layout = 'layout';
    }
}
