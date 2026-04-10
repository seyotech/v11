import { DORIK_SITE_POSTFIX } from '../config';

export default function getDomain(domain, domainType) {
    if (domainType === 'SUB_DOMAIN') {
        return `${domain}${DORIK_SITE_POSTFIX}`;
    } else {
        return domain;
    }
}
