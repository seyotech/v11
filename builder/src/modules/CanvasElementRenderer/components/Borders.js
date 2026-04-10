import { prefix } from '../../../config';

function getBorderStyle(color) {
    return { borderColor: color.bg };
}

export const Borders = ({ color }) => {
    return (
        <>
            <div
                style={getBorderStyle(color)}
                className={`${prefix}-controls-border ${prefix}-controls-border-left`}
            />
            <div
                style={getBorderStyle(color)}
                className={`${prefix}-controls-border ${prefix}-controls-border-right`}
            />
            <div
                style={getBorderStyle(color)}
                className={`${prefix}-controls-border ${prefix}-controls-border-top`}
            />
            <div
                style={getBorderStyle(color)}
                className={`${prefix}-controls-border ${prefix}-controls-border-bottom`}
            />
        </>
    );
};
