import { createSelector } from 'reselect';
import { marketIdSelector } from 'hocs/geoLocation';
import {
    ALLOWED_PAGE_TYPES,
    PROD_VALUES,
    SUBPROD_VALUES,
    PRODSOUP_VALUES,
    PUB_VALUES,
    JAG_FIELDNAMES,
} from 'containers/common/DFPAdUnits/constants';
import { getJag } from 'containers/common/DFPAdUnits/mappers/jumpstart';
import { vehicleDetailsPageDataSelector } from 'containers/vehicleDetails/selectors';
import pick from 'lodash.pick';
import filterFieldNames from 'constants/filterFieldNames';
import { vdpModeSelector, VDP_ADS_MODES } from './vdpModes';

const VDP_GPT_FIELDS = [
    filterFieldNames.BRAND,
    filterFieldNames.MODEL,
    filterFieldNames.CATEGORY,
    filterFieldNames.BODY_STYLE,
    filterFieldNames.YEAR_MADE,
    filterFieldNames.FUEL_TYPE,
    filterFieldNames.DEALER_ID,
    filterFieldNames.DEALER_TYPE,
    filterFieldNames.DEALER_GROUP_ID,
];

export const targetingSelector = createSelector(
    [vehicleDetailsPageDataSelector, vdpModeSelector, marketIdSelector],
    (vehicle, vdpMode, market) => {
        const gptProps = pick(vehicle, VDP_GPT_FIELDS);

        const commonProps = {
            ...getJag(gptProps[filterFieldNames.BRAND], JAG_FIELDNAMES.MAKE),
            ...getJag(gptProps[filterFieldNames.MODEL], JAG_FIELDNAMES.MODEL),
            ...getJag(gptProps[filterFieldNames.YEAR_MADE], JAG_FIELDNAMES.YEAR),
            ...getJag(gptProps[filterFieldNames.FUEL_TYPE], JAG_FIELDNAMES.FUEL),
            ...getJag(gptProps[filterFieldNames.DEALER_ID], JAG_FIELDNAMES.DEALER_ID),
            ...getJag(gptProps[filterFieldNames.DEALER_TYPE], JAG_FIELDNAMES.DEALER_TYPE),
            ...getJag(gptProps[filterFieldNames.DEALER_GROUP_ID], JAG_FIELDNAMES.DEALER_GROUP_ID),
            pubtemplate: ALLOWED_PAGE_TYPES.VDP,
            pub: PUB_VALUES.REGULAR,
            subprod: SUBPROD_VALUES.VDP,
            market,
        };

        const noWrapProps = {
            ...getJag(gptProps[filterFieldNames.BODY_STYLE], JAG_FIELDNAMES.TYPE),
            ...getJag(gptProps[filterFieldNames.BODY_STYLE], JAG_FIELDNAMES.STYLE),
            prod: PROD_VALUES.LISTINGS,
        };

        const wrapProps = {
            ...getJag(gptProps[filterFieldNames.BODY_STYLE], JAG_FIELDNAMES.BOD),
        };

        switch (vdpMode) {
        case VDP_ADS_MODES.PPA:
            return {
                ...commonProps,
                ...noWrapProps,
                prodsoup: PRODSOUP_VALUES.PPA_DET,
            };
        case VDP_ADS_MODES.VDP_NEW_WRAP:
        case VDP_ADS_MODES.VDP_USED_WRAP:
        case VDP_ADS_MODES.VDP_CPO_WRAP:
            return {
                ...commonProps,
                ...wrapProps,
                prodsoup: PRODSOUP_VALUES.DET,
            };
        default:
            return {
                ...commonProps,
                ...noWrapProps,
            };
        }
    },
);
