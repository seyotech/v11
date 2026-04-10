/* eslint-disable prettier/prettier */
/*****************************************************
 * Packages
 ******************************************************/
import styled from 'styled-components';
import kebabcase from 'lodash.kebabcase';
import { memo, useMemo, useState, useCallback, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Input as AntInput, Tooltip } from 'antd';
const { Search } = AntInput;
import debounce from 'lodash.debounce';

/*****************************************************
 * Components
 ******************************************************/
import Button from './components/other-components/Button';
import { PageCreateOrUpdate } from './components/other-components/Forms';
import { Button as AntButton, message } from 'antd';
import { PagesWrap, Icon, Label, PageBody } from './Pages.sc';
import Accordion, {
    AccordionItem,
    AccordionDetails,
    AccordionSummary,
} from './components/other-components/Accordion';
import usePage from './hooks/usePage';
import { pageCompose } from './util/compose';
import { BuilderContext } from './contexts/BuilderContext';

/*****************************************************
 * Pages Component
 ******************************************************/

function disabledStyle({ disabled }) {
    if (!disabled) return;
    return {
        color: 'rgba(0, 0, 0, 0.25)',
        background: '#f5f5f5',
        cursor: 'not-allowed !important',
    };
}

const HomeIcon = styled(Icon)`
    ${disabledStyle}
`;

