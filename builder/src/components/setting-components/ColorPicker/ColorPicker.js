import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import useGlobals from '../../../hooks/useGlobals';
import isObject from '../../../util/isObject';
import Button from '../../other-components/Button';
import Input from '../Input';
import InputGroup from '../InputGroup';
import { GlobalColors } from './Color';
import ColorPickerModal from './ColorPickerModal';
import PickrReact from './PickrReact';

const ActionBtn = styled.div`
    height: ${({ isSidebar }) => (isSidebar ? '26px' : '32px')};
    display: flex;
    font-size: ${({ isSidebar }) => (isSidebar ? '14px' : '18px')};
    cursor: pointer;
    border-radius: 5px;
    align-items: center;
    justify-content: center;
    width: ${({ width }) => width || '40px'};
    border: 1px solid ${({ theme }) => theme.inputBorder};
    color: ${({ theme, isActive }) =>
        isActive ? theme.primary.fg : 'currentColor'};

    &.color-dropper {
        svg {
            color: #fff;
            mix-blend-mode: difference;
        }
    }
`;

/**
 * @typedef {object} Props
 * @property {string} name
 * @property {string} value
 * @property {function} onChange
 * @property {object} options
 *
 * @param {Props} param0
 */
const ColorPicker = (props) => {
    const {
        name,
        value,
        onChange,
        clear = true,
        remove = false,
        preview = true,
        colorVars = true,
        previewWidth = '80px',
        ...rest
    } = props;

    const colorPreviewRef = useRef();
    const { colors, setColors } = useGlobals();
    const [isModalVisible, showModal] = useState(false);
    const [isAddedToGlobal, setAddedToGlobal] = useState(false);
    const [isVisibleGlobal, setVisibleGlobal] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [position, setPosition] = useState({ top: '50%', left: '50%' });

    const isActiveGlobalColor = isObject(value);

    const handleChange = useCallback(
        (payload) => {
            let inputVal = payload.value;
            const hexReg = /#?[0-9a-fA-F]{6}/;
            if (hexReg.test(inputVal)) {
                inputVal = inputVal.startsWith('#') ? inputVal : `#${inputVal}`;
            }

            onChange({ name, value: inputVal });
            setAddedToGlobal(false);
        },
        [name, onChange]
    );

    const getItemNum = useCallback((item) => {
        if (typeof item?.key !== 'string') return 0;
        const number = item.key.split('-').slice(-1).pop();
        return Number(number);
    }, []);

    const addToGlobal = useCallback(() => {
        if (isAddedToGlobal) return;
        const copied = colors ? [...colors] : [];
        const [lastItem] = copied.slice(-1);
        const num = getItemNum(lastItem);
        copied.push({ value: selectedColor, key: `--color-${num + 1}` });
        setColors(copied);
        setAddedToGlobal(true);
    }, [isAddedToGlobal, colors, getItemNum, selectedColor, setColors]);

    const clearInput = () => {
        onChange({ name, value: '' });
    };

    const handleColorModal = (event) => {
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;

        let top = clientY,
            left = clientX;
        if (clientX + 300 > innerWidth) {
            left = clientX - 300;
        }
        if (clientY + 317 > innerHeight) {
            const fromTop = clientY + 317 - innerHeight;
            top = clientY + 317 / 2 - fromTop;
        }
        setPosition({ top, left });
        showModal(!isModalVisible);
    };

    useEffect(() => {
        // TODO: doesn't clear the selected global color always
        if (isActiveGlobalColor) {
            const found = colors.find((col) => col.key === value.key);
            if (!found) {
                handleChange({ value: '' });
            } else {
                setSelectedColor(found.value);
                setVisibleGlobal(true);
            }
        } else {
            setSelectedColor(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <>
            <InputGroup isSidebar={rest.sidebar}>
                <Input
                    isSidebar={rest.sidebar}
                    className="grow-1"
                    value={selectedColor}
                    onChange={handleChange}
                    placeholder="eg: #ff00ff"
                />
                {clear && (
                    <ActionBtn {...rest} onClick={clearInput}>
                        <FontAwesomeIcon icon={['far', 'eraser']} />
                    </ActionBtn>
                )}
                {remove && (
                    <ActionBtn {...rest} onClick={clearInput}>
                        <FontAwesomeIcon icon={['far', 'trash-alt']} />
                    </ActionBtn>
                )}
                {colorVars && (
                    <ActionBtn
                        {...rest}
                        isActive={isVisibleGlobal}
                        onClick={() => setVisibleGlobal((state) => !state)}
                    >
                        <FontAwesomeIcon icon={['far', 'globe']} />
                    </ActionBtn>
                )}
                {preview && (
                    <ActionBtn
                        {...rest}
                        width={previewWidth}
                        ref={colorPreviewRef}
                        onClick={handleColorModal}
                        style={{ background: selectedColor }}
                        className={
                            !selectedColor
                                ? ' transparent-bg-placeholder'
                                : 'color-dropper'
                        }
                    >
                        <FontAwesomeIcon icon={['far', 'eye-dropper']} />
                    </ActionBtn>
                )}
            </InputGroup>

            {isVisibleGlobal && <GlobalColors {...props} colors={colors} />}

            {isModalVisible && (
                <ColorPickerModal
                    position={position}
                    close={() => showModal(false)}
                >
                    <PickrReact
                        className="mb-15"
                        value={selectedColor}
                        onChange={handleChange}
                    />
                    <InputGroup {...rest} label="Color" className="mb-15">
                        <Input value={selectedColor} onChange={handleChange} />
                    </InputGroup>
                    {!isActiveGlobalColor && (
                        <Button
                            size="sm"
                            width="100%"
                            border="dotted"
                            onClick={addToGlobal}
                            disabled={isAddedToGlobal}
                        >
                            {isAddedToGlobal ? 'Added' : 'Add To Global Color'}
                        </Button>
                    )}
                </ColorPickerModal>
            )}
        </>
    );
};
export default ColorPicker;
