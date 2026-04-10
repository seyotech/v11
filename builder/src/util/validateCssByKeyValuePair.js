export const validateCssByKeyValuePair = (cssinText) => {
    const rule = /^(?:\s*[\w-]+\s*:\s*[^;:]+;\s*)+$/gim;

    return rule.test(cssinText.replace(/\n/g, ''));
};
