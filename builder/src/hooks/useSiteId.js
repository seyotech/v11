import { useContext } from 'react';
import { EditorContext } from '../contexts/ElementRenderContext';

export default function useSite() {
    const ctx = useContext(EditorContext);

    const { siteId } = ctx;

    return { siteId };
}
