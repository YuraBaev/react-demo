// TODO: uncomment if needed
// import { takeLatest, put, call } from 'redux-saga/effects';
// import * as vehicleApi from 'api/vehicle';
//
// import {
//     VDP_STATISTICS_FETCH_REQUEST,
//     vehicleStatisticFetchSuccess,
//     vehicleStatisticFetchFail,
// } from '../reducer';
//
// const serialize = (responseData, id) => (
//     responseData.data
//     && responseData.data.attributes
//     && responseData.data.attributes[id]
// ) || {};
//
// function* fetchStatistics(action) {
//     try {
//         const vehicleId = action.payload;
//         const { data } = yield call(vehicleApi.getVehicleStatistics, vehicleId);
//         const serializedData = serialize(data, vehicleId);
//
//         yield put(vehicleStatisticFetchSuccess(serializedData));
//     } catch (error) {
//         yield put(vehicleStatisticFetchFail());
//     }
// }
//
// export default function* () {
//     yield takeLatest(VDP_STATISTICS_FETCH_REQUEST, fetchStatistics);
// }
