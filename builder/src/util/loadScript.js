export default function (id, url, callback, doc) {
    const existingScript = doc.getElementById(id);

    if (!existingScript) {
        const script = document.createElement('script');
        script.src = url;
        script.id = id;
        doc.body.appendChild(script);

        script.onload = () => {
            if (callback) callback();
        };
    }

    if (existingScript && callback) callback();
}
