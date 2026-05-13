import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const NoteDetailsPage = () => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    useEffect(() => {

        const fetchNote = async () => {

            try {

                const response = await axios.get(
                    `http://localhost:5000/api/notes/${id}`
                );

                setTitle(response.data.note.title);

                setContent(response.data.note.content);

            } catch (error) {

                console.log(error.message);

                toast.error("Failed to fetch the note!");

            } finally {

                setLoading(false);

            }
        }

        fetchNote();

    }, [id]);

    return (

        <div className='min-h-screen bg-base-200 flex justify-center items-center p-6'>

            <div className='w-full max-w-5xl min-h-[300px] bg-base-100 shadow-xl rounded-2xl overflow-hidden border border-base-300'>

                <div className='bg-gradient-to-r from-primary to-orange-400 p-6 text-white'>

                    <Link
                        className='btn btn-sm btn-ghost bg-white/20 border-none text-white hover:bg-white/30 mb-5'
                        to="/"
                    >
                        <ArrowLeft className='size-4' />
                        Back to Home
                    </Link>

                    <h1 className='text-4xl font-bold tracking-tight'>
                        {title}
                    </h1>

                </div>

                <div className='p-8'>

                    {loading ? (

                        <div className='text-center text-primary text-lg'>
                            Loading note...
                        </div>

                    ) : (

                        <div className='space-y-6'>

                            <div className='flex items-center justify-between'>

                                <span className='bg-orange-100 text-orange-600 text-xs px-4 py-2 rounded-full font-semibold'>
                                    Note Details
                                </span>

                                <span className='text-sm text-base-content/60'>
                                    {new Date().toLocaleDateString()}
                                </span>

                            </div>

                            <div className='border-t border-base-300 pt-6'>

                                <p className='text-lg leading-9 text-base-content/80 whitespace-pre-line'>
                                    {content}
                                </p>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    )
}

export default NoteDetailsPage