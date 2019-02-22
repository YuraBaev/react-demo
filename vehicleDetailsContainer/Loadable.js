import React from 'react';
import Loadable from 'react-loadable';

import Loader from 'components/common/loader';

export default Loadable({
    loader: () => import('./index'),
    loading: () => <Loader active />,
});
