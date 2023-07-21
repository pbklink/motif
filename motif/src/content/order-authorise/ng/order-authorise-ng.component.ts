import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { GridSourceNgDirective } from '../../grid-source/ng-api';
import { ContentNgService } from '../../ng/content-ng.service';
import { OrderAuthoriseFrame } from '../order-authorise-frame';

@Component({
    selector: 'app-order-authorise',
    templateUrl: './order-authorise-ng.component.html',
    styleUrls: ['./order-authorise-ng.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderAuthoriseNgComponent extends GridSourceNgDirective {
    private static typeInstanceCreateCount = 0;

    declare frame: OrderAuthoriseFrame;

    constructor(
        elRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        contentNgService: ContentNgService,
    ) {
        super(elRef, ++OrderAuthoriseNgComponent.typeInstanceCreateCount, cdr, contentNgService);
    }

    protected override createGridSourceFrame(contentNgService: ContentNgService, hostElement: HTMLElement) {
        return contentNgService.createOrdersFrame(this, hostElement);
    }
}
