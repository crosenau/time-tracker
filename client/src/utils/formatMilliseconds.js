import parseMilliseconds from 'parse-ms';

function leadingZero(num) {
  if (String(num).length < 2) {
    return '0' + String(num);
  }

  return String(num);
}

export function digitalTime(ms) {
  const time  = parseMilliseconds(ms);

  const minutes = time.hours * 60 + time.minutes;

  return `${leadingZero(minutes)}:${leadingZero(time.seconds)}`;
};

export function hoursMinutes(ms) {
  const time = parseMilliseconds(ms);

  const hours = time.days * 24 + time.hours;
  const minutes = time.seconds > 29 ? time.minutes + 1 : time.minutes;

  return `${hours}h ${minutes}min`;
};

export function toSeconds(ms) {
  const time = parseMilliseconds(ms);

  return time.hours * 3600 + time.minutes * 60 + time.seconds;
}

export function toMinutes(ms) {
  const time = parseMilliseconds(ms);

  return time.hours * 60 + time.minutes;
}
