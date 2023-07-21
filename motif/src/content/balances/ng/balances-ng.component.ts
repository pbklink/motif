import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { GridSourceNgDirective } from '../../grid-source/ng-api';
import { ContentNgService } from '../../ng/content-ng.service';
import { BalancesFrame } from '../balances-frame';

@Component({
    selector: 'app-balances',
    templateUrl: './balances-ng.component.html',
    styleUrls: ['./balances-ng.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalancesNgComponent extends GridSourceNgDirective {
    private static typeInstanceCreateCount = 0;

    declare frame: BalancesFrame;

    constructor(
        elRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        contentNgService: ContentNgService,
    ) {
        super(elRef, ++BalancesNgComponent.typeInstanceCreateCount, cdr, contentNgService);
    }

    protected override createGridSourceFrame(contentNgService: ContentNgService, hostElement: HTMLElement) {
        return contentNgService.createBalancesFrame(this, hostElement);
    }
}
