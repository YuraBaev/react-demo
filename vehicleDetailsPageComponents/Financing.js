import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { toThousand } from 'services/helper';
import { MOBILE_BREAKPOINT } from 'constants/breakpoints';
import { FINANSING_URL_DEFAULT } from 'constants/links';
import { formatTradeInCalculatorURL } from 'services/formatTradeInCalculatorURL';
import visitCounterLink from 'services/visitCounterLink';
import { FINANCING_OPTIONS } from 'constants/counterActionTypes';
import { SITE_ID, TRADEPENDING_PLUGIN_URL } from 'constants/vdpTradeInCalculator';

export default class Financing extends PureComponent {
    static propTypes = {
        openFinancingPopup: PropTypes.func.isRequired,
        getPrice: PropTypes.func.isRequired,
        price: PropTypes.number,
        zip: PropTypes.string.isRequired,
        vehicle_id: PropTypes.string,
        dealer_id: PropTypes.number,
        name: PropTypes.string,
        monthlyPayment: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        isDisabled: PropTypes.bool,
        finance_url: PropTypes.string,
        callForPrice: PropTypes.bool,
    }

    static defaultProps = {
        isDisabled: false,
        dealer_id: null,
        finance_url: null,
        callForPrice: false,
    }

    state = {
        isMobile: window.innerWidth <= MOBILE_BREAKPOINT,
    };

    clickPriceLink = () => {
        const { price, getPrice, openFinancingPopup } = this.props;

        openFinancingPopup();
        getPrice({ price });
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize = () => {
        if (this.state.isMobile && window.innerWidth > MOBILE_BREAKPOINT) this.setState({ isMobile: !this.state.isMobile });
        if (!this.state.isMobile && window.innerWidth <= MOBILE_BREAKPOINT) this.setState({ isMobile: !this.state.isMobile });
    }

    getURL = (id) => {
        const { zip, vehicle_id, name } = this.props;
        const loc = this.state.isMobile ? 'mobile' : 'desktop';
        const dealer_name = encodeURIComponent(name);
        const params = { TRADEPENDING_PLUGIN_URL, id, loc, zip, dealer_name, vehicle_id };

        return formatTradeInCalculatorURL(params);
    }

    renderTradeInCalculatorBTN = () => (
        <a
            href={this.getURL(CONST_ID)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--transparent btn--medium btn--wide"
        >
            Trade in Calculator
        </a>
    );

    renderFinancingOptionsBtn = () => {
        const { dealer_id } = this.props;
        const handler = dealer_id ? this.openFinancingOptionsSite : this.openFinancingOptionsSitePPA;

        return (
            <span
                className="financing-options-link"
                onClick={handler}
            >
                Financing Options
            </span>
        );
    }

    getStatisticsLink = () => {
        const { finance_url, dealer_id } = this.props;

        return visitCounterLink({
            type: FINANCING_OPTIONS,
            dealerId: dealer_id,
            redirect: finance_url || FINANSING_URL_DEFAULT,
        });
    }

    openFinancingOptionsSite = () => {
        window.open(this.getStatisticsLink());
    };

    openFinancingOptionsSitePPA = () => {
        window.open(FINANSING_URL_DEFAULT);
    };

    render() {
        const { monthlyPayment, isDisabled, dealer_id, callForPrice } = this.props;

        let processedMonthlyPayment = (monthlyPayment || monthlyPayment === 0)
            &&`$${toThousand(monthlyPayment)}/mo`;

        if (isDisabled || callForPrice) {
            processedMonthlyPayment = 'Call for Price';
        }

        return (
            <div className="financing">
                <h3 className="financing-title">Financing</h3>
                <div className="financing-payment">
                    <p className="financing-payment-title">Estimated monthly payment:</p>
                    <p className="financing-payment-value">{processedMonthlyPayment}</p>
                </div>
                <div className="btn-group financing-payment-btns m-col">
                    <button
                        disabled={(isDisabled || callForPrice)}
                        onClick={this.clickPriceLink}
                        className="btn btn--transparent btn--medium btn--wide"
                    >
                        Finance Calculator
                    </button>
                    { dealer_id ? this.renderTradeInCalculatorBTN() : null }
                </div>
                { this.renderFinancingOptionsBtn() }
            </div>
        );
    }
}
