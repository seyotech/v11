import React from 'react';

import useFeatureFlag from '../hooks/useFeatureFlag';

const withFeatureFlag = (flag) => {
    return (Component) => {
        const WithFeatureFlag = (props) => {
            const enabled = useFeatureFlag(flag);

            return enabled ? <Component {...props} /> : null;
        };
        return WithFeatureFlag;
    };
};

export default withFeatureFlag;
