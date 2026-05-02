import pool from './_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    if (req.method === 'GET') {
      const result = await pool.query(`
        SELECT hs.*,
               f.nom AS formateur_nom, f.prenom AS formateur_prenom,
               s.intitule AS session_intitule
        FROM heures_sup hs
        LEFT JOIN formateurs f ON hs.formateur_id = f.id
        LEFT JOIN sessions s ON hs.session_id = s.id
        ORDER BY hs.date_hs DESC
      `)
      return res.status(200).json(result.rows)
    }

    if (req.method === 'POST') {
      const {
        formateur_id, session_id, date_hs, type_hs,
        nb_heures, taux_horaire, majoration_pct, montant_final, description
      } = req.body
      const result = await pool.query(
        `INSERT INTO heures_sup
           (formateur_id, session_id, date_hs, type_hs, nb_heures,
            taux_horaire, majoration_pct, montant_final, description)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [formateur_id, session_id, date_hs, type_hs, nb_heures,
         taux_horaire, majoration_pct, montant_final, description]
      )
      return res.status(201).json(result.rows[0])
    }

    if (req.method === 'PUT') {
      const { id } = req.query
      const { statut, valide_par } = req.body
      const result = await pool.query(
        `UPDATE heures_sup SET statut=$1, valide_par=$2 WHERE id=$3 RETURNING *`,
        [statut, valide_par, id]
      )
      return res.status(200).json(result.rows[0])
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await pool.query('DELETE FROM heures_sup WHERE id=$1', [id])
      return res.status(204).end()
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[/api/heures-sup]', err.message)
    res.status(500).json({ error: err.message })
  }
}
