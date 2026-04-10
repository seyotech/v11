const isContainsScriptTag = (file) => {
    return new Promise((resolve) => {
        const scriptTagRegex = /<script[\s\S]*?<\/script>/gi;

        const reader = new FileReader();
        reader.onload = function (event) {
            const svgContent = event.target.result;
            return resolve(scriptTagRegex.test(svgContent));
        };
        reader.readAsText(file);
    });
};

export default isContainsScriptTag;
