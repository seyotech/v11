const getHoverStateConditions = (
    conditions,
    haverPathPrefix = 'pseudoClass/hover'
) =>
    conditions.map((cnd) =>
        Array.isArray(cnd)
            ? getHoverStateConditions(cnd, haverPathPrefix)
            : // : /\//.test(cnd)
              // ? `${haverPathPrefix}/${cnd}`
              cnd
    );

export default getHoverStateConditions;
