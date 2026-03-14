import React from 'react'
import { motion } from "motion/react"
import {
    FaUserTie,
    FaBriefcase,
    FaFileUpload,
    FaMicrophoneAlt,
    FaChartLine,
} from "react-icons/fa";
import { useState } from 'react';
import axios from "axios"
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function Step1SetUp({ onStart }) {
    const {userData}= useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState("Technical");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);


    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) return;
        setAnalyzing(true)

        const formdata = new FormData()
        formdata.append("resume", resumeFile)

        try {
            const result = await axios.post(ServerUrl + "/api/interview/resume", formdata, { withCredentials: true })

            console.log(result.data)

            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);

            setAnalyzing(false);

        } catch (error) {
            console.log(error)
            setAnalyzing(false);
        }
    }

    const handleStart = async () => {
        setLoading(true)
        try {
           const result = await axios.post(ServerUrl + "/api/interview/generate-questions" , {role, experience, mode , resumeText, projects, skills } , {withCredentials:true}) 
           console.log(result.data)
           if(userData){
            dispatch(setUserData({...userData , credits:result.data.creditsLeft}))
           }
           setLoading(false)
           onStart(result.data)

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='min-h-screen flex items-center justify-center bg-mesh px-4 pt-24 pb-12 relative overflow-hidden'>

            {/* Glowing background elements */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className='w-full max-w-6xl glass-card rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] grid md:grid-cols-2 overflow-hidden z-10'>

                <motion.div
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className='relative bg-gray-900/40 p-12 flex flex-col justify-center border-r border-white/10'>

                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Start Your <span className="text-gradient">AI Interview</span>
                    </h2>

                    <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                        Practice real interview scenarios powered by AI.
                        Improve communication, technical skills, and confidence.
                    </p>

                    <div className='space-y-5'>

                        {
                            [
                                {
                                    icon: <FaUserTie className="text-purple-400 text-2xl drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" />,
                                    text: "Choose Role & Experience",
                                },
                                {
                                    icon: <FaMicrophoneAlt className="text-pink-400 text-2xl drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]" />,
                                    text: "Smart Voice Interview",
                                },
                                {
                                    icon: <FaChartLine className="text-rose-400 text-2xl drop-shadow-[0_0_8px_rgba(251,113,133,0.6)]" />,
                                    text: "Performance Analytics",
                                },
                            ].map((item, index) => (
                                <motion.div key={index}
                                    initial={{ y: 30, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.15 }}
                                    whileHover={{ scale: 1.03, x: 5 }}
                                    className='flex items-center space-x-5 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-sm cursor-pointer hover:bg-white/10 transition-all'>
                                    <div className="bg-white/10 p-3 rounded-xl">
                                      {item.icon}
                                    </div>
                                    <span className='text-gray-200 font-semibold text-lg tracking-wide'>{item.text}</span>

                                </motion.div>
                            ))
                        }
                    </div>



                </motion.div>



                <motion.div
                    initial={{ x: 80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.7 }}
                    className="p-12 bg-gray-900/60 backdrop-blur-xl">

                    <h2 className='text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4'>
                        Interview <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">SetUp</span>
                    </h2>


                    <div className='space-y-6'>

                        <div className='relative'>
                            <FaUserTie className='absolute top-4 left-4 text-purple-400 text-lg' />

                            <input type='text' placeholder='Enter role'
                                className='w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500/50 outline-none transition text-white placeholder-gray-500 font-medium'
                                onChange={(e) => setRole(e.target.value)} value={role} />
                        </div>


                        <div className='relative'>
                            <FaBriefcase className='absolute top-4 left-4 text-pink-400 text-lg' />

                            <input type='text' placeholder='Experience (e.g. 2 years)'
                                className='w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-pink-500/50 outline-none transition text-white placeholder-gray-500 font-medium'
                                onChange={(e) => setExperience(e.target.value)} value={experience} />

                        </div>

                        <select value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className='w-full py-3.5 px-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-rose-500/50 outline-none transition text-white font-medium appearance-none'>

                            <option value="Technical" className="bg-gray-900 text-white">Technical Interview</option>
                            <option value="HR" className="bg-gray-900 text-white">HR Interview</option>

                        </select>

                        {!analysisDone && (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => document.getElementById("resumeUpload").click()}
                                className='border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-500/10 transition-all bg-white/5'>

                                <FaFileUpload className='text-4xl mx-auto text-purple-400 mb-4 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]' />

                                <input type="file"
                                    accept="application/pdf"
                                    id="resumeUpload"
                                    className='hidden'
                                    onChange={(e) => setResumeFile(e.target.files[0])} />

                                <p className='text-gray-300 font-medium text-lg'>
                                    {resumeFile ? resumeFile.name : "Click to upload resume (Optional)"}
                                </p>

                                {resumeFile && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleUploadResume()
                                        }}

                                        className='mt-6 btn-gradient px-8 py-2.5 rounded-xl font-semibold tracking-wide'>
                                        {analyzing ? "Analyzing Document..." : "Analyze Resume"}

                                    </motion.button>)}

                            </motion.div>


                        )}

                        {analysisDone && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='bg-white/5 border border-white/10 rounded-xl p-6 space-y-4'>
                                <h3 className='text-xl font-bold text-white border-b border-white/10 pb-2'>
                                    Resume Analysis Result</h3>

                                {projects.length > 0 && (
                                    <div>
                                        <p className='font-semibold text-purple-300 mb-2'>
                                            Projects Identified:</p>

                                        <ul className='list-disc list-inside text-gray-300 space-y-1.5 ml-2'>
                                            {projects.map((p, i) => (
                                                <li key={i}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {skills.length > 0 && (
                                    <div className="pt-2">
                                        <p className='font-semibold text-pink-300 mb-3'>
                                            Skills Extracted:</p>

                                        <div className='flex flex-wrap gap-2.5'>
                                            {skills.map((s, i) => (
                                                <span key={i} className='bg-white/10 border border-white/20 text-gray-200 px-3.5 py-1.5 rounded-full text-sm font-medium shadow-sm hover:bg-white/20 transition-colors'>{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </motion.div>
                        )}


                        <motion.button
                        onClick={handleStart}
                            disabled={!role || !experience || loading}
                            whileHover={(!role || !experience || loading) ? {} : { scale: 1.03 }}
                            whileTap={(!role || !experience || loading) ? {} : { scale: 0.95 }}
                            className='w-full disabled:opacity-50 disabled:cursor-not-allowed btn-gradient py-4 rounded-xl text-lg font-bold tracking-wide transition duration-300 shadow-xl mt-4'>
                            {loading ? "Starting Interview...":"Start Interview Now"}

                        </motion.button>
                    </div>

                </motion.div>
            </div>

        </motion.div>
    )
}

export default Step1SetUp
