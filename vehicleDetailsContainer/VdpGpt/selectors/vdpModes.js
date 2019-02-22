import { createSelector } from 'reselect';
import { AD_UNIT_TYPES } from 'containers/common/DFPAdUnits/constants';
import { vehicleDetailsPageDataSelector, sellerDataSelector } from 'containers/vehicleDetails/selectors';
import { CONDITION_TYPE_VALUES_CONSTANTS, CERTIFIED_VALUES_CONSTANTS } from 'containers/common/Filters/optionsService';

export const VDP_ADS_MODES = {
    NEW: 'VDP_NEW',
    USED: 'VDP_USED',
    CPO: 'VDP_CPO',
    PPA: 'VDP_PPA_USED',
    VDP_NEW_WRAP: 'VDP_NEW_WRAP',
    VDP_USED_WRAP: 'VDP_USED_WRAP',
    VDP_CPO_WRAP: 'VDP_CPO_WRAP',
};

export const vdpWrapMapper = conditionType => `VDP_${AD_UNIT_TYPES[conditionType]}_WRAP`;

export const isPPASelector = createSelector(
    [vehicleDetailsPageDataSelector],
    vdpData => vdpData.user_id,
);

export const hasWrapProgramSelector = createSelector(
    [sellerDataSelector],
    vdpData => Boolean(vdpData.dealer_wrap),
);

export const vdpConditionTypeSelector = createSelector(
    [vehicleDetailsPageDataSelector],
    (vehicle) => {
        const { condition_type, certified } = vehicle;

        const isCerfified = (certified === CERTIFIED_VALUES_CONSTANTS.CERTIFIED);
        const isNew = (condition_type === CONDITION_TYPE_VALUES_CONSTANTS.NEW);
        const isUsed = (condition_type === CONDITION_TYPE_VALUES_CONSTANTS.USED);

        if (isCerfified) {
            return AD_UNIT_TYPES.CPO;
        }

        if (isNew) {
            return AD_UNIT_TYPES.NEW;
        }

        return AD_UNIT_TYPES.USED;
    },
);

export const vdpModeSelector = createSelector(
    [
        isPPASelector,
        hasWrapProgramSelector,
        vdpConditionTypeSelector,
    ],
    (isPPA, isWrapped, conditionType) => {
        if (isWrapped) {
            return vdpWrapMapper(conditionType);
        }

        if (isPPA) {
            return VDP_ADS_MODES.PPA;
        }

        return VDP_ADS_MODES[conditionType] || VDP_ADS_MODES.USED;
    },
);
