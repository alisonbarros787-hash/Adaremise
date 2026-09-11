import './App.css'
import Benevole from './Benevole.jsx'
import FicheObjet from './FicheObjet.jsx'
import ListeObjets from './ListeObjet.jsx'
import UserBack from './UserHistorique.jsx'
import { Routes, Route } from 'react-router-dom'


function App() {
 

  return (
    
    <Routes>
       {/* Quand l'URL est '/', le composant Benevole s'affiche le omposant Benevole.jsx */}
      <Route path="/" element={<Benevole/>}/>
      <Route path="/objets" element={<ListeObjets/>}/>
      <Route path="/objets/:id" element={<FicheObjet/>}/>
      <Route path="/depots/:id" element={<UserBack/>}/>
    </Routes>
  )
}

export default App
 