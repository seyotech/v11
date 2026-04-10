/*****************************************************
 * Packages
 ******************************************************/
import { notification } from 'antd';
import condition from 'dynamic-condition';
import {
    useCallback,
    useContext,
    useEffect,
    memo,
    useState,
    useMemo,
} from 'react';
import styled from 'styled-components';

/*****************************************************
 * Locals
 ******************************************************/
import settingComponents from '../index';
// import { getAuthUser } from '../../../redux/selectors';
import getHoverStateConditions from 'util/getHoverStateConditions';
import useEditorModal from '../../../hooks/useEditorModal';
import getModContent from '../../../util/getModContent';
import resolveValues from '../../../util/resolveValues';
import validateMembership from '../../../util/validateMembership';
import { BuilderContext } from '../../../contexts/BuilderContext';

const StyledInput = styled.div`
    position: relative;
`;

function RenderComponent(props) {
    const {
        data,
        path,
        value,
        module,
        display,
        onChange,
        activeHover,
        parentModule,
        mqPlaceholder,
    } = props;
    // const user = useSelector(getAuthUser);
    const { user, usePlanKey } = useContext(BuilderContext);
    const { planKey } = usePlanKey();
    const { isSidebar } = useEditorModal();
    const [errors, setErrors] = useState([]);
    /**
     * @typedef modContent
     * @prop {func} [onChange] mutateOnChange in the component
     */
    /** @type {modContent} */
    const modContent = useMemo(() => getModContent(module), [module]);

    const handleBlur = useCallback(
        (event) => {
            const { value = '' } = event.target;
            if (!value) {
                return setErrors([]);
            }
            const { validation } = module;
            if (validation && typeof validation.validate !== 'function') {
                const matched = value.trim().match(validation.validate);
                if (matched) {
                    setErrors([]);
                } else {
                    setErrors([validation.message]);
                }
            }
            // else if (typeof validation?.validate === 'function') {
            //     // TODO: call the validate exec func
            //     const isMatched = validation.validate(props.value);
            //     if (isMatched) {
            //         setErrors([]);
            //     } else {
            //         setErrors([validation.message]);
            //     }
            // }
        },
        [module]
    );

    const handleOnChange = useCallback((payload) => {
        const isInvalid =
            !payload ||
            (Array.isArray(payload)
                ? payload.some(({ name }) => !name)
                : !payload.name);
        if (isInvalid)
            return notification.error({
                message: 'Payload is not valid',
                placement: 'bottomRight',
            });
        onChange(payload);
    }, []);

    useEffect(() => {
        handleBlur({ target: { value } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // <-- componentDidMount

    if (!modContent) {
        return null;
    }

    if (!path) {
        // console.error('No path assigned for: ' + module.label);
        return null;
    }

    const conditions =
        module.conditions &&
        (!activeHover
            ? module.conditions
            : getHoverStateConditions(module.conditions, 'pseudoClass/hover'));

    if (conditions && !condition(resolveValues(conditions, data)).matches) {
        return null;
    }

    const Component = settingComponents[modContent?.template] || 'div';

    // Help message for development ease
    if (!Component) {
        return (
            <p style={{ color: 'red' }}>
                No component found for `{path || modContent?.template}`
            </p>
        );
    }

    let visibleOn = 'normal';
    if (Array.isArray(modContent.visibleOn)) {
        visibleOn = modContent.visibleOn;
    }

    if (activeHover && !visibleOn.includes('hover')) {
        if (parentModule?.hasOwnProperty('hoverable')) {
            if (!parentModule.hoverable) {
                return null;
            }
        } else {
            if (!modContent.hoverable) {
                return null;
            }
        }
    }

    const excludePlans = parentModule?.excludePlans;
    const enabled = validateMembership({ excludePlans, user, planKey });

    return (
        <Component
            {...modContent}
            activeHover={activeHover}
            module={modContent}
            data={data}
            name={path}
            value={value}
            onBlur={handleBlur}
            onChange={onChange}
            isSidebar={isSidebar}
            hasError={!!errors.length}
            enabled={enabled}
            errors={errors}
            mqPlaceholder={mqPlaceholder}
            mutateOnChange={modContent.onChange}
        />
    );
}

export default memo(RenderComponent);
