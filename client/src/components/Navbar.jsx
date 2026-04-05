import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import AuthModel from './AuthModel';
function Navbar() {
    const {userData} = useSelector((state)=>state.user)
    const [showCreditPopup,setShowCreditPopup] = useState(false)
    const [showUserPopup,setShowUserPopup] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showAuth, setShowAuth] = useState(false);

    const handleLogout = async () => {
        try {
            await axios.get(ServerUrl + "/api/auth/logout" , {withCredentials:true})
            dispatch(setUserData(null))
            setShowCreditPopup(false)
            setShowUserPopup(false)
            navigate("/")

        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='bg-transparent flex justify-center px-4 pt-6 fixed top-0 w-full z-50'>
        <motion.div 
        initial={{opacity:0 , y:-40}}
        animate={{opacity:1 , y:0}}
        transition={{duration: 0.3}}
        className='w-full max-w-6xl glass-nav rounded-[24px] shadow-lg px-8 py-4 flex justify-between items-center relative'>
            <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate("/")}>
                <div className='bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 text-2xl rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)]'>
                    <BsRobot size={22}/>
                </div>
                <h1 className='font-bold hidden md:block text-2xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600'>PrepX</h1>
            </div>

            <div className='flex items-center gap-6  relative'>
                <div className='relative'>
                    <button onClick={()=>{
                        if(!userData){
                            setShowAuth(true)
                            return;
                        }
                        setShowCreditPopup(!showCreditPopup);
                        setShowUserPopup(false)
                    }} className='flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-4 py-2 rounded-full text-md hover:bg-indigo-500/20 transition-all'>
                        <BsCoin size={20} className='text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'/>
                        <span className='font-semibold'>{userData?.credits || 0}</span>
                    </button>

                    {showCreditPopup && (
                        <div className='absolute right-[-50px] mt-3 w-64 glass-card shadow-2xl rounded-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2'>
                            <p className='text-sm text-gray-300 mb-4 font-medium'>Need more credits to continue interviews?</p>
                            <button onClick={()=>navigate("/pricing")} className='w-full btn-gradient py-2.5 rounded-xl text-sm font-semibold tracking-wide'>Buy more credits</button>

                        </div>
                    )}
                </div>

                <div className='relative'>
                    <button
                    onClick={()=>{
                         if(!userData){
                            setShowAuth(true)
                            return;
                        }
                        setShowUserPopup(!showUserPopup);
                        setShowCreditPopup(false)
                    }} className='w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.5)] text-white rounded-full flex items-center justify-center font-bold text-lg hover:scale-105 transition-all'>
                        {userData ? userData?.name.slice(0,1).toUpperCase() : <FaUserAstronaut size={18}/>}
                        
                    </button>

                    {showUserPopup && (
                        <div className='absolute right-0 mt-3 w-56 glass-card shadow-2xl rounded-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2'>
                            <p className='text-lg text-white font-semibold mb-3 border-b border-gray-700 pb-2'>{userData?.name}</p>

                            <button onClick={()=>navigate("/history")} className='w-full text-left text-sm py-2 hover:text-white transition-colors text-gray-400 font-medium'>Interview History</button>
                            <button onClick={handleLogout} 
                            className='w-full text-left text-sm py-2 flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors font-medium mt-1'>
                                <HiOutlineLogout size={18}/>
                                Logout</button>
                        </div>
                    )}
                </div>

            </div>



        </motion.div>

        {showAuth && <AuthModel onClose={()=>setShowAuth(false)}/>}
      
    </div>
  )
}

export default Navbar
