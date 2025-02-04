// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.get("/:id", orderController.getOrderById); // Get order

module.exports = router;