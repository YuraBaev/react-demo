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
