import { render, screen } from '@/util/test-utils';
import SideBar from './SideBar';
import sideBarIconsTestId from './__mocks__/sideBarIconsTestId.js';
import { ComponentRenderProvider } from '@dorik/html-parser';

const renderLogo = () => (
    <div data-testid="dorik-logo">
        <svg
            width="28"
            height="30"
            fill="none"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M143.212 101.909H136.836C134.064 101.909 131.847 99.6454 131.847 96.9197V41.9895C131.847 39.2176 134.11 37 136.836 37H143.212C145.983 37 148.201 39.2638 148.201 41.9895V96.8735C148.201 99.6454 145.983 101.909 143.212 101.909Z"
                fill="white"
            />
            <path
                d="M99.3238 162.014C72.6672 162.014 51 140.67 51 114.475C51 88.2344 72.6672 66.8906 99.3238 66.8906H102.881C105.653 66.8906 107.917 69.1543 107.917 71.9262V77.5163C107.917 80.2882 105.653 82.5519 102.881 82.5519H99.3238C81.3063 82.5519 66.6151 96.8735 66.6151 114.521C66.6151 132.169 81.3063 146.491 99.3238 146.491C115.863 146.491 129.584 134.433 131.755 118.864C132.079 116.416 134.158 114.568 136.652 114.568H142.381C145.384 114.568 147.74 117.201 147.37 120.158C144.552 143.673 124.086 162.014 99.3238 162.014Z"
                fill="white"
            />
        </svg>
    </div>
);

const sidebarMenuItems = [
    {
        key: '/design',
        label: <div data-testid="design">Builder</div>,
    },
    {
        key: '/blogs',
        label: <div data-testid="blogs">Blogs</div>,
    },
    {
        key: '/collections',
        label: <div data-testid="collections">Collections</div>,
    },
];

const footerMenuItems = [
    {
        key: '/main-dashboard',
        label: <div data-testid="main-dashboard">Go to Main Dashboard</div>,
    },
];

describe('should ensure every icon curtly render in the sidebar', () => {
    test.each(sideBarIconsTestId)(
        ' should have an %s icon in the document',
        (testId) => {
            render(<SideBar renderLogo={renderLogo} />, {
                shortContext: {
                    setIds: [],
                    setImport: vi.fn(),
                    oldPages: [],
                    state: { json: {} },
                },
            });
            const icon = screen.getByTestId(testId);
            expect(icon).toBeInTheDocument();
            expect(screen.getByTestId('dorik-logo')).toBeInTheDocument();
        }
    );
    test.each(sidebarMenuItems)(
        'should render $key menu item from the "sidebarMenuItems"',
        ({ key }) => {
            render(
                <ComponentRenderProvider
                    value={{
                        sidebarMenuItems,
                        isCMSDashboard: true,
                    }}
                >
                    <SideBar renderLogo={renderLogo} />
                </ComponentRenderProvider>,
                {
                    shortContext: {
                        setIds: [],
                        setImport: vi.fn(),
                        oldPages: [],
                        state: { json: {} },
                    },
                }
            );
            const icon = screen.getByTestId(key.replace('/', ''));
            expect(icon).toBeInTheDocument();
        }
    );

    test.each(footerMenuItems)(
        'should render $key menu item from the "footerMenuItems"',
        ({ key }) => {
            render(
                <ComponentRenderProvider
                    value={{
                        footerMenuItems,
                        sidebarMenuItems,
                        isCMSDashboard: true,
                    }}
                >
                    <SideBar renderLogo={renderLogo} />
                </ComponentRenderProvider>,
                {
                    shortContext: {
                        setIds: [],
                        setImport: vi.fn(),
                        oldPages: [],
                        state: { json: {} },
                    },
                }
            );
            const icon = screen.getByTestId(key.replace('/', ''));
            expect(icon).toBeInTheDocument();
        }
    );

    test.each([
        'elements',
        'components',
        'pages',
        'GLOBAL-SETTINGS',
        'navigation',
        'mediaLibrary',
    ])('should not render ("%s") when "isCMSDashboard" is true', (testId) => {
        render(
            <ComponentRenderProvider
                value={{
                    footerMenuItems,
                    sidebarMenuItems,
                    isCMSDashboard: true,
                }}
            >
                <SideBar renderLogo={renderLogo} />
            </ComponentRenderProvider>,
            {
                shortContext: {
                    setIds: [],
                    setImport: vi.fn(),
                    oldPages: [],
                    state: { json: {} },
                },
            }
        );
        const icon = screen.queryByTestId(testId);
        expect(icon).not.toBeInTheDocument();
    });

    test.each([
        'elements',
        'components',
        'pages',
        'GLOBAL-SETTINGS',
        'navigation',
        'mediaLibrary',
    ])('should render ("%s") when "isCMSDashboard" is false', (testId) => {
        render(
            <ComponentRenderProvider
                value={{
                    footerMenuItems,
                    sidebarMenuItems,
                    isCMSDashboard: false,
                }}
            >
                <SideBar renderLogo={renderLogo} />
            </ComponentRenderProvider>,
            {
                shortContext: {
                    setIds: [],
                    setImport: vi.fn(),
                    oldPages: [],
                    state: { json: {} },
                },
            }
        );
        const icon = screen.getByTestId(testId);
        expect(icon).toBeInTheDocument();
    });
});
