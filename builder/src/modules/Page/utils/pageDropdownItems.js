import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Space, Switch, Tooltip } from 'antd';

export const pageDropdownItems = ({ style, handlers, options, t }) => {
    const items = [
        {
            style,
            label: t('Add Nested Page'),
            key: 'addPage',
            icon: icon({ name: 'file-plus', style: 'regular' }),
        },
        {
            key: 'divider1',
            type: 'divider',
        },
        {
            style,
            key: 'pageNameSlug',
            label: t('Update Slug & Name'),
            icon: icon({ name: 'link', style: 'regular' }),
        },
        {
            style,
            label: t('Duplicate Page'),
            key: 'duplicate',
            icon: icon({ name: 'copy', style: 'regular' }),
        },
        {
            style,
            key: 'setAsHomepage',
            label: t('Set As Homepage'),
            icon: icon({ name: 'house', style: 'regular' }),
        },

        {
            key: 'divider2',
            type: 'divider',
        },
        ...(options.appName === 'CMS' && !options.isHomePage
            ? [
                  {
                      label: t('Publish Status'),
                      key: 'publishStatus',
                      type: 'group',
                      children: [
                          {
                              label: (
                                  <>
                                      <Switch
                                          size="small"
                                          style={{ marginRight: '8px' }}
                                          checked={options.isPublished}
                                          onChange={(checked) => {
                                              const statusHandler =
                                                  handlers['publishStatus'];
                                              statusHandler &&
                                                  statusHandler({
                                                      page: options.currentPageData,
                                                      changedStatus: checked
                                                          ? 'PUBLISHED'
                                                          : 'DRAFT',
                                                  });
                                          }}
                                      />
                                      <span
                                          style={{
                                              fontSize: '14px',
                                              lineHeight: '22px',
                                          }}
                                      >
                                          {t('Published')}
                                      </span>
                                  </>
                              ),
                              key: 'published',
                              style: {
                                  ...style,
                                  margin: '0 -8px',
                              },
                          },
                      ],
                  },
                  {
                      key: 'divider3',
                      type: 'divider',
                  },
              ]
            : []),

        {
            style,
            label: t('Delete Page'),
            key: 'deletePage',
            danger: true,
            icon: icon({ name: 'trash', style: 'regular' }),
        },
    ];
    return generateItems(items, handlers, options, t);
};

/**
 * @param {Array} items - The array of items to be transformed.
 * @returns {Array} - The transformed array of items.
 */
export const generateItems = (items, handlers, options, t) => {
    const {
        isEditPage,
        isDraftCmsPage,
        currentPageData,
        hasChildPages,
        isHomePage,
    } = options;

    return items.map(({ icon, label, danger, ...rest }) => {
        const disabled =
            {
                pageSettings: !isEditPage,
                setAsHomepage: isDraftCmsPage || hasChildPages || isHomePage,
                addPage: isHomePage,
                pageNameSlug: isHomePage,
                deletePage: isHomePage || hasChildPages,
            }[rest.key] || false;

        const toolTipText = {
            pageSettings: t('Must be current page'),
            setAsHomepage:
                disabled &&
                (hasChildPages
                    ? t('Must not have any child pages')
                    : isHomePage
                    ? t('Already a Home page')
                    : t(
                          'Publish Status of the Page should be checked before making it as a HomePage'
                      )),
            addPage: t('Home page can not have a child page'),
            pageNameSlug: t('Name and slug can not be changed for Home page'),
            deletePage:
                disabled &&
                (hasChildPages
                    ? t('Must not have any child pages')
                    : t('Home page can not be deleted')),
        }[rest.key];

        const actionHandler = ({ domEvent: event }) => {
            event.stopPropagation();
            if (disabled) return;
            const handler = handlers[rest.key];
            handler &&
                handler({
                    page: currentPageData,
                });
        };

        return {
            label: label && (
                <Tooltip
                    title={toolTipText}
                    trigger={disabled ? 'hover' : null}
                    placement="right"
                >
                    <Space size={8} data-testid="menuItem">
                        <FontAwesomeIcon
                            data-testid={rest.key}
                            icon={icon}
                            style={{ height: 16, width: 16 }}
                        />

                        <span
                            style={{
                                fontSize: '14px',
                                lineHeight: '22px',
                            }}
                        >
                            {label}
                        </span>
                    </Space>
                </Tooltip>
            ),
            onClick: actionHandler,
            disabled,
            danger: !disabled ? !!danger : false,
            ...rest,
        };
    });
};
