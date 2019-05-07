function leadingZero(num) {
  if (String(num).length < 2) {
    return '0' + String(num);
  }

  return String(num);
}

export function digitalTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${leadingZero(min)}:${leadingZero(sec)}`;
}

export function hoursMinutes(seconds) {
  const hours = Math.floor(seconds / 60 / 60);
  const minutes = Math.floor(seconds / 60) % 60;

  return `${hours}h ${minutes}min`;
};

