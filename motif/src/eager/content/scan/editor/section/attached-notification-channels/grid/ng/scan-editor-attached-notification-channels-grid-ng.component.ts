/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject } from '@angular/core';
import { AssertInternalError, LockOpenListItem, LockerScanAttachedNotificationChannelList } from '@motifmarkets/motif-core';
import { CoreInjectionTokens } from 'component-services-ng-api';
import { GridSourceNgDirective } from '../../../../../../grid-source/ng-api';
import { ContentNgService } from '../../../../../../ng/content-ng.service';
import { ScanEditorAttachedNotificationChannelsGridFrame } from '../scan-editor-attached-notification-channels-grid-frame';

@Component({
    selector: 'app-scan-editor-attached-notification-channels-grid',
    templateUrl: './scan-editor-attached-notification-channels-grid-ng.component.html',
    styleUrls: ['./scan-editor-attached-notification-channels-grid-ng.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScanEditorAttachedNotificationChannelsGridNgComponent extends GridSourceNgDirective {
    declare frame: ScanEditorAttachedNotificationChannelsGridNgComponent.Frame;

    constructor(
        elRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        contentNgService: ContentNgService,
        @Inject(CoreInjectionTokens.lockOpenListItemOpener) private readonly _opener: LockOpenListItem.Opener,
    ) {
        const frame: ScanEditorAttachedNotificationChannelsGridNgComponent.Frame = contentNgService.createScanEditorAttachedNotificationChannelsGridFrame(_opener);
        super(elRef, ++ScanEditorAttachedNotificationChannelsGridNgComponent.typeInstanceCreateCount, cdr, frame);
    }

    setList(value: LockerScanAttachedNotificationChannelList | undefined) {
        if (value === undefined) {
            this.frame.closeGridSource(true);
        } else {
            const promise = this.frame.tryOpenList(value, true);
            AssertInternalError.throwErrorIfPromiseRejected(promise, 'SFEGGNC33133');
        }
    }

    protected override processAfterViewInit() {
        super.processAfterViewInit();
        this.frame.initialiseGrid(this._opener, undefined, false);
    }
}

export namespace ScanEditorAttachedNotificationChannelsGridNgComponent {
    // eslint-disable-next-line prefer-const
    export let typeInstanceCreateCount = 0;
    export type Frame = ScanEditorAttachedNotificationChannelsGridFrame;
}
