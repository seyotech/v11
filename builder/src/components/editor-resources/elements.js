import { plans } from '@dorik/utils';
export const names = Object.keys(plans.planEnum.plan);

const notFree = names.filter((n) => n !== 'FREE');
const onlyPremium = names.filter((n) => n !== 'FREE' && n !== 'PLAN_1');

const emptyRowCol = {
    component: 'EmptyRowCol',
};
const emptyCMSRowCol = {
    component: 'EmptyCmsRowCol',
};

const providedSections = {
    hasDropdown: true,
    component: 'LibraryView',
    select: 'providedSections',
    title: 'Pre Designed Sections',
    request: (getElements) => getElements('SECTION'),
};

const savedSections = {
    select: 'savedSections',
    component: 'LibraryView',
    title: 'Your Saved Sections',
    request: (getElements) => getElements('SECTION'),
};

const savedRow = {
    component: 'LibraryView',
    title: 'Your Saved Rows',
    select: 'savedRows',
    request: (getElements) => getElements('ROW'),
};

const savedColumns = {
    select: 'savedColumns',
    component: 'LibraryView',
    title: 'Your Saved Columns',
    request: (getElements) => getElements('COLUMN'),
};

const providedColumns = {
    hasDropdown: true,
    select: 'providedColumns',
    component: 'LibraryView',
    title: 'Pre Designed Columns',
    request: (getElements) => getElements('COLUMN'),
};

const SECTION = [
    {
        renderType: 'SECTION',
        title: 'Section Library',
        icon: ['far', 'layer-group'],
        body: [{ ...providedSections }],
    },
    {
        icon: ['far', 'bars'],
        title: 'Custom Section',
        renderType: 'SECTION/ACCORDION',
        body: [
            {
                ...emptyRowCol,
                title: 'Section with Regular Columns',
            },
            { component: 'EmptyContainer', title: 'Containers' },
        ],
    },
    {
        icon: ['far', 'hdd'],
        title: 'Saved Sections',
        renderType: 'SECTION',
        body: [{ ...savedSections }],
    },
];

const ROW = [
    {
        icon: ['far', 'bars'],
        title: 'Custom Row',
        renderType: 'SECTION',
        body: [
            { ...emptyRowCol, title: 'Row with Regular Columns' },
            { ...emptyCMSRowCol, title: 'CMS Row with Columns' },
        ],
    },
    {
        title: 'Saved Rows',
        icon: ['far', 'hdd'],
        renderType: 'SECTION',
        body: [{ ...savedRow }],
    },
];

const COLUMN = [
    {
        icon: ['far', 'bars'],
        title: 'Custom Column',
        renderType: 'SECTION',
        body: [{ ...emptyRowCol, title: 'Regular Columns' }],
    },
    {
        title: 'Saved Column',
        icon: ['far', 'hdd'],
        renderType: 'SECTION',
        body: [{ ...savedColumns }],
    },
];

const CONTAINER = [
    {
        icon: ['far', 'bars'],
        title: 'Custom Container',
        renderType: 'SECTION',
        body: [{ component: 'EmptyContainer', title: 'Containers' }],
    },
    {
        title: 'Container Symbols',
        icon: ['far', 'hdd'],
        renderType: 'SECTION',
        body: [],
    },
    {
        title: 'Saved Container',
        icon: ['far', 'hdd'],
        renderType: 'SECTION',
        body: [],
    },
];

const ELEMENTS = {};
ELEMENTS.button = {
    icon: ['fad', 'bullseye-pointer'],
    title: 'Regular Button',
    data: {
        type: 'button',
        name: 'Button',
        _elType: 'ELEMENT',
        content: 'Button Text',
        settings: {
            buttonType: 'icon-text',
        },
        pseudoClass: {
            hover: {
                style: {
                    color: '#FFFFFF',
                },
            },
        },
        style: {
            padding: [
                ['top', '20px'],
                ['bottom', '20px'],
                ['left', '20px'],
                ['right', '20px'],
            ],
            textDecoration: {
                type: 'none',
            },
            justifyContent: 'center',
            borderRadius: '5px 5px 5px 5px',
            border: [
                ['width', '0px'],
                ['style', ''],
                ['color', ''],
            ],
            backgroundColor: '#4450E7',
            fontSize: '18px',
            color: '#FFFFFF',
            lineHeight: '18px',
        },
        component_path: 'button',
    },
};
ELEMENTS.saved = {
    select: 'savedElements',
    component: 'LibraryView',
    title: 'Your Saved Elements',
    request: (getElements) => getElements('ELEMENT'),
};

const modalLibrary = {
    SECTION,
    ROW,
    CMSROW: ROW,
    COLUMN,
    CONTAINER,
    CONTAINERS: CONTAINER,
    ELEMENT: [
        {
            icon: ['far', 'bars'],
            renderType: 'SECTION',
            title: 'Default Elements',
            body: [
                {
                    type: 'regular',
                    title: 'General Elements',
                    component: 'DefaultElement',
                    elements: [
                        ELEMENTS.button,
                    ],
                },
            ],
        },
        {
            icon: ['far', 'hdd'],
            renderType: 'SECTION',
            title: 'Saved Elements',
            body: [ELEMENTS.saved],
        },
    ],
};

export default modalLibrary;
