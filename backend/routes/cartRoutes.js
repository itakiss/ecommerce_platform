// backend/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Add product to cart
router.post('/', cartController.addToCart);

router.get('/', cartController.getCartItems); 

router.delete('/:variant_id', cartController.removeFromCart); 

router.post('/clear', cartController.clearCart);
// Get cart item count
router.get('/count', cartController.getCartItemCount);


module.exports = router; 
