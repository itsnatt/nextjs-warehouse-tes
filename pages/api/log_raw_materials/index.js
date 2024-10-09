// pages/api/log_raw_materials/index.js
import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { method } = req;
  const { id_material } = req.query;

  switch (method) {
    case 'GET':
      if (id_material) {
        // Ambil data log berdasarkan ID bahan
        try {
          const result = await pool.query('SELECT * FROM log_raw_materials WHERE id_material = $1', [id_material]);
          res.status(200).json(result.rows);
        } catch (error) {
          console.error('Error fetching log raw materials:', error);
          res.status(500).json({ error: 'Failed to retrieve log raw materials', detail: error.message });
        }
      } else {
        // Ambil semua data log
        try {
          const result = await pool.query('SELECT * FROM log_raw_materials');
          res.status(200).json(result.rows);
        } catch (error) {
          console.error('Error fetching log raw materials:', error);
          res.status(500).json({ error: 'Failed to retrieve log raw materials', detail: error.message });
        }
      }
      break;

    // Anda bisa menambahkan case untuk POST, PUT, DELETE jika diperlukan

    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}