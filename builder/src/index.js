import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { App, ConfigProvider } from 'antd';
import { useTranslation } from 'react-i18next';
import Builder from './Builder';
import { ThemeProvider } from 'styled-components';
import loadIcons from './util/icons';
import { themes } from './contexts/ThemeContext';
import {
    BuilderContext,
    BuilderContextProvider,
} from './contexts/BuilderContext';
import { AIContextProvider } from 'modules/AI/context/AIContext';
import { ElementContextProvider } from './contexts/ElementRenderContext';

import './libs/translation/i18n.js';
import useImport from './hooks/useImport';
import { FeatureLock } from 'modules/FeatureLock';
import MoreMenu from './components/other-components/Menu/MoreMenu';
import { ImportContext, ImportProvider } from './contexts/ImportContext';
import { ComponentRenderContext } from '@dorik/html-parser';
import antdTheme from './antd.theme';
import scanFaIcons from './libs/macro/faIcon/scanIcons.macro';
import { Tree } from 'modules/Shared/Tree/components';
import SideBar from 'modules/SideBar/SideBar';
import FileUploadModal from 'modules/setting-components/Upload/components/FileUploadModal';
import FileUploadContextProvider from 'modules/setting-components/Upload/context/FileUploadContext';

scanFaIcons({ path: 'src' });

loadIcons();
const BuilderApp = (props) => {
    const { Link } = useContext(ComponentRenderContext);
    const { i18n } = useTranslation();

    useEffect(() => {
        i18n.changeLanguage(localStorage.getItem('i18nextLng') || 'en');
    }, []);

    return (
        <ConfigProvider theme={antdTheme}>
            <App>
                <ThemeProvider theme={themes.light}>
                    <Builder {...props} Link={Link} />
                </ThemeProvider>
            </App>
        </ConfigProvider>
    );
};

BuilderApp.propTypes = {
    site: PropTypes.any,
    page: PropTypes.any,
};

export {
    Tree,
    MoreMenu,
    SideBar,
    useImport,
    BuilderApp,
    FeatureLock,
    ImportContext,
    ImportProvider,
    BuilderContext,
    FileUploadModal,
    AIContextProvider,
    ElementContextProvider,
    BuilderContextProvider,
    FileUploadContextProvider,
};
