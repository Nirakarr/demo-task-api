import pool from "../database/connect_db.js";

// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const lang = req.query.lang === "se" ? "se" : "en";
    const titleField = `title_${lang}`;

    const { rows } = await pool.query(`
      SELECT ${titleField} AS title, in_price, price
      FROM pricelist_items
      ORDER BY id ASC
    `);

    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET single product by title (using title as by id is never used directly in real world)
export const getProductByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const lang = req.query.lang === "se" ? "se" : "en";
    const titleField = `title_${lang}`;

    const { rows } = await pool.query(
      `SELECT ${titleField} AS title, in_price, price
       FROM pricelist_items
       WHERE ${titleField} = $1`,
      [title]
    );

    if (!rows.length) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT update product by title
export const updateProductByTitle = async (req, res) => {
  try {
    const { lang } = req.query;
    const { title, in_price, price } = req.body;

    if (!title || !lang) return res.status(400).json({ success: false, message: "Title and lang required" });

    const titleField = lang === "se" ? "title_se" : "title_en";

    const { rowCount } = await pool.query(
      `UPDATE pricelist_items
       SET in_price = $1, price = $2, updated_at = CURRENT_TIMESTAMP
       WHERE ${titleField} = $3`,
      [in_price, price, title]
    );

    if (!rowCount) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
