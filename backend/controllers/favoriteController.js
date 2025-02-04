//backend/controllers/favouriteController.js
const db = require('../db');


exports.addToFavorites = async (req, res) => {
  const io = req.app.get('io');
  const { variant_id } = req.body; 
  const user_id = req.session?.user?.id;

  if (!user_id) {
    return res.status(400).json({ message: 'User must be logged in to add favorites' });
  }

  try {
    const favorite = await db.query(
      'SELECT * FROM favorites WHERE user_id = $1 AND variant_id = $2', 
      [user_id, variant_id]
    );

    if (favorite.rows.length === 0) {
      await db.query(
        'INSERT INTO favorites (user_id, variant_id, added_at) VALUES ($1, $2, CURRENT_TIMESTAMP)',
        [user_id, variant_id]
      );

      const countResult = await db.query('SELECT COUNT(*)::INTEGER AS count FROM favorites WHERE user_id = $1', [user_id]);
      
      io.emit('favoritesUpdated', { userId: user_id, count: countResult.rows[0].count });

      return res.status(200).json({ message: 'Product added to favorites', count: countResult.rows[0].count });
    } else {
      return res.status(400).json({ message: 'Product is already in favorites' });
    }
  } catch (error) {
    console.error('Error adding product to favorites:', error);
    res.status(500).send('Server error');
  }
};
exports.removeFromFavorites = async (req, res) => {
  const io = req.app.get('io');
  const { variant_id } = req.body;
  const user_id = req.session?.user?.id;

  if (!user_id) {
    return res.status(400).json({ message: 'User must be logged in to remove favorites' });
  }

  try {
    await db.query('DELETE FROM favorites WHERE user_id = $1 AND variant_id = $2', [user_id, variant_id]);

    // Fetch updated count
    const countResult = await db.query('SELECT COUNT(*)::INTEGER AS count FROM favorites WHERE user_id = $1', [user_id]);

    // Emit the updated count to all clients
    io.emit('favoritesUpdated', { userId: user_id, count: countResult.rows[0].count });

    return res.status(200).json({ message: 'Product removed from favorites', count: countResult.rows[0].count });
  } catch (error) {
    console.error('Error removing product from favorites:', error);
    res.status(500).send('Server error');
  }
};

// Get all favorite items for a user
exports.getFavorites = async (req, res) => {
  const user_id = req.session?.user?.id;

  if (!user_id) {
    return res.status(400).json({ message: 'User must be logged in to view favorites' });
  }

  try {
    const favorites = await db.query(`
      SELECT pv.variant_id, p.name AS product_name, pv.price, im.image_url 
      FROM favorites f
      JOIN product_variants pv ON f.variant_id = pv.variant_id
      JOIN products p ON pv.product_id = p.product_id
      LEFT JOIN product_images im ON im.variant_id = pv.variant_id AND im.is_main = TRUE
      WHERE f.user_id = $1
    `, [user_id]);

    res.status(200).json({ items: favorites.rows, count: favorites.rows.length });  // Dodano "count"
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).send('Server error');
  }
};



// Move all favorite products to the cart and remove them from favorites
exports.moveAllFavoritesToCart = async (req, res) => {
  const user_id = req.session?.user?.id;

  if (!user_id) {
    return res.status(400).json({ message: 'User must be logged in to move favorites to cart' });
  }

  try {
    // Retrieve all favorite items for the user
    const favorites = await db.query(`
      SELECT variant_id
      FROM favorites
      WHERE user_id = $1
    `, [user_id]);

    // If no favorites, return an appropriate response
    if (favorites.rows.length === 0) {
      return res.status(400).json({ message: 'No favorite items to move to cart' });
    }

    // Ensure the user has a cart; create if it doesn't exist
    let cart = await db.query('SELECT cart_id FROM cart WHERE user_id = $1', [user_id]);
    if (cart.rows.length === 0) {
      cart = await db.query('INSERT INTO cart (user_id, created_at) VALUES ($1, CURRENT_TIMESTAMP) RETURNING cart_id', [user_id]);
    }
    const cart_id = cart.rows[0].cart_id;

    // Move each favorite item to the cart
    for (const favorite of favorites.rows) {
      await db.query(`
        INSERT INTO cart_items (cart_id, variant_id, quantity, added_at)
        VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
        ON CONFLICT (cart_id, variant_id) DO UPDATE SET quantity = cart_items.quantity + 1
      `, [cart_id, favorite.variant_id]);
    }

    // Remove all items from favorites after adding them to the cart
    await db.query('DELETE FROM favorites WHERE user_id = $1', [user_id]);

    res.status(200).json({ message: 'All favorite items moved to cart' });
  } catch (error) {
    console.error('Error moving favorites to cart:', error);
    res.status(500).send('Server error');
  }
};

// backend/controllers/favoritesController.js
exports.getFavoritesCount = async (req, res) => {
  const user_id = req.session?.user?.id;

  if (!user_id) {
    return res.status(400).json({ message: 'User must be logged in to view favorites' });
  }

  try {
    const favorites = await db.query('SELECT COUNT(*)::INTEGER AS count FROM favorites WHERE user_id = $1', [user_id]);
    res.status(200).json({ count: favorites.rows[0].count });
  } catch (error) {
    console.error('Error fetching favorites count:', error);
    res.status(500).send('Server error');
  }
};
