import { useCallback, useEffect } from 'react';
import useGlobals from '../../hooks/useGlobals';
import Button from '../other-components/Button';
import ColorPicker from './ColorPicker/ColorPicker';

function GlobalSavedColors(props) {
    const { colors = [], setColors } = useGlobals();

    const handleChange = useCallback(
        ({ name: index, value }) => {
            const modified = [...colors];
            const item = { ...modified[index], value };
            value ? modified.splice(index, 1, item) : modified.splice(index, 1);
            setColors(modified);
        },
        [colors, setColors]
    );

    const getItemNum = useCallback((item) => {
        if (!item) return 0;
        const strs = item?.key.split('-').slice(-1);
        return strs ? Number(strs[0]) : 0;
    }, []);

    const addNewColor = useCallback(() => {
        const modified = colors ? [...colors] : [];
        const [lastItem] = modified.slice(-1);
        const num = getItemNum(lastItem);
        modified.push({ value: '', key: `--color-${num + 1}` });
        setColors(modified);
    }, [colors, getItemNum, setColors]);

    useEffect(() => {
        const hasString = colors.some((color) => typeof color === 'string');
        if (hasString) {
            const keyValColors = colors.map((value, idx) => {
                if (typeof value !== 'string') return value;
                return {
                    value,
                    key: `--color-${idx}`,
                };
            });
            setColors(keyValColors);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {colors
                .filter((v) => v)
                .map((color, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                        <ColorPicker
                            name={i}
                            clear={false}
                            remove={true}
                            colorVars={false}
                            value={color.value}
                            label={
                                color.label ||
                                color.key.replace(/--color-(\d+)/, 'Color $1')
                            }
                            onChange={handleChange}
                        />
                    </div>
                ))}
            <Button
                size="sm"
                width="100%"
                border="dotted"
                onClick={addNewColor}
            >
                + Add New Color
            </Button>
        </>
    );
}

export default GlobalSavedColors;
