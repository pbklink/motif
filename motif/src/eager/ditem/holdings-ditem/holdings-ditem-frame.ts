/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    Account,
    AdiService,
    AllowedFieldsGridLayoutDefinition,
    AllowedGridField,
    AssertInternalError,
    BrokerageAccountGroup,
    CommandRegisterService,
    Holding,
    HoldingTableRecordSourceDefinition,
    Integer,
    JsonElement,
    OrderPad,
    ScalarSettings,
    SettingsService,
    SingleBrokerageAccountGroup,
    StringId,
    Strings,
    SymbolDetailCacheService,
    SymbolsService,
    TextFormatterService
} from '@motifmarkets/motif-core';
import { RevGridLayoutDefinition, RevGridLayoutOrReferenceDefinition } from '@xilytix/rev-data-source';
import { ToastService } from 'component-services-internal-api';
import { BalancesFrame, HoldingsFrame } from 'content-internal-api';
import { BuiltinDitemFrame } from '../builtin-ditem-frame';
import { DitemFrame } from '../ditem-frame';

export class HoldingsDitemFrame extends BuiltinDitemFrame {
    private readonly _scalarSettings: ScalarSettings;

    private _holdingsFrame: HoldingsFrame | undefined;
    private _balancesFrame: BalancesFrame | undefined;
    private _balancesSingleGroup: BrokerageAccountGroup | undefined;

    private _currentFocusedAccountIdSetting: boolean;
    private _brokerageAccountGroupApplying: boolean;

    constructor(
        private readonly _componentAccess: HoldingsDitemFrame.ComponentAccess,
        settingsService: SettingsService,
        commandRegisterService: CommandRegisterService,
        desktopAccessService: DitemFrame.DesktopAccessService,
        symbolsService: SymbolsService,
        adiService: AdiService,
        private readonly _textFormatterService: TextFormatterService,
        private readonly _symbolDetailCacheService: SymbolDetailCacheService,
        private readonly _toastService: ToastService,
        private readonly _gridSourceOpenedEventer: HoldingsDitemFrame.GridSourceOpenedEventer,
        private readonly _recordFocusedEventer: HoldingsDitemFrame.RecordFocusedEventer,
    ) {
        super(
            BuiltinDitemFrame.BuiltinTypeId.Holdings,
            _componentAccess,
            settingsService,
            commandRegisterService,
            desktopAccessService,
            symbolsService,
            adiService
        );

        this._scalarSettings = settingsService.scalar;
    }

    get initialised() { return this._holdingsFrame !== undefined; }
    get focusedRecordIndex() { return this._holdingsFrame?.getFocusedRecordIndex(); }

    initialise(frameElement: JsonElement | undefined, holdingsFrame: HoldingsFrame, balancesFrame: BalancesFrame) {
        this._holdingsFrame = holdingsFrame;
        this._balancesFrame = balancesFrame;

        holdingsFrame.gridSourceOpenedEventer = (brokerageAccountGroup) => this.handleGridSourceOpenedEvent(brokerageAccountGroup);
        holdingsFrame.recordFocusedEventer = (newRecordIndex) => this.handleHoldingsRecordFocusedEvent(newRecordIndex);

        let holdingsFrameElement: JsonElement | undefined;
        let balancesFrameElement: JsonElement | undefined;
        if (frameElement !== undefined) {
            const holdingsElementResult = frameElement.tryGetElement(HoldingsDitemFrame.JsonName.holdings);
            if (holdingsElementResult.isOk()) {
                holdingsFrameElement = holdingsElementResult.value;
            }

            const balancesElementResult = frameElement.tryGetElement(HoldingsDitemFrame.JsonName.balances);
            if (balancesElementResult.isOk()) {
                balancesFrameElement = balancesElementResult.value;
            }
        }

        holdingsFrame.initialiseGrid(this.opener, undefined, true);
        balancesFrame.initialiseGrid(this.opener, undefined, true);

        const holdingsOpenPromise = holdingsFrame.tryOpenJsonOrDefault(holdingsFrameElement, true);
        const balancesOpenPromise = balancesFrame.tryOpenJsonOrDefault(balancesFrameElement, true);

        const allOpenPromise = Promise.all([holdingsOpenPromise, balancesOpenPromise]);

        allOpenPromise.then(
            (openResults) => {
                // Show balances if balances initialised and opened
                const holdingsOpenResult = openResults[0];
                if (holdingsOpenResult.isErr()) {
                    this._toastService.popup(`${Strings[StringId.ErrorOpening]} ${Strings[StringId.Holdings]}: ${holdingsOpenResult.error}`);
                }
                const balancesOpenResult = openResults[1];
                if (balancesOpenResult.isErr()) {
                    this._toastService.popup(`${Strings[StringId.ErrorOpening]} ${Strings[StringId.Balances]}: ${balancesOpenResult.error}`);
                }

                if (balancesFrame.opened) {
                    this._componentAccess.setBalancesVisible(true);
                }

                this.applyLinked();
            },
            (reason) => { throw AssertInternalError.createIfNotError(reason, 'HDFIPR50137') }
        );
    }

