/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject } from '@angular/core';
import { AssertInternalError, LockOpenListItem, StringId, Strings } from '@motifmarkets/motif-core';
import { CoreInjectionTokens, ToastNgService } from 'component-services-ng-api';
import { GridSourceNgDirective } from '../../../grid-source/ng-api';
import { ContentNgService } from '../../../ng/content-ng.service';
import { SymbolListDirectoryGridFrame } from '../symbol-list-directory-grid-frame';

@Component({
    selector: 'app-symbol-list-directory-grid',
    templateUrl: './symbol-list-directory-grid-ng.component.html',
    styleUrls: ['./symbol-list-directory-grid-ng.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SymbolListDirectoryGridNgComponent extends GridSourceNgDirective {
    declare frame: SymbolListDirectoryGridNgComponent.Frame;

    constructor(
        elRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        private readonly _toastNgService: ToastNgService,
        contentNgService: ContentNgService,
        @Inject(CoreInjectionTokens.lockOpenListItemOpener) private readonly _opener: LockOpenListItem.Opener,
    ) {
        const frame: SymbolListDirectoryGridNgComponent.Frame = contentNgService.createSymbolListDirectoryGridFrame(_opener);
        super(elRef, ++SymbolListDirectoryGridNgComponent.typeInstanceCreateCount, cdr, frame);
    }

    get listFocusedEventer() { return this.frame.listFocusedEventer; }
    set listFocusedEventer(value: SymbolListDirectoryGridFrame.listFocusedEventer | undefined) {
        this.frame.listFocusedEventer = value;
    }

    focusList(idOrName: string) {
        return this.frame.focusList(idOrName);
    }

    protected override processAfterViewInit() {
        super.processAfterViewInit();
        this.frame.initialiseGrid(this._opener, undefined, false);
        const openPromise = this.frame.tryOpenDefault(true);
        openPromise.then(
            (openResult) => {
                if (openResult.isErr()) {
                    this._toastNgService.popup(`${Strings[StringId.ErrorOpening]} ${Strings[StringId.NotificationChannelsGrid]}: ${openResult.error}`);
                }
            },
            (reason) => { throw AssertInternalError.createIfNotError(reason, 'LONCGNCPAVI44332'); }
        );
    }
}

export namespace SymbolListDirectoryGridNgComponent {
    // eslint-disable-next-line prefer-const
    export let typeInstanceCreateCount = 0;
    export type Frame = SymbolListDirectoryGridFrame;
}
