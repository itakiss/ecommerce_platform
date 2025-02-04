//backend/controllers/productController.js
const db = require('../db');

// Fetch products with variants and main images
exports.getProducts = async (req, res) => {
  try {
    const { gender } = req.query;
    console.log(`Fetching products for gender: ${gender || 'all'}`);

    const genderFilter = gender ? `AND (p.gender = $1 OR p.gender = 'unisex')` : '';
    const params = gender ? [gender] : [];

    const result = await db.query(
      `SELECT 
        p.product_id, p.name AS product_name, p.description, p.gender, 
        p.brand_id, b.name AS brand_name, 
        p.category_id, c.name AS category_name,
        p.avg_rating, p.total_reviews,
        pv.variant_id, pv.bottle_size, pv.price, pv.quantity_in_stock, pv.sku,
        im.image_url AS main_image_url
      FROM products p
      JOIN brands b ON p.brand_id = b.brand_id
      JOIN categories c ON p.category_id = c.category_id
      JOIN product_variants pv ON p.product_id = pv.product_id
      LEFT JOIN product_images im ON pv.variant_id = im.variant_id AND im.is_main = TRUE
      WHERE pv.quantity_in_stock > 0 ${genderFilter}
      ORDER BY p.product_id, pv.variant_id;`,
      params
    );

    const products = result.rows.map(row => ({
      product_id: row.product_id,
      product_name: row.product_name,
      description: row.description,
      gender: row.gender,
      brand_name: row.brand_name,
      category_name: row.category_name,
      avg_rating: row.avg_rating,
      total_reviews: row.total_reviews,
      variant: {
        variant_id: row.variant_id,
        bottle_size: row.bottle_size,
        price: row.price,
        quantity_in_stock: row.quantity_in_stock,
        sku: row.sku,
        main_image_url: row.main_image_url,
      }
    }));

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Server error');
  }
};


// Add product with variants
exports.addProduct = async (req, res) => {
  const { name, description, gender, brand_id, category_id, variants } = req.body;
  console.log("Adding new product:", req.body);

  try {
    const productResult = await db.query(
      `INSERT INTO products (name, description, gender, brand_id, category_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;`, 
      [name, description, gender, brand_id, category_id]
    );

    console.log("Created product:", productResult.rows[0]);
    const product = productResult.rows[0];

    const variantQueries = variants.map(variant => (
      db.query(
        `INSERT INTO product_variants (product_id, bottle_size, price, quantity_in_stock, sku)
        VALUES ($1, $2, $3, $4, $5);`,
        [product.product_id, variant.bottle_size, variant.price, variant.quantity_in_stock, variant.sku]
      )
    ));

    await Promise.all(variantQueries);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Server error');
  }
};

// Search products by name
exports.searchProducts = async (req, res) => {
  const { query } = req.query;
  console.log("Searching for products with query:", query);

  try {
    const result = await db.query(
      `SELECT p.product_id, p.name AS product_name, p.description, p.gender,
             pv.variant_id, pv.bottle_size, pv.price, pv.quantity_in_stock, 
             im.image_url AS main_image_url
      FROM products p
      JOIN product_variants pv ON p.product_id = pv.product_id
      LEFT JOIN product_images im ON pv.variant_id = im.variant_id AND im.is_main = TRUE
      WHERE LOWER(p.name) LIKE LOWER($1)
      ORDER BY p.product_id, pv.variant_id;`,
      [`%${query}%`]
    );


    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).send('Server error');
  }
};

