'use strict';

const fs = require('fs');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

const length = 1000;
const startDate = new Date(2018, 11, 1);
const endDate = new Date(2019, 11, 28);

const tasks = [];

function randomSelect(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomTaskLength() {
  return Math.ceil(
    (Math.random() * 60 * 60) / 60
  ) * 120 * 1000;
}

function randomDateBetween(start, end) {
  const min = start.getTime();
  const diff = end - start;

  const rndValue = Math.floor(Math.random() * diff);

  return new Date(min + rndValue);
}

async function main() {
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
  
  try {
    await writeFile('output.json', JSON.stringify(tasks));
  } catch(err) {
    console.log(err);
  }
}

main();