export default function ucFirst(string) {
    if (typeof string !== 'string') throw Error(`${string} is not a String`);
    string = string.trim();
    return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
}
