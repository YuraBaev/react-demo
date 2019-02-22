import isEqual from 'is-equal';

import { VDP } from 'constants/pages';
import { processUrl } from 'services/url';

export const vdpUrlCorrecter = (vdpData, id, searchParam) => {
    if (isEqual(vdpData, {})) { return ''; }

    const { condition_type, brand, model, body_style, year_made, vehicle_id } = vdpData;
    const url = `${VDP}/${condition_type}/${brand}/${model}/${body_style}/${year_made}/${vehicle_id}${searchParam}`;

    return processUrl(url.replace(/\/\//g, '/'));
};
