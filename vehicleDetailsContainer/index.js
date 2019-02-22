import { compose } from 'redux';
import { connect } from 'react-redux';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';

import VDP from 'components/features/vehicleDetailsPage';
import { searchResultsPageLinkSelector } from 'containers/features/searchResultsPage/selectors';
import {
    savedVehicleAddStart,
    savedVehicleRemoveStart,
} from 'containers/features/SaveVehicles/reducer/saved';

import reducer from './reducer';

import {
    vehicleDetailsFetchRequest,
    cleanVehicleDetails,
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
    isPrevNextGalleryVisible: isGalleryVisibleSelector(state),
});

const mapDispatchToProps = {
    fetch: vehicleDetailsFetchRequest,
    destroy: cleanVehicleDetails,
    saveVehicle: savedVehicleAddStart,
    unsaveVehicle: savedVehicleRemoveStart,
};

export default compose(
    injectReducer({ key: 'vehicleDetailsPage', reducer }),
    injectSaga({ key: 'vdp', saga }),
    connect(mapStateToProps, mapDispatchToProps),
)(VDP);
