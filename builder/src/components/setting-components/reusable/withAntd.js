import React from 'react';

function withAntd(Component) {
    return (props) => {
        const { name, onChange, mutateOnChange } = props;
        const handleChange = (value) => {
            typeof mutateOnChange === 'function'
                ? onChange(mutateOnChange({ name, value }))
                : onChange({ name, value });
        };
        return <Component {...props} onChange={handleChange} />;
    };
}

export default withAntd;
