/*****************************************************
 * Packages
 ******************************************************/
import { globalStyles } from '@dorik/style-generator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Layout } from 'antd';
import throttle from 'lodash.throttle';
import debounce from 'lodash/debounce';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Frame from 'react-frame-component';
import Helmet from 'react-helmet';
import styled from 'styled-components';
// eslint-disable-next-line import/no-unresolved
import canvasCSS from './scss/builder-canvas.scss?inline';
import { KeyBinding } from './modules/KeyBinding';
import { eventManager, eventNameEnums } from '../src/modules/CustomEvents';

/*****************************************************
 * Local Components
 ******************************************************/
import { BuilderHeader } from 'modules/BuilderHeader';
import ElementContextMenu from './components/ElementContextMenu';
import FrameBindingContext from './components/FrameBindingContext';
import RecursiveRender from './components/RecursiveRender';
import {
    EditorContextProvider,
    ElementContextProvider,
} from './contexts/ElementRenderContext';
import SideBar from './modules/SideBar/SideBar';
import {
    editorType,
    SAVE_TO_COLLECTION,
} from './util/constant';

/*****************************************************
 * Helpers
 ******************************************************/
import { BuilderContext } from './contexts/BuilderContext';

/*****************************************************
 * Data
 ******************************************************/
import configIntegration from './components/editor-resources/config-integration';
import globalSettings from './components/editor-resources/global-settings';
import elementSettings from './components/editor-resources/settings-priority';
import siteSettings from './components/editor-resources/site-settings';
import {
    appNameEnums,
    DND_TYPES,
    INLINE_EDITOR,
    NAVIGATION_TREE,
    PAGE_TYPE_ENUMS,
    RENAME_ELEMENT,
} from './constants';
import instances from './constants/instances/index';
import { themes } from './contexts/ThemeContext';
import initialData from './initialData';

/*****************************************************
 * Utils
 import { notification } from 'antd';
 ******************************************************/

import buildFontString from './util/buildFontString';
import CreateColumn from './util/CreateColumn';
import CreateRow from './util/CreateRow';
import CreateSection from './util/CreateSection';
import {
    replaceIds,
    splitAddress,
    resetActiveFocus,
    updateEdgeContent,
} from './util/element';
import { handleCMSAddress } from './util/getAddressValue';
import getInstance from './util/getInstance';
import { fontMigration } from './util/googleFontMigration';
import uuid from './util/uniqId';

/*****************************************************
 * Modals
 ******************************************************/
import RemoveGlobalModal from './components/ElementControls/RemoveGlobalModal';
import RenameElementModal from './components/ElementControls/RenameElementModal';
import generateThumbnail from './util/generateThumbnail';
import getBuilderDocument from './util/getBuilderDocument';
import SaveElementModal from './components/ElementControls/SaveElementModal';
import { isDev, SITE_DATA } from './config';
import deepCopy from './util/deepCopy';
/*****************************************************
 * UTILITIES
 ******************************************************/
import { SettingModal } from 'modules/setting-components/core/Modals/components';
import { AddElement } from 'modules/setting-components/core/Modals/components/AddElement';
import { Overlay } from 'modules/Shared/Overlay';
import { generateContainers } from 'util/container';
import SaveAISectionModal from './modules/AISections/SaveAISectionModal';
import { Drawer } from './modules/Drawer/index';
import { onDrop } from './util/dndHelpers';
import {
    clearHistory,
    clearUnSavedPagesHistory,
    getHistoryState,
    redo,
    setHistory,
    setHistoryPageId,
    undo,
    updateHistoryPageId,
} from './util/history';
import { BuilderStyles } from './Builder.stc';
import { createContainer } from 'util/container/container';
import StreamingOverlay from 'modules/AI/components/AITextStreamingOverlay';
import { CanvasWrapper } from 'contexts/CanvasContext';
import ShortcutList from 'modules/Component/ShortcutList';
import { entityTypeEnum } from 'constants/mediaEntityTypeEnum';
import { showPublishedSitePreview } from 'util/showPublishedSitePreview';

const BuilderHeaderStc = styled(Layout.Header)`
    padding: 0;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    background: #fff;
    border-bottom: 1px solid #f0f0f0;
`;

const { SIDEBAR } = editorType;

class Builder extends React.Component {
    static contextType = BuilderContext;

    state = {
        responsiveEditorMode: 'desktop',
        settingsWindowVisible: false,
        currentEditItem: null,
        theme: themes.light,
        settingsModal: '',
        editAddress: null,
        addElType: '',
        data: initialData,
        isLoadingBuilder: true,
        isSaving: false,
        shouldRecordHistory: false,
        editPage: null,
        contextMenuPosition: null,
        elementContext: null,
        editorLayout: SIDEBAR,
        editPageId: null,
        sidebarVisible: false,
        editPageIndex: 0,
        pages: initialData.pages.slice(),
        global: { ...initialData.global },
        activeSymbolId: null,
        symbols: {},
        previewMapper: {},
        pagesRef: new Map(),
        aiLoadingState: {},
        hasModifiedGlobal: true,
        isIndexPageChange: null,
        activeSidebar: null,
        isThumbnailUploading: false,
        history: new Map(),
        autoSaving: false,
        drawer: {},
    };

    toggleActiveSidebar = (activeSidebar) => {
        const settingsModal =
            !activeSidebar ||
            (this.state.settingsModal === 'COMPONENT_SETTINGS' &&
                activeSidebar === NAVIGATION_TREE)
                ? this.state.settingsModal
                : null;

        activeSidebar === this.state.activeSidebar
            ? this.setState({ activeSidebar: null })
            : this.setState({
                  activeSidebar,
                  settingsModal,
              });
    };

    /**
     * @typedef PageObject
     * @property {Object} [data]
     * @property {String} [name]
     *
     * @returns {PageObject}
     */
    getEditPage = () => {
        const { pages, editPageIndex } = this.state;
        return pages[editPageIndex] || {};
    };

    getEditPageById = (pageId) => {
        const { pages } = this.state;
        return pages.find((page) => page.id === pageId);
    };

    getEditPageIndexById = (pageId) => {
        const { pages } = this.state;
        return pages.findIndex((page) => page.id === pageId);
    };

    /**
     * @typedef {Object} PageObject
     * @property {Object} [data]
     * @property {String} [name]
     *
     * @param {PageObject} item the page item
     * @param {number} [editPageIndex] index of the page to be edited, defualt `from state`
     * @param {boolean} [isModified] to flag the item as modified, default `true`
     * @param {function} [callback] callback to call after setState
     */
    setEditPage = (item, editPageIndex, isModified = true, callback) => {
        if (typeof editPageIndex === 'function') {
            callback = editPageIndex;
            editPageIndex = undefined;
        }
        editPageIndex =
            undefined != editPageIndex
                ? editPageIndex
                : this.state.editPageIndex;

        const { pages } = this.state;
        // omited password if user not given
        const { password, ...rest } = pages[editPageIndex] || {};
        const nextPage = { ...rest, ...item, isModified };
        const _pagesRefs = this.state.pagesRef;
        if (item.id) {
            const { name, slug } = item;
            _pagesRefs.set(item.id, { name, slug });
        }
        this.setState(
            {
                editPageIndex,
                pagesRef: _pagesRefs,
                pages: pages
                    .slice(0, editPageIndex)
                    .concat(nextPage)
                    .concat(pages.slice(editPageIndex + 1)),
            },
            callback
        );
    };

    addToEditPages = (page) => {
        const { pages } = this.state;
        if (!page.data) page.data = { content: [] };
        const nextPages = pages.concat({ ...page, isModified: true });
        this.setState(
            { pages: nextPages, editAddress: null, settingsModal: null },
            this.storeState
        );
    };

    duplicatePage = (index) => {
        const { pages } = this.state;
        const page = pages[index];
        const copyPage = {
            ...page,
            pageType: page.pageType === 'HOMEPAGE' ? 'REGULAR' : page.pageType,
            slug: '',
            type: null,
            isModified: true,
            name: `${page.name} Copy`,
        };
        delete copyPage.id;
        const nextPages = [...pages];
        nextPages.splice(nextPages.length, 0, copyPage);
        this.setState({ pages: nextPages });
    };

    removeEditPage = (index) => {
        const { pages, editPageIndex } = this.state;
        const _pagesRefs = this.state.pagesRef;
        if (index === editPageIndex) {
            const homeIndex = pages.findIndex(
                (page) => page.pageType === 'HOMEPAGE'
            );
            this.context.selectPage(pages[homeIndex]);
            this.setState({ editPageIndex: homeIndex });
        }

        const nextPages = [...pages];
        const { id } = nextPages[index];

        _pagesRefs.has(id) && _pagesRefs.delete(id);

        const updaterFn = (history) => this.setState({ history });

        clearHistory({
            pageId: id,
            updaterFn,
            pageIndex: index,
            history: this.state.history,
        });

        nextPages.splice(index, 1);
        this.setState(
            {
                pages: nextPages,
                editPageIndex:
                    index > editPageIndex ? editPageIndex : editPageIndex - 1,
            },
            this.storeState
        );
    };

