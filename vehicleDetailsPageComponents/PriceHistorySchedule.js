import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import Tooltip from 'components/common/Tooltip';
import omit from 'lodash.omit';
import { toThousand } from 'services/helper';
import {
    DAY,
    commonStyles,
    pointFillService,
    yAxisService,
    commonYAxisTicksOptions,
    commonYAxisOptions,
    commonXAxisOptions,
    tooltipSettings,
    commonOptionsSettings,
    isRangeShort,
    formatPointDate,
    emptyStyles,
    canvasEmptyStyle,
    filterOnSameDay,
    legendSettings,
    priceAbsoluteValue,
    getPointTime,
    dateDiffInDays,
    removeDuplicates,
    modify,
} from 'services/graphic';

const WIDTH = 980;

const FORMAT_DATA_DESKTOP = {
    hour: 'MMM DD YYYY',
    day: 'MMM DD YYYY',
    week: 'MMM DD YYYY',
    month: 'MMM DD YYYY',
    year: 'MMM DD YYYY',
};
const FORMAT_DATA_MOBILE = {
    hour: 'MM/DD/YYYY',
    day: 'MM/DD/YYYY',
    week: 'MM/DD/YYYY',
    month: 'MM/DD/YYYY',
    year: 'MM/DD/YYYY',
};

const TICKS_SETTINGS = {
    fontColor: '#a7a7a7',
    autoSkip: true,
    maxRotation: 90,
    minRotation: 40,
};

export default class PriceHistorySchedule extends PureComponent {
    static propTypes = {
        graphData: PropTypes.arrayOf(PropTypes.object),
    };

    static defaultProps = {
        graphData: [],
    };

