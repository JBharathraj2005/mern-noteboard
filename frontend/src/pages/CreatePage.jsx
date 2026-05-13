import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CreatePage = () => {
  const [formData,setFormData] = useState({
    title : '',
    content : ''
  });

  const handleChange = (e) =>{
    setFormData({...formData,[e.target.name]:e.target.value});
  }

  const navigate = useNavigate();

  const handleSubmit = async(e) =>{
    e.preventDefault();
    try {
      const request = await axios.post('http://localhost:5000/api/notes',formData);
      toast.success("Note added successfully!");
      navigate('/');
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to add the note!");
    }
  }
  return (
    <div className='min-h-screen bg-base-100 flex justify-center items-center'>
      <div className='w-[500px] min-h-[400px] bg-base-300 hover:shadow-lg rounded-lg border-t-4 p-6 border-primary'>
        <h2 className='text-primary text-3xl font-bold tracking-tighter mb-5'>Create Note</h2>
        <form onSubmit={handleSubmit}>
          <div className='space-y-3'>
            <label htmlFor="title" className='block text-lg'>Title</label>
            <input onChange={handleChange} value={formData.title} type="text" name='title' className='input input-bordered w-full' />
          </div>
          <div className='space-y-3 mt-3'>
            <label htmlFor="content" className='block text-lg'>Content</label>
            <textarea onChange={handleChange} name="content" value={formData.content} className='textarea textarea-bordered w-full'></textarea>
          </div>
          <div className='space-y-3 mt-3'>
            <input type="submit" value="Create Note" className='btn btn-primary mt-[30px] w-full' />
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePage