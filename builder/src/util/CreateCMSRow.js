import uniqId from './uniqId';

export default class CreateCMSRow {
    constructor(name = 'CMS Row') {
        return {
            name,
            type: 'cmsRow',
            content: [],
            id: uniqId(),
            _elType: 'CMSROW',
            component_path: 'cmsRow',
            style: {},
            configuration: {},
            filter: {
                type: 'AND',
            },
            paginationSetting: {
                type: 'loadMore',
                buttonText: {
                    nextText: 'Next',
                    prevText: 'Prev',
                    loadText: 'Load More',
                },
                icon: {
                    nextIcon: {
                        icon: {
                            prefix: 'fas',
                            type: 'font-awesome',
                            iconName: 'arrow-right',
                        },
                    },
                    prevIcon: {
                        icon: {
                            prefix: 'fas',
                            type: 'font-awesome',
                            iconName: 'arrow-left',
                        },
                    },
                },
                itemPerPage: 4,
            },
            paginationStyle: {
                style: {
                    _border: '1px solid #34ABFD',
                    borderRadius: '5px 5px 5px 5px',
                    margin: [
                        ['left', '15px'],
                        ['right', '15px'],
                    ],
                    padding: [
                        ['top', '6px'],
                        ['bottom', '6px'],
                        ['left', '18px'],
                        ['right', '18px'],
                    ],
                    color: '#FFFFFF',
                    backgroundColor: '#34ABFD',
                },
                wrapperStyle: {
                    width: '100%',
                    display: 'flex',
                    padding: [
                        ['left', '15px'],
                        ['right', '15px'],
                    ],
                    justifyContent: 'center',
                },
            },
        };
    }
}
