const router = require('express').Router();
const registerController = require('../controllers/registerController');

router.post('/resident', registerController.registerResident);
router.post('/admin', registerController.registerAdmin);

module.exports = router;