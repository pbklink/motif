/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Injector,
    ValueProvider,
    ViewContainerRef
} from '@angular/core';
import { AssertInternalError, LockOpenListItem, StringId, Strings } from '@motifmarkets/motif-core';
import { CoreInjectionTokens, ToastNgService } from 'component-services-ng-api';
import { DelayedBadnessGridSourceNgDirective } from '../../delayed-badness-grid-source/ng-api';
import { ContentNgService } from '../../ng/content-ng.service';
import { FeedsFrame } from '../feeds-frame';

@Component({
    selector: 'app-feeds',
    templateUrl: './feeds-ng.component.html',
    styleUrls: ['./feeds-ng.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedsNgComponent extends DelayedBadnessGridSourceNgDirective {
    private static typeInstanceCreateCount = 0;

    declare frame: FeedsFrame;

    constructor(
        elRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        private readonly _toastNgService: ToastNgService,
        contentNgService: ContentNgService,
        @Inject(CoreInjectionTokens.lockOpenListItemOpener) private readonly _opener: LockOpenListItem.Opener,
    ) {
        const frame = contentNgService.createFeedsFrame();
        super(elRef, ++FeedsNgComponent.typeInstanceCreateCount, cdr, frame);
    }

    protected override processAfterViewInit() {
        super.processAfterViewInit();
        this.frame.initialiseGrid(this._opener, undefined, false);
        const openPromise = this.frame.tryOpenDefault(false);
        openPromise.then(
            (result) => {
                if (result.isErr()) {
                    this._toastNgService.popup(`${Strings[StringId.ErrorOpening]} ${Strings[StringId.Feeds]}: ${result.error}`);
                }
            },
            (reason) => { throw AssertInternalError.createIfNotError(reason, 'FNCPR50139') }
        );
    }
}

export namespace FeedsNgComponent {
    export function create(container: ViewContainerRef, opener: LockOpenListItem.Opener) {
        container.clear();

        const openerProvider: ValueProvider = {
            provide: CoreInjectionTokens.lockOpenListItemOpener,
            useValue: opener,
        };
        const injector = Injector.create({
            providers: [openerProvider],
        });

        container.createComponent(FeedsNgComponent, { injector });
    }
}