    override finalise() {
        if (this._holdingsFrame !== undefined) {
            this._holdingsFrame.finalise();
        }
        if (this._balancesFrame !== undefined) {
            this._balancesFrame.finalise();
        }
        super.finalise();
    }

    override save(ditemFrameElement: JsonElement) {
        super.save(ditemFrameElement);

        if (this._holdingsFrame === undefined || this._balancesFrame === undefined) {
            throw new AssertInternalError('HDFS33398');
        } else {
            const holdingsFrameElement = ditemFrameElement.newElement(HoldingsDitemFrame.JsonName.holdings);
            this._holdingsFrame.save(holdingsFrameElement);
            const balancesFrameElement = ditemFrameElement.newElement(HoldingsDitemFrame.JsonName.balances);
            this._balancesFrame.save(balancesFrameElement);
        }
    }

    sellFocused() {
        if (this._holdingsFrame === undefined) {
            throw new AssertInternalError('HDFSF33398');
        } else {
            const focusedIndex = this._holdingsFrame.getFocusedRecordIndex();
            const orderPad = new OrderPad(this._symbolDetailCacheService, this.adiService);
            if (focusedIndex !== undefined) {
                const holding = this._holdingsFrame.recordList.getAt(focusedIndex);
                orderPad.loadSellFromHolding(holding);
            } else {
                orderPad.loadSell();
            }
            orderPad.applySettingsDefaults(this._scalarSettings);
            this.desktopAccessService.editOrderRequest(orderPad);
        }
    }

    createAllowedFieldsAndLayoutDefinition(): HoldingsDitemFrame.AllowedFieldsAndLayoutDefinitions {
        if (this._holdingsFrame === undefined || this._balancesFrame === undefined) {
            throw new AssertInternalError('HDFCAFALD33097');
        } else {
            return {
                holdings: this._holdingsFrame.createAllowedFieldsGridLayoutDefinition(),
                balances: this._balancesFrame.createAllowedFieldsGridLayoutDefinition(),
            };
        }
    }

    openGridLayoutOrReferenceDefinition(layouts: HoldingsDitemFrame.GridLayoutDefinitions) {
        if (this._holdingsFrame === undefined) {
            throw new AssertInternalError('HDFAGLDH22298');
        } else {
            const gridLayoutOrReferenceDefinition = new RevGridLayoutOrReferenceDefinition(layouts.holdings);
            this._holdingsFrame.applyGridLayoutDefinition(gridLayoutOrReferenceDefinition);
        }
        if (this._balancesFrame === undefined) {
            throw new AssertInternalError('HDFAGLDB22298');
        } else {
            const gridLayoutOrReferenceDefinition = new RevGridLayoutOrReferenceDefinition(layouts.balances);
            this._balancesFrame.applyGridLayoutDefinition(gridLayoutOrReferenceDefinition);
        }
    }

    autoSizeAllColumnWidths(widenOnly: boolean) {
        if (this._holdingsFrame === undefined) {
            throw new AssertInternalError('HDFASACW10174');
        } else {
            this._holdingsFrame.autoSizeAllColumnWidths(widenOnly);
        }
        if (this._balancesFrame === undefined) {
            throw new AssertInternalError('HDFASACW10174');
        } else {
            this._balancesFrame.autoSizeAllColumnWidths(widenOnly);
        }
    }

    protected override applyBrokerageAccountGroup(
        group: BrokerageAccountGroup | undefined,
        selfInitiated: boolean
    ): boolean {
        if (this._currentFocusedAccountIdSetting) {
            return false;
        } else {
            const holdingsFrame = this._holdingsFrame;
            if (holdingsFrame === undefined) {
                throw new AssertInternalError('HDFABAG20207');
            } else {
                if (selfInitiated) {
                    return this.applyBrokerageAccountGroupWithOpen(holdingsFrame, group, selfInitiated, true);
                } else {
                    if (group === undefined) {
                        return false;
                    } else {
                        // const table = this._holdingsGridSourceFrame.table;
                        // if (table === undefined) {
                        //     return this.applyBrokerageAccountGroupWithNewTable(group, selfInitiated);
                        // } else {
                            const tableRecordSourceDefinition = holdingsFrame.createTableRecordSourceDefinition();
                            if (!(tableRecordSourceDefinition instanceof HoldingTableRecordSourceDefinition)) {
                                throw new AssertInternalError('HDFABAGT12120');
                            } else {
                                if (group.isEqualTo(tableRecordSourceDefinition.brokerageAccountGroup)) {
                                    return false;
                                } else {
                                    return this.applyBrokerageAccountGroupWithOpen(holdingsFrame, group, selfInitiated, true);
                                }
                            }
                        }
                    // }
                }
            }
        }
    }

