import {
    CR_WithNested,
    CR_WithoutNested_CR,
    regularRowWithNested,
} from '../../hooks/useCmsRow/data';
import { handleCMSAddress } from './getAddressValue';

describe('Testing getAddress function from builder', () => {
    test('should get cms Address is undefined', () => {
        const payload = {
            address: '0.0.0',
            ...regularRowWithNested,
        };
        let isCMSRow = handleCMSAddress(payload);
        expect(isCMSRow).toBeFalsy();
    });

    test('should replace cms Address only for top label cmsRow with nested Address', () => {
        const payload = {
            address: '0.0.1.1.1',
            ...CR_WithoutNested_CR,
        };
        let isCMSRow = handleCMSAddress(payload);

        // replaced '0.0.1.1.1' to '0.0.0.1.1'
        expect(isCMSRow).toEqual('0.0.0.1.1');
    });

    test('should replace cms Address only for top label cmsRow without nested Address', () => {
        const payload = {
            address: '0.0.1',
            ...CR_WithoutNested_CR,
        };
        let isCMSRow = handleCMSAddress(payload);
        expect(isCMSRow).toBeTruthy();

        // replaced '0.0.1' to '0.0.0'
        expect(isCMSRow).toEqual('0.0.0');
    });

    test('should replace cms Address for cms Row with nested also', () => {
        const payload = {
            address: '0.0.1.1.1.2',
            ...CR_WithNested,
        };
        let isCMSRow = handleCMSAddress(payload);
        expect(isCMSRow).toBeTruthy();

        // replaced '0.0.1.1.1.2' to '0.0.0.1.0.2'
        expect(isCMSRow).toEqual('0.0.0.1.0.2');
    });
});
