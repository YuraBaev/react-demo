import { fork } from 'redux-saga/effects';

import fetchData from './fetchData';

export default function* () {
    yield fork(fetchData);
}
