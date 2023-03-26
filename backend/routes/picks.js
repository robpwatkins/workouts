const express = require('express');
const { getPicks, createPick, updatePick } = require('../controllers/pickController');
const { ensureAuth } = require('../middleware/auth');

const router = express.Router();

router.use(ensureAuth);

router.get('/', ensureAuth, getPicks);
// router.get('/:id', ensureAuth, getWorkout);
router.post('/', ensureAuth, createPick);
// router.delete('/:id', ensureAuth, deleteWorkout);
router.patch('/:id', ensureAuth, updatePick);

module.exports = router;