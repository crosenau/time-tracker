'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const tasks = require('./routes/api/tasks');
const timers = require('./routes/api/timers');

const keys = require('./config/keys');
const env = require('./config/env');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let server;

mongoose.connect(
  keys.connectionString, 
  { 
    useNewUrlParser: true, 
    useFindAndModify: false
  }
)
  .then(() => {
    console.log('Successfully connected to database');
    app.use(passport.initialize());
    require('./config/passport')(passport);

    app.use('/api/users', users);
    app.use('/api/tasks', tasks);
    app.use('/api/timers', timers);

    if (env === 'production') {
      app.use(express.static(path.join(__dirname, 'client/build')));

      app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
      });
    }

    const port = keys.port || 5000;

    server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      app.emit('appStarted');
    });

    app.on('closeApp', () => {
      console.log('closing app');
      server.close();
    });
      })
  .catch(err => console.log(err));



module.exports = app;