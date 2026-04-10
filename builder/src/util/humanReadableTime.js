export default function humanReadableTime(remainingTimes, zero, onlyHours) {
    const seconds = ~~((remainingTimes / 1000) % 60);
    const minutes = ~~((remainingTimes / 1000 / 60) % 60);
    const hours = ~~((remainingTimes / (1000 * 60 * 60)) % 24);
    const days = ~~(remainingTimes / (1000 * 60 * 60 * 24));

    const ModifyDays = onlyHours === 'only-hours' ? null : days;
    const ModifyHours = onlyHours === 'only-hours' ? days * 24 + hours : hours;
    const addZero = (unit) =>
        zero === 'with-zero' ? `${unit}`.padStart(2, '0') : `${unit}`;
    return {
        days: ModifyDays,
        hours: addZero(ModifyHours),
        minutes: addZero(minutes),
        seconds: addZero(seconds),
    };
}
