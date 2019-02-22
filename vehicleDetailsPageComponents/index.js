import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import fieldNames from 'constants/filterFieldNames';
import pick from 'lodash.pick';
import isEqual from 'is-equal';

import visitCounterLink from 'services/visitCounterLink';
import { processUrl, getFullPathNameFromCurrentLocation, trimSlashes } from 'services/url';
import { getStatisticsBadCreditLink } from 'services/bad_credit';
import { toThousand, getVehicleTitle } from 'services/helper';
import { validatePhone, parsePhone } from 'services/phone';

import Overview from 'components/common/overview';
import VhrCheckButton from 'containers/features/VHRButton';
import ToggleFeatureList from 'components/common/toggleFeatureList';
import StickyFooter from 'components/common/stickyFooter';
import TextDescription from 'components/common/TextDescription';
import SellerInfo from 'containers/features/SellerInfo';
import Gallery from 'components/common/gallery';
import SimilarVehicles from 'containers/features/SimilarVehicles';
import SocialList from 'containers/common/footer/SocialList';
import VdpFinancing from 'containers/features/VdpFinancing';
import MonthlyPaymentPopup from 'containers/features/MonthlyPaymentPopup';
import TextToPhonePopup from 'containers/features/TextToPhonePopup';

import ClickOutsideDetector from 'components/common/ClickOutsideDetector';
import GptDesktopList from 'containers/vehicleDetails/VdpGpt/DesktopList';
import GptMobileList from 'containers/vehicleDetails/VdpGpt/MobileList';
import GptMobileLeaderboard from 'containers/vehicleDetails/VdpGpt/MobileLeaderBoard';
import FacebookPixel from 'components/common/FacebookPixel';
import MobileTextConnect from 'components/common/MobileTextConnect';

import { ADD_TO_CARD } from 'constants/facebookPixelTypes';
import { withTracking, values } from 'containers/features/GTM';
import SaveVehiclesPopup from 'containers/features/SaveVehicles/SaveVehiclesPopup';
import CheckAvailabilityPopup from 'containers/common/CheckAvailabilityPopup';
import CheckAvailabilitySuccessNotification from 'containers/common/CheckAvailabilitySuccessNotification';
import TextToPhoneSuccessNotification from 'containers/features/TextToPhonePopup/TextToPhoneSuccessNotification';
import VdpBackLink from 'containers/features/VdpBackLink';
import ChatContactAtOnce from 'containers/features/ChatContactAtOnce';
import { SELLING_STATUS_VALUES_CONSTANTS, CERTIFIED_VALUES_CONSTANTS } from 'containers/common/Filters/optionsService';
import { VDP_CLICK_REFERRALS } from 'constants/counterActionTypes';
import { tooltipPositions } from 'components/common/LatestPriceDropIcon/services';

import CheckAvailabilityVDP from 'containers/common/CheckAvailabilityVDP';
import LatestPriceDropIcon from 'components/common/LatestPriceDropIcon';

import SchemaOrgImageObject from 'containers/features/SchemaOrg/SchemaOrgImageObject';
import SchemaOrgVehicle from 'containers/features/SchemaOrg/SchemaOrgVehicle';
import SchemaOrgAutoDealerVDP from 'containers/features/SchemaOrg/SchemaOrgAutoDealerVDP';
import { IVehiclesGallery } from 'components/common/VehiclesGallery/propTypes';
import PrevNextVDPSlider from 'containers/features/PrevNextVDPSwitcher';

import { SCHEMA_ORG_JSON_LD_IDS } from 'constants/schemaOrg';

import { processImages } from 'services/images';
import { getSplatFromParams } from 'services/route';

import CSInsider from './CSInsider';
import ChatActiveEngage from './ChatActiveEngage';
import { IVehicleDetails } from './propTypes';

import './styles.scss';

const infoFields = [
    fieldNames.BRAND,
    fieldNames.CONDITION_TYPE,
    fieldNames.MODEL,
    fieldNames.YEAR_MADE,
    fieldNames.PRICE,
];

