import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ColorPicker } from 'antd';
import Loading from 'components/Loading';
import debounce from 'lodash.debounce';
import { useGetAISuggestion } from 'modules/AI/utils/ai.query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderComp from './Header';
import {
    ColorsWrapper,
    CustomBox,
    HoverableContent,
    PaletteWrapper,
} from './style.stc';
import useSuggestion from './useSuggestion';
import { getColorPalette, getColorVariation } from './utils';

function ColorPanel(props) {
    const { data, isLoading } = props;
    const { global, setAISuggestion } = useSuggestion();
    const [brandColors, setBrandColors] = useState([]);
    const brandColor = global.aiMeta?.brandColor;
    const { t } = useTranslation('builder');
    const { isLoading: reLoading, mutateAsync: getAISuggestion } =
        useGetAISuggestion();
    const handleRefresh = () => {
        getAISuggestion({ type: 'color' }).then((res) => {
            if (res) {
                setAISuggestion({ colors: res.colors });
                setBrandColors(getColorPalette([brandColor, ...res.colors]));
            }
        });
    };

    useEffect(() => {
        data && setBrandColors(getColorPalette([brandColor, ...data.colors]));
    }, [data]);
    return (
        <div>
            <HeaderComp
                isLoading={reLoading}
                title={t('Click to switch & preview color')}
                handleRefresh={handleRefresh}
            />
            <SuggestedColors
                {...props}
                isLoading={isLoading || reLoading}
                brandColors={brandColors}
                setBrandColors={setBrandColors}
            />
        </div>
    );
}

const SuggestedColors = ({
    isLoading,
    brandColors,
    siteConfig,
    setSiteConfig,
    setBrandColors,
}) => {
    const { paletteIdx } = siteConfig;
    const { updateGlobalColors } = useSuggestion();

    const handleSelectPalette = (colors, paletteIdx) => {
        setSiteConfig((prev) => ({ ...prev, paletteIdx, colors }));
        updateGlobalColors({ colors });
    };
    const handleColorChange = debounce((value, paletteIdx) => {
        const { displayColors, colors = [] } = getColorVariation(value);
        setSiteConfig((prev) => ({ ...prev, paletteIdx, colors }));
        setBrandColors((prev) => {
            let arr = [...prev];
            arr[paletteIdx] = { displayColors, colors };
            return arr;
        });
        updateGlobalColors({ colors });
    }, 100);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <ColorsWrapper>
            {brandColors.map(({ displayColors, colors }, idx) => (
                <PaletteWrapper
                    key={idx}
                    onClick={() => handleSelectPalette(colors, idx)}
                    className={`palette-wrap ${
                        paletteIdx === idx ? 'active' : ''
                    }`}
                >
                    {displayColors.map(({ key, value }, idx) => (
                        <CustomBox
                            key={idx}
                            className="color"
                            style={{ background: value }}
                        ></CustomBox>
                    ))}
                    <HoverableContent className="hoverable-content">
                        <ColorPicker
                            value={colors[0]?.value}
                            onChange={(color) => {
                                handleColorChange(color.toRgbString(), idx);
                            }}
                        >
                            <Button
                                onClick={(e) => e.stopPropagation()}
                                className="color-picker-btn"
                            >
                                <FontAwesomeIcon icon={['far', 'palette']} />
                            </Button>
                        </ColorPicker>
                    </HoverableContent>
                </PaletteWrapper>
            ))}
        </ColorsWrapper>
    );
};

export default ColorPanel;
