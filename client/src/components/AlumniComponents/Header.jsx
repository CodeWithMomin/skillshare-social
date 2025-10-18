import { Box } from '@mui/material'
import React from 'react'
import { Link ,Outlet} from 'react-router-dom'

const Header = () => {
  return (
    <>
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
        <Link>Dashboard</Link>
        <Link>Profile</Link>
        <Link>Directory</Link>
        <Link>Contact Us</Link>
        <Link>About Us</Link>
    </div>
    <div className="alumni-body">
        <Outlet/>
    </div>
    
    
    </>
  )
}

export default Header