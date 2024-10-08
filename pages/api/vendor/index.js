// pages/api/vendor/index.js
import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    // CREATE Vendor
    case 'POST':
      try {
        const { name, address } = req.body;

        // Ambil nilai increment dari sequence vendor_id_seq
        const idResult = await pool.query('SELECT nextval(\'vendor_id_seq\')');
        const idNumber = idResult.rows[0].nextval;

        // Format ID menjadi "Vxxx"
        const vendorId = `V${String(idNumber).padStart(6, '0')}`; // Contoh: V001, V002, V003

        const query = 'INSERT INTO vendor (id, name, address) VALUES ($1, $2, $3) RETURNING *';
        const values = [vendorId, name, address];

        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create vendor' });
      }
      break;

    // READ Vendors
    case 'GET':
      try {
        const query = 'SELECT * FROM vendor';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vendors' });
      }
      break;

    // UPDATE Vendor
    case 'PUT':
      try {
        const { id, name, address } = req.body;
        const query = 'UPDATE vendor SET name = $1, address = $2 WHERE id = $3 RETURNING *';
        const values = [name, address, id];
        const result = await pool.query(query, values);
        res.status(200).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update vendor' });
      }
      break;

    // DELETE Vendor
    case 'DELETE':
      try {
        const { id } = req.body;
        const query = 'DELETE FROM vendor WHERE id = $1';
        const values = [id];
        await pool.query(query, values);
        res.status(204).end();
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete vendor' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
