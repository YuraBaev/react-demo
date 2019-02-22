import PropTypes from 'prop-types';

export const IVehicleDetails = {
    tracking: PropTypes.shape({
        trackEvent: PropTypes.func,
    }).isRequired,
    features: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
    ),
    latest_price_drop: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    vin: PropTypes.string,
    model: PropTypes.string,
    brand: PropTypes.string,
    trim: PropTypes.string,
    year_made: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    price: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    msrp: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    exterior_color: PropTypes.string,
    doors: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    body_type: PropTypes.string,
    body_style: PropTypes.string,
    vehicle_type: PropTypes.string,
    category: PropTypes.string,
    mileage: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    fuel_type: PropTypes.string,
    fuel_mileage_city: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    fuel_mileage_highway: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    fuel_mileage_combined: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    condition_type: PropTypes.string,
    engine: PropTypes.string,
    drive_type: PropTypes.string,
    transmission: PropTypes.string,
    description: PropTypes.string,
    selling_status: PropTypes.string,
    seller_phone: PropTypes.string,
    expired_at: PropTypes.string,
    seller_first_name: PropTypes.string,
    seller_last_name: PropTypes.string,
    images: PropTypes.objectOf(PropTypes.string),
    views: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    ad_type: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    zip_code: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    fetch: PropTypes.func,
    fetchSeller: PropTypes.func,
    registerVdpView: PropTypes.func,
    destroy: PropTypes.func,
    pending: PropTypes.bool.isRequired,
    openCheckAvailabilityPopup: PropTypes.func.isRequired,
    searchResultsPageLink: PropTypes.string,
    call_for_price: PropTypes.bool,
    followers: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    sellerProps: PropTypes.shape({
        dealer_vdp_click: PropTypes.bool,
        text_messages_accepted: PropTypes.bool,
        active_engage: PropTypes.bool,
        contact_at_once: PropTypes.bool,
        autocheck: PropTypes.bool,
    }),
};

export const IVehicleStatistics = {
    statisticPending: PropTypes.bool,
    views: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    saves: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    days_on_site: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};
