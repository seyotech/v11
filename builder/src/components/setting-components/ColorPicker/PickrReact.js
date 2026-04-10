import Pickr from '@simonwep/pickr/dist/pickr.es5.min';
import React, { Component, createRef } from 'react';
import '@simonwep/pickr/dist/themes/nano.min.css';
import './style.scss';

class PickrReact extends Component {
    inputRef = createRef();
    componentDidUpdate(prevProps) {
        const { value: currColor = '' } = this.props;
        const { value: prevColor = '' } = prevProps;
        if (currColor.toLowerCase() !== prevColor.toLowerCase()) {
            this.pickr.setColor(currColor);
        }
    }
    componentDidMount() {
        this.pickr = new Pickr({
            inline: true,
            theme: 'nano',
            useAsButton: true,
            comparison: false,
            el: this.inputRef.current,
            default: this.props.value || '#000',
            appClass: 'react-pickr ' + this.props.className,
            components: {
                // Main components
                hue: true,
                opacity: true,
                preview: true,
            },
        });
        this.pickr.on('change', (color) => {
            const { name, value: propColor = '', onChange } = this.props;
            const colorStr =
                color.a < 1
                    ? color.toRGBA().toString(0)
                    : color.toHEXA().toString();

            if (propColor.toLowerCase() !== colorStr.toLowerCase()) {
                onChange({ name, value: colorStr });
            }
        });
    }
    componentWillUnmount() {
        this.pickr.destroy();
    }
    render() {
        return <div ref={this.inputRef} />;
    }
}

export default PickrReact;
