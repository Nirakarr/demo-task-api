import express from 'express';
import dotenv from 'dotenv';
import pool from './database/connect_db.js';
import authRoutes from "./routes/auth/authRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(`Database time: ${result.rows[0].now}`);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// authRoutes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));