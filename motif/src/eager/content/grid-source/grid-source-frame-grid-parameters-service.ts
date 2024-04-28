import { InjectionToken } from '@angular/core';
import { AdaptedRevgridBehavioredColumnSettings, GridField, SourcedFieldGrid } from '@motifmarkets/motif-core';
import { RevSubgrid } from '@xilytix/revgrid';

export interface GridSourceFrameGridParametersService {
    customGridSettings: SourcedFieldGrid.CustomGridSettings;
    customiseSettingsForNewColumnEventer: SourcedFieldGrid.CustomiseSettingsForNewColumnEventer;
    getMainCellPainterEventer: RevSubgrid.GetCellPainterEventer<AdaptedRevgridBehavioredColumnSettings, GridField>;
    getHeaderCellPainterEventer: RevSubgrid.GetCellPainterEventer<AdaptedRevgridBehavioredColumnSettings, GridField>;
}

export namespace GridSourceFrameGridParametersService {
    const tokenName = 'gridSourceFrameGridParametersService';
    export const injectionToken = new InjectionToken<GridSourceFrameGridParametersService>(tokenName);
}
