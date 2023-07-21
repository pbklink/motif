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
    ViewContainerRef
} from '@angular/core';
import { AssertInternalError } from '@motifmarkets/motif-core';
import { GridSourceNgDirective } from '../../grid-source/ng-api';
import { ContentNgService } from '../../ng/content-ng.service';
import { FeedsFrame } from '../feeds-frame';

@Component({
    selector: 'app-feeds',
    templateUrl: './feeds-ng.component.html',
    styleUrls: ['./feeds-ng.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedsNgComponent extends GridSourceNgDirective {
    private static typeInstanceCreateCount = 0;

    declare frame: FeedsFrame;

    constructor(
        elRef: ElementRef<HTMLElement>,
        cdr: ChangeDetectorRef,
        contentNgService: ContentNgService,
    ) {
        super(elRef, ++FeedsNgComponent.typeInstanceCreateCount, cdr, contentNgService);
    }

    protected override createGridSourceFrame(contentNgService: ContentNgService, hostElement: HTMLElement) {
        return contentNgService.createFeedsFrame(this, hostElement);
    }
}

export namespace FeedsNgComponent {
    export function create(container: ViewContainerRef) {
        container.clear();

        const componentRef = container.createComponent(FeedsNgComponent);

        const instance = componentRef.instance;
        if (!(instance instanceof FeedsNgComponent)) {
            throw new AssertInternalError('FCCI59923112141');
        } else {
            return instance;
        }
    }
}
