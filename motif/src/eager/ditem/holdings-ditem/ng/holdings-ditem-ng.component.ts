/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnDestroy,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {
    AssertInternalError,
    BrokerageAccountGroup,
    BrokerageAccountGroupUiAction,
    IconButtonUiAction,
    Integer,
    InternalCommand,
    JsonElement,
    ModifierKey,
    ModifierKeyId,
    StringId,
    Strings,
    UiAction,
    delay1Tick,
    getErrorMessage
} from '@motifmarkets/motif-core';
import { IOutputData, SplitComponent } from 'angular-split';
import {
    AdiNgService,
    CommandRegisterNgService,
    SettingsNgService,
    SymbolDetailCacheNgService,
    SymbolsNgService,
    TextFormatterNgService,
    ToastNgService
} from 'component-services-ng-api';
import { BalancesNgComponent, HoldingsGridLayoutsDialogNgComponent, HoldingsNgComponent } from 'content-ng-api';
import { AngularSplitTypes } from 'controls-internal-api';
import { BrokerageAccountGroupInputNgComponent, SvgButtonNgComponent } from 'controls-ng-api';
import { ComponentContainer } from 'golden-layout';
import { BuiltinDitemNgComponentBaseNgDirective } from '../../ng/builtin-ditem-ng-component-base.directive';
import { DesktopAccessNgService } from '../../ng/desktop-access-ng.service';
import { HoldingsDitemFrame } from '../holdings-ditem-frame';

