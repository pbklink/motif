/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Injectable } from '@angular/core';
import { RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { CoreNgService } from './core-ng.service';

@Injectable({
    providedIn: 'root'
})
export class GridFieldCustomHeadingsNgService {
    private _service: RevSourcedFieldCustomHeadings;

    constructor(coreNgService: CoreNgService) {
        this._service = coreNgService.customHeadingsService;
    }

    get service() { return this._service; }
}