    private handleGridSourceOpenedEvent(brokerageAccountGroup: BrokerageAccountGroup) {
        this.updateLockerName(brokerageAccountGroup.isAll() ? '' : brokerageAccountGroup.id);
        this._gridSourceOpenedEventer(brokerageAccountGroup);
    }

    private handleHoldingsRecordFocusedEvent(newRecordIndex: Integer | undefined) {
        if (newRecordIndex !== undefined) {
            if (this._holdingsFrame === undefined) {
                throw new AssertInternalError('HDFHHRFE2532');
            } else {
                const holding = this._holdingsFrame.recordList.getAt(newRecordIndex);
                this.processHoldingFocusChange(holding);
            }
        }
        this._recordFocusedEventer(newRecordIndex);
    }

    private checkApplyBalancesSingleGroup(group: SingleBrokerageAccountGroup) {
        if (this._balancesSingleGroup === undefined || !this._balancesSingleGroup.isEqualTo(group)) {
            this._balancesSingleGroup = group;
            const balancesFrame = this._balancesFrame;
            if (balancesFrame === undefined) {
                throw new AssertInternalError('HDFTOBGS23330');
            } else {
                const promise = balancesFrame.tryOpenBrokerageAccountGroup(group, false);
                promise.then(
                    (openResult) => {
                        if (openResult.isErr()) {
                            this._toastService.popup(`${Strings[StringId.ErrorOpening]} ${Strings[StringId.Balances]}: ${openResult.error}`);
                        } else {
                            this._componentAccess.setBalancesVisible(true);
                        }
                    },
                    (reason) => { throw AssertInternalError.createIfNotError(reason, 'BDFABAGWO33008', `${balancesFrame.opener.lockerName}: ${group.id}`); }
                );
            }
        }
    }

    private processHoldingFocusChange(newFocusedHolding: Holding) {
        const accountKey = new Account.Key(newFocusedHolding.accountId, newFocusedHolding.environmentId);
        const singleGroup = BrokerageAccountGroup.createSingle(accountKey);

        this.checkApplyBalancesSingleGroup(singleGroup);

        if (!this._brokerageAccountGroupApplying) {
            this._currentFocusedAccountIdSetting = true;
            try {
                this.applyDitemLitIvemIdFocus(newFocusedHolding.defaultLitIvemId, true);
                this.applyDitemBrokerageAccountGroupFocus(singleGroup, true);
            } finally {
                this._currentFocusedAccountIdSetting = false;
            }
        }
    }

    private applyBrokerageAccountGroupWithOpen(holdingsFrame: HoldingsFrame, group: BrokerageAccountGroup | undefined, selfInitiated: boolean, keepView: boolean) {
        let result: boolean;
        this._brokerageAccountGroupApplying = true;
        try {
            result = super.applyBrokerageAccountGroup(group, selfInitiated);
            if (group !== undefined) {
                // TODO add support for clearTable

                const openPromise = holdingsFrame.tryOpenBrokerageAccountGroup(group, keepView);
                openPromise.then(
                    (openResult) => {
                        if (openResult.isErr()) {
                            this._toastService.popup(`${Strings[StringId.ErrorOpening]} ${Strings[StringId.Holdings]}: ${openResult.error}`);
                        } else {
                            if (BrokerageAccountGroup.isSingle(group)) {
                                this.checkApplyBalancesSingleGroup(group);
                            } else {
                                this.closeAndHideBalances();
                            }
                        }
                    },
                    (reason) => { throw AssertInternalError.createIfNotError(reason, 'HDFABAGWO22095', `${this.opener.lockerName}: ${group.id}`); }
                );
            }
        } finally {
            this._brokerageAccountGroupApplying = false;
        }
        return result;
    }

    private closeAndHideBalances() {
        if (this._balancesFrame === undefined) {
            throw new AssertInternalError('HDFCAHB29297');
        } else {
            this._balancesFrame.closeGridSource(false);
            this._balancesSingleGroup = undefined;
            this._componentAccess.setBalancesVisible(false);
        }
    }
}

export namespace HoldingsDitemFrame {
    export namespace JsonName {
        export const holdings = 'holdings';
        export const balances = 'balances';
    }

    export type RecordFocusedEventer = (this: void, newRecordIndex: Integer | undefined) => void;
    export type GridSourceOpenedEventer = (this: void, group: BrokerageAccountGroup) => void;

    export interface AllowedGridFields {
        holdings: readonly AllowedGridField[];
        balances: readonly AllowedGridField[];
    }

    export interface GridLayoutDefinitions {
        holdings: RevGridLayoutDefinition;
        balances: RevGridLayoutDefinition;
    }

    export interface AllowedFieldsAndLayoutDefinitions {
        holdings: AllowedFieldsGridLayoutDefinition;
        balances: AllowedFieldsGridLayoutDefinition;
    }

    export interface ComponentAccess extends DitemFrame.ComponentAccess {
        setBalancesVisible(value: boolean): void;
    }
}
