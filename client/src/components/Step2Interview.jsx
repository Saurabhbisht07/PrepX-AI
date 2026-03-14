import React from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import Timer from './Timer'
import { motion } from "motion/react"
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { ServerUrl } from '../App'
import { BsArrowRight } from 'react-icons/bs'

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");


  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];


  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // Try known female voices first
      const femaleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
        );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Try known male voices
      const maleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
        );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback: first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;


  /* ---------------- SPEAK FUNCTION ---------------- */
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Add natural pauses after commas and periods
      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      // Human-like pacing
      utterance.rate = 0.92;     // slightly slower than normal
      utterance.pitch = 1.05;    // small warmth
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic()
        videoRef.current?.play();
      };


      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);



        if (isMicOn) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };


      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };


  useEffect(() => {
    if (!selectedVoice) {
      return;
    }
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );

        setIsIntroPhase(false)
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));

        // If last question (hard level)
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }

    }

    runIntro()


  }, [selectedVoice, isIntroPhase, currentIndex])



  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0;
        }
        return prev - 1

      })
    }, 1000);

    return () => clearInterval(timer)

  }, [isIntroPhase, currentIndex])

  useEffect(() => {
  if (!isIntroPhase && currentQuestion) {
    setTimeLeft(currentQuestion.timeLimit || 60);
  }
}, [currentIndex]);


  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;

  }, []);


  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch { }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };


  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic()
    setIsSubmitting(true)

    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer,
        timeTaken:
          currentQuestion.timeLimit - timeLeft,
      } , {withCredentials:true})

      setFeedback(result.data.feedback)
      speakText(result.data.feedback)
      setIsSubmitting(false)
    } catch (error) {
console.log(error)
setIsSubmitting(false)
    }
  }

  const handleNext =async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);

   
  }

  const finishInterview = async () => {
    stopMic()
    setIsMicOn(false)
    try {
      const result = await axios.post(ServerUrl+ "/api/interview/finish" , { interviewId} , {withCredentials:true})

      console.log(result.data)
      onFinish(result.data)
    } catch (error) {
      console.log(error)
    }
  }


   useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer()
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      window.speechSynthesis.cancel();
    };
  }, []);







  return (
    <div className='min-h-screen bg-transparent flex items-center justify-center p-4 sm:p-6 pb-20 pt-24 relative overflow-hidden'>
      {/* Ambient glowing orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className='w-full max-w-350 min-h-[80vh] glass-card rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] border border-white/10 flex flex-col lg:flex-row overflow-hidden relative z-10'>

        {/* video section */}
        <div className='w-full lg:w-[35%] bg-gray-900/40 flex flex-col items-center p-6 space-y-6 border-r border-white/10'>
          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-white/5'>
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* subtitle */}
          {subtitle && (
            <div className='w-full max-w-md bg-white/5 border border-white/10 rounded-xl p-4 shadow-sm backdrop-blur-md'>
              <p className='text-gray-200 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
            </div>
          )}


          {/* timer Area */}
          <div className='w-full max-w-md bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 space-y-5 backdrop-blur-md'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-400 font-medium'>
                Interview Status
              </span>
              {isAIPlaying && <span className='text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse'>
                {isAIPlaying ? "AI Speaking" : ""}
              </span>}
            </div>

            <div className="h-px bg-white/10"></div>

            <div className='flex justify-center'>

              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>

            <div className="h-px bg-white/10"></div>

            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'>{currentIndex + 1}</span>
                <span className='block text-xs text-gray-400 uppercase tracking-wider mt-1'>Current</span>
              </div>

              <div>
                <span className='text-3xl font-extrabold text-white'>{questions.length}</span>
                <span className='block text-xs text-gray-400 uppercase tracking-wider mt-1'>Total Qs</span>
              </div>
            </div>


          </div>
        </div>

        {/* Text section */}

        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative bg-gray-900/60 backdrop-blur-xl'>
          <h2 className='text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2'>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AI</span> 
            <span className="text-white">Smart Interview</span>
          </h2>


          {!isIntroPhase && (<div className='relative mb-6 bg-white/5 p-4 sm:p-6 rounded-2xl border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.1)] backdrop-blur-md'>
            <p className='text-xs sm:text-sm text-pink-300 font-medium mb-2 uppercase tracking-wide'>
              Question {currentIndex + 1} of {questions.length}
            </p>

            <div className='text-base sm:text-lg font-semibold text-white leading-relaxed '>{currentQuestion?.question}</div>
          </div>)
          }
          <textarea
            placeholder="Type or speak your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            className="flex-1 bg-black/40 p-5 sm:p-6 rounded-2xl resize-none outline-none border border-white/10 focus:ring-2 focus:ring-purple-500/50 transition-all text-white placeholder-gray-500 text-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]" />


         {!feedback ? ( <div className='flex items-center gap-4 mt-6'>
            <motion.button
              onClick={toggleMic}
              whileTap={{ scale: 0.9 }}
              className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-colors ${isMicOn ? 'bg-pink-600/20 text-pink-400 border border-pink-500/30 blur-glow' : 'bg-white/10 text-gray-400 border border-white/10'}`}>
              {isMicOn ? <FaMicrophone size={24} /> : <FaMicrophoneSlash size={24}/>}
            </motion.button>

            <motion.button
            onClick={submitAnswer}
            disabled={isSubmitting}
              whileTap={isSubmitting ? {} : { scale: 0.98 }}
              className='flex-1 btn-gradient py-4 rounded-2xl shadow-[0_10px_20px_rgba(168,85,247,0.2)] hover:shadow-[0_15px_30px_rgba(168,85,247,0.3)] transition-all font-bold text-lg tracking-wide disabled:opacity-50 disabled:cursor-not-allowed'>
              {isSubmitting?"Submitting Evaluation...":"Submit Final Answer"}

            </motion.button>

          </div>):(
            <motion.div 
             initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            className='mt-6 bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl shadow-sm backdrop-blur-md'>
              <p className='text-sm text-purple-300 font-bold mb-2 uppercase tracking-wide'>AI Feedback Details</p>
              <p className='text-gray-200 font-medium leading-relaxed mb-6'>{feedback}</p>

              <button
              onClick={handleNext}

               className='w-full btn-gradient py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 font-bold text-lg'>
                Proceed to Next Question <BsArrowRight size={20}/>
              </button>

            </motion.div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Step2Interview
