import React from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { motion } from "motion/react";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthModel from '../components/AuthModel';
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from '../components/Footer';


function Home() {
  const { userData } = useSelector((state) => state.user)
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-mesh flex flex-col relative overflow-hidden'>
      {/* Decorative Glow Elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      <Navbar />

      <div className='flex-1 px-6 py-32 z-10'>
        <div className='max-w-6xl mx-auto'>

          <div className='flex justify-center mb-10'>
            <div className='glass-nav text-gray-300 text-sm px-5 py-2.5 rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.2)] border border-purple-500/30'>
              <HiSparkles size={18} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
              <span className='font-medium tracking-wide'>AI-Powered Smart Interview Platform</span>
            </div>


          </div>
          <div className='text-center mb-28'>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-5xl md:text-7xl font-bold leading-[1.2] max-w-5xl mx-auto text-white tracking-tight'>
              Master Interviews with
              <br/>
              <span className='relative inline-block mt-2'>
                <span className='text-gradient drop-shadow-lg font-extrabold'>
                  PrepX Intelligence
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className='text-gray-400 mt-8 max-w-2xl mx-auto text-xl leading-relaxed'>
              Role-based mock interviews with smart follow-ups,
              adaptive difficulty and real-time performance evaluation.

            </motion.p>

            <div className='flex flex-wrap justify-center gap-6 mt-12'>
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return;
                  }
                  navigate("/interview")
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='btn-gradient px-12 py-4 rounded-full font-semibold text-lg tracking-wide'>
                Start Your Interview
              </motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true)
                    return;
                  }
                  navigate("/history")
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='glass-nav border border-white/20 text-white px-12 py-4 rounded-full hover:bg-white/10 transition font-semibold text-lg'>
                View Past Sessions
              </motion.button>
            </div>
          </div>

          <div className='flex flex-col md:flex-row justify-center items-center gap-10 mb-28'>
            {
              [
                {
                  icon: <BsRobot size={24} />,
                  step: "STEP 1",
                  title: "Role & Experience Selection",
                  desc: "AI adjusts difficulty based on selected job role."
                },
                {
                  icon: <BsMic size={24} />,
                  step: "STEP 2",
                  title: "Smart Voice Interview",
                  desc: "Dynamic follow-up questions based on your answers."
                },
                {
                  icon: <BsClock size={24} />,
                  step: "STEP 3",
                  title: "Timer Based Simulation",
                  desc: "Real interview pressure with time tracking."
                }
              ].map((item, index) => (
                <motion.div key={index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 + index * 0.2 }}
                  whileHover={{ rotate: 0, scale: 1.06 }}

                  className={`
        relative glass-card rounded-3xl p-10 w-80 max-w-[90%] 
        ${index === 0 ? "rotate-[-4deg] border-indigo-500/30" : ""}
        ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-[0_10px_40px_rgba(168,85,247,0.15)] border-purple-500/50" : ""}
        ${index === 2 ? "rotate-[-3deg] border-pink-500/30" : ""}
      `}>

                  <div className='absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]'>
                    {item.icon}</div>
                  <div className='pt-10 text-center'>
                    <div className='text-xs text-indigo-400 font-bold mb-2 tracking-widest uppercase'>{item.step}</div>
                    <h3 className='font-bold mb-3 text-xl text-white'>{item.title}</h3>
                    <p className='text-sm text-gray-400 leading-relaxed'>{item.desc}</p>
                  </div>


                </motion.div>
              ))
            }
          </div>


          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-5xl font-bold text-center mb-16 text-white'>
              Advanced PrepX{" "}
              <span className="text-gradient">Capabilities</span>

            </motion.h2>

            <div className='grid md:grid-cols-2 gap-10'>
              {
                [
                  {
                    image: evalImg,
                    icon: <BsBarChart size={20} />,
                    title: "AI Answer Evaluation",
                    desc: "Scores communication, technical accuracy and confidence."
                  },
                  {
                    image: resumeImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Resume Based Interview",
                    desc: "Project-specific questions based on uploaded resume."
                  },
                  {
                    image: pdfImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Downloadable PDF Report",
                    desc: "Detailed strengths, weaknesses and improvement insights."
                  },
                  {
                    image: analyticsImg,
                    icon: <BsBarChart size={20} />,
                    title: "History & Analytics",
                    desc: "Track progress with performance graphs and topic analysis."
                  }
                ].map((item, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className='glass-card rounded-3xl p-8 hover:scale-[1.02] transition-transform duration-300'>
                    <div className='flex flex-col md:flex-row items-center gap-8'>
                      <div className='w-full md:w-1/2 flex justify-center p-4 bg-white/5 rounded-2xl'>
                        <img src={item.image} alt={item.title} className='w-full h-auto object-contain max-h-56 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]' />
                      </div>

                      <div className='w-full md:w-1/2'>
                        <div className='bg-indigo-500/20 text-indigo-400 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]'>
                          {item.icon}
                        </div>
                        <h3 className='font-bold mb-3 text-2xl text-white'>{item.title}</h3>
                        <p className='text-gray-400 text-base leading-relaxed'>{item.desc}</p>
                      </div>

                    </div>


                  </motion.div>
                ))
              }
            </div>


          </div>

          <div className='mb-32'>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='text-4xl md:text-5xl font-bold text-center mb-16 text-white'>
              Multiple Interview{" "}
              <span className="text-gradient">Modes</span>

            </motion.h2>

            <div className='grid md:grid-cols-2 gap-10'>
              {
                [
                  {
                    img: hrImg,
                    title: "HR Interview Mode",
                    desc: "Behavioral and communication based evaluation."
                  },
                  {
                    img: techImg,
                    title: "Technical Mode",
                    desc: "Deep technical questioning based on selected role."
                  },

                  {
                    img: confidenceImg,
                    title: "Confidence Detection",
                    desc: "Basic tone and voice analysis insights."
                  },
                  {
                    img: creditImg,
                    title: "Credits System",
                    desc: "Unlock premium interview sessions easily."
                  }
                ].map((mode, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="glass-card rounded-3xl p-8 group">

                    <div className='flex items-center justify-between gap-6'>
                      <div className="w-1/2">
                        <h3 className="font-bold text-2xl mb-3 text-white">
                          {mode.title}
                        </h3>

                        <p className="text-gray-400 text-base leading-relaxed">
                          {mode.desc}
                        </p>
                      </div>

                      {/* RIGHT IMAGE */}
                      <div className="w-1/2 flex justify-end">
                        <img
                          src={mode.img}
                          alt={mode.title}
                          className="w-28 h-28 object-contain"
                        />
                      </div>



                    </div>


                  </motion.div>
                ))
              }
            </div>


          </div>

        </div>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}

        <Footer/>

    </div>
  )
}

export default Home
