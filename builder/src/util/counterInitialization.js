export default function initializeCounter(timeState, id, remainingTimes) {
    const d = document.getElementById('dorik-builder-iframe').contentDocument;
    const counterEl = d.querySelector(`.counter-${id}`);
    const daysDiv = counterEl.querySelector('.days');
    const daysSeparator = counterEl.querySelector('.days-separator');
    const hoursDiv = counterEl.querySelector('.hours');
    const minutesDiv = counterEl.querySelector('.minutes');
    const secondsDiv = counterEl.querySelector('.seconds');

    function updateCounter() {
        const { days, hours, minutes, seconds } = timeState;
        let visibility = days === null ? 'none' : 'flex';
        counterEl.firstChild.style.display = visibility;
        if (daysSeparator) {
            daysSeparator.style.display = visibility;
        }

        if (daysDiv) {
            daysDiv.innerText = days;
        }
        hoursDiv.innerText = hours;
        minutesDiv.innerText = minutes;
        secondsDiv.innerText = seconds;
    }
    remainingTimes > -2000 && updateCounter();
}
