const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/', cartController.getItems);
router.post('/', cartController.addItem);
router.delete('/', cartController.removeItem);

module.exports = router;