import React from 'react';
import Header from '../../components/AlumniComponents/Header';
import { Outlet } from 'react-router-dom';
// import '../../App.css';
import './AlumniConnect.css'

const AlumniConnect = () => {
  return (
    <div className='Alumni-container'>
      <Header />
      {/* Render nested routes here */}
     <div className="alumni-body">
        <Outlet/>
        
        
    </div>
    </div>
  );
};

export default AlumniConnect;
