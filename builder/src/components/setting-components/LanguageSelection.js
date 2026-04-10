import React from 'react';
import Select from './Select';
import { websiteLanguages } from './WebsiteLanguages';

function LanguageSelection(porps) {
    const options = [{ label: 'None', value: '' }, ...websiteLanguages];

    return <Select {...porps} value={porps.value || 'en'} options={options} />;
}

export default React.memo(LanguageSelection);
