import React from 'react'
import {Routes , Route} from 'react-router-dom';
import {toast} from 'react-hot-toast';
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailsPage from './pages/NoteDetailsPage';
import EditPage from "./pages/EditPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element = {<HomePage/>}/>
      <Route path="/create" element = {<CreatePage/>}/>
      <Route path='/note/:id' element={<NoteDetailsPage/>}/>
      <Route path='/edit/:id' element={<EditPage/>}/>
    </Routes>
  )
}

export default App