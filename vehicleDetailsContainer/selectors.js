import { createSelector } from 'reselect';
import { isMobileSelector } from 'selectors';
import { toThousandInteger } from 'services/helper';

import { savedVehiclesIdsSelector } from 'containers/features/SaveVehicles/selectors';

const vehicleDetailsSelector = state => state.vehicleDetailsPage || {};

export const vehicleDetailsPageDataSelector = createSelector(
    [vehicleDetailsSelector],
    data => data.data || {},
);

export const pendingSelector = createSelector(
    [vehicleDetailsSelector],
    vehicleDetails => vehicleDetails.pending,
);

export const isInitializedSelector = createSelector(
    [vehicleDetailsSelector],
    vehicleDetails => vehicleDetails.isInitialized,
);

export const isFavoriteSelector = createSelector(
    [vehicleDetailsPageDataSelector, savedVehiclesIdsSelector],
    (data, savedVehiclesIds) => savedVehiclesIds.includes(data.id),
);

export const savesSelector = createSelector(
    [vehicleDetailsPageDataSelector],
    data => data.saves,
);

export const statisticPendingSelector = createSelector(
    [vehicleDetailsSelector],
    data => data.statisticPending,
);

export const sellerDataSelector = createSelector(
    [vehicleDetailsSelector],
    data => (data.sellerProps || {}),
);

export const isVdpFullInfoFetched = createSelector(
    [vehicleDetailsSelector, pendingSelector],
    (data, pending) => (
        data
        && data.isInitialized
        && data.isSellerInitialized
        && !pending
    ),
);

export const minPriceSelector = createSelector(
    [vehicleDetailsPageDataSelector],
    data => data.marketvalue_below_price,
);

export const averagePriceSelector = createSelector(
    [vehicleDetailsPageDataSelector],
    data => data.marketvalue_average_price,
);

export const maxPriceSelector = createSelector(
    [vehicleDetailsPageDataSelector],
    data => data.marketvalue_above_price,
);

export const priceSelector = createSelector(
    [vehicleDetailsPageDataSelector],
    data => data.price,
);

export const callForPriceSelector = createSelector(
    [vehicleDetailsPageDataSelector],
    data => data.call_for_price,
);

export const vehicleIdSelector = createSelector(
    [vehicleDetailsPageDataSelector],
    data => data.vehicle_id,
);

export const hasInvalidPriceDataSelector = createSelector(
    [minPriceSelector, averagePriceSelector, maxPriceSelector, pendingSelector],
    (minPrice, averagePrice, maxPrice, pending) => {
        const isPricesDataInvalid = (isNaN(minPrice) || isNaN(maxPrice)) || (!minPrice && !maxPrice);
        const isMinPriceGreaterOrEqual = minPrice >= maxPrice;
        const isInvalidData = isPricesDataInvalid || isMinPriceGreaterOrEqual;

        return pending || isInvalidData;
    },
);

export const currentMileageSelector = createSelector(
    [vehicleDetailsPageDataSelector],
    vehicleDetailsPageData => (
        (vehicleDetailsPageData.mileage ?
            `${toThousandInteger(vehicleDetailsPageData.mileage)} miles` :
            '-')
    ),
);

export const periodSelector = createSelector(
    [vehicleDetailsPageDataSelector],
    vehicleDetailsPageData => vehicleDetailsPageData.marketvalue_period || '-',
);

export const marketValueSelector = createSelector(
    [vehicleDetailsPageDataSelector],
    (vehicleDetailsPageData) => {
        const { marketvalue_below_price, marketvalue_above_price } = vehicleDetailsPageData;

        return (!isNaN(marketvalue_below_price) && marketvalue_above_price) ?
            `$${toThousandInteger(marketvalue_below_price)} - $${toThousandInteger(marketvalue_above_price)}` :
            '-';
    },
);

export const certaintySelector = createSelector(
    [vehicleDetailsPageDataSelector],
    (vehicleDetailsPageData) => {
        const { marketvalue_certainty } = vehicleDetailsPageData;

        return marketvalue_certainty ? `${marketvalue_certainty}%` : '-';
    },
);

export const hasWrapProgramSelector = createSelector(
    [
        sellerDataSelector,
        isMobileSelector,
    ],
    (sellerData, isMobile) => (sellerData.dealer_wrap && !isMobile),
);
