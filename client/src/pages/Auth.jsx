import React, { useState } from 'react'
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Auth({isModel = false}) {
    const dispatch = useDispatch()
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleAuth = async () => {
        try {
            const response = await signInWithPopup(auth,provider)
            let User = response.user
            let displayName = User.displayName
            let userEmail = User.email
            const result = await axios.post(ServerUrl + "/api/auth/google" , {name: displayName , email: userEmail} , {withCredentials:true})
            dispatch(setUserData(result.data))
        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
        }
    }

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        if (!email || !password || (!isLogin && !name)) return;
        setLoading(true);
        try {
            let User;
            if (isLogin) {
                const response = await signInWithEmailAndPassword(auth, email, password);
                User = response.user;
            } else {
                const response = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(response.user, { displayName: name });
                User = auth.currentUser;
            }
            
            const result = await axios.post(ServerUrl + "/api/auth/google" , {name: User.displayName || name , email: User.email} , {withCredentials:true});
            dispatch(setUserData(result.data));
        } catch (error) {
            console.log(error);
            alert(error.message);
            dispatch(setUserData(null));
        } finally {
            setLoading(false);
        }
    };

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
        ${isModel ? "max-w-md p-6 rounded-3xl" : "max-w-lg p-10 rounded-[32px]"}
        glass-card shadow-2xl relative overflow-hidden
      `}>
            {/* Glow effect inside card */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none"></div>

            <div className='flex items-center justify-center gap-3 mb-5 relative z-10'>
                <div className='bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-2.5 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.3)]'>
                    <BsRobot size={22}/>
                </div>
                <h2 className='font-bold text-2xl tracking-wide text-slate-800'>PrepX</h2>
            </div>

            <h1 className='text-3xl font-bold text-center leading-snug mb-3 text-slate-800 relative z-10'>
                {isLogin ? "Welcome back" : "Create an account"}
            </h1>
            
            <div className='flex justify-center mb-5 relative z-10'>
                <span className='bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full inline-flex items-center justify-center gap-2 text-sm font-semibold'>
                    <IoSparkles size={16} className='text-indigo-500'/>
                    AI Intelligence
                </span>
            </div>

            <p className='text-slate-500 text-center text-sm leading-relaxed mb-6 relative z-10'>
                Sign in to start AI-powered mock interviews,
        track your progress, and unlock detailed performance insights.
            </p>

            <form onSubmit={handleEmailAuth} className="relative z-10 flex flex-col gap-3 mb-5">
                {!isLogin && (
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                    />
                )}
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                />
                <button type="submit" disabled={loading} className='w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md py-3 rounded-xl font-semibold text-sm transition-all'>
                    {loading ? "Processing..." : (isLogin ? "Sign In" : "Create Account")}
                </button>
            </form>

            <div className="relative z-10 flex items-center justify-center gap-3 mb-5">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">or</span>
                <div className="h-px bg-slate-200 flex-1"></div>
            </div>

            <motion.button 
            type="button"
            onClick={handleGoogleAuth}
            whileHover={{opacity:0.9 , scale:1.02}}
            whileTap={{opacity:1 , scale:0.98}}
            className='w-full flex items-center justify-center gap-3 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-sm hover:bg-slate-50 transition-all text-sm font-semibold relative z-10'>
                <FcGoogle size={20}/>
                Continue with Google
            </motion.button>

            <p className="text-center text-slate-500 text-sm mt-6 relative z-10">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  type="button"
                  onClick={() => setIsLogin(!isLogin)} 
                  className="ml-2 text-indigo-600 font-semibold hover:underline">
                    {isLogin ? "Sign up" : "Log in"}
                </button>
            </p>
        </motion.div>
    </div>
  )
}

export default Auth
