import { useAI } from 'modules/AI/hooks/useAI';
import { generateColorPayload, generateFontPayload } from './utils';
import useAISuggestion from 'modules/AI/hooks/useAISuggestion';

function useUpdateGlobal() {
    const { global = {}, aiFetcher, setPageMeta } = useAI();
    const aiSuggestion = useAISuggestion();
    const updateGlobalColors = ({ colors }) => {
        const updatedColor = generateColorPayload({ global, colors });
        let globalData = {
            ...global,
            settings: {
                ...global.settings,
                colors: updatedColor,
            },
        };
        setPageMeta({ globalData });
    };

    const updateGlobalFonts = (props) => {
        const { style, heading, googleFonts } = generateFontPayload({
            global,
            ...props,
        });
        const globalData = {
            ...global,
            style,
            heading,
            settings: {
                ...global.settings,
                googleFonts,
            },
        };
        setPageMeta({ globalData });
    };

    return {
        global,
        aiFetcher,
        ...aiSuggestion,
        updateGlobalFonts,
        updateGlobalColors,
    };
}

export default useUpdateGlobal;
