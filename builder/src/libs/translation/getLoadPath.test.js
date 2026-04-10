import getLoadPath from './getLoadPath';

vi.stubGlobal('history', {
    state: {},
});

describe('getLoadPath function', () => {
    it('should return correct load path when history.state.url is defined', () => {
        history.state = { url: '/v4/dashboard/example' };
        const expectedLoadPath = '/v4/dashboard/locales/{{lng}}/{{ns}}.json';
        expect(getLoadPath()).toEqual(expectedLoadPath);
    });

    it('should return correct load path when history.state.url is not defined', () => {
        history.state = {};
        const expectedLoadPath = '/locales/{{lng}}/{{ns}}.json';
        expect(getLoadPath()).toEqual(expectedLoadPath);
    });

    it('should return correct load path when history.state.url is empty', () => {
        history.state = { url: '' };
        const expectedLoadPath = '/locales/{{lng}}/{{ns}}.json';
        expect(getLoadPath()).toEqual(expectedLoadPath);
    });

    it('should return correct load path when history.state.url is not start with "/v4" or "/dashboard"', () => {
        history.state = { url: 'random/v4/dashboard' };
        const expectedLoadPath = '/locales/{{lng}}/{{ns}}.json';
        expect(getLoadPath()).toEqual(expectedLoadPath);
    });

    it('should return correct load path when url contains /v4/dashboard', () => {
        history.state = { url: '/v4/dashboard' };
        const expectedLoadPath = '/v4/dashboard/locales/{{lng}}/{{ns}}.json';
        expect(getLoadPath()).toEqual(expectedLoadPath);
    });

    it('should return correct load path when url contains /v4/dashboard and additional path', () => {
        history.state = { url: '/v4/dashboard/example' };
        const expectedLoadPath = '/v4/dashboard/locales/{{lng}}/{{ns}}.json';
        expect(getLoadPath()).toEqual(expectedLoadPath);
    });

    it('should return correct load path when url contains /dashboard', () => {
        history.state = { url: '/dashboard' };
        const expectedLoadPath = '/dashboard/locales/{{lng}}/{{ns}}.json';
        expect(getLoadPath()).toEqual(expectedLoadPath);
    });

    it('should return correct load path when url contains /dashboard and additional path', () => {
        history.state = { url: '/dashboard/example' };
        const expectedLoadPath = '/dashboard/locales/{{lng}}/{{ns}}.json';
        expect(getLoadPath()).toEqual(expectedLoadPath);
    });
});
