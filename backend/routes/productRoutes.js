const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Search products
router.get('/search', productController.searchProducts);

// Get all products
router.get('/', productController.getProducts);

// Add a new product
router.post('/', productController.addProduct);

// Get products by gender
router.get('/by-gender', productController.getProductsByGender);

// Get filter options (brands, sizes, categories)
router.get('/filter-options', productController.getFilterOptions);

// Filter products based on selected filters
router.post('/filter', productController.filterProducts);


router.get('/productDetails/:variantId', productController.getProductDetails);

module.exports = router;
