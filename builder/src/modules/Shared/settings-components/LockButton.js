import { icon } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

function LockButton({ isLocked, handleLock }) {
    const { t } = useTranslation('builder');
    const iconProps = isLocked
        ? {
              icon: icon({
                  name: 'lock',
                  style: 'solid',
              }),
              style: { color: '#3830b3' },
          }
        : {
              icon: icon({
                  name: 'lock',
                  style: 'regular',
              }),
              style: { color: '#747192' },
          };
    return (
        <Tooltip title={t('Sync Values')}>
            <Button
                data-testid={`lock-button`}
                type="text"
                size="small"
                icon={
                    <FontAwesomeIcon data-testid="lock-icon" {...iconProps} />
                }
                onClick={handleLock}
            />
        </Tooltip>
    );
}

export default LockButton;
