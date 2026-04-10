import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'antd';
import useGlobals from 'hooks/useGlobals';
import { GroupContainer } from 'modules/Shared/GroupContainer';
import { ColorItem } from 'modules/Shared/settings-components/GlobalColor';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function GlobalSavedColors() {
    const { colors = [], setColors } = useGlobals();
    const { t } = useTranslation('builder');

    const handleChange = useCallback(
        ({ name: index, value }) => {
            const modified = [...colors];
            const item = { ...modified[index], value };

            if (undefined === value) {
                modified.splice(index, 1);
            } else {
                modified.splice(index, 1, item);
            }

            setColors(modified);
        },
        [colors, setColors]
    );

    const handleLabelChange = ({ name: index, value }) => {
        const modified = [...colors];
        const item = { ...modified[index], label: value };
        modified.splice(index, 1, item);
        setColors(modified);
    };

    const handleDelete = (name) => {
        handleChange({
            name,
        });
    };

    const getItemNum = useCallback((item) => {
        if (!item) return 0;
        const strs = item?.key.split('-').slice(-1);
        return strs ? Number(strs[0]) : 0;
    }, []);

    const addNewColor = useCallback(() => {
        const modified = colors ? [...colors] : [];
        const [lastItem] = modified.slice(-1);
        const num = getItemNum(lastItem);
        modified.push({ value: '#FFFFFF', key: `--color-${num + 1}` });
        setColors(modified);
    }, [colors, getItemNum, setColors]);

    useEffect(() => {
        const hasString = colors.some((color) => typeof color === 'string');
        if (hasString) {
            const keyValColors = colors.map((value, idx) => {
                if (typeof value !== 'string') return value;
                return {
                    value,
                    key: `--color-${idx + 1}`,
                };
            });
            setColors(keyValColors);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <GroupContainer className="divider">
                {colors.filter(Boolean).map((color, index) => (
                    <ColorItem
                        key={color.key}
                        type="color"
                        item={color}
                        label={
                            color.label ||
                            color.key?.replace(/--color-(\d+)/, 'Color $1')
                        }
                        name={index}
                        handleChange={handleChange}
                        handleLabelChange={handleLabelChange}
                        handleDelete={handleDelete}
                    />
                ))}
            </GroupContainer>

            <Button
                block
                size="small"
                type="dashed"
                style={{ borderRadius: '6px', color: '#0C0A25' }}
                onClick={addNewColor}
                icon={
                    <FontAwesomeIcon
                        style={{ color: '#45426E' }}
                        icon={icon({ name: 'circle-plus', style: 'solid' })}
                    />
                }
            >
                {t('Add Solid Color')}
            </Button>
        </>
    );
}

export default GlobalSavedColors;
