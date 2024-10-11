import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {

      case 'GET':
        try {
          const result = await pool.query('SELECT * FROM quality');
          res.status(200).json(result.rows);
        } catch (error) {
          console.error('Error fetching quality records:', error);
          res.status(500).json({ error: 'Failed to retrieve quality records', detail: error.message });
        }
        break;

    case 'POST':
      try {
        const { name } = req.body;

        // Validasi input
        if (!name) {
          return res.status(400).json({ error: 'Quality name is required' });
        }

        const idResult = await pool.query('SELECT nextval(\'quality_id_seq\')');
        const idNumber = idResult.rows[0].nextval;

        const newId = `Q${String(idNumber).padStart(6, '0')}`; // Format ID

        const query = `
          INSERT INTO quality (id, name)
          VALUES ($1, $2) RETURNING *`;
        const values = [newId, name];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error creating quality record:', error);
        res.status(500).json({ error: 'Failed to create quality record', detail: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id, name } = req.body;

        // Validasi input
        if (!id || !name) {
          return res.status(400).json({ error: 'ID and name are required' });
        }

        const query = `
          UPDATE quality
          SET name = $1
          WHERE id = $2 RETURNING *`;
        const values = [name, id];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Quality record not found' });
        }

        res.status(200).json(result.rows[0]);
      } catch (error) {
        console.error('Error updating quality record:', error);
        res.status(500).json({ error: 'Failed to update quality record', detail: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }

        const result = await pool.query('DELETE FROM quality WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Quality record not found' });
        }

        res.status(204).send('');
      } catch (error) {
        console.error('Error deleting quality record:', error);
        res.status(500).json({ error: 'Failed to delete quality record', detail: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}