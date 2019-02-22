import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PriceChart from 'components/common/PriceChart';
import Tooltip from 'components/common/Tooltip';
import { toThousandInteger } from 'services/helper';

const markersTooltipsRenderer = [
    (coords, value, id) => (
        <Tooltip
            key={id}
            color="white"
            type="top"
            additionalClass="tooltip--right"
            style={{ left: coords.left, bottom: coords.bottom + 25 }}
        >
            <div className="tooltip-subtext">Below Market</div>
            <div className="tooltip-price centered">${toThousandInteger(value)} or less</div>
        </Tooltip>
    ),
    (coords, value, id) => (
        <Tooltip
            key={id}
            color="white"
            type="top"
            style={{ left: coords.left, bottom: coords.bottom + 12 }}
        >
            <div className="tooltip-subtext">Market Average</div>
            <div className="tooltip-price centered">${toThousandInteger(value)}</div>
        </Tooltip>
    ),
    (coords, value, id) => (
        <Tooltip
            key={id}
            color="white"
            type="top"
            additionalClass="tooltip--left"
            style={{ left: coords.left, bottom: coords.bottom + 25 }}
        >
            <div className="tooltip-subtext">Above Market</div>
            <div className="tooltip-price centered">${toThousandInteger(value)} or more</div>
        </Tooltip>
    ),
];

const indicatorTooltipRenderer = (coords, value, id) => (
    <Tooltip
        key={id}
        color="dark"
        type="bottom"
        style={{ left: coords.left, top: coords.top + 12 }}
    >
        <div className="tooltip-price">
            <span className="tooltip-price-value">${toThousandInteger(value)}</span>
        </div>
    </Tooltip>
);

const noDataTooltipRenderer = (coords, value, id) => (
    <div
        key={id}
        className="price-chart-no-data-tooltip"
        style={{ left: coords.left, bottom: coords.bottom + 10 }}
    >No data</div>
);

export default class PriceComparedToMarket extends PureComponent {
    static propTypes = {
        showChartIndicator: PropTypes.bool.isRequired,
        minValue: PropTypes.number,
        averageValue: PropTypes.number,
        maxValue: PropTypes.number,
        value: PropTypes.number,
        noDataActive: PropTypes.bool,
        currentMileage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        period: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        marketValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        certainty: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    };

    static defaultProps = {
        minValue: 0,
        averageValue: 0,
        maxValue: 0,
        value: 0,
        noDataActive: false,
        currentMileage: '-',
        period: '-',
        marketValue: '-',
        certainty: '-',
    };

    render() {
        const {
            minValue,
            averageValue,
            maxValue,
            value,
            noDataActive,
            currentMileage,
            period,
            marketValue,
            certainty,
            showChartIndicator,
        } = this.props;

        const mileageClassName = classNames({
            'insider-graph-info-value': true,
            'insider-graph-info-value--underlined': currentMileage !== '-',
        });

        const periodClassName = classNames({
            'insider-graph-info-value': true,
            'insider-graph-info-value--underlined period': period !== '-',
        });

        return (
            <div className="insider-graph">
                <div className="insider-graph-title">
                    <h4 className="title-3">Price Compared to Market</h4>
                </div>
                <div className="insider-graph-img-wrap">
                    <PriceChart
                        className="price-compared-to-market-block"
                        minValue={minValue}
                        averageValue={averageValue}
                        maxValue={maxValue}
                        value={value}
                        markerBorderWidth={2}
                        markerRadius={4}
                        chartBorderWidth={3}
                        chartBorderColor="#00bcfc"
                        indicatorBorderColor="#75c668"
                        noDataActive={noDataActive}
                        noDataTooltipRenderer={noDataTooltipRenderer}
                        markersTooltipsRenderer={markersTooltipsRenderer}
                        indicatorTooltipRenderer={indicatorTooltipRenderer}
                        showIndicator={showChartIndicator}
                    />
                </div>
                <div className="insider-graph-info">
                    <div className="col">
                        <div className="insider-graph-info-title">ASSUMPTIONS</div>
                        <div className="insider-graph-info-characteristic">
                            <p>Current Mileage:</p>
                            <p className={mileageClassName}>
                                {currentMileage}
                            </p>
                        </div>
                        <div className="insider-graph-info-characteristic">
                            <p>Time Period:</p>
                            <p className={periodClassName}>
                                {period}
                            </p>
                        </div>
                    </div>
                    <div className="col">
                        <div className="insider-graph-info-title">ESTIMATES</div>
                        <div className="insider-graph-info-characteristic">
                            <p>Market Value:</p>
                            <p className="insider-graph-info-value">
                                {marketValue}
                            </p>
                        </div>
                        <div className="insider-graph-info-characteristic">
                            <p>Estimate Certainty:</p>
                            <p className="insider-graph-info-value">
                                {certainty}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
