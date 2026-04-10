import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const emptyRowCol = {
    component: 'EmptyRowCol',
};

const structureElements = [
    {
        icon: icon({ name: 'layer-group', style: 'thin' }),
        lagacy: true,
        title: 'Section',
        type: 'section',
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
        icon: icon({ name: 'table-rows', style: 'thin' }),
        lagacy: true,
        title: 'Row',
        type: 'row',
        renderType: 'SECTION',
        body: [
            { ...emptyRowCol, title: 'Row with Regular Columns' },
        ],
    },
    {
        icon: icon({ name: 'columns-3', style: 'thin' }),
        lagacy: true,
        title: 'Column',
        type: 'column',
        renderType: 'SECTION',
        body: [{ ...emptyRowCol, title: 'Regular Columns' }],
    },
    {
        icon: icon({ name: 'box', style: 'thin' }),
        title: 'Container',
        type: 'container',
        renderType: 'SECTION',
        body: [{ component: 'EmptyContainer', title: 'Containers' }],
    },
];

export default structureElements;
