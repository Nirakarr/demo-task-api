import pool from "../database/connect_db.js";

export const getTerms = async (req, res) => {
  try {
    const lang = req.query.lang === "se" ? "se" : "en";
    const query = `SELECT 
        id,
        title_${lang} AS title,
        content_${lang} AS content,
        close_button_text_${lang} AS close_button_text
      FROM terms_information
      LIMIT 1`;

    const { rows } = await pool.query(query);

    if (!rows.length)
      return res.status(404).json({ success: false, message: "Terms not found" });

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching terms:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};