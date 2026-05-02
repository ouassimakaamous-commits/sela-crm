import pool from './_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT * FROM formateurs ORDER BY nom'
      )
      return res.status(200).json(result.rows)
    }

    if (req.method === 'POST') {
      const { nom, prenom, specialite, email, telephone, quota_hs_mensuel } = req.body
      const result = await pool.query(
        `INSERT INTO formateurs (nom, prenom, specialite, email, telephone, quota_hs_mensuel)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [nom, prenom, specialite, email, telephone, quota_hs_mensuel ?? 40]
      )
      return res.status(201).json(result.rows[0])
    }

    if (req.method === 'PUT') {
      const { id } = req.query
      const { nom, prenom, specialite, email, telephone, statut, quota_hs_mensuel } = req.body
      const result = await pool.query(
        `UPDATE formateurs SET nom=$1, prenom=$2, specialite=$3, email=$4,
         telephone=$5, statut=$6, quota_hs_mensuel=$7 WHERE id=$8 RETURNING *`,
        [nom, prenom, specialite, email, telephone, statut, quota_hs_mensuel, id]
      )
      return res.status(200).json(result.rows[0])
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await pool.query('DELETE FROM formateurs WHERE id=$1', [id])
      return res.status(204).end()
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[/api/formateurs]', err.message)
    res.status(500).json({ error: err.message })
  }
}
