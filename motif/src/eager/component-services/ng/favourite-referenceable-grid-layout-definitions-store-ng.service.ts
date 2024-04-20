/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Injectable } from '@angular/core';
import { RevFavouriteReferenceableColumnLayoutDefinitionsStoreService } from '@xilytix/revgrid';

@Injectable({
    providedIn: 'root',
})
export class FavouriteReferenceableColumnLayoutDefinitionsStoreNgService {
    private _service: RevFavouriteReferenceableColumnLayoutDefinitionsStoreService;

    constructor() {
        this._service = new RevFavouriteReferenceableColumnLayoutDefinitionsStoreService();
    }

    get service() { return this._service; }
}
