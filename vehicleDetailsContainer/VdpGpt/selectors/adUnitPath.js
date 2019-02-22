import { createSelector } from 'reselect';
import { isMobileSelector } from 'selectors';
import { marketIdSelector } from 'hocs/geoLocation';
import { SECOND_AD_UNIT_LEVEL_VALUES, THIRD_AD_UNIT_LEVEL_VALUES } from 'containers/common/DFPAdUnits/constants';
import { getJumpstartAdUnitPath, getFirstAdUnitLevel } from 'containers/common/DFPAdUnits/services/adUnitPath';
import { VDP_INTERNAL_AD_UNIT_PATH_POSTFIXES } from 'containers/common/DFPAdUnits/mappers/internal';
import { vdpConditionTypeSelector, vdpModeSelector } from './vdpModes';

export const jumpstartAdUnitPathSelector = createSelector(
    [
        vdpConditionTypeSelector,
        marketIdSelector,
        isMobileSelector,
    ],
    (vdpConditionType, market, isMobile) => (
        getJumpstartAdUnitPath({
            firstLevel: getFirstAdUnitLevel({
                firstLevel: vdpConditionType,
                isMobile,
            }),
            secondLevel: SECOND_AD_UNIT_LEVEL_VALUES.VDP,
            thirdLevel: THIRD_AD_UNIT_LEVEL_VALUES.SRP_MODEL,
            market,
        })
    ),
);

export const internalAdUnitSelector = createSelector(
    [isMobileSelector, vdpModeSelector],
    (isMobile, vdpMode) => (isMobile ? null : VDP_INTERNAL_AD_UNIT_PATH_POSTFIXES[vdpMode]),
);
