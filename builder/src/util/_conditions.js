/* eslint-disable eqeqeq */
function checkCondition(left, cond, right) {
    switch (cond) {
        case '===': {
            return left === right;
        }
        case '!==': {
            return left !== right;
        }
        case '==': {
            return left == right;
        }
        case '!=': {
            return left != right;
        }
        case '>': {
            return left > right;
        }
        case '<': {
            return left < right;
        }
        case '>=': {
            return left >= right;
        }
        case '<=': {
            return left <= right;
        }
        case '||': {
            return left || right;
        }
        case '&&': {
            return left && right;
        }

        default:
            return false;
    }
}

function isMatched(arr) {
    var result = arr.map((item) =>
        Array.isArray(item) ? checkCondition(...item) : item
    );
    var { length: len } = result;

    if (len === 1) return result[0];
    if (len % 3 !== 0) {
        throw new Error('Error in input');
    }
    return checkCondition(...result);
}

var a = [[[4, '===', '4']]];

isMatched(a);
