import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
        const [title, setTitle] = useState()
        const [ description, setDescription] = useState()
        const{id} = useParams()
        const navigate = useNavigate()
        

   const handleSubmit = (e) =>{
        e.preventDefault()
        axios.put('http://localhost:3001/editpost/'+id, {title,description})
        .then(res => {
          console.log(res)
          if(res.data ==="Success"){
            navigate('/')
          }
        })
        .catch(err => console.log(err))
   }


   useEffect((id) =>{
         axios.get('http://localhost:3001/getpostid/ ' + id)
         .then(result => {
              setTitle(result.data.title)  
              setDescription(result.data.description)  
         })
         .catch(err => console.log(err))
   }, [])

  return (
    <div className='post_container'>
         <div className='post_form'>
                <form onSubmit={handleSubmit}>
                        <h2>Update post</h2>
                        <input type="text" onChange={e => setTitle(e.target.value)} placeholder='Enter Title' value={title}/>
                        <textarea
                         name = "desc"
                          id="desc" 
                          cols="30"
                           rows="10" 
                           value={description}
                           placeholder='enter descriptipon' onChange={e => setDescription(e.target.value)}></textarea>
     
                          <button>Update</button>
                </form>
         </div>
    </div>
  )
}

export default EditPost
