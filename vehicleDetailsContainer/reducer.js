export const VEHICLE_DETAILS_FETCH_REQUEST = 'VEHICLE_DETAILS_FETCH_REQUEST';
export const VEHICLE_DETAILS_FETCH_SUCCESS = 'VEHICLE_DETAILS_FETCH_SUCCESS';
export const VEHICLE_DETAILS_FETCH_FAIL = 'VEHICLE_DETAILS_FETCH_FAIL';
export const CLEAN_VEHICLE_DETAILS = 'CLEAN_VEHICLE_DETAILS';

export const SELLER_INFO_FETCH_REQUEST = 'SELLER_INFO_FETCH_REQUEST';
export const SELLER_INFO_FETCH_SUCCESS = 'SELLER_INFO_FETCH_SUCCESS';
export const SELLER_INFO_FETCH_FAIL = 'SELLER_INFO_FETCH_FAIL';

export const VIDEO_PLAY_COUNT_VEHICLE_DETAILS = 'VIDEO_PLAY_COUNT_VEHICLE_DETAILS';
export const VIDEO_PLAY_COUNT_VEHICLE_DETAILS_SUCCESS = 'VIDEO_PLAY_COUNT_VEHICLE_DETAILS_SUCCESS';
export const VIDEO_PLAY_COUNT_VEHICLE_DETAILS_FAIL = 'VIDEO_PLAY_COUNT_VEHICLE_DETAILS_FAIL';

export const VEHICLE_DETAILS_UPDATE_STATISTIC = 'VEHICLE_DETAILS_UPDATE_STATISTIC';

// TODO Uncomment if needed
// export const VDP_STATISTICS_FETCH_REQUEST = 'VDP_STATISTICS_FETCH_REQUEST';
// export const VDP_STATISTICS_FETCH_REQUEST_SUCCESS = 'VDP_STATISTICS_FETCH_REQUEST_SUCCESS';
// export const VDP_STATISTICS_FETCH_REQUEST_FAIL = 'VDP_STATISTICS_FETCH_REQUEST_FAIL';

const INIT = {
    data: {},
    pending: false,
    sellerProps: {},
    isInitialized: false,
    isSellerInitialized: false,
    statisticPending: false,
};

const fetchSuccessHandler = (state, payload) => ({
    ...state,
    data: payload,
    pending: false,
    isInitialized: true,
});

const fetchSellerInfoSuccessHandler = (state, payload) => ({
    ...state,
    sellerProps: payload,
    pending: false,
    isSellerInitialized: true,
});

const fetchStatisticSuccessHandler = (state, payload) => ({
    ...state,
    statisticPending: false,
    data: {
        ...state.data,
        ...payload,
    },
});

const updateStatisticHandler = state => ({
    ...state,
    data: {
        ...state.data,
        views: state.data.views + 1,
    },
});

export default function vehicleDetailsPageReducer(state = INIT, action) {
    const { type, payload } = action;

    switch (type) {
    case VEHICLE_DETAILS_FETCH_REQUEST:
    case SELLER_INFO_FETCH_REQUEST:
        return { ...state, pending: true };
    case VEHICLE_DETAILS_UPDATE_STATISTIC:
        return updateStatisticHandler(state);
    // TODO Uncomment if needed
    // case VDP_STATISTICS_FETCH_REQUEST:
    //     return { ...state, statisticPending: true };
    // case VDP_STATISTICS_FETCH_REQUEST_SUCCESS:
    //     return fetchStatisticSuccessHandler(state, payload);
    // case VDP_STATISTICS_FETCH_REQUEST_FAIL:
    //     return { ...state, statisticPending: false };
    case VEHICLE_DETAILS_FETCH_SUCCESS:
        return fetchSuccessHandler(state, payload);

    case SELLER_INFO_FETCH_SUCCESS:
        return fetchSellerInfoSuccessHandler(state, payload);
    case CLEAN_VEHICLE_DETAILS:
        return INIT;
    case VEHICLE_DETAILS_FETCH_FAIL:
    case SELLER_INFO_FETCH_FAIL:
        return { ...state, pending: false };
    default:
        return state;
    }
}

export const vehicleDetailsFetchRequest = id => ({
    type: VEHICLE_DETAILS_FETCH_REQUEST,
    payload: id,
});

export const vehicleDetailsFetchSuccess = payload => ({
    type: VEHICLE_DETAILS_FETCH_SUCCESS,
    payload,
});

export const vehicleDetailsFetchFail = error => ({
    type: VEHICLE_DETAILS_FETCH_FAIL,
    payload: error,
});

export const sellerInfoFetchRequest = id => ({
    type: SELLER_INFO_FETCH_REQUEST,
    payload: id,
});

export const sellerInfoFetchSuccess = payload => ({
    type: SELLER_INFO_FETCH_SUCCESS,
    payload,
});

export const sellerInfoFetchFail = error => ({
    type: SELLER_INFO_FETCH_FAIL,
    payload: error,
});

export const cleanVehicleDetails = () => ({
    type: CLEAN_VEHICLE_DETAILS,
});

export const videoPlayCount = payload => ({
    type: VIDEO_PLAY_COUNT_VEHICLE_DETAILS,
    payload,
});

export const videoPlayCountSuccess = () => ({
    type: VIDEO_PLAY_COUNT_VEHICLE_DETAILS_SUCCESS,
});

export const videoPlayCountFail = payload => ({
    type: VIDEO_PLAY_COUNT_VEHICLE_DETAILS_FAIL,
    payload,
});

export const updateVdpStatistic = () => ({
    type: VEHICLE_DETAILS_UPDATE_STATISTIC,
});

// TODO Uncomment if needed
// export const vehicleStatisticFetch = payload => ({
//     type: VDP_STATISTICS_FETCH_REQUEST,
//     payload,
// });
//
// export const vehicleStatisticFetchSuccess = payload => ({
//     type: VDP_STATISTICS_FETCH_REQUEST_SUCCESS,
//     payload,
// });
//
// export const vehicleStatisticFetchFail = payload => ({
//     type: VDP_STATISTICS_FETCH_REQUEST_FAIL,
//     payload,
// });
