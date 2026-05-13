import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

const EditPage = () => {
  const [title,setTitle] = useState('');
  const [content,setContent] = useState('');
  const {id} = useParams();
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchNote = async() =>{
      try {
        const response = await axios.get(`http://localhost:5000/${id}`);
        setTitle(response.data.note.title);
        setContent(response.data.note.content);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchNote();
  },[id]);

  const handleUpdate = async(e) =>{
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/${id}`,{title,content});
      toast.success("Note updated successfully!");
      navigate('/');
    } catch (error) {
      console.log(error.message);
    }
  }
  
  return (
    <div className='min-h-screen flex justify-center items-center'>
      <div className='w-[500px] min-h-[400px] bg-base-300 hover:shadow-lg rounded-lg border-t-4 p-6 border-primary'>
        <h2 className='text-primary text-3xl font-bold tracking-tighter mb-5'>Update Note</h2>
        <form onSubmit={handleUpdate}>
          <div className='space-y-3'>
            <label htmlFor="title" className='block text-lg'>Title</label>
            <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" name='title' className='input input-bordered w-full' />
          </div>
          <div className='space-y-3 mt-3'>
            <label htmlFor="content" className='block text-lg'>Content</label>
            <textarea onChange={(e)=>setContent(e.target.value)} name="content" value={content} className='textarea textarea-bordered w-full'></textarea>
          </div>
          <div className='space-y-3 mt-3'>
            <input type="submit" value="Update Note" className='btn btn-primary mt-[30px] w-full' />
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPage