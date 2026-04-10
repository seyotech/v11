import debounce from 'lodash.debounce';
import DrawerHeader from 'modules/Shared/DrawerHeader';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NavTree from './NavTree';

const Navigation = () => {
    const [search, setSearch] = useState('');
    const { t } = useTranslation('builder');

    const handleDebounce = useMemo(
        () => debounce((e) => setSearch(e.target.value), 700),
        []
    );

    return (
        <>
            <DrawerHeader title={t('Navigator')} onChange={handleDebounce} />
            <NavTree search={search} />
        </>
    );
};

export default Navigation;
