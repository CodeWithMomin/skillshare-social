import React from 'react'
import '../App.css'
import UploadPost from '../components/UploadPost'
const Feed = () => {
  return (
    <div className="feedcontainer">
      <div className="uploadpostdiv">
        <UploadPost/>
      </div>
      
      <div className="postdiv"> posts</div>
    </div>
  )
}

export default Feed