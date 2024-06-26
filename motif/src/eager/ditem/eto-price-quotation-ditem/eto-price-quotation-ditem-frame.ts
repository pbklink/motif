/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    AdiService,
    CommandRegisterService,
    Integer,
    JsonElement,
    SettingsService,
    SymbolsService
} from '@motifmarkets/motif-core';
import { RevGridLayoutOrReferenceDefinition } from '@xilytix/rev-data-source';
import { GridSourceFrame, WatchlistFrame } from 'content-internal-api';
import { BuiltinDitemFrame } from '../builtin-ditem-frame';
import { DitemFrame } from '../ditem-frame';

export class EtoPriceQuotationDitemFrame extends BuiltinDitemFrame {
    private _watchGridSourceFrame: WatchlistFrame;
    private _callPutGridSourceFrame: GridSourceFrame;

    constructor(
        ditemComponentAccess: DitemFrame.ComponentAccess,
        settingsService: SettingsService,
        commandRegisterService: CommandRegisterService,
        desktopAccessService: DitemFrame.DesktopAccessService,
        symbolsService: SymbolsService,
        adiService: AdiService,
    ) {
        super(BuiltinDitemFrame.BuiltinTypeId.EtoPriceQuotation,
            ditemComponentAccess, settingsService, commandRegisterService, desktopAccessService, symbolsService, adiService
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    get initialised() { return this._callPutGridSourceFrame !== undefined; }

    initialise(watchFrame: WatchlistFrame, callPutFrame: GridSourceFrame, frameElement: JsonElement | undefined): void {
        this._watchGridSourceFrame = watchFrame;
        this._callPutGridSourceFrame = callPutFrame;

        if (frameElement === undefined) {
            this.initialiseWatch(undefined);
            this.initialiseCallPut(undefined);
        } else {
            const watchElementResult = frameElement.tryGetElement(EtoPriceQuotationDitemFrame.JsonName.watch);
            if (watchElementResult.isErr()) {
                this.initialiseWatch(undefined);
            } else {
                this.initialiseWatch(watchElementResult.value);
            }

            const callPutElementResult = frameElement.tryGetElement(EtoPriceQuotationDitemFrame.JsonName.callPut);
            if (callPutElementResult.isErr()) {
                this.initialiseCallPut(undefined);
            } else {
                this.initialiseCallPut(callPutElementResult.value);
            }
        }

        this._watchGridSourceFrame = watchFrame;
        this._watchGridSourceFrame.setOpener(this.opener);
        this._watchGridSourceFrame.keepPreviousLayoutIfPossible = true;
        this._callPutGridSourceFrame.setOpener(this.opener);
        this._callPutGridSourceFrame.keepPreviousLayoutIfPossible = true;

        // something

        this.applyLinked();
    }

    override save(frameElement: JsonElement) {
        super.save(frameElement);

        const watchElement = frameElement.newElement(EtoPriceQuotationDitemFrame.JsonName.watch);
        this.saveWatchCallPut(this._watchGridSourceFrame, watchElement);
        const callPutElement = frameElement.newElement(EtoPriceQuotationDitemFrame.JsonName.callPut);
        this.saveWatchCallPut(this._callPutGridSourceFrame, callPutElement);
    }

    private handleRecordFocusEvent(newRecordIndex: Integer | undefined, oldRecordIndex: Integer | undefined) {
    }

    private handleRecordFocusClickEvent(recordIndex: Integer, fieldIndex: Integer) {
    }

    private handleRecordFocusDblClickEvent(recordIndex: Integer, fieldIndex: Integer) {
    }

    private handleRequireDefaultTableDefinitionEvent() {
    }

    private initialiseWatch(element: JsonElement | undefined) {
        this._watchGridSourceFrame.setOpener(this.opener);
        this._watchGridSourceFrame.keepPreviousLayoutIfPossible = true;

        if (element !== undefined) {
            const elementResult = element.tryGetElement(EtoPriceQuotationDitemFrame.JsonName.watch);
            if (elementResult.isOk()) {
                const watchElement = elementResult.value;
                const keptLayoutElementResult = watchElement.tryGetElement(EtoPriceQuotationDitemFrame.JsonName.keptLayout);
                if (keptLayoutElementResult.isOk()) {
                    const keptLayoutElement = keptLayoutElementResult.value;
                    const keptLayoutResult = RevGridLayoutOrReferenceDefinition.tryCreateFromJson(keptLayoutElement);
                    if (keptLayoutResult.isOk()) {
                        this._watchGridSourceFrame.keptGridLayoutOrReferenceDefinition = keptLayoutResult.value;
                    }
                }
            }
        }
    }

    private initialiseCallPut(element: JsonElement | undefined) {
        this._callPutGridSourceFrame.setOpener(this.opener);
        this._callPutGridSourceFrame.keepPreviousLayoutIfPossible = true;

        if (element !== undefined) {
            const elementResult = element.tryGetElement(EtoPriceQuotationDitemFrame.JsonName.callPut);
            if (elementResult.isOk()) {
                const callPutElement = elementResult.value;
                const keptLayoutElementResult = callPutElement.tryGetElement(EtoPriceQuotationDitemFrame.JsonName.keptLayout);
                if (keptLayoutElementResult.isOk()) {
                    const keptLayoutElement = keptLayoutElementResult.value;
                    const keptLayoutResult = RevGridLayoutOrReferenceDefinition.tryCreateFromJson(keptLayoutElement);
                    if (keptLayoutResult.isOk()) {
                        this._callPutGridSourceFrame.keptGridLayoutOrReferenceDefinition = keptLayoutResult.value;
                    }
                }
            }
        }
    }

    private saveWatchCallPut(frame: GridSourceFrame, element: JsonElement) {
        const keptLayoutElement = element.newElement(EtoPriceQuotationDitemFrame.JsonName.keptLayout);
        const layoutDefinition = frame.createGridLayoutOrReferenceDefinition();
        layoutDefinition.saveToJson(keptLayoutElement);
    }
}

export namespace EtoPriceQuotationDitemFrame {
    export namespace JsonName {
        export const watch = 'watch';
        export const callPut = 'callPut';
        export const keptLayout = 'keptLayout';
    }
}
