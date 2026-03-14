import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../App'
import { FaArrowLeft } from 'react-icons/fa'
function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })

                setInterviews(result.data)

            } catch (error) {
                console.log(error)
            }

        }

        getMyInterviews()

    }, [])


    return (
        <div className='min-h-screen bg-mesh py-10 relative overflow-hidden pt-24' >
            {/* Ambient Background Lights */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto z-10 relative'>

                <div className='mb-12 w-full flex items-start gap-5 flex-wrap'>
                    <button
                        onClick={() => navigate("/")}
                        className='mt-2 p-3 rounded-full glass-card shadow-lg hover:bg-white/10 transition'><FaArrowLeft className='text-gray-300' /></button>

                    <div>
                        <h1 className='text-4xl font-bold flex-nowrap text-white tracking-wide'>
                            Interview <span className="text-gradient">History</span>
                        </h1>
                        <p className='text-gray-400 mt-2 text-lg'>
                            Track your past interviews and access detailed performance reports
                        </p>

                    </div>
                </div>


                {interviews.length === 0 ?
                    <div className='glass-card p-12 rounded-3xl shadow-xl text-center border border-white/10'>
                        <p className='text-gray-300 text-lg font-medium'>
                            No interviews found. Start your first <span className="text-gradient font-bold">PrepX</span> session today!
                        </p>

                    </div>

                    :

                    <div className='grid gap-6'>
                        {interviews.map((item, index) => (
                            <div key={index}
                            onClick={()=>navigate(`/report/${item._id}`)}
                             className='glass-card p-6 md:p-8 rounded-3xl shadow-lg hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)] transition-all duration-300 cursor-pointer border border-white/10 hover:border-purple-500/30 group'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                            {item.role}
                                        </h3>

                                        <p className="text-gray-400 text-base mt-2 font-medium flex items-center gap-2">
                                            <span className="bg-white/10 px-3 py-1 rounded-md text-pink-300">{item.experience}</span>
                                            <span>•</span>
                                            <span className="bg-white/10 px-3 py-1 rounded-md text-purple-300">{item.mode} Mode</span>
                                        </p>

                                        <p className="text-sm text-gray-500 mt-4">
                                            {new Date(item.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-8 bg-gray-900/50 p-4 rounded-2xl border border-white/5'>

                                        {/* SCORE */}
                                        <div className="text-right">
                                            <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                                {item.finalScore || 0}<span className="text-lg text-gray-500">/10</span>
                                            </p>
                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">
                                                Overall Score
                                            </p>
                                        </div>

                                        {/* STATUS BADGE */}
                                        <span
                                            className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide border ${item.status === "completed"
                                                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                                                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                                                }`}
                                        >
                                            {item.status.toUpperCase()}
                                        </span>


                                    </div>
                                </div>

                            </div>

                        ))
                        }

                    </div>
                }
            </div>

        </div>
    )
}

export default InterviewHistory
