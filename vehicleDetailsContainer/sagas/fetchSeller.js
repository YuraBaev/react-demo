import { takeLatest, put, call } from 'redux-saga/effects';
import * as searchApi from 'api/search';

import {
    SELLER_INFO_FETCH_REQUEST,
    sellerInfoFetchSuccess,
    sellerInfoFetchFail,
} from '../reducer';

const serialize = (responseData) => {
    const data = responseData.data.data;
    return (Array.isArray(data.attributes) && data.attributes[0]) || [];
};

function* fetchSeller(action) {
    try {
        const serverResponse = yield call(searchApi.fetchSellerInfo, action.payload);
        const data = serialize(serverResponse);

        yield put(sellerInfoFetchSuccess(data));
    } catch (error) {
        yield put(sellerInfoFetchFail(error));
    }
}

export default function* () {
    yield takeLatest(SELLER_INFO_FETCH_REQUEST, fetchSeller);
}
