import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await pool.query('SELECT * FROM wh_cutting');
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error fetching cutting records:', error);
        res.status(500).json({ error: 'Failed to retrieve cutting records', detail: error.message });
      }
      break;

    case 'POST':
      try {
        const { id_rm, name, quantity } = req.body;



        // Validasi input
        if (!id_rm || !name || !quantity) {
          return res.status(400).json({ error: 'ID Raw Material, name, and quantity are required' });
        }

        // Ambil nilai increment dari sequence
        const idResult = await pool.query('SELECT nextval(\'wh_cutting_id_seq\')');
        const idNumber = idResult.rows[0].nextval;

        // Format ID menjadi "Cxxx"
        const newId = `C${String(idNumber).padStart(6, '0')}`; // Contoh: C001, C002, C003

        const query = `
            INSERT INTO wh_cutting (id, id_rm, name, quantity, date_cutting)
            VALUES ($1, $2, $3, $4, NOW()) RETURNING *`;
        const values = [newId, id_rm, name, quantity];

        const result = await pool.query(query, values);

        // Update log_raw_materials
        const logQuery = `
INSERT INTO log_raw_materials (id, id_material, item_in, item_out, date_in, date_out)
VALUES ($1, $2, $3, $4, NOW(), NOW())`;
        const logId = `LR${String(idNumber).padStart(6, '0')}`; // Format log ID
        const item_in = 0; // Sesuaikan jika perlu
        const logValues = [logId, id_rm, item_in, quantity];

        // Eksekusi query log
        await pool.query(logQuery, logValues);

        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error creating cutting record:', error);
        res.status(500).json({ error: 'Failed to create cutting record', detail: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id, id_rm, name, quantity } = req.body;

        // Validasi input
        if (!id || !id_rm || !name || !quantity) {
          return res.status(400).json({ error: 'ID, ID Raw Material, name and quantity are required' });
        }

        const query = `
          UPDATE wh_cutting
          SET id_rm = $1, name = $2, quantity = $3, date_cutting = NOW()
          WHERE id = $4 RETURNING *`;
        const values = [id_rm, name, quantity, id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Cutting record not found' });
        }

        res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error updating cutting record:', error);
        res.status(500).json({ error: 'Failed to update cutting record', detail: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;

        // Validasi input
        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }

        const result = await pool.query('DELETE FROM wh_cutting WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Cutting record not found' });
        }

        res.status(204).send('');
      } catch (error) {
        console.error('Error deleting cutting record:', error);
        res.status(500).json({ error: 'Failed to delete cutting record', detail: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
