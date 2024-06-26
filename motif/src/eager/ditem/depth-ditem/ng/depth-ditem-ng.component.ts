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
    CommaText,
    IconButtonUiAction,
    InternalCommand,
    JsonElement,
    LitIvemId,
    LitIvemIdUiAction,
    ModifierKey,
    ModifierKeyId,
    StringId,
    StringUiAction,
    Strings,
    UiAction,
    delay1Tick,
    getErrorMessage,
    logger
} from '@motifmarkets/motif-core';
import { AdiNgService, CommandRegisterNgService, SettingsNgService, SymbolsNgService } from 'component-services-ng-api';
import { DepthGridLayoutsDialogNgComponent, DepthNgComponent } from 'content-ng-api';
import { LitIvemIdSelectNgComponent, SvgButtonNgComponent, TextInputNgComponent } from 'controls-ng-api';
import { ComponentContainer } from 'golden-layout';
import { BuiltinDitemNgComponentBaseNgDirective } from '../../ng/builtin-ditem-ng-component-base.directive';
import { DesktopAccessNgService } from '../../ng/desktop-access-ng.service';
import { DepthDitemFrame } from '../depth-ditem-frame';

@Component({
    selector: 'app-depth-ditem',
    templateUrl: './depth-ditem-ng.component.html',
    styleUrls: ['./depth-ditem-ng.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DepthDitemNgComponent extends BuiltinDitemNgComponentBaseNgDirective
    implements OnDestroy, AfterViewInit, DepthDitemFrame.ComponentAccess {

    private static typeInstanceCreateCount = 0;

    @ViewChild('symbolInput') private _symbolInputComponent: LitIvemIdSelectNgComponent;
    @ViewChild('symbolButton', { static: true }) private _symbolButtonComponent: SvgButtonNgComponent;
    @ViewChild('symbolLinkButton') private _symbolLinkButtonComponent: SvgButtonNgComponent;
    @ViewChild('rollUpButton', { static: true }) private _rollUpButtonComponent: SvgButtonNgComponent;
    @ViewChild('rollDownButton', { static: true }) private _rollDownButtonComponent: SvgButtonNgComponent;
    @ViewChild('filterButton', { static: true }) private _filterButtonComponent: SvgButtonNgComponent;
    @ViewChild('filterEdit') private _filterEditComponent: TextInputNgComponent;
    @ViewChild('columnsButton', { static: true }) private _columnsButtonComponent: SvgButtonNgComponent;
    @ViewChild('autoSizeColumnWidthsButton', { static: true }) private _autoSizeColumnWidthsButtonComponent: SvgButtonNgComponent;
    @ViewChild('depthContent', { static: true }) private _contentComponent: DepthNgComponent;
    @ViewChild('layoutEditorContainer', { read: ViewContainerRef, static: true }) private _layoutEditorContainer: ViewContainerRef;

    public isLayoutEditorVisible = false;

    private _symbolInputUiAction: LitIvemIdUiAction;
    private _symbolApplyUiAction: IconButtonUiAction;
    private _toggleSymbolLinkingUiAction: IconButtonUiAction;
    private _rollUpUiAction: IconButtonUiAction;
    private _expandUiAction: IconButtonUiAction;
    private _filterUiAction: IconButtonUiAction;
    private _filterEditUiAction: StringUiAction;
    private _autoSizeColumnWidthsUiAction: IconButtonUiAction;
    private _columnsUiAction: IconButtonUiAction;

    private _frame: DepthDitemFrame;

    constructor(
        elRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        @Inject(BuiltinDitemNgComponentBaseNgDirective.goldenLayoutContainerInjectionToken) container: ComponentContainer,
        settingsNgService: SettingsNgService,
        commandRegisterNgService: CommandRegisterNgService,
        desktopAccessNgService: DesktopAccessNgService,
        adiNgService: AdiNgService,
        symbolsNgService: SymbolsNgService
    ) {
        super(
            elRef,
            ++DepthDitemNgComponent.typeInstanceCreateCount,
            cdr,
            container,
            settingsNgService.service,
            commandRegisterNgService.service
        );


        this._frame = new DepthDitemFrame(this, this.settingsService, this.commandRegisterService,
            desktopAccessNgService.service, symbolsNgService.service, adiNgService.service);

        this._symbolInputUiAction = this.createSymbolInputUiAction();
        this._symbolApplyUiAction = this.createSymbolApplyUiAction();
        this._toggleSymbolLinkingUiAction = this.createToggleSymbolLinkingUiAction();
        this._rollUpUiAction = this.createRollUpUiAction();
        this._expandUiAction = this.createExpandUiAction();
        this._filterUiAction = this.createFilterUiAction();
        this._filterEditUiAction = this.createFilterEditUiAction();
        this._autoSizeColumnWidthsUiAction = this.createAutoSizeColumnWidthsUiAction();
        this._columnsUiAction = this.createColumnsUiAction();

        this.constructLoad(this.getInitialComponentStateJsonElement());

        this.pushSymbol(this._frame.litIvemId);
        this.pushSymbolLinkSelectState();
    }

    get ditemFrame() { return this._frame; }
    protected get stateSchemaVersion() { return DepthDitemNgComponent.stateSchemaVersion; }

    public ngOnDestroy() {
        this.finalise();
    }

    public ngAfterViewInit() {
        delay1Tick(() => this.initialise());
    }

    // TradesDitemFrame.ComponentAccess methods
    public pushSymbol(litIvemId: LitIvemId | undefined) {
        this._symbolInputUiAction.pushValue(litIvemId);
    }

    public notifyOpenedClosed(litIvemId: LitIvemId | undefined) {
        this.pushSymbol(litIvemId);
        this.pushFilterEditValue();
        this._symbolApplyUiAction.pushDisabled();
        this.pushAccepted();
    }

    public override processSymbolLinkedChanged() {
        this.pushSymbolLinkSelectState();
    }

    protected override initialise() {
        const componentStateElement = this.getInitialComponentStateJsonElement();
        const ditemFrameElement = this.tryGetChildFrameJsonElement(componentStateElement);
        this._frame.initialise(ditemFrameElement, this._contentComponent.frame);

        this.pushFilterSelectState();
        this.pushFilterEditValue();

        this.initialiseChildComponents();

        this._frame.open();

        super.initialise();
    }

    protected override finalise() {
        this._symbolInputUiAction.finalise();
        this._symbolApplyUiAction.finalise();
        this._toggleSymbolLinkingUiAction.finalise();
        this._rollUpUiAction.finalise();
        this._expandUiAction.finalise();
        this._filterUiAction.finalise();
        this._filterEditUiAction.finalise();
        this._autoSizeColumnWidthsUiAction.finalise();
        this._columnsUiAction.finalise();

        this._frame.finalise();
        super.finalise();
    }

    protected constructLoad(element: JsonElement | undefined) {
        const frameElement = this.tryGetChildFrameJsonElement(element);
        this._frame.constructLoad(frameElement);
    }

    protected save(element: JsonElement) {
        const frameElement = this.createChildFrameJsonElement(element);
        this._frame.save(frameElement);
    }

    // protected override processShown() {
    //     this._frame.adviseShown();
    // }

    private handleSymbolCommitEvent(typeId: UiAction.CommitTypeId) {
        this.commitSymbol(typeId);
    }

    private handleSymbolInputEvent() {
        if (this._symbolInputUiAction.inputtedText === '') {
            this._symbolApplyUiAction.pushDisabled();
        } else {
            // if (!this._symbolEditUiAction.inputtedParseDetails.success) {
            //     this._symbolApplyUiAction.pushDisabled();
            // } else {
            //     if (this._symbolEditUiAction.isInputtedSameAsCommitted()) {
            //         this._symbolApplyUiAction.pushDisabled();
            //     } else {
                    this._symbolApplyUiAction.pushUnselected();
            //     }
            // }
        }
    }

    private handleSymbolApplyUiActionSignalEvent(signalTypeId: UiAction.SignalTypeId, downKeys: ModifierKey.IdSet) {
        this.commitSymbol(UiAction.CommitTypeId.Explicit);
    }

    private handleSymbolLinkUiActionSignalEvent(signalTypeId: UiAction.SignalTypeId, downKeys: ModifierKey.IdSet) {
        this._frame.litIvemIdLinked = !this._frame.litIvemIdLinked;
    }

    private handleRollUpUiActionSignalEvent(signalTypeId: UiAction.SignalTypeId, downKeys: ModifierKey.IdSet) {
        this._frame.rollUp(ModifierKey.idSetIncludes(downKeys, ModifierKeyId.Shift));
    }

    private handleExpandUiActionSignalEvent(signalTypeId: UiAction.SignalTypeId, downKeys: ModifierKey.IdSet) {
        this._frame.expand(ModifierKey.idSetIncludes(downKeys, ModifierKeyId.Shift));
    }

    private handleFilterUiActionSignalEvent(signalTypeId: UiAction.SignalTypeId, downKeys: ModifierKey.IdSet) {
        this._frame.toggleFilterActive();
        this.pushFilterSelectState();
    }

    private handleFilterEditUiActionCommitEvent(typeId: UiAction.CommitTypeId) {
        const toArrayResult = CommaText.tryToStringArray(this._filterEditUiAction.definedValue, false);
        if (toArrayResult.isOk()) {
            this._frame.setFilter(toArrayResult.value);
            this.pushFilterEditValue();
        } else {
            this._filterUiAction.pushInvalid(Strings[StringId.Depth_InvalidFilterXrefs]);
        }
    }

    private handleAutoSizeColumnWidthsUiActionSignalEvent(_signalTypeId: UiAction.SignalTypeId, downKeys: ModifierKey.IdSet) {
        const widenOnly = ModifierKey.idSetIncludes(downKeys, ModifierKeyId.Shift);
        this._frame.autoSizeAllColumnWidths(widenOnly);
    }

    private handleColumnsUiActionSignalEvent(signalTypeId: UiAction.SignalTypeId, downKeys: ModifierKey.IdSet) {
        this.showLayoutEditor();
    }

    private createSymbolInputUiAction() {
        const action = new LitIvemIdUiAction();
        action.valueRequired = false;
        action.pushTitle(Strings[StringId.SymbolInputTitle]);
        action.commitEvent = (typeId) => this.handleSymbolCommitEvent(typeId);
        action.inputEvent = () => this.handleSymbolInputEvent();
        return action;
    }

    private createSymbolApplyUiAction() {
        const commandName = InternalCommand.Id.ApplySymbol;
        const displayId = StringId.ApplySymbolCaption;
        const command = this.commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushTitle(Strings[StringId.ApplySymbolTitle]);
        action.pushIcon(IconButtonUiAction.IconId.Execute);
        action.pushDisabled();
        action.signalEvent = (signalTypeId, downKeys) => this.handleSymbolApplyUiActionSignalEvent(signalTypeId, downKeys);
        return action;
    }

    private createToggleSymbolLinkingUiAction() {
        const commandName = InternalCommand.Id.ToggleSymbolLinking;
        const displayId = StringId.ToggleSymbolLinkingCaption;
        const command = this.commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushTitle(Strings[StringId.ToggleSymbolLinkingTitle]);
        action.pushIcon(IconButtonUiAction.IconId.SymbolLink);
        action.signalEvent = (signalTypeId, downKeys) => this.handleSymbolLinkUiActionSignalEvent(signalTypeId, downKeys);
        return action;
    }

    private createRollUpUiAction() {
        const commandName = InternalCommand.Id.Depth_Rollup;
        const displayId = StringId.Depth_RollUpCaption;
        const command = this.commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushTitle(Strings[StringId.Depth_RollUpToPriceLevelsTitle]);
        action.pushIcon(IconButtonUiAction.IconId.RollUp);
        action.signalEvent = (signalTypeId, downKeys) => this.handleRollUpUiActionSignalEvent(signalTypeId, downKeys);
        return action;
    }

    private createExpandUiAction() {
        const commandName = InternalCommand.Id.Depth_Expand;
        const displayId = StringId.Depth_ExpandCaption;
        const command = this.commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushTitle(Strings[StringId.Depth_ExpandToOrdersTitle]);
        action.pushIcon(IconButtonUiAction.IconId.RollDown);
        action.signalEvent = (signalTypeId, downKeys) => this.handleExpandUiActionSignalEvent(signalTypeId, downKeys);
        return action;
    }

    private createFilterUiAction() {
        const commandName = InternalCommand.Id.Depth_Filter;
        const displayId = StringId.Depth_FilterCaption;
        const command = this.commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushTitle(Strings[StringId.Depth_FilterToXrefsTitle]);
        action.pushIcon(IconButtonUiAction.IconId.Filter);
        action.signalEvent = (signalTypeId, downKeys) => this.handleFilterUiActionSignalEvent(signalTypeId, downKeys);
        return action;
    }

    private createFilterEditUiAction() {
        const action = new StringUiAction();
        action.pushTitle(Strings[StringId.Depth_SpecifyFilterXrefsTitle]);
        action.commitEvent = (typeId) => this.handleFilterEditUiActionCommitEvent(typeId);
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

    private createColumnsUiAction() {
        const commandName = InternalCommand.Id.SelectGridColumns;
        const displayId = StringId.SelectColumnsCaption;
        const command = this.commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushTitle(Strings[StringId.SelectColumnsTitle]);
        action.pushIcon(IconButtonUiAction.IconId.SelectColumns);
        action.pushUnselected();
        action.signalEvent = (signalTypeId, downKeys) => this.handleColumnsUiActionSignalEvent(signalTypeId, downKeys);
        return action;
    }

    private initialiseChildComponents() {
        this._symbolInputComponent.initialise(this._symbolInputUiAction);
        this._symbolButtonComponent.initialise(this._symbolApplyUiAction);
        this._symbolLinkButtonComponent.initialise(this._toggleSymbolLinkingUiAction);
        this._rollUpButtonComponent.initialise(this._rollUpUiAction);
        this._rollDownButtonComponent.initialise(this._expandUiAction);
        this._filterButtonComponent.initialise(this._filterUiAction);
        this._filterEditComponent.initialise(this._filterEditUiAction);
        this._autoSizeColumnWidthsButtonComponent.initialise(this._autoSizeColumnWidthsUiAction);
        this._columnsButtonComponent.initialise(this._columnsUiAction);

        this._frame.open();
    }

    private commitSymbol(typeId: UiAction.CommitTypeId) {
        const litIvemId = this._symbolInputUiAction.value;
        if (litIvemId !== undefined) {
            this._frame.setLitIvemIdFromDitem(litIvemId);
        }
        this.pushValid();
    }

    private pushSymbolLinkSelectState() {
        if (this._frame.litIvemIdLinked) {
            this._toggleSymbolLinkingUiAction.pushSelected();
        } else {
            this._toggleSymbolLinkingUiAction.pushUnselected();
        }
    }

    private pushFilterSelectState() {
        if (this._frame.filterActive) {
            this._filterUiAction.pushSelected();
        } else {
            this._filterUiAction.pushUnselected();
        }
    }

    private pushFilterEditValue() {
        const filterXrefs = this._frame.filterXrefs;
        const value = CommaText.fromStringArray(filterXrefs);
        this._filterEditUiAction.pushValue(value);
    }

    private pushAccepted() {
        this._symbolApplyUiAction.pushAccepted();
    }

    private pushValid() {
        this._symbolApplyUiAction.pushValidOrMissing();
    }

    private showLayoutEditor() {
        this.isLayoutEditorVisible = true;
        const allowedFieldGridLayoutDefinition = this._frame.createAllowedFieldsGridLayoutDefinitions();

        const closePromise = DepthGridLayoutsDialogNgComponent.open(
            this._layoutEditorContainer,
            this._frame.opener,
            Strings[StringId.Depth_ColumnsDialogCaption],
            allowedFieldGridLayoutDefinition
        );
        closePromise.then(
            (layouts) => {
                if (layouts !== undefined) {
                    this._frame.applyGridLayoutDefinitions(layouts);
                }
                this.closeLayoutEditor();
            },
            (reason) => {
                const errorText = getErrorMessage(reason);
                logger.logError(`DepthInput Layout Editor error: ${errorText}`);
                this.closeLayoutEditor();
            }
        );

        this.markForCheck();
    }

    private closeLayoutEditor() {
        this._layoutEditorContainer.clear();
        this.isLayoutEditorVisible = false;
        this.markForCheck();
    }
}

export namespace DepthDitemNgComponent {
    export const stateSchemaVersion = '2';
}