function Pages({
    pages,
    homepageId,
    onEditPage,
    onRemovePage,
    onAddNewPage,
    onSelectPage,
    duplicatePage,
    selectHomePage,
    editPageIndex,
}) {
    const { appName } = useContext(BuilderContext);
    const location = {}; //useLocation();
    const [search, setSearch] = useState('');
    const [isNew, setNew] = useState(false);
    const [isSwitchHome, setSwitchHome] = useState(false);
    const { selectPage, removePage, save, isSaving } = usePage();

    const regularPages = pageCompose(pages, 'REGULAR', search);
    const filteredTemplates = useMemo(() => {
        const templates = pageCompose(pages, 'TEMPLATE', search);
        // return ['POST', 'CATEGORY', 'TAG'].map((item) =>
        //     templates.find((temp) => temp.ref === item)
        // );
        return templates;
    }, [pages, search]);

    const handleOnExpend = useCallback(
        (e, { index }) => {
            const page = regularPages[index];
            if (!page.isModified) {
                if (page.id) {
                    selectPage(page, page.pageIndex);
                }
            }
        },
        [pages]
    );

    const handleNameChange = (value, index) => {
        const slug = kebabcase(value);
        const page = pages[index];
        const nextPage = {
            ...page,
            name: value,
            slug: isNew ? slug : page.slug,
        };
        onEditPage(nextPage, index);
    };

    const handlePageChanges = useCallback(
        (key, changeValue, index) => {
            const page = pages[index];
            const data = { ...page, [key]: changeValue };
            onEditPage(data, index);
        },
        [onEditPage, pages]
    );

    const handleOnBlur = useCallback((index) => {
        setNew(false);
    }, []);

    const handleRemovePage = useCallback(
        async (index) => {
            const page = pages[index];

            if (homepageId === page.id)
                return message.error(
                    'You can not remove this page before saving'
                );
            if (page.id) {
                const ok = window.confirm(
                    'Are you sure you want to remove the page?'
                );
                if (!ok) return;
                removePage({
                    id: page.id,
                    index,
                    editPageIndex,
                });
            } else {
                onRemovePage(index);
            }
        },
        [editPageIndex, onRemovePage, pages, homepageId]
    );

    const handleAddClick = useCallback(() => {
        setNew(true);
        onAddNewPage({
            slug: '',
            name: 'New Page',
            pageType: 'REGULAR',
            ...(appName === 'CMS' && {
                isPasswordEnable: false,
                status: 'PUBLISHED',
            }),
        });
    }, [onAddNewPage]);

    const handleClickPage = useCallback(
        (index) => {
            if (isSwitchHome) {
                return alert(
                    'Navigating between pages has been disabled! Please refresh or save changes to continue'
                );
            }
            const page = pages[index];
            if (page.id) {
                selectPage(page, index);
            }

            onSelectPage(index);
            // const siteUrl = siteId
            //     ? `/builder/site/${siteId}/page`
            //     : '/builder' + location.search;
            // const pageUrl =
            //     siteId && page.id ? `${siteUrl}/${page.id}` : siteUrl;
            // history.push(pageUrl, 'PAGE_CHANGED');
        },
        [location.search, onSelectPage, pages]
    );

    const createOrUpdatePage = useCallback(
        (index) => {
            let page = { ...pages[index] };
            const isModified = page.isModified;
            delete page.type;
            delete page.isModified;
            page = {
                ...page,

                data:
                    isModified && page.data
                        ? JSON.stringify(page.data)
                        : undefined,
            };

            save({ pages: [page] }, { isNotify: true, isPageSave: true });

            // dispatch(actions.createOrUpdatePage({ page, siteId, history })); // redux action
        },
        [pages]
    );

    const isCMS = appName === 'CMS';

    const handleHomepage = (page) => {
        if (isCMS && page.status !== 'PUBLISHED') return;
        setSwitchHome(true);
        selectHomePage(page);
    };

    const isHomepage = (page = {}) => {
        return page.type === 'INDEX' || page.pageType === 'HOMEPAGE';
    };

    const handleDebounce = useCallback(
        debounce((e) => setSearch(e.target.value), 700),
        []
    );

    return (
        <PagesWrap>
            <PageBody>
                <h4
                    style={{
                        marginBottom: '10px',
                        fontWeight: 'bold',
                    }}
                >
                    Search Page
                </h4>
                <Search
                    placeholder="input search text"
                    enterButton
                    onChange={handleDebounce}
                    size="sm"
                    style={{
                        marginBottom: '30px',
                    }}
                />
            </PageBody>
            <h4 style={{ fontWeight: 'bold' }}>Regular Pages</h4>
            {!regularPages.length && (
                <p
                    style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        marginTop: '5px',
                    }}
                >
                    Oops,{' '}
                    <strong>
                        <em>{search}</em>
                    </strong>{' '}
                    page not found!
                </p>
            )}
            <Accordion
                size="sm"
                type="box"
                toggleable
                onlyIconToggle
                onExpend={handleOnExpend}
                expendedIcon="chevron-up"
                collapsedIcon="chevron-down"
            >
                {regularPages.map((page) => (
                    <AccordionItem key={page.id}>
                        <AccordionSummary homepage={isHomepage(page)}>
                            <Tooltip
                                title={page.name.length > 10 ? page.name : ''}
                            >
                                <Label
                                    active={page.pageIndex === editPageIndex}
                                    onClick={() =>
                                        handleClickPage(page.pageIndex)
                                    }
                                >
                                    {page.name}
                                </Label>
                            </Tooltip>
                            <Icon
                                className="icon"
                                onClick={() => duplicatePage(page.pageIndex)}
                            >
                                <FontAwesomeIcon icon={['far', 'clone']} />
                            </Icon>
                            <Tooltip
                                title={
                                    isCMS && page.status !== 'PUBLISHED'
                                        ? 'Publish Status of the Page should be checked before making it as a HomePage.'
                                        : null
                                }
                            >
                                <HomeIcon
                                    className="icon"
                                    disabled={
                                        isCMS && page.status !== 'PUBLISHED'
                                    }
                                    onClick={() => handleHomepage(page)}
                                >
                                    <FontAwesomeIcon
                                        icon={[
                                            isHomepage(page) ? 'fas' : 'far',
                                            'home',
                                        ]}
                                    />
                                </HomeIcon>
                            </Tooltip>
                            {/* condition changed from page.type==='INDEX' */}
                            {isHomepage(page) ? null : (
                                <Icon
                                    className="icon"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        handleRemovePage(page.pageIndex);
                                    }}
                                >
                                    <FontAwesomeIcon
                                        icon={['far', 'trash-alt']}
                                    />
                                </Icon>
                            )}
                        </AccordionSummary>
                        <AccordionDetails homepage={isHomepage(page)}>
                            <PageBody>
                                {/* condition changed from page.type==='INDEX' */}
                                {!isHomepage(page) && (
                                    <>
                                        <PageCreateOrUpdate
                                            page={page}
                                            appName={appName}
                                            disabled={isHomepage(page)}
                                            handleOnBlur={handleOnBlur}
                                            isSwitchHome={isSwitchHome}
                                            handleNameChange={handleNameChange}
                                            createOrUpdatePage={
                                                createOrUpdatePage
                                            }
                                            handlePageChanges={
                                                handlePageChanges
                                            }
                                        />
                                    </>
                                )}
                            </PageBody>
                        </AccordionDetails>
                    </AccordionItem>
                ))}
            </Accordion>

            <div style={{ marginTop: 15, marginBottom: 30 }}>
                <Button
                    size="sm"
                    width="100%"
                    border="dotted"
                    onClick={handleAddClick}
                    disabled={search.length}
                >
                    + Add New Page
                </Button>
            </div>
            {pageCompose(pages, 'TEMPLATE').length ? (
                <>
                    <h4 style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                        Template Pages
                    </h4>
                    {!filteredTemplates.length && (
                        <p
                            style={{
                                fontSize: '14px',
                                fontWeight: 500,
                                marginTop: '5px',
                            }}
                        >
                            Oops,{' '}
                            <strong>
                                <em>{search}</em>
                            </strong>{' '}
                            page not found!
                        </p>
                    )}
                    {filteredTemplates.map((page) => (
                        <AntButton
                            key={page.id}
                            block
                            style={{ marginBottom: '5px', textAlign: 'left' }}
                            type={
                                page.pageIndex === editPageIndex
                                    ? 'primary'
                                    : 'default'
                            }
                            onClick={() => handleClickPage(page.pageIndex)}
                        >
                            {page.name}
                        </AntButton>
                    ))}
                </>
            ) : null}
            <UtilPages
                pages={pages}
                editPageIndex={editPageIndex}
                handleClickPage={handleClickPage}
            />
        </PagesWrap>
    );
}

const UtilPages = ({ pages, editPageIndex, handleClickPage }) => {
    // const searchUtilPages = useFeatureFlag(featureFlagEnums.SEARCH);

    const utilPages = pageCompose(pages, 'UTIL').filter((page) => {
        // if (page.ref === 'SEARCH' && !searchUtilPages) return false;
        if (page.ref === 'SEARCH') return false;
        return true;
    });

    return utilPages.length ? (
        <>
            <strong style={{ display: 'block', margin: '20px 0 10px' }}>
                Utility Pages
            </strong>
            {utilPages.map((page) => (
                <AntButton
                    key={page.id}
                    block
                    style={{ marginBottom: '5px', textAlign: 'left' }}
                    type={
                        page.pageIndex === editPageIndex ? 'primary' : 'default'
                    }
                    onClick={() => handleClickPage(page.pageIndex)}
                >
                    {page.name}
                </AntButton>
            ))}
        </>
    ) : null;
};

export default memo(Pages);
