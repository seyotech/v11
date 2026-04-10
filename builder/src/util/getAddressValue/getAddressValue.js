import { getRowConfig } from '../getRowConfig';
export const handleCMSAddress = ({ address, data, symbols = {} }) => {
    if (!data || !address) return;
    let cmsAddress = address.split('.');

    const { selectedField, isCmsRow } = getRowConfig({
        address: cmsAddress,
        data,
        symbols,
    });

    if (isCmsRow) {
        let addr = address.split('.');

        if (addr.length >= 3) {
            addr[2] = '0';
        }
        if (selectedField && addr.length >= 5) {
            addr[4] = '0';
        }
        address = addr.join('.');
        return address;
    }
};
