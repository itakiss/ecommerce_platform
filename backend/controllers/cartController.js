// backend/controllers/cartController.js
const db = require('../db');

// Add item to cart
exports.addToCart = async (req, res) => {
  const io = req.app.get('io'); 
  const { variant_id, quantity = 1 } = req.body;
  const user_id = req.session?.user?.id;

  if (!user_id) {
    return res.status(400).json({ message: 'Login required' });
  }

  try {
    const cart = await db.query(
      `INSERT INTO cart (user_id, created_at) 
       VALUES ($1, CURRENT_TIMESTAMP) 
       ON CONFLICT (user_id) DO NOTHING 
       RETURNING cart_id`, 
      [user_id]
    );

    const cart_id = cart.rowCount > 0 ? cart.rows[0].cart_id : (await db.query(
      `SELECT cart_id FROM cart WHERE user_id = $1`, [user_id]
    )).rows[0].cart_id;

    await db.query(
      `INSERT INTO cart_items (cart_id, variant_id, quantity, added_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT ON CONSTRAINT cart_items_unique
       DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity;`, 
      [cart_id, variant_id, quantity]
    );

    const countResult = await db.query(
      `SELECT COUNT(DISTINCT variant_id) AS count 
       FROM cart_items 
       WHERE cart_id = $1`, 
      [cart_id]
    );

    io.emit('cartUpdated', { userId: user_id, count: countResult.rows[0].count });

    res.json({ message: 'Product added to cart', count: countResult.rows[0].count });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const io = req.app.get('io');
  const { variant_id } = req.params;
  const user_id = req.session?.user?.id;

  if (!user_id) {
    return res.status(400).json({ message: 'Login required' });
  }

  try {
    await db.query(
      `DELETE FROM cart_items 
       WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = $1) 
       AND variant_id = $2`, 
      [user_id, variant_id]
    );

    const countResult = await db.query(
      `SELECT COUNT(DISTINCT variant_id) AS count 
       FROM cart_items 
       WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = $1)`, 
      [user_id]
    );

    io.emit('cartUpdated', { userId: user_id, count: countResult.rows[0].count });

    res.json({ message: 'Item removed from cart', count: countResult.rows[0].count });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Clear entire cart
exports.clearCart = async (req, res) => {
  const io = req.app.get('io');
  const user_id = req.session?.user?.id;

  if (!user_id) {
    return res.status(400).json({ message: 'Login required' });
  }

  try {
    await db.query(
      `DELETE FROM cart_items WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = $1)`, 
      [user_id]
    );

    io.emit('cartUpdated', { userId: user_id, count: 0 });

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get cart item count
exports.getCartItemCount = async (req, res) => {
  const user_id = req.session?.user?.id;

  if (!user_id) {
    return res.status(400).json({ message: 'Login required' });
  }

  try {
    const countResult = await db.query(
      `SELECT COUNT(DISTINCT variant_id) AS count 
       FROM cart_items 
       WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = $1)`,
      [user_id]
    );

    res.status(200).json({ count: countResult.rows[0].count });
  } catch (error) {
    console.error('Error fetching cart item count:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get cart items
exports.getCartItems = async (req, res) => {
  const user_id = req.session?.user?.id;
  if (!user_id) return res.status(400).json({ message: 'Login required' });

  try {
    const cartItems = await db.query(
      `SELECT pv.variant_id, p.name, pv.price, ci.quantity, 
              (SELECT image_url FROM product_images WHERE variant_id = pv.variant_id LIMIT 1) AS image_url 
       FROM cart_items ci
       JOIN product_variants pv ON ci.variant_id = pv.variant_id
       JOIN products p ON pv.product_id = p.product_id
       WHERE ci.cart_id = (SELECT cart_id FROM cart WHERE user_id = $1)`, 
      [user_id]
    );

    res.json({ items: cartItems.rows });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
