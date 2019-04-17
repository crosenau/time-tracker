'use strict';

const length = 100;
const log = [];

function randomSelect(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTaskLength() {
  return Math.ceil((Math.random()* 60 * 60) / 60) * 60;
}

function randomDateBetween(startDate, endDate) {
  const min = startDate.getTime();
  const max = endDate.getTime();
  const diff = endDate - startDate;

  const rndValue = Math.floor(Math.random() * diff);

  return new Date(min + rndValue);
}

for (let x = 0; x < length; x++) {
  const taskName = randomSelect(['Work', 'Studying', 'Reading', 'Gaming']);
  const taskLength = randomTaskLength();
  const completedAt = randomDateBetween(new Date(2019, 0, 1), new Date());

  log.push({
    taskName,
    taskLength,
    completedAt
  });
}

console.log(JSON.stringify(log));