import { compose } from 'redux';
import { connect } from 'react-redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import VDP from 'components/features/vehicleDetailsPage';
import { searchResultsPageLinkSelector } from 'containers/features/searchResultsPage/selectors';
import { isHeaderHiddenSelector } from 'selectors';

import {
    savedVehicleAddStart,
    savedVehicleRemoveStart,
} from 'containers/features/SaveVehicles/reducer/saved';
import { openCheckAvailabilityPopup } from 'containers/common/reducer/checkAvailability';
import { similarVehiclesSelector } from 'containers/features/SimilarVehicles/selectors';
import { saveVehicleAsViewed } from 'containers/common/reducer/viewedVehicles';
import { isGalleryVisibleSelector } from 'containers/features/PrevNextVDPSwitcher/selectors';

import checkAvailabilitySuccessNotificationReducer from 'containers/common/CheckAvailabilitySuccessNotification/reducer';
import textToPhoneSuccessNotificationReducer from 'containers/features/TextToPhonePopup/TextToPhoneSuccessNotification/reducer';
import checkAvailabilityVDPReducer from 'containers/common/CheckAvailabilityVDP/reducer';
import textToPhoneReducerVDPReducer, {
    openTextToPhonePopup,
} from 'containers/features/TextToPhonePopup/reducer';
import similarVehiclesReducer from 'containers/features/SimilarVehicles/reducer';
import mapsDirectionsReducer from 'containers/features/SellerInfo/reducer';
import autocheckReducer from 'containers/features/VHRButton/reducer';

import {
    vehicleDetailsFetchRequest,
    sellerInfoFetchRequest,
    cleanVehicleDetails,
    videoPlayCount,
} from './reducer';

import {
    statisticPendingSelector,
    vehicleDetailsPageDataSelector,
    pendingSelector,
    isInitializedSelector,
    sellerDataSelector,
    isFavoriteSelector,
    savesSelector,
} from './selectors';
import saga from './sagas';

const mapStateToProps = state => ({
    result: vehicleDetailsPageDataSelector(state),
    pending: pendingSelector(state),
    statisticPending: statisticPendingSelector(state),
    initialized: isInitializedSelector(state),
    searchResultsPageLink: searchResultsPageLinkSelector(state),
    sellerProps: sellerDataSelector(state),
    similarVehicles: similarVehiclesSelector(state),
    isFavourite: isFavoriteSelector(state),
    followers: savesSelector(state),
    isAboveFooterHidden: !isHeaderHiddenSelector(state),
    isPrevNextGalleryVisible: isGalleryVisibleSelector(state),
});

const mapDispatchToProps = {
    fetch: vehicleDetailsFetchRequest,
    destroy: cleanVehicleDetails,
    openTextToPhonePopup,
    fetchSeller: sellerInfoFetchRequest,
    saveVehicle: savedVehicleAddStart,
    unsaveVehicle: savedVehicleRemoveStart,
    openCheckAvailabilityPopup,
    videoPlayCount,
    saveVehicleAsViewed,
};

export default compose(
    injectReducer({
        key: 'checkAvailabilitySuccessNotification',
        reducer: checkAvailabilitySuccessNotificationReducer,
    }),
    injectReducer({
        key: 'textToPhoneSuccessNotification',
        reducer: textToPhoneSuccessNotificationReducer,
    }),
    injectReducer({ key: 'checkAvailabilityVDP', reducer: checkAvailabilityVDPReducer }),
    injectReducer({ key: 'textToPhoneReducerVDP', reducer: textToPhoneReducerVDPReducer }),
    injectReducer({ key: 'similarVehicles', reducer: similarVehiclesReducer }),
    injectReducer({ key: 'mapsDirections', reducer: mapsDirectionsReducer }),
    injectReducer({ key: 'autocheck', reducer: autocheckReducer }),
    injectSaga({ key: 'vdp', saga }),
    connect(mapStateToProps, mapDispatchToProps),
)(VDP);
