/**
 * @license Motif
 * (c) 2021 Paritech Wealth Technology
 * License: motionite.trade/license/motif
 */

import { Injectable } from '@angular/core';
import { RevFavouriteReferenceableColumnLayoutDefinitionsStore } from '@xilytix/revgrid';
import { FavouriteReferenceableColumnLayoutDefinitionsStoreService } from '../favourite-referenceable-grid-layout-definitions-store.service';

@Injectable({
    providedIn: 'root',
})
export class FavouriteReferenceableColumnLayoutDefinitionsStoreNgService {
    private _service: RevFavouriteReferenceableColumnLayoutDefinitionsStore;

    constructor() {
        this._service = new FavouriteReferenceableColumnLayoutDefinitionsStoreService();
    }

    get service() { return this._service; }
}
