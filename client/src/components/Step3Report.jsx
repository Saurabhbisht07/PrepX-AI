import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react"
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function Step3Report({ report }) {
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading Report...</p>
      </div>
    );
  }
  const navigate = useNavigate()
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0
  }))

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;


  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;
    
    // Set Light Background
    doc.setFillColor(244, 246, 250); // dashboard light bg
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, "F");

    // ================= TITLE =================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("PrepX Interview Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 8;

    // Gradient-like underline (Approximation w/ solid color)
    doc.setDrawColor(99, 102, 241); // indigo-500
    doc.setLineWidth(1);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    currentY += 15;

    // ================= FINAL SCORE BOX =================
    doc.setFillColor(255, 255, 255); // white
    doc.setDrawColor(226, 232, 240); // slate-200 border
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, currentY, contentWidth, 25, 4, 4, "FD");

    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(
      `Final Score: ${finalScore}/10`,
      pageWidth / 2,
      currentY + 16,
      { align: "center" }
    );

    currentY += 35;

    // ================= SKILLS BOX =================
    doc.setFillColor(255, 255, 255); // white
    doc.setDrawColor(226, 232, 240); // slate-200 border
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4, "FD");

    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85); // slate-700

    doc.text(`Confidence: ${confidence} / 10`, margin + 10, currentY + 12);
    doc.text(`Communication: ${communication} / 10`, margin + 10, currentY + 20);
    doc.text(`Correctness: ${correctness} / 10`, margin + 10, currentY + 28);

    currentY += 45;

    // ================= ADVICE =================
    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
    }

    doc.setFillColor(255, 255, 255); // white
    doc.setDrawColor(226, 232, 240); // slate-200 border
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(99, 102, 241); // indigo-500
    doc.text("AI Feedback & Professional Advice", margin + 10, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85); // slate-700

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 50;

    // ================= QUESTION TABLE =================
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",
        textColor: [51, 65, 85], // slate-700
      },
      headStyles: {
        fillColor: [99, 102, 241], // indigo-500
        textColor: [255, 255, 255], // white
        halign: "center",
        fontStyle: "bold"
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" }, // index
        1: { cellWidth: 55 }, // question
        2: { cellWidth: 20, halign: "center" }, // score
        3: { cellWidth: "auto" }, // feedback
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // slate-50
      },
      bodyStyles: {
        fillColor: [255, 255, 255], // white
        lineColor: [226, 232, 240], // slate-200
        lineWidth: 0.1,
      }
    });
    
    // Add User Details at the end
    let finalY = doc.lastAutoTable.finalY + 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(99, 102, 241); // indigo-500
    doc.text("Saurabh Bisht", margin, finalY);
    
    finalY += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("For queries direct souravbst007@gmail.com", margin, finalY);

    
    doc.save("PrepX_Interview_Report.pdf");
  };

  return (
    <div className='min-h-screen bg-transparent px-4 sm:px-6 lg:px-10 py-8 pt-24 relative overflow-hidden'>
      {/* Ambient glowing lines for report page */}
      <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className='relative z-10'>
      <div className='mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6'>
        <div className='w-full flex items-start gap-5 flex-wrap'>
          <button
            onClick={() => navigate("/history")}
            className='mt-1 p-3 rounded-full hover:bg-white/10 glass-card shadow-lg transition-colors border border-white/5'><FaArrowLeft className='text-gray-300' /></button>

          <div>
            <h1 className='text-4xl font-bold flex-nowrap text-white'>
              Interview <span className="text-gradient">Analytics Dashboard</span>
            </h1>
            <p className='text-gray-400 mt-2 text-lg'>
              AI-powered performance insights to help you grow
            </p>

          </div>
        </div>

        <button onClick={downloadPDF} className='btn-gradient px-8 py-3.5 rounded-xl shadow-[0_10px_20px_rgba(168,85,247,0.2)] hover:shadow-[0_15px_30px_rgba(168,85,247,0.3)] transition-all duration-300 font-bold tracking-wide text-sm sm:text-base text-nowrap border border-white/10'>Download PDF Report</button>
      </div>


      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>

        <div className='space-y-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-white/10 p-8 sm:p-10 text-center">

            <h3 className="text-gray-400 mb-6 font-semibold tracking-wider uppercase text-sm">
              Overall Performance
            </h3>
            <div className='relative w-28 h-28 sm:w-32 sm:h-32 mx-auto drop-shadow-[0_0_15px_rgba(192,132,252,0.4)]'>
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "22px",
                  pathColor: "url(#gradientColors)", // We'll add a SVG def inside the component
                  textColor: "#fff",
                  trailColor: "rgba(255,255,255,0.05)",
                  strokeLinecap: "round"
                })}
              />
              <svg style={{ height: 0 }}>
                <defs>
                  <linearGradient id="gradientColors" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <p className="text-gray-500 mt-4 text-sm font-medium">
              Out of 10
            </p>

            <div className="mt-6 bg-white/5 border border-white/10 p-4 rounded-xl">
              <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-lg">
                {performanceText}
              </p>
              <p className="text-gray-300 text-sm mt-2 font-medium">
                {shortTagline}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='glass-card rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-white/10 p-6 sm:p-8'>
            <h3 className="text-base sm:text-lg font-bold text-white mb-6 border-b border-white/10 pb-3">
              Skill Evaluation Matrix
            </h3>

            <div className='space-y-7'>
              {
                skills.map((s, i) => (
                  <div key={i}>
                    <div className='flex justify-between mb-3 text-sm sm:text-base'>

                      <span className="text-gray-300 font-medium">{s.label}</span>
                      <span className='font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'>{s.value}/10</span>
                    </div>

                    <div className='bg-white/10 h-3 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] relative'>
                      <div className='bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full relative'
                        style={{ width: `${s.value * 10}%` }}
                      >
                         <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20"></div>
                      </div>

                    </div>


                  </div>
                ))
              }
            </div>

          </motion.div>


        </div>

        <div className='lg:col-span-2 space-y-6'>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='glass-card rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-white/10 p-6 sm:p-8'>
            <h3 className="text-base sm:text-lg font-bold text-white mb-6 border-b border-white/10 pb-3">
              Performance Trend Across Questions
            </h3>

            <div className='h-64 sm:h-72 w-full'>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c084fc" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false}/>
                  <YAxis domain={[0, 10]} stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false}/>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#f472b6', fontWeight: 'bold' }}
                    cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
                  />
                  <Area type="monotone"
                    dataKey="score"
                    stroke="#f472b6"
                    fillOpacity={1}
                    fill="url(#colorScore)"
                    strokeWidth={3}
                    activeDot={{ r: 6, fill: "#c084fc", stroke: "#fff", strokeWidth: 2 }} />


                </AreaChart>

              </ResponsiveContainer>


            </div>


          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='glass-card rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] border border-white/10 p-6 sm:p-8'>
            <h3 className="text-base sm:text-lg font-bold text-white mb-6 border-b border-white/10 pb-3">
              Detailed Question Breakdown
            </h3>
            <div className='space-y-6'>
              {questionWiseScore.map((q, i) => (
                <div key={i} className='bg-gray-900/50 p-5 sm:p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-colors shadow-sm'>

                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5'>
                    <div>
                      <p className="text-xs text-pink-400 font-bold uppercase tracking-wider mb-2">
                        Question {i + 1}
                      </p>

                      <p className="font-semibold text-white text-base sm:text-lg leading-relaxed">
                        {q.question || "Question not available"}
                      </p>
                    </div>


                    <div className='bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-1.5 rounded-xl font-bold text-sm sm:text-base w-fit whitespace-nowrap shadow-[0_0_10px_rgba(192,132,252,0.1)]'>
                      {q.score ?? 0} / 10
                    </div>
                  </div>

                  <div className='bg-white/5 border border-white/10 p-5 rounded-xl backdrop-blur-sm relative overflow-hidden'>
                     <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-400 to-pink-400"></div>
                    <p className='text-xs text-purple-300 font-bold mb-2 uppercase tracking-wide ml-2'>
                      AI Evaluation & Feedback
                    </p>
                    <p className='text-sm text-gray-300 leading-relaxed font-medium ml-2'>

                      {q.feedback && q.feedback.trim() !== ""
                        ? q.feedback
                        : "No feedback available for this question."}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </motion.div>





        </div>
      </div>
      </div>
    </div>
  )
}

export default Step3Report
