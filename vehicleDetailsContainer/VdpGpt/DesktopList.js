import { connect } from 'react-redux';
import DesktopList from 'containers/common/DFPAdUnits/views/DesktopList';
import * as desktopListSelectors from './adConfig/desktop';
import { vdpModeSelector } from './selectors/vdpModes';

const mapStateToProps = (state, props) => {
    const vdpMode = vdpModeSelector(state);

    return desktopListSelectors[vdpMode](state);
};

export default connect(mapStateToProps)(DesktopList);
