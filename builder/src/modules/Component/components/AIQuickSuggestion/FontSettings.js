import { Typography } from 'antd';
import Loading from 'components/Loading';
import useIframe from 'hooks/useIframe';
import { useGetAISuggestion } from 'modules/AI/utils/ai.query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HeaderComp from './Header';
import { FontSettingsWrap, FontWrapper } from './style.stc';
import useSuggestion from './useSuggestion';
import { getFontsBuildStr } from './utils';

function FontSettings(props) {
    const { siteConfig, data, isLoading, setSiteConfig } = props;
    const { fontIdx } = siteConfig;
    const { contentDocument } = useIframe();
    const { updateGlobalFonts } = useSuggestion();
    const { t } = useTranslation('builder');

    const handleClick = (fonts, fontIdx) => {
        updateGlobalFonts(fonts);
        setSiteConfig((prev) => ({ ...prev, fontIdx, fonts }));
    };
    const fonts = data?.typography || [];

    useEffect(() => {
        if (fonts.length) {
            const { fontUrl } = getFontsBuildStr(fonts);
            const isLinkExist = contentDocument.head.querySelector(
                `link[href="${fontUrl}"]`
            );
            if (!isLinkExist) {
                const link = contentDocument.createElement('link');
                link.rel = 'stylesheet';
                link.href = fontUrl;
                document.head.appendChild(link);
            }
        }
    }, [fonts]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <FontSettingsWrap>
            {fonts.map((font, idx) => (
                <FontWrapper
                    className={`${fontIdx === idx ? 'active' : ''}`}
                    key={idx}
                    onClick={() => handleClick(font, idx)}
                >
                    <Typography.Title
                        level={3}
                        style={{
                            fontFamily: font.heading.name,
                            fontWeight: font.heading.weight,
                        }}
                    >
                        {font.heading.name}
                    </Typography.Title>
                    <Typography.Paragraph
                        style={{
                            fontFamily: font.body.name,
                        }}
                    >
                        {t('This is a paragraph using the font {{fontName}}', {
                            fontName: font.body.name,
                        })}
                    </Typography.Paragraph>
                </FontWrapper>
            ))}
        </FontSettingsWrap>
    );
}

const Fonts = (props) => {
    const { t } = useTranslation('builder');
    const {
        isLoading: reLoading,
        data: aiSuggestion,
        mutateAsync: getAISuggestion,
    } = useGetAISuggestion();
    const { setAISuggestion } = useSuggestion();

    const handleRefresh = () => {
        getAISuggestion({ type: 'font' }).then((res) => {
            if (res) {
                setAISuggestion({ typography: res.typography });
            }
        });
    };

    const data = aiSuggestion || props.data;
    return (
        <>
            <HeaderComp
                isLoading={reLoading}
                title={t('Typography')}
                handleRefresh={handleRefresh}
            />
            <FontSettings
                {...props}
                data={data}
                isLoading={reLoading || props.isLoading}
            />
        </>
    );
};

export default Fonts;