const getIdFromSplat = (splat = '') => {
    const params = trimSlashes(splat).split('/');

    return params[params.length - 1];
};

const getIdFromProps = (props) => {
    const { params } = props.match;
    const splat = getSplatFromParams(params);

    return getIdFromSplat(splat);
};

const SOUPER_PACKAGE = 'souper';

export class VehicleDetailsPage extends PureComponent {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape(),
        }).isRequired,
        statisticPending: PropTypes.bool.isRequired,
        history: PropTypes.shape({
            replace: PropTypes.func,
        }).isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string,
        }).isRequired,
        videoPlayCount: PropTypes.func,
        similarVehicles: PropTypes.arrayOf(PropTypes.shape(IVehiclesGallery)),
        saveVehicleAsViewed: PropTypes.func,
        isPrevNextGalleryVisible: PropTypes.bool,
        ...IVehicleDetails,
    };

    static defaultProps = {
        videoPlayCount: () => {},
        saveVehicleAsViewed: () => {},
        followers: 0,
        similarVehicles: [],
        isPrevNextGalleryVisible: false,
    };

    state = {
        showStickyFooter: false,
        isOpen: false,
        isToolTipOpen: false,
    };

    componentWillMount() {
        const { history } = this.props;

        const id = getIdFromProps(this.props);

        const currentPathname = getFullPathNameFromCurrentLocation();
        const processedPathname = processUrl(currentPathname);

        this.loadFullVehicleInfo(id);

        if (currentPathname !== processedPathname) {
            history.replace(processedPathname);
        }

        this.saveVehicleAsViewed(id);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.onHandleScroll);
        this.subpageWrap = document.getElementById('wrapper-for-sticky-footer-script');
        this.breadcrumbs = document.getElementById('breadcrumbs-script');
    }

    componentWillReceiveProps(nextProps) {
        const prevId = getIdFromProps(this.props);
        const nextId = getIdFromProps(nextProps);

        if (prevId !== nextId) {
            this.props.destroy();
            this.loadFullVehicleInfo(nextId);
            this.saveVehicleAsViewed(nextId);
        }
    }

    componentWillUnmount() {
        this.props.destroy();
        window.removeEventListener('scroll', this.onHandleScroll);
    }

    onHandleScroll = () => {
        const footer = this.stickyFooter;
        const mainVDP = this.mainVDP;
        const wrap = this.subpageWrap;
        const breadcrumbs = this.breadcrumbs;

        if (footer) {
            const wrapStyles = window.getComputedStyle(wrap);
            const wrapPaddingTop = parseInt(wrapStyles.paddingTop);
            const bottomLimit = (mainVDP.offsetHeight + (footer.offsetHeight * 2) + wrapPaddingTop + breadcrumbs.offsetHeight) - window.outerHeight;
            const showStickyFooter = window.pageYOffset <= bottomLimit;
            this.setState({ showStickyFooter });
        }
    };

    getReferenceToStickyFooter = (component) => {
        this.stickyFooter = component;
    };

    getReferenceToMainVDP = (component) => {
        this.mainVDP = component;
    };

    getStatisticsLink = () => {
        const { result: { vdp_url, dealer_id } } = this.props;

        return visitCounterLink({
            type: VDP_CLICK_REFERRALS,
            dealerId: dealer_id,
            redirect: vdp_url,
        });
    };

    saveVehicleAsViewed = (vehicleId) => {
        this.props.saveVehicleAsViewed({
            vehicle_id: vehicleId,
            vehicleSavedAt: Date.now(),
        });
    };

    handleGalleryCheckAvailabilityClick = () => {
        const { result: { id }, openCheckAvailabilityPopup } = this.props;
        const gtmData = {
            event: values.event.CHECK_AVAILABILITY_PHOTO_SUBMIT,
            category: values.category.VDP,
            action: values.action.CHECK_AVAILABILITY_PHOTO,
            label: values.label.SEND,
        };

        openCheckAvailabilityPopup({ id, gtmData });
    };

    handleStickyFooterCheckAvailabilityClick = () => {
        const {
            result: { id },
            tracking,
            openCheckAvailabilityPopup,
        } = this.props;

        tracking.trackEvent({
            event: values.event.CHECK_AVAILABILITY_FOOTER_CLICK,
            category: values.category.VDP,
            action: values.action.STICKY_FOOTER,
            label: values.label.CHECK_AVAILABILITY_FORM,
        });

        const gtmData = {
            event: values.event.CHECK_AVAILABILITY_FOOTER_SUBMIT,
            category: values.category.VDP,
            action: values.action.STICKY_FOOTER,
            label: values.label.CHECK_AVAILABILITY_SEND,
        };

        openCheckAvailabilityPopup({ id, gtmData });
    };

    heartClick = () => {
        const { result: { id }, saveVehicle, unsaveVehicle, isFavourite } = this.props;
        const clickHandler = isFavourite ? unsaveVehicle : saveVehicle;

        clickHandler({ id });
    };

    open = () => {
        this.setState({ isOpen: true });
    };

    close = () => {
        this.setState({ isOpen: false });
    };

    toggleToolTip = () => {
        this.setState({
            isToolTipOpen: !this.state.isToolTipOpen,
        });
    };

    closeToolTip = () => {
        this.setState({
            isToolTipOpen: false,
        });
    };

    loadFullVehicleInfo(id) {
        const { fetch, fetchSeller } = this.props;

        fetch(id);
        fetchSeller(id);
    }

    openDealerSite = () => {
        window.open(this.getStatisticsLink());
    };

    renderSellerInfo() {
        const { sellerProps } = this.props;

        return sellerProps
            && !isEqual(sellerProps, {})
            && <SellerInfo {...sellerProps} />;
    }

    renderGallery() {
        const {
            result: {
                images,
                photo_url,
                call_for_price,
                selling_status,
                vehicle_id,
                certified,
            },
            sellerProps,
            initialized,
            videoPlayCount,
        } = this.props;

        const isSoldLabelShown = (selling_status === SELLING_STATUS_VALUES_CONSTANTS.SOLD);
        const title = getVehicleTitle(this.props.result, true);

        const galleryProps = {
            ...pick(this.props.result, infoFields),
            openCheckAvailabilityPopup: this.handleGalleryCheckAvailabilityClick,
            images: processImages(images, photo_url),
            pageName: title,
            sellerProps,
            call_for_price,
            isSoldLabelShown,
            initialized,
            videoPlayCount,
            vehicle_id,
            video: this.props.result.video_url,
            isCertifiedLabelShown: (certified === CERTIFIED_VALUES_CONSTANTS.CERTIFIED),
        };

        return (
            <Gallery {...galleryProps} showSellerSettings />
        );
    }

    renderOverview() {
        const { result } = this.props;
        const overviewFields = [
            'price',
            'exterior_color',
            'mileage',
            'body_style',
            'fuel_type',
            'fuel_mileage',
            'engine_cylinders',
            'drive_type',
            'transmission',
            'stock',
            'vin',
        ];

        return (
            <Overview overview={{ ...result }} overviewFields={overviewFields} />
        );
    }

    renderToggleFeatureList() {
        const { result: { options } } = this.props;

        return options
            && <ToggleFeatureList features={options} />;
    }

    renderStickyFooter() {
        const {
            result: { price, msrp, condition_type, id, call_for_price },
            sellerProps,
            isFavourite,
            saveVehicle,
            unsaveVehicle,
            pending,
            isAboveFooterHidden,
        } = this.props;

        let realPrice = price;

        if (condition_type === 'New' && !price && msrp) {
            realPrice = msrp;
        }

        const discount = msrp - realPrice;
        const props = {
            ...pick(this.props.result, infoFields),
            id,
            msrp,
            discount,
            pending,
            sellerProps,
            isFavourite,
            saveVehicle,
            unsaveVehicle,
            call_for_price,
            isAboveFooterHidden,
            openCheckAvailabilityPopup: this.handleStickyFooterCheckAvailabilityClick,
        };

        const stickyStyles = {
            position: 'fixed',
            right: '0',
            left: '0',
            bottom: '0',
            zIndex: '100',
        };

        const styles = this.state.showStickyFooter ? stickyStyles : {};

        return <StickyFooter cssStyles={styles} {...props} componentRef={this.getReferenceToStickyFooter} />;
    }

    renderMsrp(msrp) {
        return (
            <div className="msrp vdp-gallery">
                <span className="msrp-title">MSRP:</span>
                <span className="msrp-value">{`$${toThousand(msrp)}`}</span>
            </div>
        );
    }

    renderDiscount(discount) {
        return (
            <div className="discount vdp-gallery">
                <span className="discount-title">Discount:</span>
                <span className="discount-value">{`$${toThousand(discount)}`}</span>
            </div>
        );
    }

    renderSaveVehicle() {
        const { isFavourite } = this.props;
        const title = isFavourite ? 'Saved to Garage' : 'Save to Garage';
        const holderClassName = `fa ${isFavourite ? 'fa-heart' : 'fa-heart-o'}`;
        const wrapperClassName = `vdp-save-link ${isFavourite ? 'saved' : 'unsaved'}`;

        return (
            <span className={wrapperClassName} onClick={this.heartClick}>
                <i className={holderClassName} aria-hidden="true" />
                <span className="vdp-save-link-text">{title}</span>
            </span>
        );
    }

    // TODO uncomment if needed
    // renderDealerWebsiteBtn(dealerUrl, dealerProgram) {
    //     return (
    //         (dealerUrl && dealerProgram) &&
    //         <div className="seller-info-addr-wrap">
    //             <div
    //                 className="seller-info-contacts"
    //                 onClick={this.openDealerSite}
    //             >
    //                 <div className="dealer-website-link">
    //                     <div className="dealer-website-title">
    //                         {showPureLink(dealerUrl, '/')}
    //                     </div>
    //                     <i className="fa fa-external-link" />
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    renderDealerWebsiteBtn(dealerUrl, dealerProgram) {
        return (
        (dealerUrl && dealerProgram) &&
            <div className="seller-info-addr-wrap">
                <div className="vdp-row--centered btn-wrap">
                    <span className="btn" onClick={this.openDealerSite} >
                        View On Dealer Website
                    </span>
                </div>
            </div>
        );
    }

    renderSellerPhone(phone) {
        const formatedPhone = validatePhone(phone);

        return formatedPhone
            ? (
                <div className="vdp-dealer-phone">
                    <i className="fa fa-phone" />
                    <a href={`tel:${formatedPhone}`} className="vdp-dealer-phone-link">
                        {formatedPhone}
                    </a>
                </div>
            ) : null;
    }

    renderGeneralInfo() {
        const {
            result: {
                price,
                condition_type,
                msrp,
                call_for_price,
                vdp_url,
                latest_price_drop,
                vin,
            },
            followers,
            sellerProps,
        } = this.props;

        const { dealer_vdp_click, phone } = sellerProps;
        const title = getVehicleTitle(this.props.result, true);
        const type = (condition_type && condition_type.toLowerCase()) || 'new';

        let cost = '';
        if (call_for_price) {
            cost = 'Call for price';
        } else if (price) {
            cost = `$${toThousand(String(price))}`;
        }

        const priceCssClass = `vdp-price ${call_for_price ? 'call-for-price' : ''}`;
        let realPrice = price;
        if (condition_type === 'New' && !price && msrp) {
            realPrice = msrp;
        }

        const discount = msrp - realPrice;
        let showMsrp = (discount > 0) && Boolean(msrp) && condition_type === 'New' && this.renderMsrp(msrp);
        let showDiscount = (discount > 0 && condition_type === 'New') && this.renderDiscount(discount);

        if (call_for_price) {
            showMsrp = '';
            showDiscount = '';
        }

        // TODO: Comment for now
        // const soldLabel = (selling_status === SELLING_STATUS_VALUES_CONSTANTS.SOLD) && (
        //     <span className="vdp-label vdp-label--left vdp-label--red">Sold</span>
        // );

        const optionalProps = {
            desktopPosition: tooltipPositions.bottom,
            latest_price_drop,
        };

        return (
            <div className="vdp-header vehicle-header">
                <div className="vdp-title-wrap">
                    <h1 className="vdp-title">{title}</h1>
                    {
                        // TODO: Comment for now
                        // soldLabel
                    }
                </div>
                <div className="vdp-row--centered">
                    <div className="vdp-info">
                        <span className={priceCssClass} >{cost}</span>
                        <span className="srp-card-price">
                            <LatestPriceDropIcon {...optionalProps} />
                        </span>
                        <span className="vdp-label">{type}</span>
                        <div className="vdp-characteristics-wrap">
                            {
                                (showMsrp || showDiscount) && <div className="vdp-characteristics">
                                    {showMsrp}
                                    {showDiscount}
                                </div>
                            }
                            {this.renderSellerPhone(phone)}
                        </div>
                    </div>
                    <div className="vdp-save">
                        <div className="vdp-save-text">
                            <span className="">{followers} people</span>
                            <span className="">following this vehicle</span>
                        </div>
                        {this.renderSaveVehicle()}
                    </div>
                </div>
                {this.renderDealerWebsiteBtn(vdp_url, dealer_vdp_click)}
            </div>
        );
    }

    renderMobileFooter() {
        const { result, sellerProps } = this.props;
        const { dealer_id, text_messages_accepted } = sellerProps;
        const vehicleData = pick(result, ['seller_phone', 'year_made', 'brand', 'model', 'stock', 'vin']);
        const vehicleProps = { ...vehicleData, dealer_id: sellerProps.dealer_id };
        const showPhone = sellerProps && sellerProps.phone && Boolean(validatePhone(sellerProps.phone));
        const shouldDisplayMobileTextConnect = dealer_id && text_messages_accepted;

        const mobileTextConnect = shouldDisplayMobileTextConnect
            ? <MobileTextConnect vehicleProps={vehicleProps} label="Text" />
            : null;

        return (
            <div className="sticky-controls--vdp">
                {showPhone && (
                    <a
                        href={`tel:${parsePhone(sellerProps.phone)}`}
                        id="filter-btn-show"
                        className="sticky-controls-btn"
                    >
                        Call
                    </a>
                )}
                { mobileTextConnect }
                <span
                    id="check-availability-show"
                    className="sticky-controls-btn"
                    onClick={this.handleGalleryCheckAvailabilityClick}
                >
                    Email
                </span>

            </div>
        );
    }

    openBadCreditDealershipsUrl = () => {
        const { tracking } = this.props;

        tracking.trackEvent({
            event: values.event.BAD_CREDIT_CLICK,
            category: values.category.VDP,
            action: values.action.BAD_CREDIT,
            label: values.label.BAD_CREDIT_CLICK,
        });

        const { sellerProps: { bad_credit, dealer_id } } = this.props;
        window.open(getStatisticsBadCreditLink(bad_credit, dealer_id));
    };

    renderBadCreditBanner = () => {
        const {
            sellerProps: {
                bad_credit,
             },
        } = this.props;

        if (bad_credit) {
            return (
                <div className="credits-banner">
                    <img
                        onClick={this.openBadCreditDealershipsUrl}
                        className="credits-banner-img"
                        src="/build/public/images/banners/credits-banner-big.png"
                        alt="No Credits? Bad Credit? We’ve Got You Covered"
                    />
                </div>
            );
        }
        return null;
    };

    get chats() {
        const { result = {}, sellerProps = {} } = this.props;
        const isChatActiveEngageActive = Boolean(sellerProps.active_engage && result.dealer_id);

        return [
            (<ChatContactAtOnce key="contactAtOnce" />),
            (<ChatActiveEngage
                key="activeEngage"
                active={isChatActiveEngageActive}
                dealer_id={result.dealer_id}
            />),
        ];
    }

    get schemaOrgVehicleProps() {
        return pick(this.props.result, [
            'brand',
            'condition_type',
            'year_made',
            'model',
            'trim',
            'price',
            'exterior_color',
            'drive_type',
            'transmission',
            'fuel_type',
            'photo_url',
            'interior_color',
            'category',
            'stock',
            'fuel_mileage_city',
            'fuel_mileage_highway',
            'mileage',
            'engine',
        ]);
    }

    get schemaOrgAutoDealerVDPProps() {
        return pick(this.props.sellerProps, ['name', 'dealer_id', 'url', 'phone', 'address']);
    }

    get schemaOrgImageObjectItemsVDP() {
        const { images, condition_type, year_made, brand, model, trim } = this.props.result;
        const { similarVehicles } = this.props;

        const galleryItems = images
            ? Object.values(images).map(image => ({
                photo_url: image,
                condition_type,
                year_made,
                brand,
                model,
                trim,
            }))
            : [];

        return [...galleryItems, ...similarVehicles];
    }

    get prevNextGallery() {
        const { isPrevNextGalleryVisible } = this.props;
        const vehicleId = getIdFromProps(this.props);

        return isPrevNextGalleryVisible ? (
            <PrevNextVDPSlider selectedItemId={vehicleId} />
        ) : null;
    }

    render() {
        const { result = {}, sellerProps = {}, pending, match, statisticPending, location } = this.props;
        const type = (result.condition_type && result.condition_type.toLowerCase()) || 'new';
        const isDisabled = (String(result.price) === '0' || (result.price < result.msrp / 2 && type === 'new') || !result.price);
        const { params } = match;
        const splat = getSplatFromParams(params);

        const id = getIdFromSplat(splat);
        const isPPA = result && Boolean(result.user_id);
        const isDealer = result && !result.user_id;
        const isSouperPackage = result && result.ppa_package === SOUPER_PACKAGE;
        const isAutocheckProgramEnabled = result && result.autocheck;
        const shouldShowForPPA = isPPA && isSouperPackage && isAutocheckProgramEnabled;
        const shouldShowVhrCheckButton = shouldShowForPPA || isDealer;
        const vhrProps = { isPPA, vehicleId: id, ...pick(result, ['carfax', 'dealer_id', 'special_programs']), ...pick(sellerProps, ['autocheck']) };
        const statisticData = result && pick(result, ['days_on_site', 'views', 'saves']);
        const statProps = { ...statisticData, statisticPending };
        const vehicleId = result.vehicle_id;
        const conditionType = result.condition_type;

        const csInsider = vehicleId && conditionType ? (
            <CSInsider
                statistics={statProps}
                isPPA={isPPA}
                vehicleId={vehicleId}
                conditionType={conditionType}
            />
        ) : null;
        const vhrCheckButton = shouldShowVhrCheckButton ? (
            <VhrCheckButton {...vhrProps} />
        ) : null;

        return (
            <div>
                <SchemaOrgImageObject
                    id={SCHEMA_ORG_JSON_LD_IDS.VDP_IMAGES}
                    items={this.schemaOrgImageObjectItemsVDP}
                />
                <SchemaOrgVehicle
                    id={SCHEMA_ORG_JSON_LD_IDS.VEHICLE}
                    {...this.schemaOrgVehicleProps}
                />
                <SchemaOrgAutoDealerVDP
                    id={SCHEMA_ORG_JSON_LD_IDS.AUTO_DEALER_VDP}
                    {...this.schemaOrgAutoDealerVDPProps}
                />
                <FacebookPixel
                    event={ADD_TO_CARD}
                    contentId={result.id}
                />
                <div className="main-vdp" ref={this.getReferenceToMainVDP}>

                    <div className="main-container">
                        <div className="vdp-top-content">
                            {this.prevNextGallery}
                            {this.renderMobileFooter()}
                            <div className="vdp-top-header">
                                <VdpBackLink location={location} />
                                <div className="contact">
                                    <span
                                        className="contact-item open-popup-mobile"
                                        onClick={this.props.openTextToPhonePopup}
                                    >
                                        <i className="fa fa-mobile" aria-hidden="true" />
                                        <span className="contact-item-text">Text to Phone</span>
                                    </span>
                                    {/*  TODO: restore when feature will be finished
                                            <a className="contact-item email-popup-form" href="">
                                                <i className="fa fa-envelope-o" aria-hidden="true" /><span className="contact-item-text">Email</span>
                                            </a> */}
                                    <ClickOutsideDetector handler={this.closeToolTip} className="click-outside-class" disabled={!this.state.isToolTipOpen}>
                                        <span className="contact-item tooltipe">
                                            <div className="contact-item" onClick={this.toggleToolTip}>
                                                <i className="fa fa-share" aria-hidden="true" />
                                                <span className="contact-item-text">Social</span>
                                            </div>

                                            <div className={`tooltipe-content ${this.state.isToolTipOpen ? 'm-active' : ''}`}>
                                                <div className="tooltipe-body">
                                                    <SocialList onSelect={this.closeToolTip} />
                                                </div>
                                            </div>
                                        </span>
                                    </ClickOutsideDetector>
                                    {/*  TODO: restore when feature will be finished
                                            <a className="contact-item m-hidden" href="">
                                                <i className="fa fa-print" aria-hidden="true" /><span className="contact-item-text">Print Friendly</span>
                                            </a>
                                            <a className="contact-item contact-item--big" href="">
                                                <i className="fa fa-flag" aria-hidden="true" /><span className="contact-item-text">Report a Problem</span>
                                            </a> */}
                                </div>
                            </div>
                            {this.renderGeneralInfo()}
                        </div>
                    </div>
                    <div className="main-container">
                        <div className="vdp-content vdp-content-without-ad">
                            <div className="vdp-row--bordered">
                                <div className="col-left-side">
                                    { this.renderGallery() }
                                    <div>
                                        <GptMobileLeaderboard />
                                        <h3 className="overview-title">Overview</h3>
                                        <div className="overview">
                                            { this.renderOverview() }
                                        </div>
                                        <TextDescription text={result.description} pending={pending} />
                                        <div className="features">
                                            {this.renderToggleFeatureList()}
                                        </div>
                                        { vhrCheckButton }
                                    </div>
                                </div>
                                <div className="col-right-side ">
                                    <CheckAvailabilityVDP vehicle_id={result && result.id} />
                                    {this.renderBadCreditBanner()}
                                    {this.chats}
                                    {csInsider}
                                    {this.renderSellerInfo()}
                                    <GptMobileList />
                                    <VdpFinancing
                                        price={result && result.price}
                                        callForPrice={result && result.call_for_price}
                                        isDisabled={isDisabled}
                                        openFinancingPopup={this.open}
                                    />
                                </div>
                            </div>
                            <SimilarVehicles id={id} />
                        </div>
                        <GptDesktopList />
                    </div>
                </div>
                { /*  TODO uncomment if needed stickyFooter
                {this.renderStickyFooter()}
                */ }
                <MonthlyPaymentPopup
                    isOpen={this.state.isOpen}
                    close={this.close}
                />
                <TextToPhonePopup />
                <SaveVehiclesPopup />
                <CheckAvailabilityPopup />
                <CheckAvailabilitySuccessNotification />
                <TextToPhoneSuccessNotification />
            </div>
        );
    }
}

export default compose(
    withTracking(),
    withRouter,
)(VehicleDetailsPage);
