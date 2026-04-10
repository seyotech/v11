import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';

const generalElements = [
    {
        icon: icon({ name: 'bullseye-pointer', style: 'thin' }),
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
    }
];

export default generalElements;