exports.getFilterOptions = async (req, res) => {
  try {
    const { gender } = req.query;
    console.log(`Fetching filter options for gender: ${gender || 'all'}`);

    const genderFilter = gender ? `AND (p.gender = $1 OR p.gender = 'unisex')` : '';
    const params = gender ? [gender] : [];

    const [brands, sizes, categories] = await Promise.all([
      db.query(
        `SELECT DISTINCT b.brand_id, b.name 
         FROM brands b
         JOIN products p ON p.brand_id = b.brand_id
         JOIN product_variants pv ON p.product_id = pv.product_id
         WHERE pv.quantity_in_stock > 0 ${genderFilter}
         ORDER BY b.name;`,
        params
      ),
      db.query(
        `SELECT DISTINCT pv.bottle_size 
         FROM product_variants pv 
         JOIN products p ON pv.product_id = p.product_id
         WHERE pv.quantity_in_stock > 0 ${genderFilter}
         ORDER BY pv.bottle_size;`,
        params
      ),
      db.query(
        `SELECT DISTINCT c.category_id, c.name 
         FROM categories c
         JOIN products p ON p.category_id = c.category_id
         JOIN product_variants pv ON p.product_id = pv.product_id
         WHERE pv.quantity_in_stock > 0 ${genderFilter}
         ORDER BY c.name;`,
        params
      ),
    ]);

    res.status(200).json({
      brands: brands.rows,
      sizes: sizes.rows.map(row => row.bottle_size),
      categories: categories.rows,
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).send('Server error');
  }
};


// Get Products Filtered by Gender
exports.getProductsByGender = async (req, res) => {
  const { gender } = req.query;

  try {
    const result = await db.query(`
      SELECT p.product_id, p.name, p.description, p.gender, p.brand_id, p.category_id, p.avg_rating, p.total_reviews,
             pv.variant_id, pv.bottle_size, pv.price, pv.quantity_in_stock,
             im.image_id, im.image_url, im.alt_text, im.is_main
      FROM products p
      JOIN product_variants pv ON p.product_id = pv.product_id
      LEFT JOIN product_images im ON pv.variant_id = im.variant_id AND im.is_main = TRUE
      WHERE p.gender = $1 OR p.gender = 'unisex'
      ORDER BY p.product_id, pv.variant_id
    `, [gender]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching products by gender:', error);
    res.status(500).send('Server error');
  }
};

exports.filterProducts = async (req, res) => {
  const { gender, brand, size, category } = req.body;
  const filters = [];
  const params = [];
  let index = 1;

  if (gender) {
    filters.push(`(p.gender = $${index} OR p.gender = 'unisex')`);
    params.push(gender);
    index++;
  }
  if (category) {
    filters.push(`c.name ILIKE $${index}`);
    params.push(`%${category}%`);
    index++;
  }
  if (size) {
    filters.push(`pv.bottle_size = $${index}`);
    params.push(parseFloat(size));
    index++;
  }
  if (brand) {
    filters.push(`b.name ILIKE $${index}`);
    params.push(`%${brand}%`);
    index++;
  }
  filters.push("pv.quantity_in_stock > 0");
  console.log("Filter parameters:", params);

  
  const query = `
    SELECT p.product_id, p.name AS product_name, b.name AS brand_name, c.name AS category_name,
           pv.variant_id, pv.bottle_size, pv.price, pv.quantity_in_stock,
           im.image_url AS main_image_url
    FROM products p
    JOIN product_variants pv ON p.product_id = pv.product_id
    JOIN brands b ON p.brand_id = b.brand_id
    JOIN categories c ON p.category_id = c.category_id
    LEFT JOIN product_images im ON pv.variant_id = im.variant_id AND im.is_main = TRUE
    ${filters.length ? `WHERE ${filters.join(' AND ')}` : ''}
    ORDER BY p.product_id, pv.variant_id;`;

  try {
    console.log("Filter parameters:", params);
    console.log("Generated SQL Query:", query);


    const result = await db.query(query, params);
    console.log("Filtered products count:", result.rows.length);
    console.log("Filtered products data:", result.rows);
    res.status(200).json(result.rows);
    
  } catch (error) {
    console.error('Error filtering products:', error);
    res.status(500).send('Server error');
  }
};



// Fetch product details by variant_id
exports.getProductDetails = async (req, res) => {
  const { variantId } = req.params;

  try {
    const result = await db.query(
      `SELECT 
        p.product_id, p.name AS product_name, p.description, 
        b.name AS brand_name, c.name AS category_name,
        pv.variant_id, pv.bottle_size, pv.price, pv.quantity_in_stock, pv.sku,
        im.image_url AS main_image_url,
        pi.image_url AS additional_images
      FROM products p
      JOIN brands b ON p.brand_id = b.brand_id
      JOIN categories c ON p.category_id = c.category_id
      JOIN product_variants pv ON p.product_id = pv.product_id
      LEFT JOIN product_images im ON pv.variant_id = im.variant_id AND im.is_main = TRUE
      LEFT JOIN product_images pi ON pv.variant_id = pi.variant_id AND pi.is_main = FALSE
      WHERE pv.variant_id = $1
      ORDER BY pi.image_id`,
      [variantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const mainImage = result.rows.find(row => row.main_image_url);
    const additionalImages = result.rows
      .filter(row => row.additional_images)
      .map(row => row.additional_images);

    const product = {
      product_id: result.rows[0].product_id,
      product_name: result.rows[0].product_name,
      description: result.rows[0].description,
      brand_name: result.rows[0].brand_name,
      category_name: result.rows[0].category_name,
      variant: {
        variant_id: result.rows[0].variant_id,
        bottle_size: result.rows[0].bottle_size,
        price: result.rows[0].price,
        quantity_in_stock: result.rows[0].quantity_in_stock,
        sku: result.rows[0].sku,
        main_image_url: mainImage.main_image_url,
        additional_images: additionalImages,
      },
    };

    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).send('Server error');
  }
};

exports.getDynamicFilters = async (req, res) => {
  const { gender } = req.query; // Extend to include other filters if needed

  try {
    const filtersQuery = `
      SELECT DISTINCT b.brand_id, b.name AS brand_name
      FROM brands b
      JOIN products p ON b.brand_id = p.brand_id
      WHERE p.gender = $1 OR p.gender = 'unisex';

      SELECT DISTINCT pv.bottle_size
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.product_id
      WHERE p.gender = $1 OR p.gender = 'unisex';
    `;

    const result = await db.query(filtersQuery, [gender]);
    res.status(200).json({
      brands: result[0].rows,
      sizes: result[1].rows.map((row) => row.bottle_size),
    });
  } catch (error) {
    console.error('Error fetching dynamic filters:', error);
    res.status(500).send('Server error');
  }
};
