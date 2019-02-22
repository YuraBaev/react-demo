import { fork } from 'redux-saga/effects';

import similarVehicles from 'containers/features/SimilarVehicles/sagas';
import mapsDirections from 'containers/features/SellerInfo/sagas';
import autoCheck from 'containers/features/VHRButton/sagas';
import checkAvailability from 'containers/common/CheckAvailabilityVDP/sagas';

import fetchData from './fetchData';
import fetchSellerInfo from './fetchSeller';
import videoPlayCount from './videoPlayCount';
// TODO: Uncomment if needed
// import getStatistics from './getStatistics';

export default function* () {
    yield fork(fetchData);
    yield fork(fetchSellerInfo);
    yield fork(similarVehicles);
    yield fork(mapsDirections);
    yield fork(autoCheck);
    yield fork(checkAvailability);
    yield fork(videoPlayCount);

    // TODO: Uncomment if needed
    //  yield fork(getStatistics);
}
