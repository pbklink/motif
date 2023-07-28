import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { DelayedBadnessGridSourceNgDirective } from '../../delayed-badness-grid-source/ng-api';
import { ContentNgService } from '../../ng/content-ng.service';
import { BrokerageAccountsFrame } from '../brokerage-accounts-frame';

@Component({
    selector: 'app-brokerage-accounts',
    templateUrl: './brokerage-accounts-ng.component.html',
    styleUrls: ['./brokerage-accounts-ng.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrokerageAccountsNgComponent extends DelayedBadnessGridSourceNgDirective {
    private static typeInstanceCreateCount = 0;

    declare frame: BrokerageAccountsFrame;

    constructor(
        elRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        contentNgService: ContentNgService,
    ) {
        super(elRef, ++BrokerageAccountsNgComponent.typeInstanceCreateCount, cdr, contentNgService);
    }

    protected override createGridSourceFrame(contentNgService: ContentNgService) {
        return  contentNgService.createBrokerageAccountsFrame(this);
    }
}
