import { createSelector } from 'reselect';
import { isDesktopVdpSelector } from 'selectors';
import { isVdpFullInfoFetched } from 'containers/vehicleDetails/selectors';
import { INTERNAL_TAG_POSITIONS, SLCSS_VALUES } from 'containers/common/DFPAdUnits/constants';
import { jumpstartAdUnitPathSelector } from '../selectors/adUnitPath';
import { targetingSelector } from '../selectors/targeting';
import { getInternalAdUnitPathSelector } from '../selectors';
import {
    NEW_VDP_DESKTOP_LIST,
    USED_VDP_DESKTOP_LIST,
    CPO_VDP_DESKTOP_LIST,
    PPA_VDP_DESKTOP_LIST,
    NEW_WRAP_VDP_DESKTOP_LIST,
    USED_WRAP_VDP_DESKTOP_LIST,
    CPO_WRAP_VDP_DESKTOP_LIST,
} from '../data/desktop';
import * as vdpAdsIds from '../data/ids';

export const VDP_NEW = createSelector(
    [
        jumpstartAdUnitPathSelector,
        targetingSelector,
        isDesktopVdpSelector,
        isVdpFullInfoFetched,
    ],
    (jumpstartAdUnitPath, targeting, isDesktop, isVdpDataLoaded) => ({
        adUnitPathWays: [
            jumpstartAdUnitPath,
            jumpstartAdUnitPath,
            jumpstartAdUnitPath,
            jumpstartAdUnitPath,
        ],
        targeting: [targeting, targeting, targeting, targeting],
        slotSizes: NEW_VDP_DESKTOP_LIST,
        positions: null,
        slcss: [
            null,
            null,
            SLCSS_VALUES.VERTICAL,
            null,
        ],
        delayedAds: [false, false, false, true],
        isVisible: (isDesktop && isVdpDataLoaded),
        ids: vdpAdsIds.VDP_NEW,
    }),
);

export const VDP_USED = createSelector(
    [
        jumpstartAdUnitPathSelector,
        getInternalAdUnitPathSelector,
        targetingSelector,
        isDesktopVdpSelector,
        isVdpFullInfoFetched,
    ],
    (
        jumpstartAdUnitPath,
        internalAdUnitPath,
        targeting,
        isDesktop,
        isVdpDataLoaded,
    ) => ({
        adUnitPathWays: [
            jumpstartAdUnitPath,
            jumpstartAdUnitPath,
            jumpstartAdUnitPath,
            internalAdUnitPath,
        ],
        targeting: [
            targeting,
            targeting,
            targeting,
            targeting,
        ],
        slotSizes: USED_VDP_DESKTOP_LIST,
        positions: ['', '', '', INTERNAL_TAG_POSITIONS.RECTANGLE_SECOND],
        slcss: [
            null,
            null,
            SLCSS_VALUES.VERTICAL,
            null,
        ],
        delayedAds: null,
        isVisible: (isDesktop && isVdpDataLoaded),
        ids: vdpAdsIds.VDP_USED,
    }),
);

export const VDP_CPO = createSelector(
    [
        jumpstartAdUnitPathSelector,
        getInternalAdUnitPathSelector,
        targetingSelector,
        isDesktopVdpSelector,
        isVdpFullInfoFetched,
    ],
    (
        jumpstartAdUnitPath,
        internalAdUnitPath,
        targeting,
        isDesktop,
        isVdpDataLoaded,
    ) => ({
        adUnitPathWays: [
            jumpstartAdUnitPath,
            jumpstartAdUnitPath,
            jumpstartAdUnitPath,
            internalAdUnitPath,
        ],
        targeting: [
            targeting,
            targeting,
            targeting,
            targeting,
        ],
        slotSizes: CPO_VDP_DESKTOP_LIST,
        positions: ['', '', '', INTERNAL_TAG_POSITIONS.RECTANGLE_SECOND],
        slcss: [
            null,
            null,
            SLCSS_VALUES.VERTICAL,
            null,
        ],
        delayedAds: null,
        isVisible: (isDesktop && isVdpDataLoaded),
        ids: vdpAdsIds.VDP_CPO,
    }),
);

export const VDP_PPA_USED = createSelector(
    [
        jumpstartAdUnitPathSelector,
        getInternalAdUnitPathSelector,
        targetingSelector,
        isDesktopVdpSelector,
        isVdpFullInfoFetched,
    ],
    (
        jumpstartAdUnitPath,
        internalAdUnitPath,
        targeting,
        isDesktop,
        isVdpDataLoaded,
    ) => ({
        adUnitPathWays: [
            jumpstartAdUnitPath,
            jumpstartAdUnitPath,
            jumpstartAdUnitPath,
            internalAdUnitPath,
        ],
        targeting: [
            targeting,
            targeting,
            targeting,
            targeting,
        ],
        slotSizes: PPA_VDP_DESKTOP_LIST,
        positions: ['', '', '', INTERNAL_TAG_POSITIONS.RECTANGLE_SECOND],
        slcss: [
            null,
            null,
            SLCSS_VALUES.VERTICAL,
            null,
        ],
        delayedAds: null,
        isVisible: (isDesktop && isVdpDataLoaded),
        ids: vdpAdsIds.VDP_PPA_USED,
    }),
);

export const VDP_NEW_WRAP = createSelector(
    [
        getInternalAdUnitPathSelector,
        targetingSelector,
        isDesktopVdpSelector,
        isVdpFullInfoFetched,
    ],
    (
        internalAdUnitPath,
        targeting,
        isDesktop,
        isVdpDataLoaded,
    ) => ({
        adUnitPathWays: [internalAdUnitPath],
        targeting: [targeting],
        slotSizes: NEW_WRAP_VDP_DESKTOP_LIST,
        positions: [INTERNAL_TAG_POSITIONS.RECTANGLE_FIRST],
        additionalParams: null,
        delayedAds: null,
        isVisible: (isDesktop && isVdpDataLoaded),
        ids: vdpAdsIds.VDP_NEW_WRAP,
    }),
);

export const VDP_USED_WRAP = createSelector(
    [
        getInternalAdUnitPathSelector,
        targetingSelector,
        isDesktopVdpSelector,
        isVdpFullInfoFetched,
    ],
    (
        internalAdUnitPath,
        targeting,
        isDesktop,
        isVdpDataLoaded,
    ) => ({
        adUnitPathWays: [internalAdUnitPath],
        targeting: [targeting],
        slotSizes: USED_WRAP_VDP_DESKTOP_LIST,
        positions: [INTERNAL_TAG_POSITIONS.RECTANGLE_FIRST],
        additionalParams: null,
        delayedAds: null,
        isVisible: (isDesktop && isVdpDataLoaded),
        ids: vdpAdsIds.VDP_USED_WRAP,
    }),
);

export const VDP_CPO_WRAP = createSelector(
    [
        getInternalAdUnitPathSelector,
        targetingSelector,
        isDesktopVdpSelector,
        isVdpFullInfoFetched,
    ],
    (
        internalAdUnitPath,
        targeting,
        isDesktop,
        isVdpDataLoaded,
    ) => ({
        adUnitPathWays: [internalAdUnitPath],
        targeting: [targeting],
        slotSizes: CPO_WRAP_VDP_DESKTOP_LIST,
        positions: [INTERNAL_TAG_POSITIONS.RECTANGLE_FIRST],
        additionalParams: null,
        delayedAds: null,
        isVisible: (isDesktop && isVdpDataLoaded),
        ids: vdpAdsIds.VDP_CPO_WRAP,
    }),
);
