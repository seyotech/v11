/*****************************************************
 * Packages
 ******************************************************/
import { Radio } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
/*****************************************************
 * Locals
 ******************************************************/
import DrawerHeader from 'modules/Shared/DrawerHeader';
import { useTranslation } from 'react-i18next';
import SavedElements from './SavedElements';
import SectionLibraries from './SectionLibraries';
import Symbols from './Symbols';

const RadioGroup = styled(Radio.Group)`
    & {
        width: 100%;
        display: flex;
        text-align: center;
        & .ant-radio-button-wrapper {
            flex: 1;
        }
    }
`;

const Library = () => {
    const [componentType, setComponentType] = useState('library');
    const { t } = useTranslation('builder');
    const libraryOptions = [
        { label: t('Library'), value: 'library' },
        { label: t('Saved'), value: 'saved' },
        { label: t('Symbols'), value: 'symbols' },
    ];
    return (
        <>
            <DrawerHeader title={t('Components')}>
                <RadioGroup
                    defaultValue={'library'}
                    size="small"
                    optionType="button"
                    options={libraryOptions}
                    onChange={(event) => {
                        setComponentType(event.target.value);
                    }}
                />
            </DrawerHeader>
            <SectionLibraries shouldRender={componentType === 'library'} />
            <SavedElements shouldRender={componentType === 'saved'} />
            {componentType === 'symbols' && <Symbols />}
        </>
    );
};

export default Library;
