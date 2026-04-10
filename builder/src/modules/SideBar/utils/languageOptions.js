import i18n from 'i18next';
import { Tag, Flex } from 'antd';

const style = {
    width: '100%',
    margin: '0 auto',
};

const LanguageLabel = ({ label }) => {
    return (
        <Flex justify="space-between" align="center">
            {label}
            <Tag
                color="green"
                style={{
                    lineHeight: 1,
                    color: 'green',
                    marginLeft: 8,
                    fontSize: '12px',
                    padding: '4px 8px',
                }}
            >
                Beta
            </Tag>
        </Flex>
    );
};

const languages = [
    { key: 'en', label: 'English', value: 'en', style },
    {
        style,
        key: 'fr',
        label: <LanguageLabel label="French" />,
    },
    {
        style,
        key: 'de',
        label: <LanguageLabel label="German" />,
    },
    {
        style,
        key: 'es',
        label: <LanguageLabel label="Spanish" />,
    },
    {
        style,
        key: 'cs',
        label: <LanguageLabel label="Czech" />,
    },
];

class Language {
    constructor(languages) {
        this.lang = localStorage.getItem('i18nextLng');
        this.list = languages;
    }

    getCurrent() {
        return this.list.some(({ key }) => key === this.lang)
            ? this.lang
            : 'en';
    }

    setCurrent(lang, i18next = i18n) {
        i18next.changeLanguage(lang);
        localStorage.setItem('i18nextLng', lang);
        this.lang = lang;
    }
}

export const language = new Language(languages);
