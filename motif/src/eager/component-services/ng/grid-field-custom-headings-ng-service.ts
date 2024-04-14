/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Injectable } from '@angular/core';
import { RevSourcedFieldCustomHeadingsService } from '@xilytix/rev-data-source';
import { CoreNgService } from './core-ng.service';

@Injectable({
    providedIn: 'root'
})
export class GridFieldCustomHeadingsNgService {
    private _service: RevSourcedFieldCustomHeadingsService;

    constructor(coreNgService: CoreNgService) {
        this._service = coreNgService.gridFieldCustomHeadingsService;
    }

    get service() { return this._service; }
}
