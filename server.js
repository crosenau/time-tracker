'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const sessions = require('./routes/api/sessions');
const initDb = require('./db').initDb;
const keys = require('./config/keys');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let server;

initDb()
  .then(db => {
    console.log('Successfully connected to database');
    
    app.use(passport.initialize());
    require('./config/passport')(passport);

    app.use('/api/users', users);
    app.use('/api/sessions', sessions);

    const port = keys.port || 5000;

    server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      app.emit('appStarted');
    });
  })
  .catch(err => console.log(err));

app.on('closeApp', () => {
  console.log('closing app');
  server.close();
});

module.exports = app;