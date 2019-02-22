import React, { PureComponent } from 'react';
import { bool, string, shape } from 'prop-types';
import Tabs from 'components/common/Tabs';
import PriceHistory from 'containers/vehicleDetails/PriceHistory';
import PriceComparedToMarket from 'containers/vehicleDetails/PriceComparedToMarket';
import { NEW } from 'constants/programs';
import VdpStatistics from './VdpStatistics';
import { IVehicleStatistics } from './propTypes';

export default class CSInsider extends PureComponent {
    static propTypes = {
        isPPA: bool.isRequired,
        vehicleId: string.isRequired,
        statistics: shape(IVehicleStatistics),
        conditionType: string,
    };

    static defaultProps = {
        statistics: {},
        conditionType: '',
    };

    state = { selectedTab: 0 };

    componentWillReceiveProps(nextProps) {
        const { vehicleId } = this.props;
        const isVehicleIdChanged = vehicleId && vehicleId !== nextProps.vehicleId;

        if (isVehicleIdChanged) {
            this.setState({ selectedTab: 0 });
        }
    }

    switchTabs = (selected) => {
        this.setState({ selectedTab: selected });
    };

    get switcherLinks() {
        const { conditionType } = this.props;
        const priceToMarketLink = (
            <span>
                Price to market
                <i className="fa fa-dollar" aria-hidden="true" />
            </span>
        );
        const priceHistoryLink = (
            <span>
                Price history
                <i className="fa fa-area-chart" aria-hidden="true" />
            </span>
        );

        if (conditionType === NEW) {
            return [''];
        }

        return [priceToMarketLink, priceHistoryLink];
    }

    get tabs() {
        const { conditionType } = this.props;

        if (conditionType === NEW) {
            return ([
                (<PriceHistory key="0" />),
            ]);
        }

        return ([
            (<PriceComparedToMarket key="0" />),
            (<PriceHistory key="1" />),
        ]);
    }

    render() {
        const { statistics } = this.props;
        const { selectedTab } = this.state;
        const pending = !Object.keys(statistics).length;

        return (
            <div className="insider">
                <div className="insider-logo-wrap">
                    <img src="/build/public/images/insider-logo.png" className="insider-logo" alt="Insider" />
                </div>
                <div className="insider-information">
                    <VdpStatistics {...statistics} pending={pending} />
                    <Tabs
                        switcherClassName="insider-information-controls"
                        switcherItemClassName="insider-information-link"
                        switcherActiveItemClassName="active"
                        settings={{
                            onSelect: this.switchTabs,
                            selectedIndex: selectedTab,
                        }}
                        switcher={this.switcherLinks}
                    >
                        {this.tabs}
                    </Tabs>
                </div>
            </div>

        );
    }
}
