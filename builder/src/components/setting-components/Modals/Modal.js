import React from 'react';
import ReactDOM from 'react-dom';

// Style
import './Modal.scss';

let zIndexCount = 1000;

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.el.setAttribute('class', 'modal');
        let styles = '';
        if (false === this.props.hasBackdrop) {
            styles = `position: static; height: 0;`;
        }
        this.el.setAttribute('style', `z-index: ${zIndexCount++};${styles}`);
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
        document.body.appendChild(this.el);
    }

    componentWillUnmount() {
        document.body.removeChild(this.el);
    }

    componentDidUpdate() {
        if (this.props.isDragging) {
            this.el.style.height = '100%';
            this.el.style.position = 'fixed';
        } else {
            this.el.style.height = 0;
            this.el.style.position = 'static';
        }
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.el);
    }
}

export default Modal;
