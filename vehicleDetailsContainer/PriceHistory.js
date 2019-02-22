import { connect } from 'react-redux';
import PriceHistorySchedule from 'components/features/vehicleDetailsPage/PriceHistorySchedule';

const graphDataSelector = state => (
    state.vehicleDetailsPage.data
    && state.vehicleDetailsPage.data.price_history_formatted
) || [];


const mapStateToProps = state => ({
    graphData: graphDataSelector(state),
});

export default connect(mapStateToProps)(PriceHistorySchedule);
