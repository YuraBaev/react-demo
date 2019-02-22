import { connect } from 'react-redux';
import PriceComparedToMarket from 'components/features/vehicleDetailsPage/PriceComparedToMarket';
import {
    minPriceSelector,
    averagePriceSelector,
    maxPriceSelector,
    priceSelector,
    hasInvalidPriceDataSelector,
    currentMileageSelector,
    periodSelector,
    marketValueSelector,
    certaintySelector,
    callForPriceSelector,
} from './selectors';

const mapStateToProps = state => ({
    minValue: minPriceSelector(state),
    averageValue: averagePriceSelector(state),
    maxValue: maxPriceSelector(state),
    value: priceSelector(state),
    noDataActive: hasInvalidPriceDataSelector(state),
    currentMileage: currentMileageSelector(state),
    period: periodSelector(state),
    marketValue: marketValueSelector(state),
    certainty: certaintySelector(state),
    showChartIndicator: !callForPriceSelector(state),
});

export default connect(mapStateToProps)(PriceComparedToMarket);
