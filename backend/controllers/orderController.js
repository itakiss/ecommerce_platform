const db = require('../db');

// Get Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query("SELECT * FROM orders WHERE order_id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
