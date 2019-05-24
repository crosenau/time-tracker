'use strict';

const length = 1000;
const startDate = new Date(2018, 0, 1);
const endDate = new Date(2019, 4, 15);

const tasks = [];

function randomSelect(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTaskLength() {
  return Math.ceil(
    (Math.random() * 60 * 60) / 60
  ) * 60 * 1000;
}

function randomDateBetween(start, end) {
  const min = start.getTime();
  const diff = end - start;

  const rndValue = Math.floor(Math.random() * diff);

  return new Date(min + rndValue);
}

for (let x = 0; x < length; x++) {
  const taskName = randomSelect(['Work', 'Studying', 'Reading', 'Gaming']);
  const taskLength = randomTaskLength();
  const completedAt = randomDateBetween(startDate, endDate);

  tasks.push({
    taskName,
    taskLength,
    completedAt
  });
}

console.log(JSON.stringify(tasks));