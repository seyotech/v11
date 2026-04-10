function kebabCase(string) {
    return string.replace(/([A-Z])/g, (n) => `-${n.toLowerCase()}`);
}

export default kebabCase;
