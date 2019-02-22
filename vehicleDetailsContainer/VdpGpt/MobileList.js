import { connect } from 'react-redux';
import MobileList from 'containers/common/DFPAdUnits/views/MobileList';
import * as mobileListSelectors from './adConfig/mobile';
import { vdpModeSelector } from './selectors/vdpModes';

const mapStateToProps = (state, props) => {
    const vdpMode = vdpModeSelector(state);

    return mobileListSelectors[vdpMode](state);
};


export default connect(mapStateToProps)(MobileList);

