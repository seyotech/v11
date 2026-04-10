import { ComponentRenderContext } from '@dorik/html-parser';
import { useContext } from 'react';

const noop = () => null;

const useFeatureFlag = (flag) => {
    const { useFlag = noop } = useContext(ComponentRenderContext);
    const enabled = useFlag(flag);

    return import.meta.env.MODE === 'test' || enabled;
};

export default useFeatureFlag;
