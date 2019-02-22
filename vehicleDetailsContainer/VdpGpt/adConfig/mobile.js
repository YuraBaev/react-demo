import { createSelector } from 'reselect';
import { isDesktopSelector } from 'selectors';
import { isVdpFullInfoFetched } from 'containers/vehicleDetails/selectors';
import { jumpstartAdUnitPathSelector } from '../selectors/adUnitPath';
import { targetingSelector } from '../selectors/targeting';
import {
    NEW_VDP_MOBILE_LIST,
    USED_VDP_MOBILE_LIST,
    CPO_VDP_MOBILE_LIST,
    PPA_VDP_MOBILE_LIST,
} from '../data/mobile';
import * as vdpAdsIds from '../data/ids';

export const VDP_NEW = createSelector(
    [
        jumpstartAdUnitPathSelector,
        targetingSelector,
        isDesktopSelector,
        isVdpFullInfoFetched,
    ],
    (jumpstartAdUnitPath, targeting, isDesktop, isVdpDataLoaded) => ({
        adUnitPathWays: [jumpstartAdUnitPath],
        targeting: [targeting],
        slotSizes: NEW_VDP_MOBILE_LIST,
        positions: null,
        additionalParams: null,
        delayedAds: null,
        isVisible: (!isDesktop && isVdpDataLoaded),
        ids: vdpAdsIds.VDP_NEW_MOBILE,
    }),
);

export const VDP_USED = createSelector(
    [
        jumpstartAdUnitPathSelector,
        targetingSelector,
        isDesktopSelector,
        isVdpFullInfoFetched,
    ],
    (jumpstartAdUnitPath, targeting, isDesktop, isVdpDataLoaded) => ({
        adUnitPathWays: [jumpstartAdUnitPath],
        targeting: [targeting],
        slotSizes: USED_VDP_MOBILE_LIST,
        positions: null,
        additionalParams: null,
        delayedAds: null,
        isVisible: (!isDesktop && isVdpDataLoaded),
        ids: vdpAdsIds.VDP_USED_MOBILE,
    }),
);

export const VDP_CPO = createSelector(
    [
        jumpstartAdUnitPathSelector,
        targetingSelector,
        isDesktopSelector,
        isVdpFullInfoFetched,
    ],
    (jumpstartAdUnitPath, targeting, isDesktop, isVdpDataLoaded) => ({
        adUnitPathWays: [jumpstartAdUnitPath],
        targeting: [targeting],
        slotSizes: CPO_VDP_MOBILE_LIST,
        positions: null,
        additionalParams: null,
        delayedAds: null,
        isVisible: (!isDesktop && isVdpDataLoaded),
        ids: vdpAdsIds.VDP_CPO_MOBILE,
    }),
);

export const VDP_PPA_USED = createSelector(
    [
        jumpstartAdUnitPathSelector,
        targetingSelector,
        isDesktopSelector,
        isVdpFullInfoFetched,
    ],
    (jumpstartAdUnitPath, targeting, isDesktop, isVdpDataLoaded) => ({
        adUnitPathWays: [jumpstartAdUnitPath],
        targeting: [targeting],
        slotSizes: PPA_VDP_MOBILE_LIST,
        positions: null,
        additionalParams: null,
        delayedAds: null,
        isVisible: (!isDesktop && isVdpDataLoaded),
        ids: vdpAdsIds.VDP_PPA_USED_MOBILE,
    }),
);

export const VDP_NEW_WRAP = state => ({
    isVisible: false,
});

export const VDP_USED_WRAP = state => ({
    isVisible: false,
});

export const VDP_CPO_WRAP = state => ({
    isVisible: false,
});
