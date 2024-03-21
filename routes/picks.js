const express = require('express');
const {
  getPicks,
  getPick,
  createPick,
  updatePick,
  deletePick
} = require('../controllers/pickController');
const { ensureAuth } = require('../middleware/auth');

const router = express.Router();

router.use(ensureAuth);

router.get('/:all?', ensureAuth, getPicks);
router.get('/:id', ensureAuth, getPick);
router.post('/', ensureAuth, createPick);
router.patch('/:id', ensureAuth, updatePick);
router.delete('/:id', ensureAuth, deletePick);

module.exports = router;