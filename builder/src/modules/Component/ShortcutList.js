import { Modal, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

function ShortcutList({ close }) {
    const { t } = useTranslation('builder');

    const Keywords = {
        SAVE: () => (
            <div data-testid="save-shortcut">
                <code>Cmd</code> or <code>Ctrl</code> + <code>S</code>
            </div>
        ),
        PUBLISH: () => (
            <div data-testid="publish-shortcut">
                <code>Cmd</code> or <code>Ctrl</code> + <code>Shift</code> +{' '}
                <code>P</code>
            </div>
        ),
        UNDO: () => (
            <div data-testid="undo-shortcut">
                <code>Cmd</code> or <code>Ctrl</code> + <code>Z</code>
            </div>
        ),
        REDO: () => (
            <div data-testid="redo-shortcut">
                <code>Cmd</code> or <code>Ctrl</code> + <code>Shift</code> +{' '}
                <code>Z</code>
            </div>
        ),
        SHOW: () => (
            <div data-testid="help-shortcut">
                <code>Cmd</code> or <code>Ctrl</code> + <code>Shift</code> +{' '}
                <code>/</code>
            </div>
        ),
    };

    const data = [
        {
            description: t('Save Current Page'),
            eventName: 'SAVE',
        },
        {
            description: t('Publish Site'),
            eventName: 'PUBLISH',
        },
        {
            description: t('Undo Current Changes'),
            eventName: 'UNDO',
        },
        {
            description: t('Redo Previous Changes'),
            eventName: 'REDO',
        },
        {
            description: t('Shortcut Help'),
            eventName: 'SHOW',
        },
    ];

    const columns = [
        {
            title: 'Keyword',
            width: '45%',
            dataIndex: 'eventName',
            render: (eventName) => {
                const Comp = Keywords[eventName];

                if (!Comp) return null;
                return (
                    <Wrap>
                        <Comp />
                    </Wrap>
                );
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
    ];
    return (
        <Modal
            title={t('Keyboard Shortcuts')}
            open={true}
            footer={null}
            onCancel={close}
        >
            <Table
                size="small"
                columns={columns}
                dataSource={data}
                pagination={false}
            />
        </Modal>
    );
}

const Wrap = styled.div`
    code {
        color: #fff;
        padding: 1px 4px;
        border-radius: 3px;
        background-color: rgb(118 119 123);
    }
`;
export default ShortcutList;