    selectHomePage = async (page) => {
        try {
            const { pageIndex: index, id, slug } = page;
            if (slug === 'index' || !id) return;
            const { pages } = this.state;

            if (this.context.appName === appNameEnums.CMS) {
                const { data: pages = [] } = await this.context.makeHomepage({
                    id,
                });

                if (!pages?.length) return;

                const { pages: statePages } = this.state;
                const _pages = pages.map((page) => {
                    const { switchedHome, ...statePage } = page.id
                        ? statePages.find((item) => item.id === page.id)
                        : {};
                    return {
                        ...statePage,
                        ...page,
                    };
                });
                return _pages;
            }
            const nextPages = this.context.selectHomePage({
                index,
                pages,
            });
            const modifiedPages = this.getModifiedPages(nextPages).map(
                ({ data, ...restOfPage }) => ({ ...restOfPage })
            );
            this.context.save(
                { pages: modifiedPages },
                { redirectPageId: id, isNotify: true }
            );
            return nextPages;
        } catch (error) {
            console.log(error);
        }
    };

    /**
     * @typedef {Object} Page
     * @property {String} id
     * @property {String} name
     * @property {String} slug
     *
     * @param {Page} page
     * @param {Number} index
     */
    handleSelectPage = (index) => {
        const page = this.state.pages[index];
        const { location } = this.props;
        this.setState({ editPageIndex: index, editAddress: null });
        // if (location.pathname.includes('page') && !page.id) {
        //     this.setState({ data: initialData });
        // }
    };

    parseURLId = (query) => {
        const params = new URLSearchParams(query);
        if (params.has('e')) {
            return ['site', params.get('e')];
        } else if (params.has('t')) {
            return ['template', params.get('t')];
        }
    };

    handleCloseTab = (e) => {
        const { isSaved } = this.context;
        if (!isSaved) {
            // Cancel the event
            e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
            // Chrome requires returnValue to be set
            e.returnValue = '';
        } else {
            delete e['returnValue'];
        }
    };

    findHomePage = () => {
        const { site } = this.props;
        return site?.pages?.find((page) => page.type === 'INDEX');
    };

    handlePageVisibility = () => {
        const { id } = this.getEditPage();
        const visibilityType = this.props.site?.pages.find(
            (page) => page.id === id
        )?.visibilityType;

        const setPageVisibility = (value) => {
            if (!id) return;
            const page = { id, visibilityType: value };
            this.context.save(
                { pages: [page] },
                { isNotify: false, isPageSave: true }
            );
        };

        return [visibilityType, setPageVisibility];
    };

    syncPages = (cb) => {
        const { appName } = this.context;
        const { site = {} } = this.props;
        const { pages: propPages = [] } = site;
        const { pages: statePages } = this.state;
        const pages = propPages.map((page) => {
            const statePage = page.id
                ? statePages.find((item) => item.id === page.id)
                : {};
            const data = !page.data ? { content: [] } : JSON.parse(page.data);
            delete statePage?.switchedHome;

            const updaterFn = (history) => this.setState({ history });
            clearUnSavedPagesHistory({
                updaterFn,
                history: this.state.history,
            });

            return {
                ...page,
                data,
                ...statePage,
                slug: page.slug,
                isModified: !page.id,
                ...(appName === 'CMS' && {
                    status: page.status || 'PUBLISHED',
                }),
            };
        });
        this.setState({ pages }, cb);
    };

    buildPagesRef = (pages = []) => {
        return pages
            .filter((page) => page.id)
            .map((page) => {
                const { name, slug, linkId, id } = page;
                return [linkId || id, { name, slug }];
            });
    };

    setPagesRef = (data) => {
        if (data && Array.isArray(data)) {
            const pagesRef = new Map(data);
            this.setState({ pagesRef });
        }
    };

    setPages = ({ pages, activePageIndex }) => {
        if (Array.isArray(pages)) {
            this.setState(
                {
                    pages,
                    editPageIndex: activePageIndex || 0,
                },
                () => {
                    this.storeState();
                }
            );
        }
    };

    hideLoadingBuilder = (ms = 300) => {
        setTimeout(() => this.setState({ isLoadingBuilder: false }), ms);
    };
    startLoadingBuilder = (ms = 0) => {
        setTimeout(() => this.setState({ isLoadingBuilder: true }), ms);
    };

    restorePagesFromLS = () => {
        const activePageIndex = 0;
        const { pages, global, symbols } = this.handleLocalStorage();
        const data = JSON.stringify(pages[activePageIndex].data);

        this.setState(
            { pages, global, symbols, hasModifiedGlobal: true },
            () => {
                this.setEditPage(
                    { data: JSON.parse(data || '{"content":[]}') },
                    activePageIndex,
                    true,
                    this.hideLoadingBuilder
                );
            }
        );
    };
    handlePublish = () => {
        this.handleShowPublishPopOver({ isShortcut: true });
    };

    addCustomEvents = () => {
        eventManager.addEvent(eventNameEnums.SAVE, this.handleSaveData);
        eventManager.addEvent(eventNameEnums.UNDO, this.handleUndo);
        eventManager.addEvent(eventNameEnums.REDO, this.handleRedo);
        eventManager.addEvent(eventNameEnums.PUBLISH, this.handlePublish);
        eventManager.addEvent(eventNameEnums.SHOW, () =>
            this.showSettingsModal('SHORTCUT-LIST')
        );
    };
    removeCustomEvents = () => {
        eventManager.removeEvent(eventNameEnums.SAVE, () =>
            this.handleSaveData(false)
        );
        eventManager.removeEvent(eventNameEnums.UNDO, this.handleUndo);
        eventManager.removeEvent(eventNameEnums.REDO, this.handleRedo);
        eventManager.removeEvent(eventNameEnums.PUBLISH, this.handlePublish);
        eventManager.removeEvent(eventNameEnums.SHOW, () =>
            this.showSettingsModal('SHORTCUT-LIST')
        );
    };

    componentDidMount() {
        const { siteId, pageId } = this.context;

        const { site = {}, page = {} } = this.props;
        this.updateBuilderPreference();

        if (!siteId && !pageId) {
            this.restorePagesFromLS();
        } else {
            const global = site.global && JSON.parse(site.global);
            const nextState = {};

            if (siteId) {
                this.setState({ siteId });
            }
            if (global) {
                const { symbols = {}, ...restOfGlobals } = global;
                nextState.global = fontMigration(restOfGlobals);
                nextState.symbols = symbols;
                const pagesRef = this.buildPagesRef(site.pages);
                // set pages ref
                this.setPagesRef(pagesRef);

                const uniqueArrayFromPagesRef = Array.from(
                    new Map(
                        pagesRef.map(([key, value]) => [key, [key, value]])
                    ).values()
                );

                const hasModifiedGlobal = !isEqual(restOfGlobals, {
                    ...nextState.global,
                    pagesRef: uniqueArrayFromPagesRef,
                });

                nextState.hasModifiedGlobal = hasModifiedGlobal;
            }
            this.setState({
                editPageId: pageId,
                ...nextState,
            });

            this.syncPages(() => {
                const activePageIndex = this.getEditPageIndexById(pageId);
                this.setState({ editPageIndex: activePageIndex || 0 });
                if (page.data) {
                    this.setEditPage(
                        { data: JSON.parse(page.data) },
                        activePageIndex,
                        false,
                        this.hideLoadingBuilder
                    );
                }
            });
        }
        this.addCustomEvents();
    }

