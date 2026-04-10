import useFeatureFlag from './useFeatureFlag';
const useCheckFeatureFlag = (flagName) => {
    let isFlagEnabled = useFeatureFlag(flagName);
    let shouldRenderComp = true;

    if (flagName) {
        shouldRenderComp = isFlagEnabled;
    }
    return shouldRenderComp;
};

export default useCheckFeatureFlag;
