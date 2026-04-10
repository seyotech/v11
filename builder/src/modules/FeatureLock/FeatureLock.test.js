import { FeatureLock } from './FeatureLock';
import { render, screen, userEvent } from 'util/test-utils';
import { getByClassName, getByIconName } from 'util/custom-queries';

const dorikAppURL = 'https://app.dorik.com';
const pricingPagePath = '/dashboard/pricing/plans';

const mockUseLimit = vi.fn(() => ({
    hasPricingPagePermission: vi.fn(() => true),
}));

const mockOpenFn = vi.fn();

vi.stubGlobal('open', mockOpenFn);
const initialContext = {
    builderContext: { dorikAppURL, useLimit: mockUseLimit },
};

describe('<FeatureLock', () => {
    test('should not render lock icon when  isFeatureLocked is false', () => {
        render(<FeatureLock isLocked={false} />, initialContext);
        const lockIcon = getByIconName('lock');
        expect(lockIcon).not.toBeInTheDocument();
    });

    test('should render only lock icon when isFeatureLocked is true', () => {
        render(<FeatureLock isLocked={true} />, initialContext);
        const lockIcon = getByIconName('lock');
        expect(lockIcon).toBeInTheDocument();
    });

    test('should render children with lock icon when isFeatureLocked is true', () => {
        render(
            <FeatureLock isLocked={true}>
                {() => <p>Locked label</p>}
            </FeatureLock>,
            initialContext
        );
        const childLabel = screen.getByText('Locked label');
        expect(childLabel).toBeInTheDocument();
        const lockIcon = getByIconName('lock');
        expect(lockIcon).toBeInTheDocument();
    });

    test('should render only children without lock icon when isFeatureLocked is false', () => {
        render(
            <FeatureLock isLocked={false}>
                {() => <p>Locked label</p>}
            </FeatureLock>,
            initialContext
        );
        const childLabel = screen.getByText('Locked label');
        expect(childLabel).toBeInTheDocument();
        const lockIcon = getByIconName('lock');
        expect(lockIcon).not.toBeInTheDocument();
    });

    test('should through error if children is not a function', () => {
        expect(() =>
            render(
                <FeatureLock isLocked={true}>
                    <p>Locked label</p>
                </FeatureLock>,
                initialContext
            )
        ).toThrow('children is not a function');
    });

    test('should open plan upgrade modal when click on lock icon', async () => {
        render(<FeatureLock isLocked={true} />, initialContext);

        const lockIcon = getByIconName('lock');
        await userEvent.click(lockIcon);
        const planUpgradeTitle = screen.getByText('Feature Restricted');
        const planUpgradeDescription = screen.getByText(
            'This feature is not part of your current plan. To gain access, please upgrade your subscription.'
        );
        expect(planUpgradeTitle).toBeInTheDocument();
        expect(planUpgradeDescription).toBeInTheDocument();
    });

    test('should open plan upgrade modal when click on lock icon for team member', async () => {
        render(<FeatureLock isLocked={true} />, {
            builderContext: {
                ...initialContext.builderContext,
                useLimit: vi.fn(() => ({
                    hasPricingPagePermission: vi.fn(() => false),
                })),
            },
        });

        const lockIcon = getByIconName('lock');
        await userEvent.click(lockIcon);
        const planUpgradeTitle = screen.getByText('Feature Restricted');
        const planUpgradeDescription = screen.getByText(
            'Please inform the site owner that this feature is not included in the current plan. To access it, they will need to upgrade their subscription.'
        );
        expect(planUpgradeTitle).toBeInTheDocument();
        expect(planUpgradeDescription).toBeInTheDocument();
    });

    test.each(['CMS', 'STATIC'])(
        'should plan upgrade modal navigation work properly',
        async (appName) => {
            render(<FeatureLock isLocked={true} />, {
                builderContext: { dorikAppURL, useLimit: mockUseLimit },
            });

            const lockIcon = getByIconName('lock');
            await userEvent.click(lockIcon);
            const planUpgradeBtn = screen.getByText('View site plans');

            // click cancel button to close the modal
            await userEvent.click(planUpgradeBtn);

            expect(mockOpenFn).toHaveBeenCalledWith(
                `${dorikAppURL}${pricingPagePath}`
            );
        }
    );

    test('should close upgrade modal when clicked on cancel button', async (appName) => {
        render(<FeatureLock isLocked={true} />, {
            builderContext: { dorikAppURL, useLimit: mockUseLimit },
        });

        const lockIcon = getByIconName('lock');
        await userEvent.click(lockIcon);
        const cancelBtn = screen.getByText('No thanks');

        // click cancel button to close the modal
        await userEvent.click(cancelBtn);
        const modalWrapper = getByClassName('ant-modal-wrap');
        expect(modalWrapper).toHaveStyle('display: none;');
    });
});
