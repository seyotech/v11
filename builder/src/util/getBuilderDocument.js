const getBuilderDocument = () => {
    return document.getElementById('dorik-builder-iframe').contentWindow
        .document;
};

export default getBuilderDocument;
