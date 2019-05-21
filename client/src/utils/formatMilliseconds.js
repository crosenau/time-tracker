import parseMilliseconds from 'parse-ms';

function leadingZero(num) {
  if (String(num).length < 2) {
    return '0' + String(num);
  }

  return String(num);
}

export function digitalTime(ms) {
  const time  = parseMilliseconds(ms);

  return `${leadingZero(time.minutes)}:${leadingZero(time.seconds)}`;
};

export function hoursMinutes(ms) {
  const time = parseMilliseconds(ms);

  const hours = time.days ? time.days * 24 + time.hours : time.hours;
  const minutes = time.minutes;

  return `${hours}h ${minutes}min`;
};

