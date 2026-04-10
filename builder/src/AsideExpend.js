import { forwardRef } from 'react';
import { Button } from 'antd';

import {
    AsideExpendBody,
    AsideExpendHead,
    AsideExpend as AsideExpendDiv,
} from './BuilderAside.sc';
import { FontAwesomeIcon, addFaIcon } from './util/faHelpers';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';

addFaIcon(faTimes);

const AsideExpend = forwardRef((props, ref) => {
    const { title, close, children } = props;
    return (
        <AsideExpendDiv ref={ref}>
            <AsideExpendHead>
                <strong>{title}</strong>
                <Button type="link" onClick={close}>
                    <FontAwesomeIcon icon={['far', 'times']} />
                </Button>
            </AsideExpendHead>
            <AsideExpendBody>{children}</AsideExpendBody>
        </AsideExpendDiv>
    );
});

export default AsideExpend;
