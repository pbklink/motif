/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    BadnessListTableRecordSource,
    CorrectnessBadness,
    Integer,
    LockerScanAttachedNotificationChannel,
    LockerScanAttachedNotificationChannelList,
    TableFieldSourceDefinition,
    TableFieldSourceDefinitionCachingFactoryService,
    TableRecord,
    TextFormatterService,
    UnreachableCaseError
} from '@motifmarkets/motif-core';
import { LockerScanAttachedNotificationChannelTableRecordDefinition } from './locker-scan-attached-notification-channel-table-record-definition';
import { LockerScanAttachedNotificationChannelTableValueSource } from './locker-scan-attached-notification-channel-table-value-source';
import { ScanEditorAttachedNotificationChannelComparableListTableRecordSourceDefinition } from './scan-editor-attached-notification-channel-comparable-list-table-record-source-definition';
import { RevFieldCustomHeadingsService } from '@xilytix/rev-data-source';

export class ScanEditorAttachedNotificationChannelComparableListTableRecordSource extends BadnessListTableRecordSource<LockerScanAttachedNotificationChannel> {
    declare readonly definition: ScanEditorAttachedNotificationChannelComparableListTableRecordSourceDefinition;
    declare readonly list: LockerScanAttachedNotificationChannelList;

    constructor(
        textFormatterService: TextFormatterService,
        gridFieldCustomHeadingsService: RevFieldCustomHeadingsService,
        tableFieldSourceDefinitionCachingFactoryService: TableFieldSourceDefinitionCachingFactoryService,
        correctnessBadness: CorrectnessBadness,
        definition: ScanEditorAttachedNotificationChannelComparableListTableRecordSourceDefinition,
    ) {
        super(
            textFormatterService,
            gridFieldCustomHeadingsService,
            tableFieldSourceDefinitionCachingFactoryService,
            correctnessBadness,
            definition,
            definition.allowedFieldSourceDefinitionTypeIds,
        );
    }

    override get recordList() { return super.recordList as LockerScanAttachedNotificationChannelList; }

    override createDefinition(): ScanEditorAttachedNotificationChannelComparableListTableRecordSourceDefinition {
        return ScanEditorAttachedNotificationChannelComparableListTableRecordSourceDefinition.create(
            this._gridFieldCustomHeadingsService,
            this._tableFieldSourceDefinitionCachingFactoryService,
            this.list.clone()
        )
    }

    override createRecordDefinition(idx: Integer): LockerScanAttachedNotificationChannelTableRecordDefinition {
        const lockerScanAttachedNotificationChannel = this.list.getAt(idx);
        return {
            typeId: TableFieldSourceDefinition.TypeId.LockerScanAttachedNotificationChannel,
            mapKey: lockerScanAttachedNotificationChannel.name,
            record: lockerScanAttachedNotificationChannel,
        };
    }

    override createTableRecord(recordIndex: Integer, eventHandlers: TableRecord.EventHandlers): TableRecord {
        const result = new TableRecord(recordIndex, eventHandlers);
        const lockerScanAttachedNotificationChannel = this.list.getAt(recordIndex);

        const fieldSources = this.activeFieldSources;
        const sourceCount = fieldSources.length;
        for (let i = 0; i < sourceCount; i++) {
            const fieldSource = fieldSources[i];
            const fieldSourceDefinition = fieldSource.definition;
            const fieldSourceDefinitionTypeId = fieldSourceDefinition.typeId as ScanEditorAttachedNotificationChannelComparableListTableRecordSourceDefinition.FieldSourceDefinitionTypeId;
            if (this.allowedFieldSourceDefinitionTypeIds.includes(fieldSourceDefinitionTypeId)) {
                switch (fieldSourceDefinitionTypeId) {
                    case TableFieldSourceDefinition.TypeId.LockerScanAttachedNotificationChannel: {
                        const valueSource = new LockerScanAttachedNotificationChannelTableValueSource(result.fieldCount, lockerScanAttachedNotificationChannel);
                        result.addSource(valueSource);
                        break;
                    }
                    default:
                        throw new UnreachableCaseError('SFEFCLTRSCTR19909', fieldSourceDefinitionTypeId);
                }
            }
        }

        return result;
    }

    protected override getDefaultFieldSourceDefinitionTypeIds() {
        return ScanEditorAttachedNotificationChannelComparableListTableRecordSourceDefinition.defaultFieldSourceDefinitionTypeIds;
    }
}
