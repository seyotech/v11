import React, { useCallback, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { App } from 'antd';

import { BuilderContext } from '../../../../contexts/BuilderContext';
import {
    Desc,
    Img,
    Item,
    ItemWrap,
    Remove,
    RemoveWrap,
    Section,
    Text,
} from './LibraryView.stc';
import { searchFilter } from './utils';

function Element({ element, isProvided, addElement, isAdmin }) {
    const { modal } = App.useApp();
    const { getElement, removeElement, getSavedElements } =
        useContext(BuilderContext);
    const isRemoveVisible = isAdmin || !isProvided;

    const confirm = (title, content) => {
        modal.confirm({
            title,
            content,
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                const deleted = await removeElement(element.id);
                if (deleted) {
                    getSavedElements(element.type);
                }
            },
        });
    };

    const handleAddElement = useCallback(() => {
        (async function () {
            const data = await getElement(element.id);
            if (data) {
                addElement({ data: JSON.parse(data), elType: element.type });
            }
        })();
    }, [addElement, element]);

    return (
        // <Popover
        //     key={element.id}
        //     placement="top"
        //     trigger="hover"
        //     content={
        //         <Zoom>
        //             <Img src="http://source.unsplash.com/250x150" alt="" />
        //         </Zoom>
        //     }
        // >
        <>
            <Item>
                {isRemoveVisible && (
                    <RemoveWrap>
                        <Remove
                            onClick={() =>
                                confirm(
                                    `${element.title}`,
                                    'Are you sure you want to delete?'
                                )
                            }
                        >
                            <FontAwesomeIcon
                                fixedWidth
                                icon={['far', 'trash-alt']}
                            />
                        </Remove>
                    </RemoveWrap>
                )}
                <div title="Click to Add" onClick={handleAddElement}>
                    <Img
                        loading="lazy"
                        srcSet={
                            element.thumbnail
                                ? `${element.thumbnail}?width=423, ${element.thumbnail}?width=846 2x`
                                : '/assets/images/image-placeholder.jpg'
                        }
                        alt=""
                    />
                    {!isProvided && (
                        <Desc>
                            <Text>{element.title}</Text>
                        </Desc>
                    )}
                </div>
            </Item>
        </>

        // </Popover>
    );
}

function LibraryView({ data = [], searchVal = '', ...restOfProps }) {
    const { isProvided } = restOfProps;
    const colSize = isProvided ? 2 : 3;
    // const isAdmin = useSelector(getIsAdmin);
    let isAdmin;

    const filteredData = data.filter((item) =>
        searchFilter({ item, type: 'title', searchVal })
    );

    const getImages = (idx, cols) => {
        let images = [];
        for (let i = idx; i < filteredData.length; i += cols) {
            const item = filteredData[i];

            images.push(
                <Element
                    key={item.id}
                    element={item}
                    isAdmin={isAdmin}
                    {...restOfProps}
                />
            );
        }
        return images;
    };

    const ImageList = () => {
        let imageList = [];
        for (let i = 0; i < 3; i++) {
            imageList.push(
                <ItemWrap className="mesonry--image-container" key={i}>
                    {getImages(i, 3)}
                </ItemWrap>
            );
        }
        return imageList;
    };

    return (
        <Section colSize={colSize}>
            <ImageList />
        </Section>
    );
}

export default React.memo(LibraryView);
