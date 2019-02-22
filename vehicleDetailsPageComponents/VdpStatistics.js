import React, { PureComponent } from 'react';
import Loader from 'components/common/loader';
import { IVehicleStatistics } from './propTypes';

export default class VdpStatistics extends PureComponent {
    static propTypes = IVehicleStatistics;

    static defaultProps = {
        views: 0,
        saves: 0,
        days_on_site: 0,
        pending: true,
        statisticPending: false,
    };

    render() {
        const { views, saves, days_on_site, pending, statisticPending } = this.props;
        const viewsContent = statisticPending ? <Loader active size={15} inline /> : views;

        return (
            <ul className="insider-information-list">
                <li className="insider-information-item">
                    <span className="insider-information-value">
                        {days_on_site}
                        <Loader active={pending} size={15} />
                    </span>
                    <span className="insider-information-title">Days on site</span>
                </li>
                <li className="insider-information-item">
                    <span className="insider-information-value views">
                        {viewsContent}
                    </span>
                    <span className="insider-information-title">Views</span>
                </li>
                <li className="insider-information-item">
                    <span className="insider-information-value">
                        {saves}
                        <Loader active={pending} size={15} />
                    </span>
                    <span className="insider-information-title">Saves</span>
                </li>
            </ul>
        );
    }
}

