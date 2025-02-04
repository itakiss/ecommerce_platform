// backend/controllers/checkoutController.js
const db = require('../db');

// Create a draft order (Only if not already present)
exports.createDraftOrder = async (req, res) => {
  const user_id = req.session?.user?.id;
  if (!user_id) return res.status(400).json({ message: 'Login required' });

  try {
    // Delete old draft orders older than 30 minutes
    await db.query(`DELETE FROM orders WHERE order_status = 'Draft' AND created_at < NOW() - INTERVAL '30 minutes'`);

    // Check if the user already has a draft order
    const existingOrder = await db.query(
      `SELECT order_id FROM orders WHERE user_id = $1 AND order_status = 'Draft' LIMIT 1`, 
      [user_id]
    );

    if (existingOrder.rowCount > 0) {
      return res.json({ message: 'Draft order already exists', order_id: existingOrder.rows[0].order_id });
    }

    // Fetch cart items & calculate total
    const cartItems = await db.query(
      `SELECT ci.variant_id, pv.price, ci.quantity 
       FROM cart_items ci
       JOIN product_variants pv ON ci.variant_id = pv.variant_id
       WHERE ci.cart_id = (SELECT cart_id FROM cart WHERE user_id = $1)`, 
      [user_id]
    );

    if (cartItems.rowCount === 0) return res.status(400).json({ message: 'Cart is empty' });

    const totalAmount = cartItems.rows.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create draft order
    const order = await db.query(
      `INSERT INTO orders (user_id, total_amount, order_status) 
       VALUES ($1, $2, 'Draft') RETURNING order_id`, 
      [user_id, totalAmount]
    );

    const order_id = order.rows[0].order_id;

    // Insert cart items into order_items
    await db.query(
      `INSERT INTO order_items (order_id, variant_id, quantity, price_per_unit)
      SELECT 
          $1 AS order_id, 
          ci.variant_id, 
          ci.quantity, 
          pv.price AS price_per_unit
      FROM cart_items ci
      JOIN product_variants pv ON ci.variant_id = pv.variant_id
      WHERE ci.cart_id = (SELECT cart_id FROM cart WHERE user_id = $2)`,
     [order_id, user_id]
   );

    res.json({ message: 'Draft order created', order_id, totalAmount });
  } catch (error) {
    console.error('Error creating draft order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Finalize order
exports.finalizeOrder = async (req, res) => {
  const user_id = req.session?.user?.id;
  const { orderId } = req.params;
  if (!user_id) return res.status(401).json({ message: 'Login required' });

  try {
    // Verify draft order
    const order = await db.query(
      `SELECT total_amount FROM orders WHERE order_id = $1 AND user_id = $2 AND order_status = 'Draft'`, 
      [orderId, user_id]
    );

    if (order.rowCount === 0) return res.status(400).json({ message: 'Draft order not found' });

    await db.query('BEGIN');

    // Update order status & deduct stock
    await db.query(`UPDATE orders SET order_status = 'Pending', created_at = CURRENT_TIMESTAMP WHERE order_id = $1`, [orderId]);

    await db.query(
      `UPDATE product_variants 
       SET quantity_in_stock = quantity_in_stock - oi.quantity 
       FROM order_items oi 
       WHERE oi.order_id = $1 
       AND product_variants.variant_id = oi.variant_id 
       AND product_variants.quantity_in_stock >= oi.quantity`, 
      [orderId]
    );

    // Clear cart
    await db.query(`DELETE FROM cart_items WHERE cart_id = (SELECT cart_id FROM cart WHERE user_id = $1)`, [user_id]);

    await db.query('COMMIT');

    res.json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Error finalizing order:', error);
    res.status(500).json({ message: 'Order processing failed' });
  }
};


// Delete draft order
exports.deleteDraftOrder = async (req, res) => {
  const user_id = req.session?.user?.id;

  if (!user_id) {
    return res.status(400).json({ message: 'User must be logged in to delete draft orders' });
  }

  try {
    await db.query(
      `DELETE FROM orders WHERE user_id = $1 AND order_status = $2`,
      [user_id, 'Draft']
    );

    res.status(200).json({ message: 'Draft order deleted successfully' });
  } catch (error) {
    console.error('Error deleting draft order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get an order by ID (for order confirmation or details)
exports.getOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('SELECT * FROM orders WHERE order_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).send('Server error');
  }
};

exports.getUserOrders = async (req, res) => {
  // Get userId from session
  const userId = req.session?.user?.id;  // Access session userId

  if (!userId) {
    return res.status(401).json({ message: "User not logged in" });
  }

  try {
    const orders = await db.query(
            `SELECT o.order_id, o.created_at, o.order_status, o.total_amount,
            json_agg(json_build_object(
                'variant_id', oi.variant_id, 
                'quantity', oi.quantity, 
                'price', oi.price_per_unit
            )) AS items
              FROM orders o
              LEFT JOIN order_items oi ON o.order_id = oi.order_id
              WHERE o.user_id = $1
              GROUP BY o.order_id
              ORDER BY o.created_at DESC;
        `,   [userId] 
    );

    res.status(200).json(orders.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};