@Component({
    selector: 'app-holdings-ditem',
    templateUrl: './holdings-ditem-ng.component.html',
    styleUrls: ['./holdings-ditem-ng.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HoldingsDitemNgComponent extends BuiltinDitemNgComponentBaseNgDirective implements AfterViewInit, OnDestroy {
    private static typeInstanceCreateCount = 0;

    @ViewChild('balances', { static: true }) private _balancesComponent: BalancesNgComponent;
    @ViewChild('holdings', { static: true }) private _holdingsComponent: HoldingsNgComponent;
    @ViewChild('accountGroupInput', { static: true }) private _accountGroupInputComponent: BrokerageAccountGroupInputNgComponent;
    @ViewChild('sellButton', { static: true }) private _sellButtonComponent: SvgButtonNgComponent;
    @ViewChild('columnsButton', { static: true }) private _columnsButtonComponent: SvgButtonNgComponent;
    @ViewChild('autoSizeColumnWidthsButton', { static: true }) private _autoSizeColumnWidthsButtonComponent: SvgButtonNgComponent;
    @ViewChild('accountLinkButton', { static: true }) private _accountLinkButtonComponent: SvgButtonNgComponent;
    @ViewChild('symbolLinkButton', { static: true }) private _symbolLinkButtonComponent: SvgButtonNgComponent;
    @ViewChild(SplitComponent) private _balancesHoldingsSplitComponent: SplitComponent;
    @ViewChild('dialogContainer', { read: ViewContainerRef }) private _dialogContainer: ViewContainerRef;

    public splitterGutterSize = 3;
    public balancesVisible = false;
    public balancesHeight: AngularSplitTypes.AreaSize.Html = 50;

    private readonly _frame: HoldingsDitemFrame;

    private _accountGroupUiAction: BrokerageAccountGroupUiAction;
    private _sellUiAction: IconButtonUiAction;
    private _columnsUiAction: IconButtonUiAction;
    private _autoSizeColumnWidthsUiAction: IconButtonUiAction;
    private _accountGroupLinkUiAction: IconButtonUiAction;
    private _toggleSymbolLinkingUiAction: IconButtonUiAction;
    private _explicitBalancesHeight = false;

    private _activeDialogTypeId = HoldingsDitemNgComponent.ActiveDialogTypeId.None;

    constructor(
        elRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        settingsNgService: SettingsNgService,
        commandRegisterNgService: CommandRegisterNgService,
        desktopAccessNgService: DesktopAccessNgService,
        adiNgService: AdiNgService,
        symbolsNgService: SymbolsNgService,
        textFormatterNgService: TextFormatterNgService,
        symbolDetailCacheNgService: SymbolDetailCacheNgService,
        toastNgService: ToastNgService,
        @Inject(BuiltinDitemNgComponentBaseNgDirective.goldenLayoutContainerInjectionToken) container: ComponentContainer,
    ) {
        super(
            elRef,
            ++HoldingsDitemNgComponent.typeInstanceCreateCount,
            cdr,
            container,
            settingsNgService.service,
            commandRegisterNgService.service
        );


        this._frame = new HoldingsDitemFrame(
            this,
            this.settingsService,
            this.commandRegisterService,
            desktopAccessNgService.service,
            symbolsNgService.service,
            adiNgService.service,
            textFormatterNgService.service,
            symbolDetailCacheNgService.service,
            toastNgService.service,
            (group) => this.handleGridSourceOpenedEvent(group),
            (recordIndex) => this.handleHoldingsRecordFocusEvent(recordIndex),
        );
        this._accountGroupUiAction = this.createAccountIdUiAction();
        this._sellUiAction = this.createSellUiAction();
        this._columnsUiAction = this.createColumnsUiAction();
        this._autoSizeColumnWidthsUiAction = this.createAutoSizeColumnWidthsUiAction();
        this._toggleSymbolLinkingUiAction = this.createToggleSymbolLinkingUiAction();
        this._accountGroupLinkUiAction = this.createToggleAccountGroupLinkingUiAction();

        this.constructLoad(this.getInitialComponentStateJsonElement());

        this.pushAccountLinkButtonState();
        this.pushSymbolLinkButtonState();
        this._accountGroupUiAction.pushValue(BrokerageAccountGroup.createAll());
    }

    get ditemFrame() { return this._frame; }

    protected get stateSchemaVersion() { return HoldingsDitemNgComponent.stateSchemaVersion; }

    public ngAfterViewInit() {
        delay1Tick(() => this.initialise());
    }

    public ngOnDestroy() {
        this.finalise();
    }

    public isDialogActive() {
        return this._activeDialogTypeId !== HoldingsDitemNgComponent.ActiveDialogTypeId.None;
    }

    public splitDragEnd(data: IOutputData) {
        this._explicitBalancesHeight = true;
    }

    // component interface methods

    public loadConstructLayoutConfig(config: JsonElement | undefined) {
        if (config === undefined) {
            this._explicitBalancesHeight = false;
        } else {
            const balancesHeightResult = config.tryGetInteger(HoldingsDitemNgComponent.JsonName.balancesHeight);
            if (balancesHeightResult.isErr()) {
                this._explicitBalancesHeight = false;
            } else {
                this.balancesHeight = balancesHeightResult.value;
                this._explicitBalancesHeight = true;
            }
        }
    }

    public setBalancesVisible(value: boolean) {
        if (value !== this.balancesVisible) {
            this.balancesVisible = value;
            this.markForCheck();
        }
    }

    public override processSymbolLinkedChanged() {
        this.pushSymbolLinkButtonState();
    }

    public override processBrokerageAccountGroupLinkedChanged() {
        this.pushAccountLinkButtonState();
    }

    protected override initialise() {
        this._accountGroupInputComponent.initialise(this._accountGroupUiAction);
        this._sellButtonComponent.initialise(this._sellUiAction);
        this._columnsButtonComponent.initialise(this._columnsUiAction);
        this._autoSizeColumnWidthsButtonComponent.initialise(this._autoSizeColumnWidthsUiAction);
        this._symbolLinkButtonComponent.initialise(this._toggleSymbolLinkingUiAction);
        this._accountLinkButtonComponent.initialise(this._accountGroupLinkUiAction);

        const componentStateElement = this.getInitialComponentStateJsonElement();
        const frameElement = this.tryGetChildFrameJsonElement(componentStateElement);
        const holdingsFrame = this._holdingsComponent.frame;
        const balancesFrame = this._balancesComponent.frame;
        this._frame.initialise(frameElement, holdingsFrame, balancesFrame);

        if (!this._explicitBalancesHeight) {
            const gridRowHeight = this._balancesComponent.gridRowHeight;
            const gridHeaderHeight = this._balancesComponent.getHeaderPlusFixedLineHeight();
            const gridHorizontalScrollbarInsideOverlap = balancesFrame.gridHorizontalScrollbarInsideOverlap;
            this.balancesHeight = gridHeaderHeight + gridRowHeight + gridHorizontalScrollbarInsideOverlap;
            this.markForCheck();
        }

        this.pushSellButtonState(this._frame.focusedRecordIndex);

        super.initialise();
    }

    protected override finalise() {
        this._accountGroupUiAction.finalise();
        this._sellUiAction.finalise();
        this._columnsUiAction.finalise();
        this._autoSizeColumnWidthsUiAction.finalise();
        this._accountGroupLinkUiAction.finalise();
        this._toggleSymbolLinkingUiAction.finalise();

        this._frame.finalise();
        super.finalise();
    }

    protected constructLoad(element: JsonElement | undefined) {
        const frameElement = this.tryGetChildFrameJsonElement(element);
        this._frame.constructLoad(frameElement);

        if (element === undefined) {
            this._explicitBalancesHeight = false;
        } else {
            const balancesHeightResult = element.tryGetInteger(HoldingsDitemNgComponent.JsonName.balancesHeight);
            if (balancesHeightResult.isErr()) {
                this._explicitBalancesHeight = false;
            } else {
                this.balancesHeight = balancesHeightResult.value;
                this._explicitBalancesHeight = true;
            }
        }
    }

    protected save(element: JsonElement) {
        if (this._explicitBalancesHeight) {
            const balancesHeight = this.getBalancesHeight();
            element.setInteger(HoldingsDitemNgComponent.JsonName.balancesHeight, balancesHeight);
        }

        const frameElement = this.createChildFrameJsonElement(element);
        this._frame.save(frameElement);
    }

    private handleAccountGroupCommitEvent(typeId: UiAction.CommitTypeId) {
        const accountId = this._accountGroupUiAction.definedValue;
        this._frame.setBrokerageAccountGroupFromDitem(accountId);
    }

    private handleSellSignalEvent() {
        this._frame.sellFocused();
    }

    private handleColumnsUiActionSignalEvent() {
        this.showLayoutEditorDialog();
    }

    private handleAutoSizeColumnWidthsUiActionSignalEvent(_signalTypeId: UiAction.SignalTypeId, downKeys: ModifierKey.IdSet) {
        const widenOnly = ModifierKey.idSetIncludes(downKeys, ModifierKeyId.Shift);
        this._frame.autoSizeAllColumnWidths(widenOnly);
    }

    private handleAccountLinkSignalEvent() {
        this._frame.brokerageAccountGroupLinked = !this._frame.brokerageAccountGroupLinked;
    }

    private handleToggleSymbolLinkingSignalEvent() {
        this._frame.litIvemIdLinked = !this._frame.litIvemIdLinked;
    }

    private handleHoldingsRecordFocusEvent(recordIndex: Integer | undefined) {
        this.pushSellButtonState(this._frame.focusedRecordIndex);
    }

    private handleGridSourceOpenedEvent(group: BrokerageAccountGroup) {
        this._accountGroupUiAction.pushValue(group);
        const contentName = group.isAll() ? undefined : group.id;
        this.setTitle(this._frame.baseTabDisplay, contentName);
    }

    private createAccountIdUiAction() {
        const action = new BrokerageAccountGroupUiAction();
        action.pushOptions({ allAllowed: true });
        action.pushTitle(Strings[StringId.SelectAccountTitle]);
        action.pushPlaceholder(Strings[StringId.BrokerageAccountIdInputPlaceholderText]);
        action.commitEvent = (typeId) => this.handleAccountGroupCommitEvent(typeId);
        return action;
    }

    private createSellUiAction() {
        const commandName = InternalCommand.Id.SellOrderPad;
        const displayId = StringId.SellOrderPadCaption;
        const command = this.commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushTitle(Strings[StringId.SellOrderPadTitle]);
        action.pushIcon(IconButtonUiAction.IconId.SellOrderPad);
        action.pushUnselected();
        action.signalEvent = () => this.handleSellSignalEvent();
        return action;
    }

    private createColumnsUiAction() {
        const commandName = InternalCommand.Id.SelectGridColumns;
        const displayId = StringId.SelectColumnsCaption;
        const command = this.commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushTitle(Strings[StringId.SelectColumnsTitle]);
        action.pushIcon(IconButtonUiAction.IconId.SelectColumns);
        action.pushUnselected();
        action.signalEvent = () => this.handleColumnsUiActionSignalEvent();
        return action;
    }

    private createAutoSizeColumnWidthsUiAction() {
        const commandName = InternalCommand.Id.AutoSizeGridColumnWidths;
        const displayId = StringId.AutoSizeColumnWidthsCaption;
        const command = this.commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushTitle(Strings[StringId.AutoSizeColumnWidthsTitle]);
        action.pushIcon(IconButtonUiAction.IconId.AutoSizeColumnWidths);
        action.pushUnselected();
        action.signalEvent = (signalTypeId, downKeys) => this.handleAutoSizeColumnWidthsUiActionSignalEvent(signalTypeId, downKeys);
        return action;
    }

    private createToggleSymbolLinkingUiAction() {
        const commandName = InternalCommand.Id.ToggleSymbolLinking;
        const displayId = StringId.ToggleSymbolLinkingCaption;
        const command = this.commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushTitle(Strings[StringId.ToggleSymbolLinkingTitle]);
        action.pushIcon(IconButtonUiAction.IconId.SymbolLink);
        action.signalEvent = () => this.handleToggleSymbolLinkingSignalEvent();
        return action;
    }

    private createToggleAccountGroupLinkingUiAction() {
        const commandName = InternalCommand.Id.ToggleAccountLinking;
        const displayId = StringId.ToggleAccountLinkingCaption;
        const command = this.commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushTitle(Strings[StringId.ToggleAccountLinkingTitle]);
        action.pushIcon(IconButtonUiAction.IconId.AccountGroupLink);
        action.signalEvent = () => this.handleAccountLinkSignalEvent();
        return action;
    }

    private pushSellButtonState(newRecordIndex: Integer | undefined) {
        if (newRecordIndex === undefined) {
            this._sellUiAction.pushDisabled();
        } else {
            this._sellUiAction.pushValidOrMissing();
        }
    }

    private pushAccountLinkButtonState() {
        if (this._frame.brokerageAccountGroupLinked) {
            this._accountGroupLinkUiAction.pushSelected();
        } else {
            this._accountGroupLinkUiAction.pushUnselected();
        }
    }

    private pushSymbolLinkButtonState() {
        if (this._frame.litIvemIdLinked) {
            this._toggleSymbolLinkingUiAction.pushSelected();
        } else {
            this._toggleSymbolLinkingUiAction.pushUnselected();
        }
    }

    private getBalancesHeight() {
        const sizes = this._balancesHoldingsSplitComponent.getVisibleAreaSizes();
        if (sizes.length !== 2) {
            throw new AssertInternalError('HDNCGBHHL23239', sizes.length.toString(10));
        } else {
            const balancesHeight = sizes[0];
            if (balancesHeight === '*') {
                throw new AssertInternalError('HDNCGBHH023239');
            } else {
                return balancesHeight;
            }
        }
    }

    private showLayoutEditorDialog() {
        this._activeDialogTypeId = HoldingsDitemNgComponent.ActiveDialogTypeId.Layout;

        const allowedFieldsAndLayoutDefinitions = this._frame.createAllowedFieldsAndLayoutDefinition();

        const closePromise = HoldingsGridLayoutsDialogNgComponent.open(
            this._dialogContainer,
            this._frame.opener,
            Strings[StringId.Holdings_ColumnsDialogCaption],
            allowedFieldsAndLayoutDefinitions
        );
        closePromise.then(
            (layoutOrReferenceDefinition) => {
                if (layoutOrReferenceDefinition !== undefined) {
                    this._frame.openGridLayoutOrReferenceDefinition(layoutOrReferenceDefinition);
                }
                this.closeDialog();
            },
            (reason) => {
                throw new AssertInternalError('HDNCSLEDCPTR20987', getErrorMessage(reason));
            }
        );

        this.markForCheck();
    }

    private closeDialog() {
        this._dialogContainer.clear();
        this._activeDialogTypeId = HoldingsDitemNgComponent.ActiveDialogTypeId.None;
        this.markForCheck();
    }
}

export namespace HoldingsDitemNgComponent {
    export const stateSchemaVersion = '2';

    export namespace JsonName {
        export const balancesHeight = 'balancesHeight';
    }

    export const enum ActiveDialogTypeId {
        None,
        Layout,
    }
}
