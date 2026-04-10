import { createPortal } from 'react-dom';
import usePortal from '../hooks/usePortal';

const Portal = ({ children, css = '', events, ...rest }) => {
    const target = usePortal({ ...rest, style: css }, events);
    return createPortal(children, target);
};

export default Portal;
