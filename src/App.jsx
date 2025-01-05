import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Chat from './pages/Chat/Chat';
import Login from './pages/Login/Login';
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate';


import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from './config/firebase';
const App = () => {
  const navigate=useNavigate();
  useEffect(()=>{
    onAuthStateChanged(auth,async (user)=> {
      if(user)
      {
             navigate('/chat')
      }else{
              navigate('/')
      }
    })
  },[])
  return (
    <>
    <ToastContainer/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/Chat' element={<Chat/>}/>
        <Route path='/profile' element={<ProfileUpdate/>}/>
      </Routes>
      </>
  )
}
export default App