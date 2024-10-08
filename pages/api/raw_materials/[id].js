import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'GET':
      try {
        // Ambil data berdasarkan ID
        const result = await pool.query('SELECT * FROM raw_materials WHERE id = $1', [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Raw material not found' });
        }

        res.status(200).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve raw material' });
      }
      break;

    case 'PUT':
      try {
        const { name, size, merk, surat_jalan, supplier, purchase_order_code, amount, unit } = req.body;

        // Update raw material data
        const query = `
          UPDATE raw_materials
          SET name = $1, size = $2, merk = $3, surat_jalan = $4, supplier = $5,
              purchase_order_code = $6, amount = $7, unit = $8
          WHERE id = $9 RETURNING *`;
        const values = [name, size, merk, surat_jalan, supplier, purchase_order_code, amount, unit, id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Raw material not found' });
        }

        // Update log material (item_out jika amount diubah)
        const logQuery = `
          UPDATE log_raw_materials
          SET item_out = $1, date_out = NOW()
          WHERE id_material = $2 AND item_out IS NULL RETURNING *`;
        const logValues = [amount, id];

        await pool.query(logQuery, logValues);

        res.status(200).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update raw material' });
      }
      break;

    case 'DELETE':
      try {
        // Delete raw material by ID
        const result = await pool.query('DELETE FROM raw_materials WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: 'Raw material not found' });
        }

        res.status(200).json({ message: 'Raw material deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete raw material' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
