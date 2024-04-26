import { InjectionToken } from '@angular/core';
import { AdaptedRevgridBehavioredColumnSettings, GridField, SourcedFieldGrid } from '@motifmarkets/motif-core';
import { Subgrid } from '@xilytix/revgrid';

export interface GridSourceFrameGridParametersService {
    customGridSettings: SourcedFieldGrid.CustomGridSettings;
    customiseSettingsForNewColumnEventer: SourcedFieldGrid.CustomiseSettingsForNewColumnEventer;
    getMainCellPainterEventer: Subgrid.GetCellPainterEventer<AdaptedRevgridBehavioredColumnSettings, GridField>;
    getHeaderCellPainterEventer: Subgrid.GetCellPainterEventer<AdaptedRevgridBehavioredColumnSettings, GridField>;
}

export namespace GridSourceFrameGridParametersService {
    const tokenName = 'gridSourceFrameGridParametersService';
    export const injectionToken = new InjectionToken<GridSourceFrameGridParametersService>(tokenName);
}
