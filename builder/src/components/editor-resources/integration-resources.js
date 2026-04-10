const integrationResources = {
    default: [
        {
            hoverControl: false,
            label: 'Analytics',
            modules: [
                {
                    path: 'integrations/googleAnalytics',
                    content: {
                        template: 'Input',
                        placeholder: 'UA-XX... OR G-XX...',
                        label: 'Google Analytics ID',
                    },
                },
                {
                    path: 'integrations/GTM',
                    content: {
                        template: 'Input',
                        placeholder: 'GTM-XX...',
                        label: 'Google Tag Manager ID',
                    },
                }
            ],
        },
    ],
};

export default integrationResources;
