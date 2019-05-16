const Mocha = require('mocha');

const fs = require('fs');
const path = require('path');

const server = require('../server');

const mocha = new Mocha();

const dirs = [
  path.join(__dirname, 'users'), 
  path.join(__dirname, 'tasks'),
  path.join(__dirname, 'timers')
];

server.on('appStarted', () => {
  for (let dir of dirs) {
    fs.readdirSync(dir)
      .filter(file => file.substr(-3) === '.js')
      .forEach(file => mocha.addFile(path.join(dir, file)));
  }
  
  const runner = mocha.run(failures => process.exitCode = failures ? 1: 0);

  runner.on('end', () => {
    server.emit('closeApp');
    process.exit();
  });
});