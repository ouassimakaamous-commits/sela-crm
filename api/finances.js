import pool from './_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT * FROM finances ORDER BY date_transaction DESC'
      )
      return res.status(200).json(result.rows)
    }

    if (req.method === 'POST') {
      const { libelle, categorie, montant, type, date_transaction } = req.body
      const result = await pool.query(
        `INSERT INTO finances (libelle, categorie, montant, type, date_transaction)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [libelle, categorie, montant, type, date_transaction]
      )
      return res.status(201).json(result.rows[0])
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await pool.query('DELETE FROM finances WHERE id=$1', [id])
      return res.status(204).end()
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[/api/finances]', err.message)
    res.status(500).json({ error: err.message })
  }
}
