// backend/routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// Checkout and place a new order
router.post('/', checkoutController.createDraftOrder);

// Delete a draft order when user exits checkout
router.delete('/delete-draft', checkoutController.deleteDraftOrder);

// Finalize the order with billing info
router.post('/finalize/:orderId', checkoutController.finalizeOrder);

// Get a specific order by ID (e.g., for order confirmation)
router.get('/:id', checkoutController.getOrder);

// Get all orders for a logged-in user (userId will be fetched from session)
router.get('/ORDERS/user-orders', checkoutController.getUserOrders);


module.exports = router;