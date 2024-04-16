/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Injectable } from '@angular/core';
import { ReferenceableColumnLayoutsService } from '@motifmarkets/motif-core';
import { CoreNgService } from './core-ng.service';

@Injectable({
    providedIn: 'root',
})
export class ReferenceableColumnLayoutsNgService {
    private _service: ReferenceableColumnLayoutsService;

    constructor(coreNgService: CoreNgService) {
        this._service = coreNgService.referenceableColumnLayoutsService;
    }

    get service() { return this._service; }
}
