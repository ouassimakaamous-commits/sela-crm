import pool from './_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT * FROM apprenants ORDER BY nom'
      )
      return res.status(200).json(result.rows)
    }

    if (req.method === 'POST') {
      const { nom, prenom, email, telephone, date_naissance, filiere, financement, statut } = req.body
      const result = await pool.query(
        `INSERT INTO apprenants (nom, prenom, email, telephone, date_naissance, filiere, financement, statut)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [nom, prenom, email, telephone, date_naissance, filiere, financement, statut ?? 'inscrit']
      )
      return res.status(201).json(result.rows[0])
    }

    if (req.method === 'PUT') {
      const { id } = req.query
      const { nom, prenom, email, telephone, date_naissance, filiere, financement, statut } = req.body
      const result = await pool.query(
        `UPDATE apprenants SET nom=$1, prenom=$2, email=$3, telephone=$4,
         date_naissance=$5, filiere=$6, financement=$7, statut=$8 WHERE id=$9 RETURNING *`,
        [nom, prenom, email, telephone, date_naissance, filiere, financement, statut, id]
      )
      return res.status(200).json(result.rows[0])
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await pool.query('DELETE FROM apprenants WHERE id=$1', [id])
      return res.status(204).end()
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[/api/apprenants]', err.message)
    res.status(500).json({ error: err.message })
  }
}
