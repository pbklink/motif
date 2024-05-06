/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    LockOpenNotificationChannel,
    PickEnum,
    TableFieldSourceDefinition,
    TableFieldSourceDefinitionCachingFactory,
    TableRecordSourceDefinition
} from '@motifmarkets/motif-core';
import { RevColumnLayoutDefinition, RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { LockOpenNotificationChannelTableFieldSourceDefinition } from './lock-open-notification-channel-table-field-source-definition';

export class LockOpenNotificationChannelListTableRecordSourceDefinition extends TableRecordSourceDefinition {
    constructor(
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
    ) {
        super(
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            TableRecordSourceDefinition.TypeId.LockOpenNotificationChannelList,
            LockOpenNotificationChannelListTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
        );
    }

    override createDefaultLayoutDefinition(): RevColumnLayoutDefinition {
        const notificationChannelTableFieldSourceDefinition = LockOpenNotificationChannelTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);

        const fieldNames = new Array<string>();

        fieldNames.push(notificationChannelTableFieldSourceDefinition.getFieldNameById(LockOpenNotificationChannel.FieldId.Name));

        return RevColumnLayoutDefinition.createFromFieldNames(fieldNames);
    }
}

/** @public */
export namespace LockOpenNotificationChannelListTableRecordSourceDefinition {
    export type FieldSourceDefinitionTypeId = PickEnum<TableFieldSourceDefinition.TypeId,
        TableFieldSourceDefinition.TypeId.LockOpenNotificationChannel
    >;

    export const allowedFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.LockOpenNotificationChannel
    ];

    export const defaultFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.LockOpenNotificationChannel
    ];

    export type FieldId = LockOpenNotificationChannelTableFieldSourceDefinition.FieldId;

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
    // ): Result<ScanEditorAttachedNotificationChannelComparableListTableRecordSourceDefinition> {
    //     const listCreateResult = tryCreateListFromElement(element);
    //     if (listCreateResult.isErr()) {
    //         const errorCode = ErrorCode.LitIvemIdComparableListTableRecordSourceDefinition_JsonListIsInvalid;
    //         return listCreateResult.createOuter(errorCode);
    //     } else {
    //         const list = listCreateResult.value;
    //         const definition = new ScanEditorAttachedNotificationChannelComparableListTableRecordSourceDefinition(customHeadingsService, tableFieldSourceDefinitionCachingFactory, list);
    //         return new Ok(definition);
    //     }
    // }

    export function create(
        customHeadingsService: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
    ) {
        return new LockOpenNotificationChannelListTableRecordSourceDefinition(
            customHeadingsService,
            tableFieldSourceDefinitionCachingFactory,
        );
    }

    export function createLayoutDefinition(
        fieldSourceDefinitionRegistryService: TableFieldSourceDefinitionCachingFactory,
        fieldIds: FieldId[],
    ): RevColumnLayoutDefinition {
        return fieldSourceDefinitionRegistryService.createLayoutDefinition(fieldIds);
    }

    export function is(definition: TableRecordSourceDefinition): definition is LockOpenNotificationChannelListTableRecordSourceDefinition {
        return definition.typeId === TableRecordSourceDefinition.TypeId.ScanEditorAttachedNotificationChannel;
    }
}
