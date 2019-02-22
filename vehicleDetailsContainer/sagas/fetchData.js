import { takeLatest, put, call } from 'redux-saga/effects';
import * as searchApi from 'api/search';
import { to } from 'services/redirection';
import { SRP } from 'constants/pages';

import {
    VEHICLE_DETAILS_FETCH_REQUEST,
    vehicleDetailsFetchSuccess,
    vehicleDetailsFetchFail,
    updateVdpStatistic,
    // vehicleStatisticFetch,
} from '../reducer';

const serialize = (responseData) => {
    const data = responseData.data.data;
    const id = data.id;
    const attributes = data.attributes;

    return { id, ...attributes };
};

function* fetch(action) {
    try {
        const vehicleId = action.payload;
        const serverResponse = yield call(searchApi.fetchVehicleDetails, vehicleId);
        const data = serialize(serverResponse);

        yield put(vehicleDetailsFetchSuccess(data));
        yield call(searchApi.statisticsCountVDP, vehicleId);
        yield put(updateVdpStatistic());
        // TODO: Uncomment after prod updating
        // yield put(vehicleStatisticFetch(vehicleId));

    } catch (error) {
        const isUndefinedPage = error.response && error.response.status === 404;
        if (isUndefinedPage) {
            yield call(to, SRP);
        }

        yield put(vehicleDetailsFetchFail(error));
    }
}

export default function* () {
    yield takeLatest(VEHICLE_DETAILS_FETCH_REQUEST, fetch);
}
