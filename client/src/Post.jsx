import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { userContext } from './App';

function Post() {
  const [post, setPost] = useState({})
  const { id } = useParams()
  console.log(id)
  const navigate = useNavigate()
  const user = useContext(userContext)
  console.log(user)


  useEffect(() => {
    axios.get(`http://localhost:3001/getpostbyid/${id}`)
      .then((result)=>{
        setPost(result.data)
        console.log(result)
      }) 
      .catch(err => console.log(err))
  }, [id])


  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/deletepost/${id}`)
    .then(result => {
      navigate('/')
    })
      .catch(err => console.log(err))
  }




  return (


    <div className='post_container' >
      <div className='post_post'>
        <img src={`http://localhost:3001/Images/${post.file}`} alt='' />
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        <div>
          {
            user.email === post.email ?
            <>
            <Link to ={`/editpost/${id}`}>Edit</Link>
          <button onClick={ e => handleDelete( id)}>Delete</button>
            </> : <></>
          }

        </div>
      </div>

    </div>
  )
}

export default Post
