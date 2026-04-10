import { Space } from 'antd';
import { BuilderContext } from 'contexts/BuilderContext';
import { EditorContext, ElementContext } from 'contexts/ElementRenderContext';
import { SelectInput } from 'modules/setting-components/Select';
import { FeatureLock } from 'modules/FeatureLock';
import { useContext } from 'react';

const VisibilityType = ({ isPasswordEnable, ...restProps }) => {
    const { useLimit } = useContext(BuilderContext);
    const { hasFeaturePermission } = useLimit();
    const isPasswordProtectionLocked = !hasFeaturePermission({
        excludePlans: ['FREE', 'PERSONAL'],
    });
    const pageAccessOptions = [
        {
            label: 'Public',
            value: 'PUBLIC',
        },
        {
            label: 'Members Only',
            value: 'FREE',
        },
        {
            label: 'Paid Members Only',
            value: 'PAID',
        },
        {
            label: 'Enable Password Protection',
            value: true,
            disabled: isPasswordProtectionLocked,
        },
    ];
    const { handlePageVisibility } = useContext(ElementContext);
    const { editPageIndex, setEditPage } = useContext(EditorContext);
    const [visibilityType, setPageVisibility] = handlePageVisibility();

    const changePasswordToggle = (value) => {
        setEditPage(
            {
                isPasswordEnable: value,
            },
            editPageIndex
        );
    };

    const handlePageAccess = ({ value }) => {
        if (['PUBLIC', 'FREE', 'PAID'].includes(value)) {
            setPageVisibility(value);
            changePasswordToggle(false);
        } else {
            if (isPasswordProtectionLocked) {
                return;
            }
            changePasswordToggle(true);
            setPageVisibility('PUBLIC');
        }
    };

    return (
        <SelectInput
            {...restProps}
            options={pageAccessOptions}
            onChange={handlePageAccess}
            value={isPasswordEnable || visibilityType}
            optionRender={(option) => {
                if (option.data.key === 3) {
                    return (
                        <Space>
                            {option.data.label}
                            {isPasswordProtectionLocked && (
                                <FeatureLock
                                    isLocked={true}
                                    style={{ right: 'unset' }}
                                />
                            )}
                        </Space>
                    );
                }
                return option.data.label;
            }}
        />
    );
};

export default VisibilityType;
