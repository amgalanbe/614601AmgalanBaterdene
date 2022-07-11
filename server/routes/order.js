const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/placeOrder', orderController.placeOrder);

module.exports = router;