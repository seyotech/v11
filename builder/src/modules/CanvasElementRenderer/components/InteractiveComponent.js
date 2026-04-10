import { forwardRef } from 'react';
import { WithTyping } from '../hoc/WithTyping';
import WithInlineEditor from '../hoc/InlineEditor/WithInlineEditor';
import { useAI } from 'modules/AI/hooks/useAI';
import htmlEscape from 'lodash/escape';

export const InteractiveComponent = forwardRef((props, ref) => {
    const { status } = useAI();
    const {
        as: Tag = 'div',
        shouldType,
        inlineEditor,
        children,
        typekey,
        ...rest
    } = props;

    if (shouldType && typekey) {
        return (
            <WithTyping
                typekey={typekey}
                status={status}
                ref={ref}
                {...props}
            />
        );
    }

    if (inlineEditor) {
        return <WithInlineEditor {...props} ref={ref} />;
    }

    return (
        <Tag
            {...rest}
            dangerouslySetInnerHTML={{
                __html: rest.strings.map((htmlString) =>
                    htmlEscape(htmlString)
                ),
            }}
        />
    );
});
