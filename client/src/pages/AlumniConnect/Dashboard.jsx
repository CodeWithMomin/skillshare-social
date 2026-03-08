import React from 'react'
import '../AlumniConnect/AlumniConnect.css'
import { useNavigate } from 'react-router-dom'
const Dashboard = () => {
    const navigate = useNavigate()
    const handleProfilebtnclick = () => {
        navigate('/alumniconnect/profile')
    }
    return (
        <div className='dashboard_container'>
            <div className='profile'>
                <h3>Your Alumni Profile</h3>
                <br />
                <p>Complete your Alumni Profile &  <br />be recognized in alumni community</p>
                <button className='dashboard-button' onClick={handleProfilebtnclick}>View</button>
            </div>
            <div className='alumni-directory'>
                <h3> Alumni Directory</h3>
                <br />
                <p>View complete directory & connect <br />with alumni in your domain</p>
                <button className='dashboard-button' onClick={() => navigate('/alumniconnect/alumni-directory')}>View</button>
            </div>
            <div className='alumni-city'>
                <h3> Alumni in your City</h3>
                <br />
                <p>Find the alumni living in your city & be a <br />part of meetups in your local area</p>
                <button className='dashboard-button' onClick={() => navigate('/alumniconnect/alumni-in-city')}>View</button>
            </div>
            <div className='alumni-batchmates'>
                <h3> Your Batchmates</h3>
                <br />
                <p>View our exclusive batchmates<br />directory</p>
                <button className='dashboard-button' onClick={() => navigate('/alumniconnect/batchmates')}>View</button>
            </div>
        </div>
    )
}

export default Dashboard