const getInstance = (instance) => {
    return [
        'style',
        'type',
        'media',
        'animation',
        'advanced.customStyle',
        'pseudoClass',
        ...instance,
    ];
};

export default getInstance;
