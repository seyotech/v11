/*****************************************************
 * Packages
 ******************************************************/
import { Form } from 'antd';
import debounce from 'lodash/debounce';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import styled from 'styled-components';

/*****************************************************
 * Locals
 ******************************************************/
import Tab, { TabOption } from '../../reusable/Tab';
import EditorModalBase from '../EditorModalBase';
import ContentView from './ContentView';

import { ElementContext } from '../../../../contexts/ElementRenderContext';
import { handleCMSAddress } from '../../../../util/getAddressValue';
import validateMembership from '../../../../util/validateMembership';
import modalLibrary from '../../../editor-resources/elements';
import ElementSearch from './ElementSearch';
import NestedRowCol from './NestedRowCol';
import { searchFilter } from './utils';

const Wrapper = styled.div`
    margin-top: 10px;
    background: ${({ theme }) => theme.primary.bg};
`;

function AddSectionModal({ onClose, type, page, editAddress }) {
    const simpleBarRef = useRef();
    const [searchVal, setSearchVal] = useState('');
    const { symbols = {} } = useContext(ElementContext) || {};
    let user;
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState(0);
    const modalData = modalLibrary[type];
    const tabContent = modalData[activeTab];
    const cmsRow = handleCMSAddress({
        address: editAddress,
        data: page?.data,
        symbols,
    });
    const nestedModalData = modalLibrary['ELEMENT'];
    const nestedTabContent = nestedModalData[activeTab];
    const addressLength = editAddress?.split('.').length;
    const handleValidateMembership = useCallback(
        (membership) => {
            return validateMembership(membership, user);
        },
        [user]
    );

    const handleTabChange = useCallback((payload) => {
        setActiveTab(payload.value);
        setSearchVal('');
        form.setFieldValue('search', '');
    }, []);

    const renderNestedRow =
        (type === 'ELEMENT' || type === 'ROW') && addressLength === 4;
    const shouldRenderNestedRow = type === 'ROW' && addressLength === 4;

    let renderableContent = shouldRenderNestedRow
        ? nestedTabContent
        : tabContent;

    if (0 === activeTab && (type === 'ELEMENT' || renderNestedRow)) {
        renderableContent = {
            ...renderableContent,
            body: renderableContent.body.map((items) => {
                return {
                    ...items,
                    elements: items.elements.filter((item) =>
                        searchFilter({ item, type: 'title', searchVal })
                    ),
                };
            }),
        };
    }

    const isSearchbarRenderable = () => {
        if (type === 'SECTION') {
            return ![0, 1].includes(activeTab);
        }
        if (type === 'ROW' && addressLength === 4) {
            return true;
        }
        return type === 'ELEMENT' || 0 !== activeTab;
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <EditorModalBase
                size="lg"
                close={onClose}
                sidebarIcon={false}
                title={`Add new ${type}`}
            >
                <Tab
                    type="underlined"
                    selected={activeTab}
                    onSelect={handleTabChange}
                >
                    {modalData.map((option, index) => (
                        <TabOption
                            value={index}
                            key={option.title}
                            icon={option.icon}
                        >
                            {option.title}
                        </TabOption>
                    ))}
                </Tab>

                <SimpleBar ref={simpleBarRef} style={{ maxHeight: 578 }}>
                    {isSearchbarRenderable() && (
                        <ElementSearch
                            form={form}
                            handleSearch={debounce(setSearchVal, 500)}
                        />
                    )}

                    {renderableContent.body.map((item, idx) => (
                        <Wrapper key={idx} data-testid={`wrapper-${idx + 1}`}>
                            <ContentView
                                type={type}
                                data={item}
                                page={page}
                                cmsRow={cmsRow}
                                searchVal={searchVal}
                                validateMembership={handleValidateMembership}
                            />
                        </Wrapper>
                    ))}

                    {0 === activeTab && renderNestedRow && (
                        <Wrapper data-testid="wrapper-nested">
                            <React.Fragment>
                                <NestedRowCol />
                            </React.Fragment>
                        </Wrapper>
                    )}
                </SimpleBar>
            </EditorModalBase>
        </DndProvider>
    );
}

export default AddSectionModal;
