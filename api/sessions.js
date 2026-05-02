import pool from './_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const result = await pool.query(`
        SELECT s.*, f.nom AS formateur_nom, f.prenom AS formateur_prenom
        FROM sessions s
        LEFT JOIN formateurs f ON s.formateur_id = f.id
        ORDER BY s.date_debut DESC
      `)
      return res.status(200).json(result.rows)
    }

    if (req.method === 'POST') {
      const { intitule, formateur_id, date_debut, date_fin, nb_places, salle, statut, financement } = req.body
      const result = await pool.query(
        `INSERT INTO sessions (intitule, formateur_id, date_debut, date_fin, nb_places, salle, statut, financement)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [intitule, formateur_id, date_debut, date_fin, nb_places, salle, statut ?? 'planifiee', financement]
      )
      return res.status(201).json(result.rows[0])
    }

    if (req.method === 'PUT') {
      const { id } = req.query
      const { intitule, formateur_id, date_debut, date_fin, nb_places, nb_inscrits, salle, statut } = req.body
      const result = await pool.query(
        `UPDATE sessions SET intitule=$1, formateur_id=$2, date_debut=$3, date_fin=$4,
         nb_places=$5, nb_inscrits=$6, salle=$7, statut=$8 WHERE id=$9 RETURNING *`,
        [intitule, formateur_id, date_debut, date_fin, nb_places, nb_inscrits, salle, statut, id]
      )
      return res.status(200).json(result.rows[0])
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await pool.query('DELETE FROM sessions WHERE id=$1', [id])
      return res.status(204).end()
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[/api/sessions]', err.message)
    res.status(500).json({ error: err.message })
  }
}
