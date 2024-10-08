import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await pool.query('SELECT * FROM raw_materials');
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error fetching raw materials:', error);
        res.status(500).json({ error: 'Failed to retrieve raw materials', detail: error.message });
      }
      break;

    case 'POST':
      try {
        const { name, size, merk, surat_jalan, supplier, purchase_order_code, amount, unit } = req.body;

        // Validasi input
        if (!name || !amount) {
          return res.status(400).json({ error: 'Name and amount are required' });
        }

        // Generate new ID
        const idResult = await pool.query('SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 2) AS INTEGER)), 0) + 1 AS next_id FROM raw_materials');
        const newId = `K${String(idResult.rows[0].next_id).padStart(6, '0')}`;

        const query = `
          INSERT INTO raw_materials (id, name, size, merk, surat_jalan, supplier, purchase_order_code, amount, unit)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
        const values = [newId, name, size, merk, surat_jalan, supplier, purchase_order_code, amount, unit];

        const result = await pool.query(query, values);

        // Log the insertion
        const logQuery = `
          INSERT INTO log_raw_materials (id, id_material, item_in, date_in)
          VALUES ($1, $2, $3, NOW())`;
        const logId = `LR${String(idResult.rows[0].next_id).padStart(3, '0')}`;
        const logValues = [logId, newId, amount];

        await pool.query(logQuery, logValues);

        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error creating raw material:', error);
        res.status(500).json({ error: 'Failed to create raw material', detail: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id, name, size, merk, surat_jalan, supplier, purchase_order_code, amount, unit } = req.body;

        // Validasi input
        if (!id || !name || !amount) {
          return res.status(400).json({ error: 'ID, name and amount are required' });
        }

        const query = `
          UPDATE raw_materials
          SET name = $1, size = $2, merk = $3, surat_jalan = $4, supplier = $5, purchase_order_code = $6, amount = $7, unit = $8
          WHERE id = $9 RETURNING *`;
        const values = [name, size, merk, surat_jalan, supplier, purchase_order_code, amount, unit, id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Material not found' });
        }

        res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error updating raw material:', error);
        res.status(500).json({ error: 'Failed to update raw material', detail: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
