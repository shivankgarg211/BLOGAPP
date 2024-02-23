import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';


function Home() {
  const [posts,setPosts] = useState([])
   
    
  useEffect(()=>{
    axios.get('http://localhost:3001/getposts')
    .then((res)=>{
      console.log(res)
      setPosts(res.data)
    }).catch((err)=>{
      console.log(err)
    })
    // .then(posts =>({
    //   console.log(posts)
    // })) 
    // setPosts(posts.data)
    // .catch(err => console.log(err))
  },[])



  return (
    <div>
      {
        posts.map((post) =>(
          <Link to = {`/post/${post._id}`} className='post'>
          
            <img src={`http://localhost:3001/Images/${post.file}`}/>
            <div>
                 <h2 >{post.title}</h2>
                 <p>{post.description}</p>
                 </div>
         
          </Link>
        ))
      }
    </div>
    
  )
}

export default Home
