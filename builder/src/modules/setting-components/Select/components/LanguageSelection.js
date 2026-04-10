import { websiteLanguages } from 'components/setting-components/WebsiteLanguages';
import { t } from 'i18next';
import React from 'react';
import SelectInput from './SelectInput';

/**
 * Returns a React component for language selection.
 * @param {object} props - The props object passed to the LanguageSelection component.
 * @returns {React.Component} - A React component that renders a SelectInput component with the provided props and options.
 * @example
 * <LanguageSelection value="fr" onChange={handleLanguageChange} />
 * @description
 * This function creates an array of options for a select input by combining a default option of "None" with the websiteLanguages array.
 * It then renders a SelectInput component with the provided props, a default value of 'en', and the options array.
 */
function LanguageSelection(props) {
    const options = [{ label: t('None'), value: '' }, ...websiteLanguages];

    return (
        <SelectInput {...props} value={props.value || 'en'} options={options} />
    );
}

export default React.memo(LanguageSelection);
