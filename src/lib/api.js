const BASE = '/api'

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  if (res.status === 204) return null
  return res.json()
}

// ─── FORMATEURS ────────────────────────────────────────────────────────────
export const getFormateurs = () => apiFetch('/formateurs')
export const createFormateur = (data) => apiFetch('/formateurs', { method: 'POST', body: data })
export const updateFormateur = (id, data) => apiFetch(`/formateurs?id=${id}`, { method: 'PUT', body: data })
export const deleteFormateur = (id) => apiFetch(`/formateurs?id=${id}`, { method: 'DELETE' })

// ─── APPRENANTS ────────────────────────────────────────────────────────────
export const getApprenants = () => apiFetch('/apprenants')
export const createApprenant = (data) => apiFetch('/apprenants', { method: 'POST', body: data })
export const updateApprenant = (id, data) => apiFetch(`/apprenants?id=${id}`, { method: 'PUT', body: data })
export const deleteApprenant = (id) => apiFetch(`/apprenants?id=${id}`, { method: 'DELETE' })

// ─── SESSIONS ──────────────────────────────────────────────────────────────
export const getSessions = () => apiFetch('/sessions')
export const createSession = (data) => apiFetch('/sessions', { method: 'POST', body: data })
export const updateSession = (id, data) => apiFetch(`/sessions?id=${id}`, { method: 'PUT', body: data })
export const deleteSession = (id) => apiFetch(`/sessions?id=${id}`, { method: 'DELETE' })

// ─── HEURES SUP ────────────────────────────────────────────────────────────
export const getHeuresSup = () => apiFetch('/heures-sup')
export const createHeureSup = (data) => apiFetch('/heures-sup', { method: 'POST', body: data })
export const validateHeureSup = (id, valide_par) =>
  apiFetch(`/heures-sup?id=${id}`, { method: 'PUT', body: { statut: 'valide', valide_par } })
export const refuseHeureSup = (id, valide_par) =>
  apiFetch(`/heures-sup?id=${id}`, { method: 'PUT', body: { statut: 'refuse', valide_par } })
export const deleteHeureSup = (id) => apiFetch(`/heures-sup?id=${id}`, { method: 'DELETE' })

// ─── FINANCES ──────────────────────────────────────────────────────────────
export const getFinances = () => apiFetch('/finances')
export const createFinance = (data) => apiFetch('/finances', { method: 'POST', body: data })
export const deleteFinance = (id) => apiFetch(`/finances?id=${id}`, { method: 'DELETE' })
