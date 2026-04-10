import React, { useContext, useState, useMemo } from 'react';
import { EditorContext } from '../../../../contexts/ElementRenderContext';
import PasswordProtection from '../../../other-components/PasswordProtection';
import { BuilderContext } from '../../../../contexts/BuilderContext';
import { message, Space, Typography } from 'antd';
const { Text } = Typography;

const openNotification = (type) => {
    const msgType = type === 'error' ? 'error' : 'success';
    let text = `Page has been ${type} successfully`;
    message[msgType](text);
};

const PasswordProtectionGuard = () => {
    const { pagesData, usePasswordProtectionHook } = useContext(BuilderContext);
    const { save, isLoading, isSuccess } = usePasswordProtectionHook();
    const { currentPage, editPageIndex, setEditPage } =
        useContext(EditorContext);

    const [error, setError] = useState({
        password: {
            isValid: false,
            message: '',
            isTouch: false,
        },
    });

    const formValues = useMemo(() => {
        const cmsPage = pagesData.find((p) => p.id === currentPage.id);
        return {
            isPasswordEnable: currentPage.isPasswordEnable || false,
            password: currentPage.password || '',
            alreadySetPassword: cmsPage?.isPasswordEnable || false,
        };
    }, [pagesData, currentPage]);

    const changePasswordToggle = (value) => {
        setEditPage(
            {
                isPasswordEnable: value,
            },
            editPageIndex
        );
        if (!value && formValues.alreadySetPassword) {
            saveHandler({
                id: currentPage.id,
                isPasswordEnable: value,
            });
        }
    };
    const isError = (value) => {
        const length = /^.{6,18}$/;
        const whitespace = /^(?=.*\s)/;
        const uppercase = /^(?=.*[A-Z])/;
        const lowercase = /^(?=.*[a-z])/;
        const number = /^(?=.*[0-9])/;
        const special = /^(?=.*[~`!@#$%^&*()])/;
        const messageList = [
            {
                isValid: length.test(value) && !whitespace.test(value),
                text: 'At least 6 characters, no whitespace is allowed',
            },
            {
                isValid: uppercase.test(value),
                text: 'At least one uppercase letter (A-Z)',
            },
            {
                isValid: lowercase.test(value),
                text: 'At least one lowercase letter (a-z)',
            },
            {
                isValid: number.test(value),
                text: 'At least one number letter (0-9)',
            },
            {
                isValid: special.test(value),
                text: 'At least one special character (@#$%&*)',
            },
        ];
        return messageList;
    };
    const changePasswordValue = (value, touch = true) => {
        if (value.length > 18) return;
        const errors = isError(value);
        setError({
            password: {
                isTouch: touch,
                isValid: errors.every((e) => e.isValid),
                messages: errors,
            },
        });
        setEditPage(
            {
                ...(value && { password: value }),
            },
            editPageIndex
        );
    };

    const saveHandler = async (payload) => {
        const res = await save(payload);
        openNotification(
            res?.error ? 'error' : payload.id ? 'updated' : 'created'
        );
        if (!res?.error) {
            setError({
                password: {
                    isValid: false,
                    message: '',
                    isTouch: false,
                },
            });
            setEditPage({}, editPageIndex);
        }
    };
    const createOrUpdatePage = async () => {
        const { isPasswordEnable, password, isModified, data, id, ...rest } =
            currentPage;
        const newPage = {
            ...(!id && {
                rest,
                data: isModified && data ? JSON.stringify(data) : undefined,
            }),
            ...(id && { id }),
            isPasswordEnable,
            ...(isPasswordEnable && { password }),
        };
        saveHandler(newPage);
    };

    return (
        <div>
            <Space>
                <Text>Password Protection</Text>
            </Space>

            <PasswordProtection
                formValues={formValues}
                changePasswordToggle={changePasswordToggle}
                changePasswordValue={changePasswordValue}
                error={error}
                isSuccess={isSuccess}
                isLoading={isLoading}
                createOrUpdatePage={createOrUpdatePage}
            />
        </div>
    );
};

export default PasswordProtectionGuard;
