import axios from 'axios';
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'

const Navbar = () => {
  
  return (
    <header className='bg-base-300 w-screen'>
      <div className='max-w-6xl mx-auto p-[30px] bg-base-300 flex justify-between items-center gap-4'>
        <h1 className='text-primary font-bold text-3xl tracking-tighter'>NoteBoard</h1>
        <div className='flex justify-center items-center'>
          <Link to={'/create'} className='btn btn-primary'>
            <Plus className='size-4'/>
            <span>Create Note</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar