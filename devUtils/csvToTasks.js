const csv = require('csv-parser');
const fs = require('fs');
const { promisify } = require('util');

const writeFile = promisify(fs.writeFile);

const tasks = [];

fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', row => {
    const sessionLength = Number(row['Session length']
      .replace(/^0*:/, '')
      .replace(/:00$/, '')
    );
    const taskLength = sessionLength * 60 * 1000; // convert minutes to ms

    for (let x = 0; x < Number(row['Work Sessions']); x++) {
      const completedAt = new Date(row['Date']);
      
      completedAt.setMinutes(sessionLength * x);

      tasks.push({
        taskName: 'Coding',
        taskLength,
        completedAt
      });
    }
  })
  .on('end', async () => {
    try {
      await writeFile('output.json', JSON.stringify(tasks));
    } catch(err) {
      console.log(err);
    }

    console.log('CSV converted to JSON');
  });
