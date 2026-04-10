export default function testScript(doc) {
    const timeSpanList = doc.querySelectorAll('.getTime');

    if (timeSpanList.length) {
        timeSpanList.forEach((timeSpan) => {
            if (timeSpan) {
                let endtime = timeSpan.dataset.time;
                let onlyHours = timeSpan.dataset.onlyHours;
                let zero = timeSpan.dataset.zero;
                let counterId = timeSpan.dataset.counter;
                let finishText = timeSpan.dataset.finishText;
                const counterEl = doc.querySelector(`.${counterId}`);

                function getTimeRemaining(endtime) {
                    const remainingTimes = endtime - Date.now();
                    const seconds = ~~((remainingTimes / 1000) % 60);
                    const minutes = ~~((remainingTimes / 1000 / 60) % 60);
                    const hours = ~~((remainingTimes / (1000 * 60 * 60)) % 24);
                    const days = ~~(remainingTimes / (1000 * 60 * 60 * 24));

                    const ModifyDays = onlyHours === 'only-hours' ? null : days;
                    const ModifyHours =
                        onlyHours === 'only-hours' ? days * 24 + hours : hours;
                    const addZero = (unit) =>
                        zero === 'with-zero'
                            ? `${unit}`.padStart(2, '0')
                            : `${unit}`;

                    return {
                        remainingTimes,
                        days: ModifyDays,
                        hours: addZero(ModifyHours),
                        minutes: addZero(minutes),
                        seconds: addZero(seconds),
                    };
                }

                function initilizeCounter() {
                    const daysDiv = counterEl.querySelector('.days');
                    const daysText = counterEl.querySelector('.days-text');
                    const daysSeparator =
                        counterEl.querySelector('.days-separator');
                    const hoursDiv = counterEl.querySelector('.hours');
                    const minutesDiv = counterEl.querySelector('.minutes');
                    const secondsDiv = counterEl.querySelector('.seconds');

                    updateCounter();
                    const timeinterval = setInterval(updateCounter, 1000);
                    function updateCounter() {
                        const {
                            days,
                            hours,
                            minutes,
                            seconds,
                            remainingTimes,
                        } = getTimeRemaining(endtime);

                        //MARK: hidden styled of days
                        let visibility = days === null ? 'none' : 'flex';
                        daysDiv.style.display = visibility;
                        daysText.style.display = visibility;
                        if (daysSeparator) {
                            daysSeparator.style.display = visibility;
                        }

                        if (remainingTimes < 1000) {
                            counterEl.innerHTML = `
                    <span class='finish-text'>
                        ${finishText}
                    </span>`;
                        }

                        //MARK: insert text in html

                        if (daysDiv) {
                            daysDiv.innerText = days;
                        }
                        hoursDiv.innerText = hours;
                        minutesDiv.innerText = minutes;
                        secondsDiv.innerText = seconds;

                        if (remainingTimes <= 0) {
                            clearInterval(timeinterval);
                        }
                    }
                }
                endtime - Date.now() > 0 && initilizeCounter();
                if (endtime - Date.now() <= 0) {
                    counterEl.innerHTML = `
                    <span class='finish-text'>
                        ${finishText}
                    </span>`;
                }
            }
        });
    }
}
