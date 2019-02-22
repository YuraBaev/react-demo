import { takeLatest, call, put } from 'redux-saga/effects';
import * as vehicleApi from 'api/vehicle';

import {
    VIDEO_PLAY_COUNT_VEHICLE_DETAILS,
    videoPlayCountSuccess,
    videoPlayCountFail,
} from '../reducer';

function* statisticCounter(action) {
    try {
        yield call(vehicleApi.videoPlayCount, action.payload);
        yield put(videoPlayCountSuccess());
    } catch (error) {
        yield put(videoPlayCountFail(error));
    }
}

export default function* () {
    yield takeLatest(VIDEO_PLAY_COUNT_VEHICLE_DETAILS, statisticCounter);
}
