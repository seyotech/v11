import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

class TooltipContent extends Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        // The portal element is inserted in the DOM tree after
        // the Modal's children are mounted, meaning that children
        // will be mounted on a detached DOM node. If a child
        // component requires to be attached to the DOM tree
        // immediately when mounted, for example to measure a
        // DOM node, or uses 'autoFocus' in a descendant, add
        // state to Modal and only render the children when Modal
        // is inserted in the DOM tree.
        let tooltip = document.getElementById('tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.setAttribute('id', 'tooltip');
            document.body.appendChild(tooltip);
        }
        tooltip.appendChild(this.el);
    }

    componentWillUnmount() {
        let tooltip = document.getElementById('tooltip');
        tooltip.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.el);
    }
}

const TooltipContentSC = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    background: red;
`;

const Tooltip = ({ children, button }) => {
    const [isOpen, open] = useState(false);
    const toggle = () => open(!isOpen);
    return (
        <>
            {button(toggle)}
            {/* {isOpen ? children : null} */}
            {isOpen && (
                <TooltipContentSC>
                    <TooltipContent>{children}</TooltipContent>
                </TooltipContentSC>
            )}
        </>
    );
};

export default Tooltip;
