export let controller = new AbortController();
export const imageGenerateByModelType = async ({
    aiFetcher,
    model,
    ...value
}) => {
    try {
        controller = new AbortController();
        return await aiFetcher(`/images/generations`, JSON.stringify(value), {
            signal: controller.signal,
        }).then((res) => res.data);
    } catch (error) {
        console.log({ error });
        return Promise.reject(error);
    }
};

export const getImageVariation = async ({ aiFetcher, ...value }) => {
    try {
        controller = new AbortController();
        return aiFetcher(
            '/api-extended/images/model-2/variations',
            JSON.stringify(value),
            {
                signal: controller.signal,
            }
        ).then((res) => res.data);
    } catch (error) {
        console.log({ error });
    }
};