    state = { changeTooltipOrientation: window.innerWidth <= WIDTH }

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
    }

    onResize = () => {
        if (window.innerWidth <= WIDTH && !this.state.changeTooltipOrientation) {
            this.setState({ changeTooltipOrientation: true });
        } else if (window.innerWidth > WIDTH && this.state.changeTooltipOrientation) {
            this.setState({ changeTooltipOrientation: false });
        }
    };

    getPoints() {
        const { graphData } = this.props;

        const modified = modify(graphData);
        const unique = removeDuplicates(modified);

        return unique.map(elem => ({
            x: new Date(elem.x),
            y: Number(elem.y),
        }))
            .sort((a, b) => a.x - b.x);
    }

    getDataFormat = () => (this.state.changeTooltipOrientation ? FORMAT_DATA_MOBILE : FORMAT_DATA_DESKTOP)

    getFontSize = () => (this.state.changeTooltipOrientation ? 10: 11)

    getOptions() {
        const points = this.getPoints();
        const pointsCount = points.length;

        if (!pointsCount) {
            return ({
                scales: {
                    xAxes: [{
                        ...commonXAxisOptions,
                        ticks: {
                            fontColor: '#a7a7a7',
                            autoSkip: false,
                            maxRotation: 90,
                            maxTicksLimit: 5,
                        },
                    }],
                    yAxes: [{
                        ...commonYAxisOptions,
                        ticks: {
                            autoSkip: false,
                            fontColor: '#a7a7a7',
                            maxTicksLimit: 5,
                            ...yAxisService(points),
                            callback: value => `${toThousand(value)}`,
                        },
                    }],
                },
                ...commonOptionsSettings,
                showTooltips: false,
                tooltips: { enabled: false },
            });
        }

        if (pointsCount === 1) {
            return ({
                type: 'line',
                scales: {
                    xAxes: [commonXAxisOptions],
                    yAxes: [{
                        ...commonYAxisOptions,
                        ticks: {
                            ...commonYAxisTicksOptions,
                            ...yAxisService(points),
                        },
                    }],
                },
                ...commonOptionsSettings,
                tooltips: {
                    ...tooltipSettings,
                    position: 'nearest',
                    callbacks: {
                        label: tooltipItem => `Price: $${toThousand(tooltipItem.yLabel)}`,
                        title: tooltipItem => formatPointDate(new Date(tooltipItem[0].xLabel), 'MM/DD/YYYY'),
                    },
                },
            });
        } else if (isRangeShort(points) && pointsCount > 2) {
            const maxTicksLimit = pointsCount - 1;

            return ({
                scales: {
                    xAxes: [{
                        ...commonXAxisOptions,
                        type: 'time',
                        time: {
                            displayFormats: this.getDataFormat(),
                        },
                        ticks: {
                            ...TICKS_SETTINGS,
                            fontSize: this.getFontSize(),
                            maxTicksLimit,
                        },
                    }],
                    yAxes: [{
                        ...commonYAxisOptions,
                        ticks: {
                            ...commonYAxisTicksOptions,
                            ...yAxisService(points),
                        },
                    }],
                },
                ...commonOptionsSettings,
                tooltips: {
                    ...tooltipSettings,
                    callbacks: {
                        label: tooltipItem => `Price: $${toThousand(tooltipItem.yLabel)}`,
                        title: (tooltipItem) => {
                            const title = points.find((point, idx) => idx === tooltipItem[0].index);
                            return formatPointDate(new Date(title.x), 'MM/DD/YYYY');
                        },
                    },
                },
            });
        } else if (isRangeShort(points) && pointsCount === 2) {
            return ({
                scales: {
                    xAxes: [{
                        ...commonXAxisOptions,
                        type: 'time',
                        time: {
                            displayFormats: this.getDataFormat(),
                            unit: 'day',
                        },
                        ticks: {
                            ...TICKS_SETTINGS,
                            fontSize: this.getFontSize(),
                            maxTicksLimit: 2,
                        },
                    }],
                    yAxes: [{
                        ...commonYAxisOptions,
                        ticks: {
                            ...commonYAxisTicksOptions,
                            ...yAxisService(points),
                        },
                    }],
                },
                ...commonOptionsSettings,
                tooltips: {
                    ...tooltipSettings,
                    callbacks: {
                        label: tooltipItem => `Price: $${toThousand(tooltipItem.yLabel)}`,
                        title: (tooltipItem) => {
                            const title = points.find((point, idx) => idx === tooltipItem[0].index);
                            return formatPointDate(new Date(title.x), 'MM/DD/YYYY');
                        },
                    },
                },
            });
        } else if (pointsCount > 2 && pointsCount <= 5) {
            const maxTicksLimit = pointsCount - 1;

            return ({
                scales: {
                    xAxes: [{
                        ...commonXAxisOptions,
                        ticks: {
                            ...TICKS_SETTINGS,
                            fontSize: this.getFontSize(),
                            maxTicksLimit,
                        },
                        type: 'time',
                        time: {
                            displayFormats: this.getDataFormat(),
                        },
                    }],
                    yAxes: [{
                        ...commonYAxisOptions,
                        ...commonYAxisTicksOptions,
                        ticks: {
                            ...commonYAxisTicksOptions,
                            ...yAxisService(points),
                        },
                    }],
                },
                ...commonOptionsSettings,
                tooltips: {
                    ...tooltipSettings,
                    position: 'nearest',
                    callbacks: {
                        label: tooltipItem => `Price: $${toThousand(tooltipItem.yLabel)}`,
                        title: (tooltipItem) => {
                            const title = points.find((point, idx) => idx === tooltipItem[0].index);
                            return formatPointDate(new Date(title.x), 'MMM DD YYYY');
                        },
                    },
                },
            });
        } else {
            return ({
                scales: {
                    xAxes: [{
                        ...commonXAxisOptions,
                        ticks: {
                            ...TICKS_SETTINGS,
                            fontSize: this.getFontSize(),
                            maxTicksLimit: 4,
                        },
                        type: 'time',
                        time: {
                            displayFormats: this.getDataFormat(),
                        },
                        // TODO: To remove after QA resolution
                       // time: timelineService(points),
                    }],
                    yAxes: [{
                        ...commonYAxisOptions,
                        ...commonYAxisTicksOptions,
                        ticks: {
                            ...commonYAxisTicksOptions,
                            ...yAxisService(points),
                        },
                    }],
                },
                ...commonOptionsSettings,
                tooltips: {
                    ...tooltipSettings,
                    position: 'nearest',
                    callbacks: {
                        label: tooltipItem => `Price: $${toThousand(tooltipItem.yLabel)}`,
                        title: (tooltipItem) => {
                            const title = points.find((point, idx) => idx === tooltipItem[0].index);
                            return formatPointDate(new Date(title.x), 'MMM DD YYYY');
                        },
                    },
                },
            });
        }
    }

    getData() {
        const points = this.getPoints();

        if (!points.length) {
            return ({
                labels: ['', '', '', '', ''],
                datasets: [{
                    ...emptyStyles,
                    data: points,
                }],
            });
        }

        if (points.length === 1) {
            return ({
                labels: ['', formatPointDate(new Date(points[0].x), 'MMM DD YYYY'), ''],
                datasets: [{
                    ...commonStyles,
                    data: [null, ...points, null],
                }],
            });
        } else {
            return ({
                datasets: [{
                    ...commonStyles,
                    ...pointFillService(points),
                    data: points,
                }],
            });
        }
    }

    renderEmpty() {
        const { graphData } = this.props;

        if (!graphData || !graphData.length) {
            return (
                <div
                    className="price-chart-no-data-tooltip"
                    style={canvasEmptyStyle}
                >
                    No data
                </div>
            );
        }
    }

    renderPriceDrop() {
        const { changeTooltipOrientation } = this.state;

        const points = this.getPoints();
        const len = points.length;

        if (!len || len < 2) { return null; }

        const priceDifference = Number(points[len - 1].y - points[0].y);
        const totalPriceDrop = priceAbsoluteValue(priceDifference);

        const isTooltipVisibleOnHover = (getPointTime(points[len - 1].x) - getPointTime(points[len - 2].x)) < (7 * DAY);
        const latestPriceDrop = Number(points[len - 1].y - points[len - 2].y);

        const blockClassName = `srp-card-price ${(latestPriceDrop > 0) ? 'negative' : ''}`;
        const iconClassName = `fa fa-arrow-circle-${(latestPriceDrop > 0) ? 'up' : 'down'}`;
        const tooltipPrice = priceAbsoluteValue(latestPriceDrop);

        const tooltip = changeTooltipOrientation
            ? { class: 'd-hidden', type: 'top' }
            : { class: 'm-hidden', type: 'bottom' };

        const arrowClassName = `srp-price-link-icon${isTooltipVisibleOnHover ? '' : '--hidden'} tooltip-trigger`;

        return (
            <div>
                <div>
                    <span className="move-to-left">Total Price Drop </span>
                    <span className="title-3 move-to-right"> {totalPriceDrop}</span>
                </div>
                <div className="clear-fix" />
                <div className={blockClassName}>
                    <span className="title-3 move-to-left">Latest Price Drop</span>
                    <div className="srp-price-link move-to-right">
                        <span className={arrowClassName}>
                            <i className={iconClassName} aria-hidden="true" />
                        </span>
                        {isTooltipVisibleOnHover && (
                            <Tooltip color="dark" type={tooltip.type} hidden additionalClass={tooltip.class}>
                                <h3 className="tooltip-title">Latest Price Drop</h3>
                                <p className="tooltip-subtitle">(within past 7 days)</p>
                                <span className="tooltip-price-change">{tooltipPrice}</span>
                            </Tooltip>
                            )}
                    </div>
                </div>
                <div className="clear-fix" />
            </div>
        );
    }

    render() {
        return (
            <div className="insider-graph">
                <div className="insider-graph-title">
                    <h4 className="title-3">Price history</h4>
                </div>
                {
                    // TODO: Uncomment after BA resolution
                    // this.renderPriceDrop()
                }
                <div className="insider-graph-img-wrap">
                    <Line
                        data={this.getData()}
                        options={this.getOptions()}
                        legend={legendSettings}
                        redraw
                    />
                    {this.renderEmpty()}
                </div>
            </div>
        );
    }
}
