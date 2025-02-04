//backend/routes/favouriteRoutes.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// Route to add a product to favorites
router.post('/', favoriteController.addToFavorites);

// Route to remove a product from favorites
router.delete('/', favoriteController.removeFromFavorites);

// Route to get all favorite products for the user
router.get('/', favoriteController.getFavorites);

// Route to move all favorite products to cart and remove them from favorites
router.post('/move-all', favoriteController.moveAllFavoritesToCart);

router.get('/count', favoriteController.getFavoritesCount);

module.exports = router;
