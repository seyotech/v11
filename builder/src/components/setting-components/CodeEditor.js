import 'ace-builds';
import AceEditor from 'react-ace';
import React, { useCallback, useState, useRef } from 'react';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-split';
import styled from 'styled-components';

// const ignorAble  = ['Unexpected End of file. Expected DOCTYPE']

const Marker = styled.div`
    background: red;
    position: absolute;
    z-index: 10;
    width: 6px;
    left: 0;
    font-size: 0px;
    height: 14px;
    text-align: center;
    top: ${({ top }) => `${top * 14}px`};
    &:hover {
        width: 100%;
        height: auto;
        font-size: 12px;
    }
`;

function CodeEditor({ value, name, onChange, mode = 'html' }) {
    const [markers, setMarkers] = useState([]);
    const ref = useRef();
    const handleChange = useCallback(
        (newValue) => {
            onChange({ value: newValue, name });
        },
        [name, onChange]
    );

    const handleMarkers = (markers) => {
        let _markers = markers.reduce((acc, { text, row }) => {
            const hasError = acc.find((a) => a.row === row);
            if (hasError) return acc;
            if (text.toLowerCase().includes('doctype')) return acc;
            acc.push({
                row,
                text,
            });

            return acc;
        }, []);
        setMarkers(_markers);
    };

    return (
        <div style={{ position: 'relative' }}>
            {renderMarkers(markers)}
            <AceEditor
                ref={ref}
                mode={mode}
                name={name}
                value={value}
                theme="tomorrow"
                markers={markers}
                showGutter={false}
                onChange={handleChange}
                onValidate={handleMarkers}
                enableLiveAutocompletion={true}
                setOptions={{ useWorker: false }}
                editorProps={{ $blockScrolling: true }}
                placeholder="Write or copy your custom code here..."
                style={{
                    height: 220,
                    width: '100%',
                    borderRadius: '5px',
                    border: '1px solid #e5ebf0',
                }}
            />
        </div>
    );
}

const renderMarkers = (markers) =>
    markers.map((marker, idx) => (
        <Marker key={idx} top={marker.row}>
            {marker.text}
        </Marker>
    ));

export default CodeEditor;
