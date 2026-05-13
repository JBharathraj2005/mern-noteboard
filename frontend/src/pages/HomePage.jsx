import React from 'react'
import Navbar from "../components/Navbar"
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import {toast} from "react-hot-toast";

const HomePage = () => {
  const [notes,setNotes] = useState([]);
  const [loading,setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotes = async() =>{
    try {
      const response = await axios.get('http://localhost:5000');
      setNotes(response.data.notes);
      console.log(response.data.notes);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to fetch notes!");
    }
  }

  useEffect(()=>{
    fetchNotes();
  },[]);

  const deleteNote = async(id)  =>{
    const confirmDelete = window.confirm("Are you sure want to delete this note?");
    if(!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/${id}`);
      setNotes((prev)=>prev.filter((note)=>
        note._id !== id
      ));
      toast.success("Note deleted successfully!");
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to delete the note!");
    }
  }
  return (
    <div className='min-h-screen'>
      <Navbar/>
      {loading && (
        <div className='text-center text-primary text-lg mt-36'>Loading notes...</div>
      )}

      {!loading  && notes.length === 0 && (
        <div className='text-center text-primary text-lg mt-36'>No note found.</div>
      )}

      <div className='mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 p-4 lg:grid-cols-3'>
        {notes.map((note)=>(
          <div className='card bg-base-100 rounded-xl p-3 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[orange]' key={note._id}>
            <div className='card-body'>
              <Link to={`/note/${note._id}`}>
                <h3 className='card-title text-primary'>{note.title}</h3>
                <p className='text-base-content/70 line-clamp-3'>{note.content.substring(0,50)}...</p>
              </Link>
              <div className='flex justify-between items-center gap-3'>
                <span className='text-sm text-base-content/60'>{new Date(note.createdAt).toLocaleDateString()}</span>
                <div  className='flex items-center justify-center'>
                  <button onClick={()=>navigate(`/edit/${note._id}`)} className='btn'>
                    <PenSquareIcon className='size-4'/>
                  </button>
                  <button onClick={()=>deleteNote(note._id)} className='btn btn-ghost text-error'>
                    <Trash2Icon className='size-4'/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePage