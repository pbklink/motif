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
    InjectionToken,
    Injector,
    OnDestroy,
    ValueProvider,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {
    CommandRegisterService,
    IconButtonUiAction,
    InternalCommand,
    LockOpenListItem,
    Ok,
    Result,
    StringId,
    StringUiAction,
    Strings,
    UiAction,
    UnreachableCaseError,
    delay1Tick
} from '@motifmarkets/motif-core';
import { AssertInternalError } from '@xilytix/sysutils';
import { CommandRegisterNgService, CoreInjectionTokens, ScansNgService } from 'component-services-ng-api';
import { ButtonInputNgComponent, CaptionLabelNgComponent, SvgButtonNgComponent, TabListNgComponent, TextInputNgComponent } from 'controls-ng-api';
import { ContentComponentBaseNgDirective } from '../../../ng/content-component-base-ng.directive';
import { SymbolListDirectoryGridNgComponent } from '../../symbol-list-directory-grid/ng-api';

@Component({
    selector: 'app-open-watchlist-dialog',
    templateUrl: './open-watchlist-dialog-ng.component.html',
    styleUrls: ['./open-watchlist-dialog-ng.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenWatchlistDialogNgComponent extends ContentComponentBaseNgDirective implements AfterViewInit, OnDestroy {
    private static typeInstanceCreateCount = 0;

    @ViewChild('okButton', { static: true }) private _okButtonComponent: SvgButtonNgComponent;
    @ViewChild('cancelButton', { static: true }) private _cancelButtonComponent: SvgButtonNgComponent;
    @ViewChild('tabList', { static: true }) private _tabListComponent: TabListNgComponent;
    @ViewChild('symbolListDirectoryComponent', { static: true }) private _symbolListDirectoryComponent: SymbolListDirectoryGridNgComponent;
    @ViewChild('listNameLabel', { static: true }) private _listNameLabelComponent: CaptionLabelNgComponent;
    @ViewChild('listNameControl', { static: true }) private _listNameControlComponent: TextInputNgComponent;
    @ViewChild('openButton', { static: true }) private _openButtonComponent: ButtonInputNgComponent;

    public symbolListVisible = true;
    public watchlistVisible = false;

    private _okUiAction: IconButtonUiAction;
    private _cancelUiAction: IconButtonUiAction;
    private _listNameUiAction: StringUiAction;

    private _visibleExistingListsTypeId: OpenWatchlistDialogNgComponent.ExistingListsTypeId;

    private _closeResolve: ((this: void, scanId: Result<string | undefined>) => void);

    private _listId: string | undefined;

    constructor(
        elRef: ElementRef<HTMLElement>,
        private _cdr: ChangeDetectorRef,
        commandRegisterNgService: CommandRegisterNgService,
        scansNgService: ScansNgService,
        @Inject(OpenWatchlistDialogNgComponent.captionInjectionToken) public readonly caption: string,
    ) {
        super(elRef, ++OpenWatchlistDialogNgComponent.typeInstanceCreateCount);

        const commandRegisterService = commandRegisterNgService.service;

        this._okUiAction = this.createOkUiAction(commandRegisterService);
        this._cancelUiAction = this.createCancelUiAction(commandRegisterService);
        this._listNameUiAction = this.createListNameUiAction();
    }

    ngAfterViewInit() {
        delay1Tick(() => this.initialiseComponents());
    }

    ngOnDestroy() {
        this._okUiAction.finalise();
        this._cancelUiAction.finalise();
        this._listNameUiAction.finalise();
    }

    open(): OpenWatchlistDialogNgComponent.ClosePromise {
        return new Promise((resolve) => {
            this._closeResolve = resolve;
        });
    }

    private handleActiveTabChangedEvent(tab: TabListNgComponent.Tab, existingListsTypeId: OpenWatchlistDialogNgComponent.ExistingListsTypeId) {
        if (tab.active) {
            this.showExistingListsTypeId(existingListsTypeId);
        }
    }

    private createOkUiAction(commandRegisterService: CommandRegisterService) {
        const commandName = InternalCommand.Id.OpenWatchlistDialog_Ok;
        const displayId = StringId.Open;
        const command = commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushIcon(IconButtonUiAction.IconId.ReturnOk);
        action.pushDisabled();
        action.signalEvent = () => this.close(true);
        return action;
    }

    private createCancelUiAction(commandRegisterService: CommandRegisterService) {
        const commandName = InternalCommand.Id.OpenWatchlistDialog_Cancel;
        const displayId = StringId.Cancel;
        const command = commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushIcon(IconButtonUiAction.IconId.ReturnCancel);
        action.signalEvent = () => this.close(false);
        return action;
    }

    private createListNameUiAction() {
        const action = new StringUiAction();
        action.pushCaption(Strings[StringId.OpenWatchlistDialog_ListName_Caption]);
        action.pushTitle(Strings[StringId.OpenWatchlistDialog_ListName_Description]);
        action.inputEvent = () => {
            this.focusList(this._listNameUiAction.inputtedText);
        }
        action.commitEvent = (typeId) => {
            this.focusList(this._listNameUiAction.definedValue);
            if (typeId === UiAction.CommitTypeId.Explicit && this._listId !== undefined) {
                this.close(true);
            }
        }

        return action;
    }

    private initialiseComponents() {
        this._okButtonComponent.initialise(this._okUiAction);
        this._cancelButtonComponent.initialise(this._cancelUiAction);
        this._listNameLabelComponent.initialise(this._listNameUiAction);
        this._listNameControlComponent.initialise(this._listNameUiAction);
        this._openButtonComponent.initialise(this._okUiAction);

        const tabDefinitions: TabListNgComponent.TabDefinition[] = [
            {
                caption: Strings[StringId.SymbolList],
                initialActive: true,
                initialDisabled: false,
                activeChangedEventer: (tab) => this.handleActiveTabChangedEvent(tab, OpenWatchlistDialogNgComponent.ExistingListsTypeId.SymbolList),
            },
            // {
            //     caption: Strings[StringId.Watchlist],
            //     initialActive: false,
            //     initialDisabled: false,
            //     activeChangedEventer: (tab) => this.handleActiveTabChangedEvent(tab, OpenWatchlistDialogNgComponent.ExistingListsTypeId.Watchlist),
            // },
        ];
        this._tabListComponent.setTabs(tabDefinitions);

        this._symbolListDirectoryComponent.listFocusedEventer = (id, name) => {
            this._listId = id;
            this._listNameUiAction.pushValue(name);
            this.setOkEnabled(id !== undefined);
        }

        this.showExistingListsTypeId(OpenWatchlistDialogNgComponent.ExistingListsTypeId.SymbolList);
    }

    private showExistingListsTypeId(value: OpenWatchlistDialogNgComponent.ExistingListsTypeId) {
        if (value !== this._visibleExistingListsTypeId) {
            // let selectedListName: string;
            switch (value) {
                case OpenWatchlistDialogNgComponent.ExistingListsTypeId.SymbolList:
                    // selectedListName = this._symbolListDirectoryComponent.selectedListName
                    break;

                case OpenWatchlistDialogNgComponent.ExistingListsTypeId.Watchlist:
                    // selectedListName = this._symbolListDirectoryComponent.selectedListName
                    break;

                default:
                    throw new UnreachableCaseError('OWDNCSELTI74773', value);
            }

            this._visibleExistingListsTypeId = value;
            this._cdr.markForCheck();
        }
    }

    private focusList(idOrName: string) {
        switch (this._visibleExistingListsTypeId) {
            case OpenWatchlistDialogNgComponent.ExistingListsTypeId.SymbolList:
                this._symbolListDirectoryComponent.focusList(idOrName);
                break;
            case OpenWatchlistDialogNgComponent.ExistingListsTypeId.Watchlist:
                this._listId = undefined;
                break;
            default:
                throw new UnreachableCaseError('OWDNCFL74773', this._visibleExistingListsTypeId);
        }
    }

    private setOkEnabled(value: boolean) {
        if (value) {
            this._okUiAction.pushValidOrMissing();
        } else {
            this._okUiAction.pushDisabled();
        }
    }

    private close(ok: boolean) {
        if (ok) {
            const listId = this._listId;
            if (listId === undefined) {
                throw new AssertInternalError('OWDNCC55598');
            } else {
                this._closeResolve(new Ok(listId));
            }
        } else {
            this._closeResolve(new Ok(undefined));
        }
    }
}

export namespace OpenWatchlistDialogNgComponent {
    export const enum ExistingListsTypeId {
        SymbolList,
        Watchlist,
    }

    export type ClosePromise = Promise<Result<string | undefined>>;
    export const captionInjectionToken = new InjectionToken<string>('OpenWatchlistDialogNgComponent.Caption');

    export function open(
        container: ViewContainerRef,
        opener: LockOpenListItem.Opener,
        caption: string,
    ): ClosePromise {
        container.clear();

        const openerProvider: ValueProvider = {
            provide: CoreInjectionTokens.lockOpenListItemOpener,
            useValue: opener,
        };
        const captionProvider: ValueProvider = {
            provide: captionInjectionToken,
            useValue: caption,
        }
        const injector = Injector.create({
            providers: [openerProvider, captionProvider],
        });

        const componentRef = container.createComponent(OpenWatchlistDialogNgComponent, { injector });

        const component = componentRef.instance;

        return component.open();
    }
}
