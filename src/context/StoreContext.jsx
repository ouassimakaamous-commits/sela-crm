import { createContext, useContext, useState } from 'react'
import { formateurs as initFormateurs, apprenants as initApprenants, sessions as initSessions } from '../data/mockData'

const StoreContext = createContext(null)

const AVATAR_COLORS = ['#00839F', '#DCA35A', '#10B981', '#7C3AED', '#EF4444', '#F59E0B', '#007493', '#3B82F6']
const pick = (arr, id) => arr[id % arr.length]

let nextId = 1000

function makeId() { return ++nextId }

function initials(nom) {
  return nom.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'XX'
}

export function StoreProvider({ children }) {
  const [formateurs, setFormateurs] = useState(initFormateurs)
  const [apprenants, setApprenants] = useState(initApprenants)
  const [sessions,   setSessions]   = useState(initSessions)

  const addFormateur = (data) => {
    const id  = makeId()
    const av  = initials(data.nom)
    const col = pick(AVATAR_COLORS, id)
    const entry = {
      id, nom: data.nom, email: data.email, telephone: data.telephone || '',
      specialite: data.specialite, grade: data.grade || 'Formateur',
      statut: 'Actif', avatar: av, couleur: col,
      tauxHoraire: Number(data.tauxHoraire) || 100,
      sessionsParMois: 0, hsaMois: 0, hseMois: 0, totalHS: 0,
      quotaMensuel: 30, quotaRestant: 30,
    }
    setFormateurs(prev => [entry, ...prev])
    return entry
  }

  const addApprenant = (data) => {
    const id  = makeId()
    const av  = initials(data.nom)
    const col = pick(AVATAR_COLORS, id)
    const entry = {
      id, nom: data.nom, age: Number(data.age) || 0,
      filiere: data.filiere, session: data.session || '—',
      financement: data.financement || 'Autofinancement',
      statut: data.statut || 'Inscrit',
      dateInscription: new Date().toISOString().slice(0, 10),
      avatar: av, couleur: col,
    }
    setApprenants(prev => [entry, ...prev])
    return entry
  }

  const addSession = (data) => {
    const id = makeId()
    const entry = {
      id, intitule: data.intitule, formateur: data.formateur,
      formateurId: formateurs.find(f => f.nom === data.formateur)?.id || 0,
      dateDebut: data.dateDebut, dateFin: data.dateFin || '',
      duree: data.duree || '—', inscrits: 0,
      places: Number(data.places) || 15,
      salle: data.salle || '—', statut: 'Planifiée',
      hsGenerees: 0, financement: data.financement || 'OPCO',
    }
    setSessions(prev => [entry, ...prev])
    return entry
  }

  const deleteFormateur = (id) => setFormateurs(prev => prev.filter(f => f.id !== id))
  const deleteApprenant = (id) => setApprenants(prev => prev.filter(a => a.id !== id))
  const deleteSession   = (id) => setSessions(prev => prev.filter(s => s.id !== id))

  return (
    <StoreContext.Provider value={{
      formateurs, apprenants, sessions,
      addFormateur, addApprenant, addSession,
      deleteFormateur, deleteApprenant, deleteSession,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
