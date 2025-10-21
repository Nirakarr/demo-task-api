import express from 'express';
import dotenv from 'dotenv';
import pool from './database/connect_db.js';
import authRoutes from "./routes/auth/authRoutes.js";
import pricelistRoutes from "./routes/pricelist/pricelistRoutes.js";
import seedDatabase from "./database/seed.js";
import termsRoutes from './routes/terms/termsRoute.js';

dotenv.config();

const app = express();
app.use(express.json());

// to test db connection
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Database time: ${result.rows[0].now}`);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// seedRoute
app.use("/api", seedDatabase);

// authRoutes
app.use("/api/auth", authRoutes);

// pricelistRoutes
app.use("/api/pricelist", pricelistRoutes);

// termsRoute
app.use("/api/terms", termsRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));