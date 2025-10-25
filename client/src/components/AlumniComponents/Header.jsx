import { Box } from '@mui/material'
import React from 'react'
import { Link ,Outlet} from 'react-router-dom'
import '../../pages/AlumniConnect/AlumniConnect.css'
const Header = () => {
  return (
    <div className='header-body'>
    <div className='alumni-header'>
        <div className="alumni-logo">
            <div>I</div>
            <div>U</div>
            <div>S</div>
            <div>T</div>

        </div>
        <div className='header-text'> 
            <span>ALUMNI</span>
            <span> ASSOCIATION</span>
            
        </div>
        
    </div>
     <div className="alumni-navlinks">
        <Link to="/alumniconnect/dashboard">Dashboard</Link>
        {/* <Link to="/alumniconnect/profile">Profile</Link> */}
        <Link to="/alumniconnect/alumni-directory">Directory</Link>
        <Link to="/">SKilShare Social</Link>
        <Link to="/alumniconnect/aboutus">About Us</Link>
    </div>
    
    
    
    </div>
  )
}

export default Header