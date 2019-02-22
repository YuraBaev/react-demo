import { internalAdUnitPathSelector } from 'containers/common/DFPAdUnits/selectors';
import { createSelector } from 'reselect';
import { isMobileSelector } from 'selectors';
import { INTERNAL_TAG_POSITIONS, HEADER_LEADERBOARD_CLASSNAME } from 'containers/common/DFPAdUnits/constants';
import { isVdpFullInfoFetched } from 'containers/vehicleDetails/selectors';
import { jumpstartAdUnitPathSelector, internalAdUnitSelector } from './adUnitPath';
import { targetingSelector } from './targeting';
import { hasWrapProgramSelector } from './vdpModes';
import { VDP_MOBILE_LEADERBOARD } from '../data/mobile';


export const getInternalAdUnitPathSelector = createSelector(
    [internalAdUnitSelector, state => state],
    (internalAdUnit, state) => internalAdUnitPathSelector(internalAdUnit)(state),
);

export const headerPositionSelector = createSelector(
    [isMobileSelector],
    isMobile => (isMobile ? '' : INTERNAL_TAG_POSITIONS.HEADER),
);

export const isHeaderVisibleSelector = createSelector(
    [isMobileSelector, isVdpFullInfoFetched],
    (isMobile, isVDPDataLoaded) => (isVDPDataLoaded && !isMobile),
);

export const isHeaderMobileVisibleSelector = createSelector(
    [isMobileSelector, isVdpFullInfoFetched],
    (isMobile, isVDPDataLoaded) => (isVDPDataLoaded && isMobile),
);

const headerConfig = createSelector(
    [
        hasWrapProgramSelector,
        internalAdUnitSelector,
    ],
    (hasWrap, internalAdUnit) => {
        const common = {
            targetingSelector,
            isVisibleSelector: isHeaderVisibleSelector,
            headerPositionSelector,
        };

        return {
            ...common,
            adUnitPathSelector: hasWrap ? internalAdUnitPathSelector(internalAdUnit) : jumpstartAdUnitPathSelector,
        };
    },
);

export const mobileLeaderboardSelector = createSelector(
    [
        hasWrapProgramSelector,
        jumpstartAdUnitPathSelector,
        getInternalAdUnitPathSelector,
        targetingSelector,
        isHeaderMobileVisibleSelector,
    ],
    (
        hasWrap,
        jumpstartAdUnitPath,
        internalAdUnitPath,
        targeting,
        isHeaderMobileVisible,
    ) => ({
        adUnitPath: hasWrap ? internalAdUnitPath : jumpstartAdUnitPath,
        targeting,
        isVisible: isHeaderMobileVisible,
        slotSize: VDP_MOBILE_LEADERBOARD,
        holderClassName: HEADER_LEADERBOARD_CLASSNAME,
        id: 'header-dfp-ad-id-mobile-vdp',
    }),
);

export default headerConfig;
