/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    AdaptedRevgridBehavioredColumnSettings,
    AssertInternalError,
    Badness,
    BadnessComparableList,
    CheckboxTextFormattableValueRecordGridCellEditor,
    CheckboxTextFormattableValueRecordGridCellPainter,
    DataSourceDefinition,
    DataSourceOrReferenceDefinition,
    GridField,
    Integer,
    TextFormattableValueRecordGridCellPainter,
    TextHeaderCellPainter,
    TextTextFormattableValueCellPainter
} from '@motifmarkets/motif-core';
import { RevCellEditor, RevColumnLayoutOrReferenceDefinition, RevDatalessViewCell, RevSubgrid, RevViewCell } from '@xilytix/revgrid';
import { GridSourceFrame } from '../../../../../../../grid-source/internal-api';
import { ScanFieldEditorFrame } from '../field/internal-api';
import { ScanFieldEditorFrameComparableListTableRecordSource } from './scan-field-editor-frame-comparable-list-table-record-source';
import { ScanFieldEditorFrameComparableListTableRecordSourceDefinition } from './scan-field-editor-frame-comparable-list-table-record-source-definition';

export class ScanFieldEditorFramesGridFrame extends GridSourceFrame {
    recordFocusedEventer: ScanFieldEditorFramesGridFrame.RecordFocusedEventer | undefined

    private _list: BadnessComparableList<ScanFieldEditorFrame>;

    private _gridHeaderCellPainter: TextHeaderCellPainter;
    private _gridMainCellPainter: TextFormattableValueRecordGridCellPainter<TextTextFormattableValueCellPainter>;
    private _visibleCheckboxPainter: CheckboxTextFormattableValueRecordGridCellPainter;
    private _visibleCheckboxEditor: CheckboxTextFormattableValueRecordGridCellEditor;
    private _widthEditor: RevCellEditor<AdaptedRevgridBehavioredColumnSettings, GridField>;

    get list() { return this._list; }

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
        this._gridMainCellPainter = this.cellPainterFactoryService.createTextTextFormattableValueRecordGrid(grid, grid.mainDataServer);
        this._visibleCheckboxPainter = this.cellPainterFactoryService.createCheckboxTextFormattableValueRecordGrid(grid, grid.mainDataServer);
        this._visibleCheckboxEditor = new CheckboxTextFormattableValueRecordGridCellEditor(this.settingsService, grid, grid.mainDataServer);

        grid.focus.getCellEditorEventer = (
            field,
            subgridRowIndex,
            subgrid,
            readonly,
            viewCell
        ) => this.getCellEditor(field, subgridRowIndex, subgrid, readonly, viewCell);


        return grid;
    }

    tryOpenList(list: BadnessComparableList<ScanFieldEditorFrame>, keepView: boolean) {
        const definition = this.createListGridSourceOrReferenceDefinition(list, undefined);
        return this.tryOpenGridSource(definition, keepView);
    }

    getScanFieldEditorFrameAt(index: Integer) {
        return this._list.getAt(index);
    }

    protected override getDefaultGridSourceOrReferenceDefinition() {
        const list = new BadnessComparableList<ScanFieldEditorFrame>();
        return this.createListGridSourceOrReferenceDefinition(list, undefined);
    }

    protected override processGridSourceOpenedEvent() {
        const recordSource = this.grid.openedRecordSource as ScanFieldEditorFrameComparableListTableRecordSource;
        this._list = recordSource.list;
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
        if (this.recordFocusedEventer !== undefined) {
            this.recordFocusedEventer(newRecordIndex);
        }
    }

    private createListGridSourceOrReferenceDefinition(list: BadnessComparableList<ScanFieldEditorFrame>, layoutDefinition: RevColumnLayoutOrReferenceDefinition | undefined) {
        const tableRecordSourceDefinition = new ScanFieldEditorFrameComparableListTableRecordSourceDefinition(
            this.gridFieldCustomHeadingsService,
            this.tableFieldSourceDefinitionCachingFactoryService,
            list,
        );
        const gridSourceDefinition = new DataSourceDefinition(tableRecordSourceDefinition, layoutDefinition, undefined);
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

    private getCellEditor(
        field: GridField,
        subgridRowIndex: Integer,
        _subgrid: RevSubgrid<AdaptedRevgridBehavioredColumnSettings, GridField>,
        readonly: boolean,
        _viewCell: RevViewCell<AdaptedRevgridBehavioredColumnSettings, GridField> | undefined
    ): RevCellEditor<AdaptedRevgridBehavioredColumnSettings, GridField> | undefined {
        return this.tryGetCellEditor(field.definition.sourcelessName, readonly, subgridRowIndex);
    }

    private tryGetCellEditor(sourcelesFieldName: string, readonly: boolean, subgridRowIndex: Integer): RevCellEditor<AdaptedRevgridBehavioredColumnSettings, GridField> | undefined {
        // if (sourcelesFieldName === EditableColumnLayoutDefinitionColumn.FieldName.visible) {
        //     this._visibleCheckboxEditor.readonly = readonly || subgridRowIndex < this._recordList.fixedColumnCount;
        //     return this._visibleCheckboxEditor;
        // } else {
        //     if (sourcelesFieldName === EditableColumnLayoutDefinitionColumn.FieldName.width) {
        //         this._widthEditor.readonly = readonly
        //         return this._widthEditor;
        //     } else {
                return undefined;
        //     }
        // }
    }
}

export namespace ScanFieldEditorFramesGridFrame {
    export type RecordFocusedEventer = (this: void, newRecordIndex: Integer | undefined) => void;
}
