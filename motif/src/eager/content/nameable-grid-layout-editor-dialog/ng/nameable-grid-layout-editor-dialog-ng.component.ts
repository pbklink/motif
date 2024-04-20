/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    InjectionToken,
    Injector,
    OnDestroy,
    Self,
    ValueProvider,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {
    AllowedSourcedFieldsColumnLayoutDefinition,
    CommandRegisterService,
    EditableColumnLayoutDefinitionColumnList,
    GridField,
    IconButtonUiAction,
    InternalCommand,
    LockOpenListItem,
    StringId,
    delay1Tick
} from '@motifmarkets/motif-core';
import { RevColumnLayoutOrReferenceDefinition } from '@xilytix/revgrid';
import { CommandRegisterNgService, CoreInjectionTokens } from 'component-services-ng-api';
import { SvgButtonNgComponent } from 'controls-ng-api';
import { ColumnLayoutEditorNgComponent, allowedFieldsInjectionToken, definitionColumnListInjectionToken, oldLayoutDefinitionInjectionToken } from '../../grid-layout-dialog/ng-api';
import { ContentComponentBaseNgDirective } from '../../ng/content-component-base-ng.directive';

@Component({
    selector: 'app-nameable-grid-layout-editor-dialog',
    templateUrl: './nameable-grid-layout-editor-dialog-ng.component.html',
    styleUrls: ['./nameable-grid-layout-editor-dialog-ng.component.scss'],
    providers: [ { provide: definitionColumnListInjectionToken, useClass: EditableColumnLayoutDefinitionColumnList}],

    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NameableColumnLayoutEditorDialogNgComponent extends ContentComponentBaseNgDirective implements AfterViewInit, OnDestroy {
    private static typeInstanceCreateCount = 0;

    @ViewChild('editor', { static: true }) private _editorComponent: ColumnLayoutEditorNgComponent;
    @ViewChild('okButton', { static: true }) private _okButtonComponent: SvgButtonNgComponent;
    @ViewChild('cancelButton', { static: true }) private _cancelButtonComponent: SvgButtonNgComponent;

    private _commandRegisterService: CommandRegisterService;

    private _okUiAction: IconButtonUiAction;
    private _cancelUiAction: IconButtonUiAction;

    private _closeResolve: (value: RevColumnLayoutOrReferenceDefinition | undefined) => void;
    private _closeReject: (reason: unknown) => void;

    constructor(
        elRef: ElementRef<HTMLElement>,
        commandRegisterNgService: CommandRegisterNgService,
        @Inject(NameableColumnLayoutEditorDialogNgComponent.captionInjectionToken) public readonly caption: string,
        @Inject(allowedFieldsInjectionToken) _allowedFields: readonly GridField[],
        @Inject(oldLayoutDefinitionInjectionToken) _oldLayoutDefinition: AllowedSourcedFieldsColumnLayoutDefinition,
        @Self() @Inject(definitionColumnListInjectionToken) private readonly _definitionColumnList: EditableColumnLayoutDefinitionColumnList,
    ) {
        super(elRef, ++NameableColumnLayoutEditorDialogNgComponent.typeInstanceCreateCount);

        this._commandRegisterService = commandRegisterNgService.service;
        this._okUiAction = this.createOkUiAction();
        this._cancelUiAction = this.createCancelUiAction();

        this._definitionColumnList.load(_allowedFields, _oldLayoutDefinition, _oldLayoutDefinition.fixedColumnCount);
    }

    ngAfterViewInit() {
        delay1Tick(() => this.initialiseComponents());
    }

    ngOnDestroy() {
        this._okUiAction.finalise();
        this._cancelUiAction.finalise();
    }

    open(): NameableColumnLayoutEditorDialogNgComponent.ClosePromise {
        return new Promise<RevColumnLayoutOrReferenceDefinition | undefined>((resolve) => {
            this._closeResolve = resolve;
        });
    }

    private handleOkSignal() {
        this.close(true);
    }

    private handleCancelSignal() {
        this.close(false);
    }

    private createOkUiAction() {
        const commandName = InternalCommand.Id.ColumnLayoutDialog_Ok;
        const displayId = StringId.Ok;
        const command = this._commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushIcon(IconButtonUiAction.IconId.ReturnOk);
        action.signalEvent = () => this.handleOkSignal();
        return action;
    }

    private createCancelUiAction() {
        const commandName = InternalCommand.Id.ColumnLayoutDialog_Cancel;
        const displayId = StringId.Cancel;
        const command = this._commandRegisterService.getOrRegisterInternalCommand(commandName, displayId);
        const action = new IconButtonUiAction(command);
        action.pushIcon(IconButtonUiAction.IconId.ReturnCancel);
        action.signalEvent = () => this.handleCancelSignal();
        return action;
    }

    private initialiseComponents() {
        this._okButtonComponent.initialise(this._okUiAction);
        this._cancelButtonComponent.initialise(this._cancelUiAction);
    }

    private close(ok: boolean) {
        if (ok) {
            const columnLayoutDefinition = this._editorComponent.getColumnLayoutDefinition();
            const columnLayoutOrReferenceDefinition = new RevColumnLayoutOrReferenceDefinition(columnLayoutDefinition);
            this._closeResolve(columnLayoutOrReferenceDefinition);
        } else {
            this._closeResolve(undefined);
        }
    }
}

export namespace NameableColumnLayoutEditorDialogNgComponent {
    export type ClosePromise = Promise<RevColumnLayoutOrReferenceDefinition | undefined>;
    export const captionInjectionToken = new InjectionToken<string>('NameableColumnLayoutEditorDialogNgComponent.Caption');

    export function open(
        container: ViewContainerRef,
        opener: LockOpenListItem.Opener,
        caption: string,
        allowedSourcedFieldsColumnLayoutDefinition: AllowedSourcedFieldsColumnLayoutDefinition,
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
        const allowedFieldsProvider: ValueProvider = {
            provide: allowedFieldsInjectionToken,
            useValue: allowedSourcedFieldsColumnLayoutDefinition.allowedFields,
        };
        const oldLayoutDefinitionProvider: ValueProvider = {
            provide: oldLayoutDefinitionInjectionToken,
            useValue: allowedSourcedFieldsColumnLayoutDefinition,
        };
        const injector = Injector.create({
            providers: [openerProvider, captionProvider, allowedFieldsProvider, oldLayoutDefinitionProvider],
        });

        const componentRef = container.createComponent(NameableColumnLayoutEditorDialogNgComponent, { injector });
        const component = componentRef.instance;

        return component.open();
    }
}
