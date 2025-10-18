import React from 'react';
import Header from '../../components/AlumniComponents/Header';
import { Outlet } from 'react-router-dom';
import '../../App.css';

const AlumniConnect = () => {
  return (
    <div className='Alumni-container'>
      <Header />
      {/* Render nested routes here */}
      <Outlet />
    </div>
  );
};

export default AlumniConnect;
