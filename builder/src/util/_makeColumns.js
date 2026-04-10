const makeCols = (cols) => {
    const quarantine = [];
    const result = [];
    for (let i = 1; i <= cols; i++) {
        const iSize = (i / i) * 100;
        if (!quarantine.includes(iSize)) {
            result.push({ selector: `${i}/${i}`, size: iSize });
        }
        quarantine.push(iSize);
        for (let j = 1; j <= i; j++) {
            const jSize = (j / i) * 100;
            if (quarantine.includes(jSize)) continue;
            result.push({ selector: `${j}/${i}`, size: jSize });
            quarantine.push(jSize);
        }
    }
};
