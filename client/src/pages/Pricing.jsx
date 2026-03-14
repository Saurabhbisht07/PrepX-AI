import React, { useState } from 'react'
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion } from "motion/react";
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function Pricing() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch()

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Perfect for beginners starting interview preparation.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹100",
      credits: 150,
      description: "Great for focused practice and skill improvement.",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹500",
      credits: 650,
      description: "Best value for serious job preparation.",
      features: [
        "650 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];



  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id)

      const amount =  
      plan.id === "basic" ? 100 :
      plan.id === "pro" ? 500 : 0;

      const result = await axios.post(ServerUrl + "/api/payment/order" , {
        planId: plan.id,
        amount: amount,
        credits: plan.credits,
      },{withCredentials:true})
      

      const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: result.data.amount,
      currency: "INR",
      name: "PrepX",
      description: `${plan.name} - ${plan.credits} Credits`,
      order_id: result.data.id,

      handler:async function (response) {
        const verifypay = await axios.post(ServerUrl + "/api/payment/verify" ,response , {withCredentials:true})
        dispatch(setUserData(verifypay.data.user))

          alert("Payment Successful 🎉 Credits Added!");
          navigate("/")

      },
      theme:{
        color: "#10b981",
      },

      }

      const rzp = new window.Razorpay(options)
      rzp.open()

      setLoadingPlan(null);
    } catch (error) {
     console.log(error)
     setLoadingPlan(null);
    }
  }



  return (
    <div className='min-h-screen bg-mesh py-16 px-6 relative overflow-hidden'>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className='max-w-6xl mx-auto mb-14 flex items-start gap-4'>

        <button onClick={() => navigate("/")} className='mt-2 p-3 rounded-full glass-card hover:bg-white/10 transition z-10'>
          <FaArrowLeft className='text-gray-300' />
        </button>

        <div className="text-center w-full z-10">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Choose Your <span className="text-gradient">Plan</span>
          </h1>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            Flexible pricing to match your interview preparation goals.
          </p>
        </div>
      </div>


      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>

        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id

          return (
            <motion.div key={plan.id}
              whileHover={!plan.default && { scale: 1.03 }}
              onClick={() => !plan.default && setSelectedPlan(plan.id)}

              className={`relative rounded-3xl p-8 transition-all duration-300 glass-card
                ${isSelected
                  ? "border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)] bg-indigo-900/40 scale-[1.02]"
                  : "border-white/10 bg-slate-900/40"
                }
                ${plan.default ? "cursor-default opacity-90" : "cursor-pointer"}
              `}
            >

              {/* Badge */}
              {plan.badge && (
                <div className="absolute top-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.4)]">
                  {plan.badge}
                </div>
              )}

              {/* Default Tag */}
              {plan.default && (
                <div className="absolute top-6 right-6 bg-white/10 text-gray-300 font-semibold text-xs px-3 py-1.5 rounded-full border border-white/20">
                  Default
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-white">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {plan.price}
                </span>
                <p className="text-gray-400 mt-1 font-medium">
                  {plan.credits} Credits
                </p>
              </div>

              {/* Description */}
              <p className="text-gray-400 mt-4 text-base leading-relaxed h-12">
                {plan.description}
              </p>

              {/* Features */}
              <div className="mt-8 space-y-4 text-left">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FaCheckCircle className="text-pink-500 text-lg drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]" />
                    <span className="text-gray-300 text-base font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {!plan.default &&
                <button
                disabled={loadingPlan === plan.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSelected) {
                      setSelectedPlan(plan.id)
                    } else {
                      handlePayment(plan)
                    }
                  }} className={`w-full mt-10 py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-lg ${isSelected
                    ? "btn-gradient hover:opacity-90 scale-105"
                    : "bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20"
                    }`}>
                  {loadingPlan === plan.id
                    ? "Processing..."
                    : isSelected
                      ? "Proceed to Pay"
                      : "Select Plan"}

                </button>
              }
            </motion.div>
          )
        })}
      </div>

    </div>
  )
}

export default Pricing
