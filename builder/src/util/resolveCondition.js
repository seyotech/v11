/* eslint-disable eqeqeq */
const resolveCondition = (start, pact, end) => {
    switch (pact) {
        case '===':
            return start === end;
        case '!==':
            return start !== end;
        case '==':
            return start == end;
        case '!=':
            return start != end;
        case '>':
            return start > end;
        case '>=':
            return start >= end;
        case '<':
            return start < end;
        case '<=':
            return start <= end;
        case '||':
            return start || end;
        case '&&':
            return start && end;
        default:
            return false;
    }
};

export default resolveCondition;
