'use strict';

const router = require('express').Router();
const passport = require('passport');

const session = require('../../models/session');

router.post('/save', passport.authenticate('jwt', {session: false }), async (req, res) => {
  console.log(req.body);

  try {
    const saveResult = await session.save(req.body);

    console.log('saveResult: ', saveResult);
    
    if (result.ops.length === 0) {
      throw Error('Could not save session');
    }

    return '?';
  } catch(err) {
    console.log(err);
  }
});

module.exports = router;