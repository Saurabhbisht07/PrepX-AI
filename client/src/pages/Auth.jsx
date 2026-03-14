import React from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function Auth({isModel = false}) {
    const dispatch = useDispatch()

    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            let User = response.user
            let name = User.displayName
            let email = User.email
            const result = await axios.post(ServerUrl + "/api/auth/google" , {name , email} , {withCredentials:true})
            dispatch(setUserData(result.data))
            


            
        } catch (error) {
            console.log(error)
              dispatch(setUserData(null))
        }
    }
  return (
    <div className={`
      w-full 
      ${isModel ? "py-4" : "min-h-screen bg-mesh flex items-center justify-center px-6 py-20"}
    `}>
        <motion.div 
        initial={{opacity:0 , y:-40}} 
        animate={{opacity:1 , y:0}} 
        transition={{duration:1.05}}
        className={`
        w-full 
        ${isModel ? "max-w-md p-8 rounded-3xl" : "max-w-lg p-12 rounded-[32px]"}
        glass-card shadow-2xl relative overflow-hidden
      `}>
            {/* Glow effect inside card */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/30 rounded-full blur-[50px] pointer-events-none"></div>

            <div className='flex items-center justify-center gap-3 mb-6 relative z-10'>
                <div className='bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2.5 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)]'>
                    <BsRobot size={22}/>
                </div>
                <h2 className='font-bold text-2xl tracking-wide text-white'>PrepX</h2>
            </div>

            <h1 className='text-3xl md:text-4xl font-bold text-center leading-snug mb-6 text-white relative z-10'>
                Continue with
                <span className='btn-gradient px-4 py-1.5 rounded-full inline-flex items-center gap-2 mt-2 text-xl ml-2'>
                    <IoSparkles size={20} className='text-yellow-300'/>
                    AI Intelligence
                </span>
            </h1>

            <p className='text-gray-400 text-center text-sm md:text-base leading-relaxed mb-8 relative z-10'>
                Sign in to start AI-powered mock interviews,
        track your progress, and unlock detailed performance insights.
            </p>


            <motion.button 
            onClick={handleGoogleAuth}
            whileHover={{opacity:0.9 , scale:1.03}}
            whileTap={{opacity:1 , scale:0.98}}
            className='w-full flex items-center justify-center gap-3 py-3.5 bg-white/10 border border-white/20 text-white rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:bg-white/20 transition-all font-semibold tracking-wide relative z-10'>
                <FcGoogle size={20}/>
                Continue with Google

   
            </motion.button>
        </motion.div>

      
    </div>
  )
}

export default Auth
