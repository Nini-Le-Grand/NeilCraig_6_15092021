const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');

router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getSauce);
router.get('/', auth, sauceCtrl.getAllSauces);

module.exports = router;