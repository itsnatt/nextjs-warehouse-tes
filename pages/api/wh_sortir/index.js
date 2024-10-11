import pool from '../../../lib/db';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await pool.query('SELECT * FROM wh_sortir ');
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error fetching cutting records:', error);
        res.status(500).json({ error: 'Failed to retrieve cutting records', detail: error.message });
      }
      break;

   
  

    case 'POST':
      try {
        const { id_cutting, id_quality, type_name, quantity, BON } = req.body;

        if (!id_cutting || !id_quality || !type_name || !quantity) {
          return res.status(400).json({ error: 'ID Cutting, ID Quality, type_name, and quantity are required' });
        }

        const idResult = await pool.query('SELECT nextval(\'wh_sortir_id_seq\')');
        const idNumber = idResult.rows[0].nextval;

        const newId = `S${String(idNumber).padStart(6, '0')}`;

        const query = `
          INSERT INTO wh_sortir (id, id_cutting, id_quality, type_name, quantity, BON, date_sorting)
          VALUES ($1, $2, $3, $4, $5, $6, NOW()) RETURNING *`;
        const values = [newId, id_cutting, id_quality, type_name, quantity, BON];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
      } catch (error) {
        console.error('Error creating sorting record:', error);
        res.status(500).json({ error: 'Failed to create sorting record', detail: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}