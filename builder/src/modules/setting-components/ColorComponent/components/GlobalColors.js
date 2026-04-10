import { useEffect } from 'react';
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown } from 'modules/Shared/Dropdown';
import { useTranslation } from 'react-i18next';
import { antToken } from '../../../../antd.theme';

/**
 * GlobalColors Component
 *
 * @param {Object} props
 * @param {string} props.name - The name of the module path.
 * @param {string|{key: string, value: string}} props.value - The value of the color. Can be a string or an object with 'key' and 'value' properties.
 * @param {Function} props.onChange - Function to handle change events.
 * @param {Array<{key: string, label: string, value: string}>} props.colors - Array of color objects, each containing 'key', 'label', and 'value'.
 * @param {boolean} props.isGlobalColorActive - Indicates if the global color is active.
 *
 * @returns {JSX.Element} The rendered Gobal color dropdown.
 */

export const GlobalColors = ({
    name,
    onChange,
    value,
    colors,
    setColors,
    children,
    popupContainer,
    isGlobalColorActive,
}) => {
    const { t } = useTranslation('builder');
    const selectedKeys = colors
        .filter((color) => color.key === value?.key)
        .map(({ key, value }) => `${key}|${value}`);

    const options = [
        {
            key: 'globalColorsa',
            label: (
                <span style={{ color: '#ffffff' }}>{t('Global Colors')}</span>
            ),
            type: 'group',
            children: !colors.length
                ? [
                      {
                          label: t('No colors available'),
                          disabled: true,
                      },
                  ]
                : colors.map(({ key, value, label }) => {
                      return {
                          style: {
                              height: '32px',
                              fontSize: '13px',
                              lineHeight: '20px',
                              padding: '5px 12px',
                          },
                          key: `${key}|${value}`,
                          prefix: (
                              <span
                                  data-testid="color-indicator"
                                  style={{
                                      display: 'inline-block',
                                      marginBottom: '-3.5px',
                                      height: 16,
                                      width: 16,
                                      padding: '8px',
                                      border: `1px solid ${antToken.colorBorderSecondary}`,
                                      background: value,
                                      borderRadius: '4px',
                                  }}
                              />
                          ),
                          label:
                              label ||
                              key?.replace(/--color-(\d+)/, 'Color $1'),
                          onClick: ({ key: itemKey }) => {
                              const [key, value] = itemKey.split('|');
                              onChange({ name, value: { key, value } });
                          },
                      };
                  }),
        },
    ];

    useEffect(() => {
        const hasString = colors.some((color) => typeof color === 'string');
        if (hasString) {
            const keyValColors = colors.map((value, idx) => {
                if (typeof value !== 'string') return value;
                return {
                    value,
                    key: `--color-${idx + 1}`,
                };
            });
            setColors(keyValColors);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Dropdown
            options={options}
            width="max-content"
            selectedKeys={selectedKeys}
            placement={'bottomRight'}
            className="global-colors-dropdown"
            popupContainer={popupContainer}
        >
            {children || (
                <FontAwesomeIcon
                    style={{
                        color: isGlobalColorActive
                            ? antToken.colorPrimary
                            : antToken.colorTextDescription,
                        cursor: 'pointer',
                    }}
                    icon={icon({ type: 'regular', name: 'globe' })}
                />
            )}
        </Dropdown>
    );
};
