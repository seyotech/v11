export default function deepCopy(el) {
    return JSON.parse(JSON.stringify(el));
}
