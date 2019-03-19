'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const initDb = require('./db').initDb;
const keys = require('./config/keys');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

initDb()
  .then(db => {
    console.log('Successfully connected to database');
    
    app.use(passport.initialize());
    require('./config/passport')(passport);

    app.use('/api/users', users);

    const port = keys.port || 5000;

    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch(err => console.log(err));