const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/order/:orderId', orderController.getOrderStatus);
router.post('/return', orderController.createReturn);
router.get('/refund/:id', orderController.getRefundStatus);

module.exports = router;