    shouldRequestPage = (pageId) => {
        const page = this.getEditPageById(pageId);
        if (!page) return true;
        return !page.isModified && !page.data.content.length;
    };

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.handleCloseTab);
        this.removeCustomEvents();
    }

    componentDidUpdate(prevProps) {
        const { site, page, authUser = true } = this.props;

        const { isSaved } = this.context;
        const pageId = page?.id;
        const siteId = site?.id;
        // fetch new page when route changes
        if (pageId && pageId !== prevProps.page?.id) {
            this.setState({
                addElType: null,
                settingsModal: null,
                isLoadingBuilder: true,
            });

            // const yes = this.shouldRequestPage(pageId);
            // yes && dispatch(actions.fetchPage(pageId));
        }

        if (undefined !== page?.data && !this.state.history.has(pageId)) {
            const { editPageIndex } = this.state;

            const historyUpdaterFn = (updatedHistory) => {
                if (this.state.history.has(`page-${editPageIndex}`)) {
                    return this.setState({ history: updatedHistory });
                }

                const record = { type: 'PAGE', data: JSON.parse(page.data) };
                const updaterFn = (history) => this.setState({ history });
                setHistory({
                    record,
                    pageId,
                    updaterFn,
                    history: updatedHistory,
                });
            };

            updateHistoryPageId({
                pageId,
                pageIndex: editPageIndex,
                history: this.state.history,
                updaterFn: historyUpdaterFn,
            });
        }

        // When server returns a site with all pages

        if (
            site &&
            site.pages?.length &&
            site.pages !== prevProps.site?.pages
        ) {
            this.syncPages(() => {
                const activePageIndex = this.getEditPageIndexById(pageId);
                this.setState({ editPageIndex: activePageIndex || 0 });
            });
            this.setPagesRef(this.buildPagesRef(site.pages));
            if (site.pages.length !== prevProps.site.pages.length) {
                this.setState({ hasModifiedGlobal: true });
            }
        }

        if (site !== prevProps.site) {
            this.setState({ isSaving: false });
            if (!prevProps.site.global && site?.global) {
                const { symbols = {}, ...globalSettings } = site.global
                    ? JSON.parse(site.global)
                    : {};

                this.setState({
                    symbols,
                    global: fontMigration(globalSettings),
                    hasModifiedGlobal: true,
                });
                // if (!authUser) set('global', globalSettings);
            }
            if (site?.data) {
                const data = JSON.parse(site.data);
                const { content, ...rest } = data;
                if (!site?.global) {
                    this.setState({
                        global: rest,
                        hasModifiedGlobal: true,
                    });
                }
                this.setState({
                    isLoadingBuilder: false,
                });
                this.setEditPage(
                    { data },
                    () => siteId && this.handleSaveData(false)
                );
                // ReactGA.event({
                //     category: 'Migration',
                //     action: 'Save Homepage',
                //     label: `SiteID: ${siteId}`,
                // });
            }
        }
        // When server returns a page
        if (page && page !== prevProps.page) {
            const pageIndex = this.getEditPageIndexById(page.id);
            const { pages } = this.state;
            const currentPage = pages[pageIndex];
            this.setState({ editPageId: page.id, editPageIndex: pageIndex });
            const hasPageChanged = false; // this.props.location.state === 'PAGE_CHANGED';

            if (page.data && pageIndex >= 0) {
                // if (!currentPage?.data.content.length || !hasPageChanged) {
                if (
                    !currentPage?.data?.content?.length ||
                    !currentPage.isModified
                ) {
                    this.setEditPage(
                        { data: JSON.parse(page.data) },
                        pageIndex,
                        false,
                        this.hideLoadingBuilder
                    );
                } else {
                    // Stop preloader 300ms after page switch
                    this.hideLoadingBuilder();
                }
            }
            if (page.data === null) {
                setTimeout(() => {
                    this.setState({ isLoadingBuilder: false });
                }, 300);
            }
        }

        if (this.context.versionHistory.isVersionLoad) {
            this.context.versionHistory.setVersionLoad(false);
            const pageIndex = this.getEditPageIndexById(page.id);
            this.setEditPage(
                { data: JSON.parse(page.data) },
                pageIndex,
                false,
                this.hideLoadingBuilder
            );
        }

        if (prevProps.isSaved !== isSaved) {
            if (isSaved) {
                window.removeEventListener('beforeunload', this.handleCloseTab);
            } else {
                window.addEventListener('beforeunload', this.handleCloseTab);
            }
        }
    }

    /**
     * Temporarily store data in localStorage
     * Need more improvement
     * @param {object} data
     */
    storeState = debounce(() => {
        const { site = {}, page = {} } = this.props;
        if (!site.id && !page.id) {
            const { pages, global, symbols } = this.state;
            const stateData = JSON.stringify({ pages, global, symbols });
            localStorage.setItem(SITE_DATA, stateData);
        }
    }, 10000);

    handleLocalStorage() {
        let {
            pages = this.state.pages,
            global = this.state.global,
            symbols = this.state.symbols,
        } = JSON.parse(localStorage.getItem(SITE_DATA)) || {};

        pages = pages.map((page) => ({
            ...page,
            pageType: page.type === 'INDEX' ? 'HOMEPAGE' : 'REGULAR',
        }));
        return { pages, global, symbols };
    }

    updateBuilderPreference = () => {
        let { editorLayout = SIDEBAR } =
            JSON.parse(window.localStorage.getItem('builderPreference')) || {};
        this.setState({ editorLayout });
    };

    makeCurrentEditItem = (data, address) => {
        address = address ? address.split('.') : [];
        const currentEditItem = address.reduce(
            (acc, index) => acc.content[index],
            data
        );
        this.setState({ currentEditItem });
    };

    savedHistory = {
        items: new Map(),
        pointer: null,
    };

    pushToHistory = (id, data) => {
        this.savedHistory.items.set(id, data);
        this.savedHistory.pointer = id;
    };

    browseSavedHistory = (position) => {
        const { items, pointer } = this.savedHistory;
        const history = Array.from(items.keys());
        const currentIndex = history.indexOf(pointer) + position;
        const currPoi = history[currentIndex];
        this.savedHistory.pointer = currPoi;

        this.setState({ data: items.get(currPoi) });
    };

    onDragItem = (props) => {
        const symbols = this.state.symbols;
        const data = this.getEditPage().data;
        const isCMS = this.context.appName === appNameEnums.CMS;
        const isComponentSettingModalOpen =
            this.state.settingsModal === 'COMPONENT_SETTINGS';
        const destinationAddress = props.destination.address;

        const updaterFn = ({ symbols, data }) => {
            this.setState({
                symbols,
                ...(isComponentSettingModalOpen && {
                    editAddress: destinationAddress,
                }),
            });
            this.setEditPage({ data });
            this.saveToHistory({ data, type: 'PAGE' });
        };
        onDrop({
            data,
            props,
            isCMS,
            symbols,
            updaterFn,
        });
        resetActiveFocus();
    };

    /**
     * Removes element from the data store
     * @param {string} address
     * @returns void
     */
    removeElement = (address = this.state.editAddress) => {
        const { setBuilderFocus } = this.context;
        setBuilderFocus(true);
        const ctx = this.getElementContext(splitAddress(address));
        const updateFn = (content, index) => {
            content.splice(index, 1);
            return content;
        };
        this.updatePageData(ctx, updateFn, this.cleanUpElementEditMode);
        resetActiveFocus();
    };

    /**
     * Duplicate an element
     * @param {string} address
     * @returns void
     */
    duplicateElement = (address = this.state.editAddress) => {
        const ctx = this.getElementContext(splitAddress(address));
        const { symbolId, element } = ctx;
        const updateFn = (content, index) => {
            const item = symbolId
                ? { symbolId, id: uuid() }
                : replaceIds(element);
            content.splice(index, 0, item);
            return content;
        };
        this.updatePageData(ctx, updateFn, this.cleanUpElementEditMode);

        // this.saveToHistory({ data: page.data });
        // this.setEditPage({ data }, null, true, () => {
        //     dispatch(actions.setSavedStatus(false));
        // });
    };

    /**
     * This method determines where to insert the Column
     * @param {Number} cols
     * @param {String} contentOf
     * @returns void
     */
    addColumn = (cols, { nestedEl, cmsRow }) => {
        const { addElType } = this.state;
        const columns = cols.split('+');
        const colCount = columns.reduce((num, curr) => num + parseInt(curr), 0);
        if (
            ['ROW', 'CMSROW', 'CONTAINER'].includes(addElType) &&
            !cmsRow
        ) {
            const row = new CreateRow({ colCount, nestedEl });
            row.content = columns.map(
                (span) =>
                    new CreateColumn({
                        size: `${span}/${colCount}`,
                        cmsRow,
                        nestedEl,
                    })
            );
            this.insertElement(row);
        } else if (addElType === 'COLUMN') {
            const column = new CreateColumn({
                size: `${columns[0]}/${colCount}`,
                nestedEl,
                cmsRow,
            });
            this.insertElement(column);
        } else if (addElType === 'SECTION' && cmsRow) {
            const section = new CreateSection();
            const row = new CreateCMSRow('CMS Row');
            row.content = [columns[0]].map(
                (span) =>
                    new CreateColumn({
                        size: `${span}/${colCount}`,
                        cmsRow,
                    })
            );
            section.content.push(row);
            this.insertElement(section);
        } else if (addElType === 'SECTION' && !cmsRow) {
            const section = new CreateSection();
            const row = new CreateRow({ nestedEl });
            row.content = columns.map(
                (span) =>
                    new CreateColumn({
                        size: `${span}/${colCount}`,
                        nestedEl,
                        cmsRow,
                    })
            );
            section.content.push(row);
            this.insertElement(section);
        } else if (addElType === 'ELEMENT') {
            const row = new CreateRow({ nestedEl });
            row.content = columns.map(
                (span) =>
                    new CreateColumn({
                        size: `${span}/${colCount}`,
                        nestedEl,
                    })
            );
            this.insertElement(row);
        }
    };

    // add container
    addContainers = ({ cols, addElType, editAddress }) => {
        addElType = addElType || this.state.addElType;
        editAddress = editAddress || this.state.editAddress;

        const containers = generateContainers({ cols, addElType, editAddress });
        this.insertElement(containers, editAddress);
    };

    addElement = ({
        data,
        elType,
        insertAddress,
        nextEditAdress,
        addElType = this.state.addElType,
    }) => {
        const elData = replaceIds(data);

        if (addElType === 'SECTION') {
            if (elType === 'SECTION') {
                this.insertElement(elData, insertAddress, nextEditAdress);
            } else if (elType === 'ROW') {
                const section = new CreateSection();
                section.content.push(elData);
                this.insertElement(section, insertAddress);
            }
        } else if (addElType === 'ROW') {
            if (elType === 'ROW' || elType === 'ELEMENT') {
                this.insertElement(elData, insertAddress);
            }
        } else if (addElType === 'CMSROW') {
            if (elType === 'ROW' || elType === 'CMSROW') {
                this.insertElement(elData, insertAddress);
            }
        } else if (addElType === 'ELEMENT') {
            const splitAddress = insertAddress.split('.');
            const isRootContainer =
                3 === splitAddress.length &&
                this.getDataByAddress(splitAddress.slice(0, -1).join('.'))
                    ?.type === 'container';

            if (isRootContainer && elType === 'ELEMENT') {
                this.insertElement(
                    {
                        ...createContainer({ size: '100' }),
                        content: [elData],
                    },
                    insertAddress
                );
                return;
            }
            if (elType === 'ELEMENT' || elType === 'CONTAINER') {
                this.insertElement(elData, insertAddress);
            }
        } else if (elType === 'COLUMN' && addElType === 'COLUMN') {
            this.insertElement(elData, insertAddress);
        } else if (addElType === 'CONTAINER') {
            if (data) {
                this.insertElement(elData, insertAddress);
            } else {
                this.addContainers({
                    cols: '',
                    editAddress: insertAddress,
                    addElType: addElType,
                });
            }
        }
    };

    addAISection = (section, index) => {
        const { content, ...rest } = this.getEditPage().data;
        const data = {
            data: { ...rest, content: [section, ...content] },
        };
        this.setEditPage(data, this.state.editPageIndex);
    };

    insertElement = async (
        elData,
        address = this.state.editAddress,
        nextEditAdress
    ) => {
        let cmsAddr = this.cmsRow(address);
        if (cmsAddr) {
            address = cmsAddr;
        }

        const ctx = this.getElementContext(splitAddress(address));
        const addr = ctx.address.slice();
        const destination = addr.length ? parseInt(addr.pop()) + 1 : 0;
        const updateFn = (content, index) => {
            const data = [].concat(elData);
            content.splice(destination, 0, ...data);
            return content;
        };
        const cleanupFn = () => {
            this.hideAddModal(null, triggerEditorModal);
            this.context.setIsSaved(false);
        };
        this.updatePageData(ctx, updateFn, cleanupFn);

        // Show Editor Modal
        function triggerEditorModal() {
            if (
                elData._elType === 'ELEMENT' ||
                elData._elType === 'CMSROW' ||
                nextEditAdress
            ) {
                this.handleClickSettings(
                    nextEditAdress || `${addr.join('.')}.${destination}`
                );
            }
        }
    };

    /**
     * Determins which modal to show
     * @param {string} contentOf
     * @param {string} address A concatanated indexes of data contents
     */
    showAddModal = (addElType, address) => {
        const { setBuilderFocus } = this.context;

        setBuilderFocus(true);
        this.setState({
            addElType,
            editAddress: address,
            sidebarVisible: false,
            settingsModal: null,
            activeSidebar: false,
            drawer: { drawerName: null, isOpen: false },
        });
    };

    hideAddModal = (event, fn) => {
        this.setState(
            { editAddress: null, addElType: '', settingsModal: '' },
            fn
        );
    };

    /**
     * Called when clicked on settings control button
     * It shows settings modal
     * @param {string} address - A concatanated indexes of data contents
     */
    handleClickSettings = (address, settingModal = 'COMPONENT_SETTINGS') => {
        this.showSettingsModal(settingModal, address);
        if (this.state.activeSidebar !== NAVIGATION_TREE) {
            this.setState({ activeSidebar: null });
        }
        resetActiveFocus();
    };
    currentEditAddress = () => {
        return this.state.editAddress;
    };

    showSettingsModal = (type, address, triggerFrom = '') => {
        const { setBuilderFocus } = this.context;
        setBuilderFocus(true);
        // this.props.dispatch({ type: 'settingsWindowVisible' });
        const shouldKeepOpenComponentSettingsModal =
            triggerFrom === 'VERSION-HISTORY' &&
            this.state.settingsModal === 'COMPONENT_SETTINGS';

        const shouldCloseDrawer =
            triggerFrom !== NAVIGATION_TREE ||
            triggerFrom === 'VERSION-HISTORY';

        this.setState({
            settingsModal: shouldKeepOpenComponentSettingsModal
                ? 'COMPONENT_SETTINGS'
                : type,
            editAddress: address,
            activeSidebar: type,
            settingsModalTriggerFrom: triggerFrom,
            ...(shouldCloseDrawer && {
                drawer: {
                    drawerName: null,
                    isOpen: false,
                },
            }),
            addElType: '',
        });

        if (type === 'SITE-SETTINGS' || type === 'GLOBAL-SETTINGS') {
            // TODO: enable it on first input change instead of openning the settings
            // this.setState({
            //     hasModifiedGlobal: true,
            // });
            this.makeCurrentEditItem(this.state.global);
        } else {
            let cmsAddr = this.cmsRow(address);
            if (cmsAddr) {
                address = cmsAddr;
            }

            const ctx = this.getElementContext(splitAddress(address));
            this.setState({
                elementContext: ctx,
                currentEditItem: ctx.element,
            });
        }
        this.handleSidebarVisible(true);
    };

    /**
     * Deprecated. Use `cleanUpElementEditMode` instead
     */
    hideSettingsModal = () => {
        // this.props.dispatch({ type: 'hideSettingsWindow' });

        const settingsModalTriggerFrom =
            this.state.settingsModalTriggerFrom === INLINE_EDITOR
                ? null
                : this.state.settingsModalTriggerFrom;

        this.setState({
            editAddress: null,
            settingsModal: null,
            activeSidebar: null,
            currentEditItem: null,
            previewMapper: {},
            settingsModalTriggerFrom,
        });
    };

    cleanUpElementEditMode = () => {
        // TODO: refactor hideSettingsModal and replace with this method
        const { setBuilderFocus } = this.context;
        setBuilderFocus(true);
        this.hideSettingsModal();
        this.setState({
            elementContext: null,
        });
    };

    /**
     * To hide settings modal
     */
    hideSettingsWindow = () => {
        // this.props.dispatch({ type: 'hideSettingsWindow' });
        this.setState({
            // responsiveEditorMode: "desktop",
            settingsWindowVisible: false,
            currentEditItem: null,
            editAddress: null,
        });
    };

    /**
     * @param {object} data
     * @param {string} address
     * @returns {array}
     */
    shallowData = (data, address) => {
        const { symbols } = this.state;
        const addr = address ? address.split('.') : [];
        const result = { ...data };
        const edgeItem = addr.reduce((acc, index) => {
            acc = 'symbolId' in acc ? symbols[acc.symbolId].data : acc;
            const arr = [...acc.content]; // shallow copy array
            const nItem = { ...arr[index] }; // shallow copy the item
            arr[index] = nItem; // replace array index with the shallow copied item
            acc.content = arr;
            return nItem;
        }, result);
        return [result, edgeItem];
    };

    getDataByAddress = (address, symbolId) => {
        const { symbols } = this.state;
        if (symbolId) {
            return { ...symbols[symbolId]?.data, symbolId };
        }
        const cmsAddr = this.cmsRow(address);
        if (cmsAddr) {
            address = cmsAddr;
        }
        const page = this.getEditPage();
        const addr = address ? address.split('.') : [];
        return addr.reduce((acc, index) => {
            if (!Array.isArray(acc.content)) return {};
            const item = acc.content[index] || { content: [] };

            return 'symbolId' in item
                ? { ...symbols[item.symbolId].data, symbolId: item.symbolId }
                : item;
        }, page.data);
    };

    updateSymbols = (callback, cleanUpFn) => {
        const { symbols } = this.state;
        const invokeAfterStateUpdate = () => {
            cleanUpFn?.call(this);
            this.storeState();
        };

        const nextSymbols = callback(symbols);

        this.setState(
            { symbols: nextSymbols, hasModifiedGlobal: true },
            invokeAfterStateUpdate
        );
    };

    getElementStyleByAddress = (address = this.state.editAddress) => {
        const prvElement = this.getDataByAddress(address);
        const instance = instances[prvElement?.type] || [];
        const updatedInstance = getInstance(instance);
        const style = pick(prvElement, updatedInstance);
        this.cleanUpElementEditMode();
        return style;
    };

    pasteElementStyleByAddress = (
        style,
        currentAddress = this.state.editAddress
    ) => {
        const ctx = this.getElementContext(splitAddress(currentAddress));
        const { symbolId } = ctx;

        if (symbolId) {
            const updateFn = (symbols) => {
                const symbol = symbols[symbolId];
                return {
                    ...symbols,
                    [symbolId]: {
                        ...symbol,
                        data: merge(deepCopy(symbol.data), style),
                    },
                };
            };
            this.updateSymbols(updateFn, this.cleanUpElementEditMode);
        } else {
            const changerFn = (edgeContent, edgeIndex) => {
                const content = edgeContent.slice();
                content[edgeIndex] = merge(deepCopy(content[edgeIndex]), style);
                return content;
            };

            this.updatePageData(ctx, changerFn, this.cleanUpElementEditMode);
        }
    };

    _saveOne = (edgeItem, payload) => {
        const { name: path, value } = payload;
        // This code bellow is written for mutating the currently
        // editable item which is shallow copy of original object
        // settings popupSetting sidebarPopup
        path?.split('/').reduce((acc, key, index, arr) => {
            if (arr.length === index + 1) {
                // assign the value to the last part of the path
                return (acc[key] = value);
            } else {
                // create a blank object, if unvailable
                if (!acc[key]) {
                    acc[key] = {};
                }
                return (acc[key] = { ...acc[key] }); // return without referance
            }
        }, edgeItem);
    };

    /**
     * @typedef ElementContextReturnValue
     * @prop {object} [element]
     * @prop {string} [symbolId]
     * @prop {string} [parentSymbolId]
     * @prop {string[]} [symbolAddress]
     * @prop {string[]} [addressInParent]
     * @prop {string[]} [parentSymbolAddress]
     *
     * @param {string[]} address
     * @param {object} data
     * @returns {ElementContextReturnValue}
     */
    getElementContext = (address, data) => {
        data = data || this.getEditPage().data;

        const elmContext = address.reduce(
            (prev, key, index, addr) => {
                const element = prev.element?.content[key];
                const isLast = addr.length - 1 === index;
                if (element?.symbolId) {
                    const symbolAddress = addr.slice(0, index + 1);
                    const symbol = this.state.symbols[element.symbolId].data;
                    return {
                        address,
                        element: symbol,
                        symbolAddress,
                        symbolId: element.symbolId,
                        parentSymbolId: isLast
                            ? prev.parentSymbolId
                            : element.symbolId,
                        parentSymbolAddress: isLast
                            ? prev.parentSymbolAddress
                            : symbolAddress,
                    };
                } else {
                    return {
                        address,
                        element,
                        parentSymbolId: prev.parentSymbolId,
                        parentSymbolAddress: prev.parentSymbolAddress,
                    };
                }
            },
            { element: data }
        );

        return {
            ...elmContext,
            addressInParent:
                elmContext.parentSymbolAddress &&
                address.slice(elmContext.parentSymbolAddress.length),
        };
    };

    updatePageData = (ctx, updateFn, cleanUpFn) => {
        const { address, addressInParent, parentSymbolId } = ctx;

        const invokeAfterStateUpdate = () => {
            cleanUpFn?.call(this);
            this.storeState();
        };
        if (this.getEditPage().slug === 'index') {
            this.setState({ isIndexPageChange: true });
        }

        if (parentSymbolId) {
            const { symbols } = this.state;
            const symbol = symbols[parentSymbolId];
            const updated = updateEdgeContent(
                symbol.data,
                addressInParent,
                updateFn
            );
            const nextSymbols = {
                ...symbols,
                [parentSymbolId]: {
                    ...symbol,
                    data: updated,
                },
            };
            this.setState(
                { symbols: nextSymbols, hasModifiedGlobal: true },
                invokeAfterStateUpdate
            );
            // this.saveToHistory({ data: nextSymbols, type: 'SYMBOL' });
        } else {
            const page = this.getEditPage();
            const updated = updateEdgeContent(page.data, address, updateFn);
            this.setEditPage({ data: updated }, invokeAfterStateUpdate);
            this.saveToHistory({ data: updated, type: 'PAGE' });
        }
    };
    linkSymbol = ({
        symbolId,
        address = this.state.editAddress,
        symbol,
        cb,
    }) => {
        const { symbols } = this.state;
        // Create symbol
        this.setState(
            {
                hasModifiedGlobal: true,
                symbols: { ...symbols, [symbolId]: symbol },
            },
            () => {
                const ctx = this.getElementContext(splitAddress(address));
                this.updatePageData(ctx, updateFn, cleanUpFn);
            }
        );
        this.backgroundSave();

        // Replace data by symbol referance
        function updateFn(edgeContent, edgeIndex) {
            const content = edgeContent.slice();
            content.splice(edgeIndex, 1, { symbolId });
            return content;
        }

        function cleanUpFn() {
            cb && cb();
            this.cleanUpElementEditMode();
        }
    };

    unlinkSymbol = (cb) => {
        const ctx = this.getElementContext(
            splitAddress(this.state.editAddress)
        );
        const data = replaceIds(ctx.element);

        // Replace symbol referance by its data
        this.updatePageData(ctx, updateFn, cleanUpFn);

        function updateFn(edgeContent, edgeIndex) {
            const content = edgeContent.slice();
            content.splice(edgeIndex, 1, data);
            return content;
        }

        function cleanUpFn() {
            cb && cb();
            this.cleanUpElementEditMode();
        }

        // const nextSymbols = { ...symbols };
        // this.setState({ symbols: nextSymbols, hasModifiedGlobal: true }, cb);
    };

    /**
     * Triggered when user changes something in settings modal
     * and clicks on Save changes
     * @param {object|array} payload
     * @param {string} [address]
     * @returns void
     */
    handleSaveSettings = (
        payload,
        address = this.state.editAddress,
        isMigrationInProgress
    ) => {
        if (isMigrationInProgress && !this.state.isSavingVersionHistory) {
            this.saveInitialVersionHistory();
        }

        const { symbols, editAddress, shouldRecordHistory } = this.state;
        const cmsAddr = this.cmsRow();
        if (cmsAddr) {
            address = cmsAddr;
        }
        if (this.getEditPage().slug === 'index') {
            this.setState({ isIndexPageChange: true });
        }

        const elementContext = address
            ? this.getElementContext(splitAddress(address))
            : this.state.elementContext;
        const { symbolId } = elementContext;
        address = address || editAddress;
        payload = Array.isArray(payload) ? payload : [payload];

        // Temporary solution
        // page settings only
        if (!address) {
            const data = { ...this.getEditPage().data };
            payload.forEach((load) => this._saveOne(data, load));
            this.setEditPage({ data }, this.storeState);
            this.makeCurrentEditItem(data);
            this.backgroundSave();
            return;
        }

        if (symbolId) {
            const symbol = symbols[symbolId];
            const updated = { ...symbol.data };
            payload.forEach((load) => this._saveOne(updated, load));
            const nextSymbols = {
                ...symbols,
                [symbolId]: {
                    ...symbol,
                    data: updated,
                },
            };
            this.setState(
                {
                    symbols: nextSymbols,
                    currentEditItem: updated,
                    hasModifiedGlobal: true,
                },
                this.storeState
            );
            this.saveToHistory({ data: nextSymbols, type: 'SYMBOL' });
        } else {
            const updateFn = (content, index) => {
                const item = { ...content[index] };
                payload.forEach((load) => this._saveOne(item, load));
                content[index] = item;
                this.setState({ currentEditItem: item });
                return content;
            };
            this.updatePageData(elementContext, updateFn);
        }

        //     if (!shouldRecordHistory) {
        //         this.setState({ shouldRecordHistory: true });
        //         this.saveToHistory({ data: page.data });
        //     }

        // Site saved status update
        // dispatch(actions.setSavedStatus(false));

        // Auto save
        if (!(isMigrationInProgress || this.state.isSavingVersionHistory)) {
            this.backgroundSave();
        }
        this.versionHistorySave();
    };

    handleGlobalChanges = (payload) => {
        const { global } = this.state;
        const copyGlobal = { ...global };
        if (Array.isArray(payload)) {
            payload.forEach((load) => this._saveOne(copyGlobal, load));
        } else {
            // TODO: refactor to make it emmutable
            this._saveOne(copyGlobal, payload);
        }

        const record = { data: copyGlobal, type: 'GLOBAL' };
        this.saveToHistory(record);

        this.setState(
            {
                global: copyGlobal,
                currentEditItem: { ...copyGlobal },
                hasModifiedGlobal: true,
            },
            this.storeState
        );
        this.backgroundSave();
    };

    handleBuilderLayout = (editorLayout) => {
        this.setState({ editorLayout });
        this.backgroundSave();
    };

    handleSidebarVisible = (value) => {
        this.setState({ sidebarVisible: value, previewMapper: {} });
    };
    handleTogglePreview = ({ name, value }) => {
        this.setState({
            previewMapper: { [name]: value },
        });
    };

    handleIsAutoSaving = (value = false) => {
        this.setState({
            autoSaving: value,
        });
    };

    backgroundSave = debounce(() => {
        // const { pages } = this.state;
        // const { authUser } = this.props;
        this.handleSaveData(false);
        this.handleIsAutoSaving(true);
        // if (!authUser) {
        //     localStorage.setItem('pages-temp', JSON.stringify(pages));
        // }
    }, 3000);

    aiAutoSave = async ({ isNotify, shouldPublish }) => {
        const updateFn = shouldPublish
            ? this.handleClickOnPublish
            : this.handleSaveData;

        updateFn(isNotify);
        this.handleIsAutoSaving(true);
        const data = { ...this.getEditPage() };
        this.saveToHistory(data);
    };
    setAILoadingState = (payload) => {
        const { aiLoadingState } = this.state;
        const value = payload ? { ...aiLoadingState, ...payload } : {};
        this.setState({ aiLoadingState: value });
    };

    getModObj = () => {
        const page = this.getEditPage();
        if (!page?.id || !page?.data) return;
        const obj = {
            body: JSON.stringify(page.data),
            pageType: page?.pageType,
            ...(page?.ref && { ref: page?.ref }),
            slug: page?.slug,
            pageId: page?.id,
            saveType: 'AUTO',
        };
        return obj;
    };

    versionHistorySave = throttle(
        async () => {
            const { authUser } = this.props;
            if (!authUser) return;
            let obj = this.getModObj();
            if (!obj) return;
            await this.context.versionHistory.createPageVersionHistory(obj);
        },
        1000 * 60 * 10,
        {
            leading: false,
        }
    );

    saveInitialVersionHistory = throttle(
        async () => {
            try {
                this.setState({ isSavingVersionHistory: true });

                let obj = this.getModObj();
                const {
                    page: { data },
                } = this.props;

                if (!obj || !data) return;

                const { success } =
                    await this.context.versionHistory.createPageVersionHistory({
                        ...obj,
                        body: data,
                    });

                success && this.backgroundSave();
            } finally {
                this.setState({ isSavingVersionHistory: false });
            }
        },
        500,
        {
            leading: false,
        }
    );

    saveToHistory = debounce((record) => {
        const { history, editPageIndex } = this.state;
        const { id: pageId } = this.getEditPage();

        record = { type: 'PAGE', ...record };

        const historyUpdaterFn = (updatedHistory) => {
            const editPageId =
                pageId || updatedHistory.get(`page-${editPageIndex}`);
            const updaterFn = (history) => this.setState({ history });
            setHistory({
                record,
                updaterFn,
                pageId: editPageId,
                history: updatedHistory,
            });
        };
        if (!pageId) {
            setHistoryPageId({
                history,
                pageIndex: editPageIndex,
                updaterFn: historyUpdaterFn,
            });
        } else {
            updateHistoryPageId({
                pageId,
                history,
                pageIndex: editPageIndex,
                updaterFn: historyUpdaterFn,
            });
        }
    }, 500);

    updateHistory = ({ record, history }) => {
        this.hideSettingsModal();
        const { editAddress } = this.state;
        const { data } = record;
        this.setEditPage({ data });
        editAddress && this.makeCurrentEditItem(data, editAddress);

        if (editAddress) {
            const ctx = this.getElementContext(splitAddress(editAddress));
            if (ctx.symbolId)
                this.setState({ currentEditItem: data[ctx.symbolId].data });
        }
        this.setState({ history });
    };

    handleUndo = () => {
        const { editPageId, history, editPageIndex: pageIndex } = this.state;
        undo({
            history,
            pageIndex,
            pageId: editPageId,
            updaterFn: this.updateHistory,
        });
    };

    handleRedo = () => {
        const { history, editPageId, editPageIndex: pageIndex } = this.state;
        redo({
            history,
            pageIndex,
            pageId: editPageId,
            updaterFn: this.updateHistory,
        });
    };

    //TODO: refactor handle save settings
    REF_handleSaveSettings = (payload, address) => {
        const { data, editAddress, currentEditItem } = this.state;
        address = address || editAddress;

        const addr = address ? address.split('.') : [];
        if (currentEditItem) {
            const copyOfCurrentEditItem = { ...currentEditItem };
            const { name, value } = payload;
            // This code bellow is written for mutating the currently
            // editable item which is shallow copy of original object
            const path = name.split('/'),
                len = path.length;
            path.reduce((acc, key, index) => {
                if (len === index + 1) {
                    // assign the value to the last part of the path
                    return (acc[key] = value);
                } else {
                    // create a blank object, if unvailable
                    if (!acc[key]) {
                        return (acc[key] = {});
                    }
                    return (acc[key] = { ...acc[key] });
                }
            }, copyOfCurrentEditItem);
            // TODO: save item into data
        } else {
            const currentEditItem = addr.reduce((acc, index) => {
                const arr = [...acc.content]; // shallow copy contents array
                return { ...arr[index] }; // shallow copy the element
            }, data);
            // TODO: save item into data
            this.setState({ currentEditItem });
        }
    };

    handleImport = (data) => {
        this.setState({ data });
    };

    handleResponsiveEditorMode = (value) =>
        this.setState({ responsiveEditorMode: value });

    setGlobalState = (newGlobalState) => {
        const { global } = this.state;
        this.setState(
            {
                hasModifiedGlobal: true,
                global: {
                    ...global,
                    ...newGlobalState,
                },
            },
            this.storeState
        );
        this.backgroundSave();
    };

    setTemplateInfo = (value) => {
        this.setState({
            selectedTopicItem: value,
        });
    };

    hideElementRightClickMenu = () => {
        // this.props.dispatch({ type: 'hideSettingsWindow' });
        this.setState({ settingsModal: '', contextMenuPosition: null });
    };

    handleElementRightClick = ({
        elRef,
        address,
        triggerFrom = '',
        contextMenuPosition,
    }) => {
        this.showSettingsModal('CONTEXT_MENU', address, triggerFrom);
        this.setState({ contextMenuPosition, elRef });
    };

    handleClickContextMenu = (type) => {
        const { editAddress } = this.state;
        this.setState({ settingsModal: type, editAddress });
    };

    getReferenceForNavTreeEl = (elRef) => this.setState({ elRef });

    // to avoid this object to be created each render
    elementContextMethods = {
        handleResponsiveEditorMode: this.handleResponsiveEditorMode,
        getReferenceForNavTreeEl: this.getReferenceForNavTreeEl,
        responsiveEditorMode: this.state.responsiveEditorMode,
        cleanUpElementEditMode: this.cleanUpElementEditMode,
        onElementRightClick: this.handleElementRightClick,
        handleSidebarVisible: this.handleSidebarVisible,
        onClickContextMenu: this.handleClickContextMenu,
        handleTogglePreview: this.handleTogglePreview,
        handleBuilderLayout: this.handleBuilderLayout,
        currentEditAddress: this.currentEditAddress,
        getElementStyleByAddress: this.getElementStyleByAddress,
        showSettingsModal: this.showSettingsModal,
        onClickSettings: this.handleClickSettings,
        getDataByAddress: this.getDataByAddress,
        pasteElementStyleByAddress: this.pasteElementStyleByAddress,
        duplicateElement: this.duplicateElement,
        onSaveSettings: throttle(this.handleSaveSettings, 16.67, {
            leading: true,
            trailing: true,
        }),
        setGlobalState: this.setGlobalState,
        addContainers: this.addContainers,
        showAddModal: this.showAddModal,
        unlinkSymbol: this.unlinkSymbol,
        onRemove: this.removeElement,
        addElement: this.addElement,
        addAISection: this.addAISection,
        linkSymbol: this.linkSymbol,
        addColumn: this.addColumn,
        onDragItem: this.onDragItem,
        setTemplateInfo: this.setTemplateInfo,
        startLoadingBuilder: this.startLoadingBuilder,
        hideLoadingBuilder: this.hideLoadingBuilder,
        handleUndo: this.handleUndo,
        handleRedo: this.handleRedo,
        handleIsAutoSaving: this.handleIsAutoSaving,
    };

    get canvasCtx() {
        const {
            global,
            symbols,
            settingsModal,
            previewMapper,
            aiLoadingState,
            settingsModalTriggerFrom,
        } = this.state;
        const { user, appName, permission, getElement, versionHistory } =
            this.context;
        const isConfirmationModalOpen = versionHistory.isConfirmationModalOpen;

        const editPage = this.getEditPage();
        const { data } = editPage;
        return {
            user,
            global,
            symbols,
            appName,
            getElement,
            permission,
            settingsModal,
            aiLoadingState,
            previewMapper,
            isConfirmationModalOpen,
            settingsModalTriggerFrom,
            addElement: this.addElement,
            pageSettings: data?.settings,
            showAddModal: this.showAddModal,
            getDataByAddress: this.getDataByAddress,
            onSaveSettings: this.handleSaveSettings,
            onClickSettings: this.handleClickSettings,
            currentEditAddress: this.currentEditAddress,
            cleanUpElementEditMode: this.cleanUpElementEditMode,
            onElementRightClick: this.handleElementRightClick,
            getReferenceForNavTreeEl: this.getReferenceForNavTreeEl,
        };
    }

    get stateToContext() {
        const {
            pages,
            global,
            // siteId,
            editAddress,
            editPageIndex,
            previewMapper,
            sidebarVisible,
            elementContext,
            currentEditItem,
            isThumbnailUploading,
            responsiveEditorMode,
            activeSidebar,
            autoSaving,
        } = this.state;
        const { siteId, user } = this.context;
        const page = this.getEditPage();
        const parenItem = this.getDataByAddress(editAddress?.slice(0, -2));
        const editItem = { ...currentEditItem, parentType: parenItem?.type };
        return {
            user,
            page,
            pages,
            siteId,
            global,
            editAddress,
            previewMapper,
            sidebarVisible,
            elementContext,
            isThumbnailUploading,
            display: responsiveEditorMode,
            currentEditItem: editItem,
            getEditPage: this.getEditPage,
            currentPage: pages[editPageIndex],
            editPageIndex,
            setEditPage: this.setEditPage,
            importJSON: this.importJSON,
            activeSidebar,
            autoSaving,
            drawer: this.state.drawer,
        };
    }

    get getFrameStyle() {
        const devices = {
            desktop: '100%',
            tablet: '768px',
            mobile: '420px',
        };
        return {
            border: '0px',
            display: 'block',
            margin: '0 auto',
            background: '#ffffff',
            height: '100%',
            boxShadow: '0 0 60px 0 rgba(43,53,86,0.15)',
            width: devices[this.state.responsiveEditorMode],
        };
    }

    handleClickOnPublish = () => {
        this.handlePublishSave();
    };

    getPublishablePage = (modifiedPages) => {
        const { data, ...rest } = this.getEditPage();
        delete rest.isModified;
        const type = rest.type ?? undefined;
        const currentPage = {
            ...rest,
            type,
            ...this.getPublishFlag(),
            data: data && JSON.stringify(data),
        };
        const currentPageIndexInModifiedPages = modifiedPages.findIndex(
            (page) => page.slug === currentPage.slug
        );

        const index =
            currentPageIndexInModifiedPages >= 0
                ? currentPageIndexInModifiedPages
                : modifiedPages.length;

        return [currentPage, index];
    };

    handlePublishSave = async () => {
        const builderContent = getBuilderDocument();
        const {
            save,
            CDNDomain,
            isPublishing,
            handleUploadMedia,
            handleUpdateGlobalStyle,
        } = this.context;
        const { isIndexPageChange } = this.state;

        const { slug, pageType } = this.getEditPage();
        const isHomePage = slug === 'index' && pageType === 'HOMEPAGE';

        let thumbnail;
        if (isIndexPageChange && isHomePage) {
            try {
                this.setState({
                    isThumbnailUploading: true,
                });
                const file = await generateThumbnail(builderContent);

                const [result] = await handleUploadMedia({
                    fileList: [file],
                    kind: 'image',
                    entityType: entityTypeEnum.SYSTEM,
                });
                thumbnail = `${CDNDomain}/${result.path}`;
            } catch (error) {
                console.log({ error });
            }
        }
        this.setState({
            isThumbnailUploading: false,
        });

        if (isPublishing) return;
        const { global, hasModifiedGlobal, symbols, pagesRef } = this.state;
        const modifiedPages = this.getModifiedPages().map((page) => ({
            ...page,
            ...this.getPublishFlag(),
        }));
        const unModifiedPages = this.getUnmodifiedPages();

        const data = hasModifiedGlobal
            ? { ...global, symbols, pagesRef: Array.from(pagesRef) }
            : null;
        if (hasModifiedGlobal) {
            handleUpdateGlobalStyle(data).then(() => {
                this.setState({ hasModifiedGlobal: false });
            });
        }
        save(
            {
                pages: modifiedPages.concat(unModifiedPages),
                ...(data && { global: data }),
                ...(thumbnail && { thumbnail }),
            },
            {
                publishing: true,
                isNotify: true,
                pageVersion: this.getModObj(),
            }
        );
        this.setState({ switchedHome: false, isIndexPageChange: false });
    };

    getModifiedPages = (nextPages) => {
        const { appName } = this.context;
        const { hasFeaturePermission } = this.props;
        const isCms = appName === appNameEnums.CMS;
        const isFeatureLocked =
            isCms &&
            !hasFeaturePermission({
                excludePlans: ['FREE'],
            });
        const { pages, switchedHome } = this.state;
        const _pages = (nextPages || pages)
            .filter((page) => page.isModified)
            .map((page) => {
                const { id, name, slug, data } = page;
                const type = null !== page.type ? page.type : undefined;
                return {
                    ...page,
                    id,
                    name,
                    slug,
                    type,
                    isModified: undefined,
                    ...(isFeatureLocked && {
                        shouldIncludeInSitemap: false,
                    }),
                    data:
                        !switchedHome && data
                            ? JSON.stringify(data)
                            : undefined,
                };
            });
        return _pages
            .filter((page) => page.pageType !== 'HOMEPAGE')
            .concat(_pages.filter((page) => page.pageType === 'HOMEPAGE'));
    };

    getPublishFlag = () => {
        const { appName } = this.context;
        const isStatic = appName === appNameEnums.STATIC;

        return { [isStatic ? 'public' : 'shouldPublish']: true };
    };

    getUnmodifiedPages = () => {
        const { pages } = this.state;
        return pages
            .filter((page) => !page.isModified)
            .map((page) => {
                const { id } = page;
                const type = null !== page.type ? page.type : undefined;
                return {
                    id,
                    type,
                    ...this.getPublishFlag(),
                };
            });
    };

    setIsSaving = (isSaving) => {
        this.setState({ isSaving });
    };

    handleShowPublishPopOver = ({ isShortcut } = {}) => {
        const { activeSidebar } = this.state;
        const { site } = this.props;
        const editPage = this.getEditPage();
        const { appName } = this.context;
        const visible = activeSidebar === 'PUBLISH-SETTINGS';

        if (isShortcut) {
            return this.handleClickOnPublish();
        }
        if (
            (appName === 'STATIC' && (!site || site.status === 'DRAFT')) ||
            (appName === 'CMS' && editPage?.ref === 'SUBSCRIPTION_BANNER')
        ) {
            return this.handleClickOnPublish();
        }

        this.showSettingsModal(visible ? '' : 'PUBLISH-SETTINGS');
    };

    saveSiteJSON = throttle(
        async () => {
            const { createSiteVersion, siteId } = this.context;
            try {
                await createSiteVersion(siteId);
            } catch (error) {
                console.log(error);
            }
        },
        1000 * 60 * 5,
        { leading: false, trailing: true }
    );
    saveInitSiteJSON = async () => {
        const { createSiteVersion, siteId } = this.context;
        try {
            const success = await createSiteVersion(siteId);
            success && this.setState({ hasInitialSaved: true });
        } catch (error) {
            console.log(error);
        }
    };

    handleSaveData = (isNotify = true) => {
        const { global, symbols, pagesRef, hasModifiedGlobal } = this.state;
        const pages = this.getModifiedPages();
        const { save, isSaving, handleUpdateGlobalStyle } = this.context;
        if (isSaving) return;
        const data = hasModifiedGlobal
            ? { ...global, pagesRef: Array.from(pagesRef), symbols }
            : null;

        if (hasModifiedGlobal) {
            handleUpdateGlobalStyle(data).then(() => {
                this.setState({ hasModifiedGlobal: false });
            });
        }

        save(
            {
                pages,
                ...(data && { global: data }),
                setIsSaving: this.setIsSaving,
            },
            { isNotify }
        );
        this.saveSiteJSON();
        if (!this.state.hasInitialSaved) {
            this.saveInitSiteJSON();
        }
        this.setState({ switchedHome: false });
    };

    previewSite = () => {
        const { site, page } = this.props;
        const { appName } = this.context;
        const siteId = site.id;
        const pageId = page?.id;
        const prefix = window.location.pathname.startsWith('/v4') ? '/v4' : '';
        const staticPath = prefix + `/preview/site/${siteId}/page/${pageId}`;
        let cmsPath = prefix + `/dashboard/design/preview/${pageId}`;
        const itemId = this.state.selectedTopicItem;

        if (page?.pageType === PAGE_TYPE_ENUMS.TEMPLATE && itemId) {
            cmsPath = cmsPath.concat(`?itemId=${itemId}`);
        }

        if (!siteId) {
            window.alert('Please save changes to preview');
        } else {
            if (appName === appNameEnums.STATIC)
                return window.open(staticPath, '_blank');
            window.open(cmsPath, '_blank');
        }
    };

    handleExportJSON = () => {
        const { dispatch, siteId } = this.props;
        // dispatch(actions.exportJSON(siteId));
    };

    importJSON = ({ pages, global }) => {
        const { symbols: currentSymbols, global: currentGlobal } = this.state;
        const res = {
            symbols: (global ? global.symbols : currentSymbols) || {},
            global: global
                ? fontMigration(global)
                : fontMigration(currentGlobal),
        };

        this.setState(
            {
                pages,
                ...res,
                hasModifiedGlobal: true,
            },
            () => {
                const [firstPage] = pages;
                this.setEditPage(firstPage, 0);
            }
        );
    };
    handleAddOrUpdateSections = ({ section, index }) => {
        const { content, ...rest } = this.getEditPage().data;

        const pageContent = [...content];
        pageContent.splice(index, 1, section);
        const data = {
            data: { ...rest, content: pageContent },
        };

        this.setEditPage(data, this.state.editPageIndex);
    };
    setPageMeta = ({ pageMeta, globalData, autoSave = false }) => {
        const data = { content: [] };
        const { global } = this.state;
        if (pageMeta) {
            pageMeta.forEach((load) => this._saveOne(data, load));
            this.setEditPage({ data }, this.storeState);
        }

        this.setState(
            {
                hasModifiedGlobal: true,
                global: {
                    ...global,
                    ...globalData,
                },
            },
            this.storeState
        );
        if (autoSave) {
            this.backgroundSave();
        }
    };

    get getPreviewHeader() {
        const { global } = this.state;
        const pageData = this.getEditPage()?.data;
        if (!global) return null;
        const { settings: { typekitFonts = {} } = {} } = global;
        const fontFamilies = buildFontString(global);
        const globalCSS = globalStyles(global, pageData, 'BUILDER');
        return (
            <>
                {fontFamilies && (
                    <link
                        href={`https://fonts.googleapis.com/css?family=${fontFamilies}&display=swap`}
                        rel="stylesheet"
                    />
                )}
                <link rel="stylesheet" href="/css/main.css" />
                <style>{canvasCSS}</style>
                {typekitFonts?.typekitId ? (
                    <link
                        rel="stylesheet"
                        href={`https://use.typekit.net/${typekitFonts.typekitId}.css`}
                    />
                ) : null}

                {globalCSS ? <style>{globalCSS}</style> : null}
            </>
        );
    }

    handleDrawer = (drawer) => {
        const {
            editAddress,
            settingsModal,
            drawer: currentDrawer,
        } = this.state;
        const isNavTreeActive =
            editAddress &&
            settingsModal === 'COMPONENT_SETTINGS' &&
            drawer.drawerName === 'navigation';
        this.setState({
            drawer: { ...currentDrawer, ...drawer },
            editAddress: isNavTreeActive ? editAddress : null,
            addElType: '',
            settingsModal: isNavTreeActive ? settingsModal : null,
            sidebarVisible: false,
            activeSidebar: false,
        });
    };

    render() {
        const {
            elRef,
            symbols,
            history,
            addElType,
            editPageIndex,
            editAddress,
            previewMapper,
            settingsModal,
            currentEditItem,
            isLoadingBuilder,
            contextMenuPosition,
            settingsModalTriggerFrom,
        } = this.state;

        const editPage = this.getEditPage();
        const { siteId } = this.context;

        const { data } = editPage;
        const singleTemplatePageSlug =
            this.props.page?.pageType === 'TEMPLATE' &&
            this.context.templateItems?.singleItem.slug
                ? `${this.context.templateItems?.singleItem.slug}`
                : '';
        const isLoading = isLoadingBuilder || data?.isUninitialized;

        const getPageUrl = ({ origin }) => {
            if (!origin) return;
            let root = origin;
            if (!isDev) {
                root = /^https?:\/\//.test(origin)
                    ? origin
                    : `https://${origin}`;
            }

            if (window.location.pathname.startsWith('/v4')) {
                root += '/v4';
            }

            let slug = singleTemplatePageSlug
                ? `${editPage.slug}/${singleTemplatePageSlug}`
                : editPage.slug;
            return !slug || slug === 'index' ? `${root}` : `${root}/${slug}`;
        };

        const handlePublishedSitePreview = () => {
            const { permission, dorikAppURL } = this.context;
            const { pages, global, symbols } = this.state;

            return showPublishedSitePreview({
                permission,
                dorikAppURL,
                page: editPage.data,
                site: { siteId, pages, global: { ...global, symbols } },
            });
        };

        const redirect = (pageUrl) => {
            if (isDev && this.context.appName === appNameEnums.STATIC) {
                return handlePublishedSitePreview();
            }

            window.open(
                pageUrl.startsWith('http') ? pageUrl : `http://${pageUrl}`,
                '_blank'
            );
        };
        const pageTitle = data?.settings?.meta?.title;

        const { previous: hasPrev, next: hasNext } = getHistoryState({
            history,
            pageId: editPage.id,
            pageIndex: editPageIndex,
        });

        const EditorLayout = SettingModal;

        const addElementInfo = (() => {
            if (!editAddress || !addElType) return;

            const currentItem = this.getDataByAddress(editAddress);

            const lastDotIndex = editAddress.lastIndexOf('.');
            const parentAddress = editAddress.slice(0, lastDotIndex);

            const parentItem = this.getDataByAddress(parentAddress);

            let parentType = parentItem?.type;
            let type = currentItem?.type || addElType.toLowerCase();

            if (addElType === 'ROW' && parentItem.type === 'section') {
                type = 'containers';
            }

            return {
                type,
                editAddress,
                parentType,
            };
        })();

        return (
            <>
                <Helmet>
                    <title>{pageTitle || 'Untitled'} | Dorik Builder</title>
                </Helmet>
                    <ElementContextProvider
                        value={{
                            ...this.elementContextMethods,
                            ...this.stateToContext,
                            hasPrev,
                            hasNext,
                            symbols,
                            previewMapper,
                            settingsModal,
                            settingsModalTriggerFrom,
                            pageSettings: data?.settings ?? {},
                            currentPageInfo: editPage,
                            handleDrawer: this.handleDrawer,
                            handlePageVisibility: this.handlePageVisibility,
                            previewSite: this.previewSite,
                            handleSaveData: this.handleSaveData,
                            handleClickOnPublish: this.handleClickOnPublish,
                            handleShowPublishPopOver:
                                this.handleShowPublishPopOver,
                            selectHomePage: this.selectHomePage,
                            hideAddModal: this.hideAddModal,
                            onRemovePage: this.removeEditPage,
                            onAddNewPage: this.addToEditPages,
                            duplicatePage: this.duplicatePage,
                            onSelectPage: this.handleSelectPage,
                            setPages: this.setPages,
                            onEditPage: this.setEditPage,
                        }}
                    >
                        <EditorContextProvider value={this.stateToContext}>
                            <StreamingOverlay />
                            <DndProvider backend={HTML5Backend}>
                                <Layout style={{ minHeight: '100vh' }}>
                                    <SideBar
                                        renderLogo={this.props.renderLogo}
                                    />
                                    <Layout>
                                        <BuilderHeaderStc>
                                            <BuilderHeader
                                                builderProps={this.props}
                                                handleGotoPublishEnd={(
                                                    pageUrl
                                                ) => {
                                                    redirect(pageUrl);
                                                }}
                                                getPageUrl={getPageUrl}
                                            />
                                        </BuilderHeaderStc>
                                        <Layout.Content
                                            style={{
                                                overflow: 'hidden',
                                                position: 'relative',
                                                padding: '6px 6px 0px',
                                            }}
                                        >
                                            <Drawer
                                                {...this.state.drawer}
                                                editAddress={
                                                    this.state.editAddress
                                                }
                                                pages={this.state.pages}
                                            />
                                            {isLoading ? (
                                                <div
                                                    style={{
                                                        inset: 0,
                                                        opacity: 0.5,
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        size="3x"
                                                        spin
                                                        icon={[
                                                            'fal',
                                                            'spinner',
                                                        ]}
                                                    />
                                                </div>
                                            ) : null}
                                            <Frame
                                                id="dorik-builder-iframe"
                                                style={{
                                                    ...this.getFrameStyle,
                                                    transition: 'opacity 0.3s',
                                                    opacity: isLoading ? 0 : 1,
                                                }}
                                                head={this.getPreviewHeader}
                                            >
                                                {isLoading ? null : (
                                                    <FrameBindingContext>
                                                        <CanvasWrapper
                                                            {...this.canvasCtx}
                                                        >
                                                            <RecursiveRender
                                                                type="page"
                                                                page={
                                                                    this.props
                                                                        .page
                                                                }
                                                                content={
                                                                    data?.content
                                                                }
                                                                onDragItem={
                                                                    this
                                                                        .onDragItem
                                                                }
                                                                siteId={siteId}
                                                            />
                                                        </CanvasWrapper>
                                                    </FrameBindingContext>
                                                )}
                                            </Frame>
                                            {addElementInfo && (
                                                <AddElement
                                                    {...addElementInfo}
                                                    onClose={this.hideAddModal}
                                                />
                                            )}

                                            {settingsModal ===
                                                'COMPONENT_SETTINGS' && (
                                                <EditorLayout
                                                    settings={elementSettings}
                                                    close={
                                                        this.hideSettingsModal
                                                    }
                                                    currentEditItem={
                                                        currentEditItem
                                                    }
                                                    title={`${currentEditItem?.name}`}
                                                    editElType={
                                                        currentEditItem?.type
                                                    }
                                                    onSaveSettings={
                                                        this.handleSaveSettings
                                                    }
                                                    isRenameable={true}
                                                />
                                            )}

                                            {settingsModal ===
                                                'GLOBAL-SETTINGS' && (
                                                <EditorLayout
                                                    settings={globalSettings}
                                                    close={
                                                        this.hideSettingsModal
                                                    }
                                                    title={`Global Styles`}
                                                    onSaveSettings={
                                                        this.handleGlobalChanges
                                                    }
                                                />
                                            )}

                                            {settingsModal ===
                                                'PAGE-SETTINGS' && (
                                                <EditorLayout
                                                    settings={configIntegration}
                                                    close={
                                                        this.hideSettingsModal
                                                    }
                                                    title="Page &amp; Settings"
                                                    onSaveSettings={
                                                        this.handleSaveSettings
                                                    }
                                                />
                                            )}

                                            {settingsModal ===
                                                'SITE-SETTINGS' && (
                                                <EditorLayout
                                                    settings={siteSettings}
                                                    close={
                                                        this.hideSettingsModal
                                                    }
                                                    title="Site Settings &amp; Integrations"
                                                    onSaveSettings={
                                                        this.handleGlobalChanges
                                                    }
                                                />
                                            )}
                                            {settingsModal ===
                                                'SHORTCUT-LIST' && (
                                                <ShortcutList
                                                    close={
                                                        this.hideSettingsModal
                                                    }
                                                />
                                            )}

                                            <Overlay />

                                            <ElementContextMenu
                                                position={contextMenuPosition}
                                                hideContextMenu={
                                                    this
                                                        .hideElementRightClickMenu
                                                }
                                                contextMenuVisibile={
                                                    settingsModal ===
                                                    'CONTEXT_MENU'
                                                }
                                            />
                                        </Layout.Content>
                                    </Layout>
                                </Layout>
                            </DndProvider>
                        </EditorContextProvider>

                        <SaveElementModal
                            elRef={elRef}
                            data={currentEditItem}
                            onClose={this.hideSettingsModal}
                            visible={settingsModal === SAVE_TO_COLLECTION}
                        />
                    </ElementContextProvider>
                <BuilderStyles />
                <KeyBinding />
            </>
        );
    }
}

Builder.propTypes = {
    site: PropTypes.any,
    page: PropTypes.any,
};

export default Builder;
