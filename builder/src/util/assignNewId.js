import uniqId from './uniqId';

export default function assignNewId(obj) {
    obj.id = uniqId();
    if (Array.isArray(obj.content)) {
        obj.content.forEach((item) => assignNewId(item));
    }
}
