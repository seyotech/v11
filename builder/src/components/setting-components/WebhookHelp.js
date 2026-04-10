import React from 'react';
import { useCallback } from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
import { useMemo } from 'react';
import getPathValue from '../../util/getPathValue';
import snakeCase from 'lodash.snakecase';
import isObject from '../../util/isObject';

const UL = styled.ul`
    margin: 0;
    font-size: 13px;
    padding: 0 0 0 20px;

    li {
        line-height: 1.5;
    }
`;

function WebhookHelp(props) {
    const { module, currentEditItem } = props;
    const { settings = {} } = currentEditItem;
    const { service, webhook } = settings;
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fieldsKey = module.content?.fieldsKey || 'fields';
    const fields = getPathValue(fieldsKey, currentEditItem);

    function queryStringFromObject(fields) {
        return Object.entries(fields)
            .filter(([name]) => name !== 'button')
            .map(([name, obj]) => `${name}=${obj?.attr?.placeholder}`)
            .join('&');
    }

    function queryStringFromArray(fields) {
        return fields
            .map(
                (field) =>
                    `${field.name || snakeCase(field.label)}=${field.label}`
            )
            .join('&');
    }
    const queryString = isObject(fields)
        ? queryStringFromObject(fields)
        : queryStringFromArray(fields);

    const handleClick = useCallback(
        async (e) => {
            e.preventDefault();
            setIsLoading(true);
            try {
                if (isLoading) return;
                const response = await fetch(webhook, {
                    method: 'POST',
                    body: queryString,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
                if (service === 'zapier' || service === 'pabbly') {
                    const data = await response.json();
                    data.status === 'success'
                        ? setMessage('sent!')
                        : setMessage('try again!');
                } else if (service === 'integromat') {
                    setMessage('sent!');
                }
            } catch (err) {
                setMessage('try again!');
            }
            setIsLoading(false);
        },
        [isLoading, queryString, service, webhook]
    );

    const HookInstructions = useMemo(() => {
        switch (service) {
            case 'zapier':
                return ZapierInstructions;
            case 'integromat':
                return IntegromatInstructions;
            case 'pabbly':
                return Pabbly;
            default:
                return null;
        }
    }, [service]);

    return (
        <div>
            <HookInstructions>
                <a href="#" onClick={handleClick}>
                    Click here
                </a>
                {isLoading && (
                    <FontAwesomeIcon
                        spin
                        fixedWidth
                        icon={['fal', 'spinner']}
                    />
                )}
                {message && (
                    <span style={{ color: 'orange', fontWeight: 'bold' }}>
                        ({message})
                    </span>
                )}
            </HookInstructions>
        </div>
    );
}

function Pabbly({ children }) {
    return (
        <UL>
            <li>
                Click on <strong>Access Now</strong> from{' '}
                <strong>Connect</strong> App
            </li>
            <li>
                Click on <strong>Create New Workflow</strong> button
            </li>
            <li>
                Name your workflow and Click on <strong>Save</strong>
            </li>
            <li>
                Select <strong>Webhook</strong> from Choose App dropdown
            </li>
            <li>Copy the Webhook URL to the input field above</li>
            <li>
                Click on <strong>Capture Webhook Response</strong> or{' '}
                <strong>Re-capture Webhook Response</strong> button
            </li>
            <li>{children} to send test data</li>
            <li>Add your second app where you desire to receive data</li>
        </UL>
    );
}

function IntegromatInstructions({ children }) {
    return (
        <UL>
            <li>
                Copy <strong>Webhook URL</strong> into the field above
            </li>
            <li>
                Click on <strong>Re-determine data structure</strong> button if
                not listening for request
            </li>
            <li>{children} to send test data</li>
            <li>
                Click <strong>Ok</strong> button
            </li>
            <li>Add your second app where you desire to receive data</li>
        </UL>
    );
}

function ZapierInstructions({ children }) {
    return (
        <UL>
            <li>
                Click on <strong>MAKE A ZAP</strong> button
            </li>
            <li>
                Select <strong>Webhooks by Zapier</strong> app
            </li>
            <li>
                Choose <strong>Catch Hook</strong> event
            </li>
            <li>
                Copy <strong>Custom Webhook URL</strong>into the field above
            </li>
            <li>{children} to send test data</li>
            <li>Add your second app where you desire to receive data</li>
        </UL>
    );
}

export default WebhookHelp;
