/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    BadnessComparableList,
    BadnessListTableRecordSourceDefinition,
    PickEnum,
    TableFieldSourceDefinition,
    TableFieldSourceDefinitionCachingFactory,
    TableRecordSourceDefinition
} from '@motifmarkets/motif-core';
import { RevColumnLayoutDefinition, RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { ScanFieldEditorFrame } from '../field/internal-api';
import { ScanFieldEditorFrameTableFieldSourceDefinition } from './scan-field-editor-frame-table-field-source-definition';

export class ScanFieldEditorFrameComparableListTableRecordSourceDefinition extends BadnessListTableRecordSourceDefinition<ScanFieldEditorFrame> {
    declare list: BadnessComparableList<ScanFieldEditorFrame>;

    constructor(
        customHeadingsService: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        list: BadnessComparableList<ScanFieldEditorFrame>,
    ) {
        super(
            customHeadingsService,
            tableFieldSourceDefinitionCachingFactory,
            TableRecordSourceDefinition.TypeId.ScanFieldEditorFrame,
            ScanFieldEditorFrameComparableListTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
            list,
        );
    }

    override createDefaultLayoutDefinition(): RevColumnLayoutDefinition {
        const scanFieldEditorFrameFieldSourceDefinition = ScanFieldEditorFrameTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);

        const fieldNames = new Array<string>();

        fieldNames.push(scanFieldEditorFrameFieldSourceDefinition.getFieldNameById(ScanFieldEditorFrame.FieldId.Name));

        return RevColumnLayoutDefinition.createFromFieldNames(fieldNames);
    }
}

/** @public */
export namespace ScanFieldEditorFrameComparableListTableRecordSourceDefinition {
    export type FieldSourceDefinitionTypeId = PickEnum<TableFieldSourceDefinition.TypeId,
        TableFieldSourceDefinition.TypeId.ScanFieldEditorFrame
    >;

    export const allowedFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.ScanFieldEditorFrame
    ];

    export const defaultFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.ScanFieldEditorFrame
    ];

    export type FieldId = ScanFieldEditorFrameTableFieldSourceDefinition.FieldId;

    export namespace JsonName {
        export const list = 'list';
    }

    // export function tryCreateListFromElement(element: JsonElement): Result<BadnessComparableList<ScanFieldEditorFrame>> {
    //     const elementArrayResult = element.tryGetElementArray(JsonName.list);
    //     if (elementArrayResult.isErr()) {
    //         const error = elementArrayResult.error;
    //         if (error === JsonElement.arrayErrorCode_NotSpecified) {
    //             return new Err(ErrorCode.LitIvemIdComparableListTableRecordSourceDefinition_JsonLitIvemIdsNotSpecified);
    //         } else {
    //             return new Err(ErrorCode.LitIvemIdComparableListTableRecordSourceDefinition_JsonLitIvemIdsIsInvalid);
    //         }
    //     } else {
    //         const litIvemIdsResult = LitIvemId.tryCreateArrayFromJsonElementArray(elementArrayResult.value);
    //         if (litIvemIdsResult.isErr()) {
    //             return litIvemIdsResult.createOuter(ErrorCode.LitIvemIdComparableListTableRecordSourceDefinition_JsonLitIvemIdArrayIsInvalid);
    //         } else {
    //             const litIvemIds = litIvemIdsResult.value;
    //             const list = new UiBadnessComparableList<LitIvemId>();
    //             list.addRange(litIvemIds);
    //             return new Ok(list);
    //         }
    //     }
    // }

    // export function tryCreateDefinition(
    //     customHeadingsService: RevSourcedFieldCustomHeadingsService,
    //     tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
    //     element: JsonElement,
    // ): Result<ScanFieldEditorFrameComparableListTableRecordSourceDefinition> {
    //     const listCreateResult = tryCreateListFromElement(element);
    //     if (listCreateResult.isErr()) {
    //         const errorCode = ErrorCode.LitIvemIdComparableListTableRecordSourceDefinition_JsonListIsInvalid;
    //         return listCreateResult.createOuter(errorCode);
    //     } else {
    //         const list = listCreateResult.value;
    //         const definition = new ScanFieldEditorFrameComparableListTableRecordSourceDefinition(customHeadingsService, tableFieldSourceDefinitionCachingFactory, list);
    //         return new Ok(definition);
    //     }
    // }

    export function create(
        customHeadingsService: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        list: BadnessComparableList<ScanFieldEditorFrame>,
    ) {
        return new ScanFieldEditorFrameComparableListTableRecordSourceDefinition(
            customHeadingsService,
            tableFieldSourceDefinitionCachingFactory,
            list,
        );
    }

    export function createLayoutDefinition(
        fieldSourceDefinitionRegistryService: TableFieldSourceDefinitionCachingFactory,
        fieldIds: FieldId[],
    ): RevColumnLayoutDefinition {
        return fieldSourceDefinitionRegistryService.createLayoutDefinition(fieldIds);
    }

    export function is(definition: TableRecordSourceDefinition): definition is ScanFieldEditorFrameComparableListTableRecordSourceDefinition {
        return definition.typeId === TableRecordSourceDefinition.TypeId.ScanFieldEditorFrame;
    }
}
