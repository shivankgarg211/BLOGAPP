import React, { useContext, useState } from 'react';
import axios from 'axios';
import { userContext } from './App';

function CreatePost() {
        const [title, setTitle] = useState()
        const [ description, setDescription] = useState()
        const [ file, setFile] = useState()
        const user = useContext(userContext)

   const handleSubmit = (e) =>{
        e.preventDefault()
        const formData = new FormData()
        formData.append('title',title)
        formData.append('description',description)
        formData.append('email', user.email)
        formData.append('file',file)
        axios.post('http://localhost:3001/create', formData)
        .then(res => {
          console.log(res)
          if(res.data ==="Success"){
            window.location.href = "/"
          }
        })
        .catch(err => console.log(err))
   }

  return (
    <div className='post_container'>
         <div className='post_form'>
                <form onSubmit={handleSubmit}>
                        <h2>Create post</h2>
                        <input type="text" onChange={e => setTitle(e.target.value)}/>
                        <textarea
                         name = "desc"
                          id="desc" 
                          cols="30"
                           rows="10" 
                           placeholder='enter descriptipon' onChange={e => setDescription(e.target.value)}></textarea>
                        <input 
                        type='file' 
                        className='file' 
                        placeholder='Select file' onChange={e => setFile(e.target.files[0])}/>
                          <button>Post</button>
                </form>
         </div>
    </div>
  )
}

export default CreatePost
