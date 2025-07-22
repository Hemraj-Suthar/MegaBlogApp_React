import React from 'react'
import appwriteService from "../services/config"
import {Link} from 'react-router-dom'

function PostCard({_id, title, featuredImage}) {
  
  return (
    <Link to={`/post/${_id}`}>
        <div className="w-full bg-gray-100 rounded-xl p-4 flex flex-col items-center h-full">
            <div className="w-full aspect-[3/4] mb-4 overflow-hidden rounded-xl">
                <img src={`${featuredImage}`} alt={title} className="w-full h-full object-cover" />
            </div>
            <h2 className='text-xl font-bold'>{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard;
