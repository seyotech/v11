import Typed from 'typed.js';

export default function (doc) {
    const typeList = doc.querySelectorAll('.getOptions');

    if (typeList.length) {
        let dynamicClassList = [...typeList].map(
            (item) => item.dataset.dynamicClass
        );

        dynamicClassList.forEach((dynamiclass) => {
            const dynamicClass = doc.querySelector(
                `.${dynamiclass.split(' ')[0]}`
            );
            const optionsClass = dynamicClass.querySelector('.getOptions');
            const type = dynamicClass.querySelector(`.typed`);
            const typedString = dynamicClass.querySelector(`.typed-strings`);
            const typedCursor = dynamicClass.querySelectorAll('.typed-cursor');
            const { backspeed, typespeed, loop, cursorChar } =
                optionsClass.dataset;

            if (typedCursor.length) return;

            new Typed(type, {
                stringsElement: typedString,
                loop: loop === 'true' ? true : false,
                backSpeed: +backspeed,
                typeSpeed: +typespeed,
                cursorChar: cursorChar === 'true' ? '|' : '',
            });
        });
    }
}
