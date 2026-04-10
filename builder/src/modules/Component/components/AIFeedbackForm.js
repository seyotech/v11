import { BuilderContext } from 'contexts/BuilderContext';
import useScript from 'hooks/useScript';
import { useAI } from 'modules/AI/hooks/useAI';
import React, { useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

function AIFeedbackForm() {
    const ref = useRef();
    const { status } = useAI();
    const { t } = useTranslation('builder');
    const { user } = useContext(BuilderContext);
    let { prompt } = JSON.parse(sessionStorage.getItem('_prompt') || '{}');
    const popupOpen = ref.current && prompt && status === 'done';

    useScript('https://tally.so/widgets/embed.js');
    useEffect(() => {
        if (popupOpen) {
            setTimeout(() => ref.current.click(), 45000);
        }
    }, [popupOpen]);
    const url = window.location.href;
    return (
        <>
            <FeedbackButton
                ref={ref}
                href={`#tally-open=nWzgvQ&tally-width=280&layout=modal&tally-align-left=1&tally-hide-title=1&tally-emoji-text=👋&tally-emoji-animation=wave&email=${user.email}&builderURL=${url}`}
            >
                {t('Feedback')}
            </FeedbackButton>
        </>
    );
}

export default AIFeedbackForm;

const FeedbackButton = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 0 16px;
    transform: rotate(90deg);
    border-radius: 6px;
    background: #3a30ba;
    line-height: 1.5;
    color: #fff;
    font-size: 14px;
    transition: all 0.4s;

    &:hover {
        text-decoration: none;
        color: #fff;
        background: #2a228e;
    }
`;
