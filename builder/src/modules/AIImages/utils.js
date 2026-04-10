export const getBase64Image = async (url) => {
    const isFullUrl = /^https?:\/\//.test(url);
    if (!isFullUrl) return url;
    if (!url) return '';
    const response = await fetch(url, { headers: { Accept: 'image/png' } });
    const blob = await response.blob();
    const reader = new FileReader();
    await new Promise((resolve, reject) => {
        reader.onloadend = resolve;
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
    const res = reader.result.replace(/^data:.+;base64,/, '');
    return res;
};
