import React from 'react';

const BackArrow = () => (
  <svg className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const UserIcon = () => (
  <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ChartIcon = () => (
  <svg className="w-8 h-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 20V10"></path><path d="M12 20V4"></path><path d="M6 20V14"></path>
  </svg>
);

const CheckCircle = () => (
  <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const AlertTriangle = () => (
  <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

export default function AnalysisDashboard({
  analysisResult,
  totalFeedback,
  onBack,
}: {
  analysisResult: any;
  totalFeedback: number;
  onBack: () => void;
}) {
  const positiveTopics = analysisResult?.positive_themes || [];
  const improvementTopics = analysisResult?.negative_themes || [];
  const neutralTopics = analysisResult?.neutral_themes || [];
  const summary = analysisResult?.summary_text || "ไม่มีบทสรุปสำหรับการประเมินนี้";

  let sentimentPercentage = 50; // Default neutral
  if (analysisResult?.sentiment_score !== undefined) {
    sentimentPercentage = analysisResult.sentiment_score;
  } else {
    // Fallback calculation if the API doesn't return a score
    const totalTopics = positiveTopics.length + improvementTopics.length + (neutralTopics.length * 0.5);
    if (totalTopics > 0) {
      sentimentPercentage = Math.round((positiveTopics.length + (neutralTopics.length * 0.25)) / totalTopics * 100);
    }
  }

  const getProgressColor = (percent: number) => {
    if (percent >= 70) return 'from-emerald-400 to-teal-500';
    if (percent >= 40) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-red-500';
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 font-sans animate-in fade-in duration-700 slide-in-from-bottom-4">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200/60">
          <div className="space-y-4">
            <button
              onClick={onBack}
              className="group flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-all bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-slate-200/60"
            >
              <BackArrow />
              ย้อนกลับ
            </button>
            <div className="space-y-1 mt-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
                สรุปผลการประเมิน<span className="text-black">ความพึงพอใจ</span>
              </h1>
              <p className="text-lg text-slate-500 flex items-center gap-2 font-medium">
                <svg className="w-6 h-6 text-indigo-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg>
                วิเคราะห์ความคิดเห็นทั้งหมดด้วย AI
              </p>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Top Metrics Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-blue-100/80 to-indigo-100/80 rounded-full group-hover:scale-150 transition-transform duration-700 ease-in-out z-0 blur-2xl"></div>
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">จำนวนผู้ตอบ</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-slate-900 tracking-tight">{totalFeedback}</span>
                    <span className="text-lg text-slate-500 font-medium">คน</span>
                  </div>
                </div>
                <div className="p-4 bg-white shadow-sm ring-1 ring-slate-100 rounded-2xl group-hover:rotate-6 transition-transform">
                  <UserIcon />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-purple-100/80 to-fuchsia-100/80 rounded-full group-hover:scale-150 transition-transform duration-700 ease-in-out z-0 blur-2xl"></div>
              <div className="relative z-10 flex justify-between items-start w-full mb-6">
                 <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">ดัชนีความรู้สึก</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-slate-900 tracking-tight">{sentimentPercentage}</span>
                      <span className="text-3xl font-bold text-slate-300">%</span>
                    </div>
                 </div>
                 <div className="p-4 bg-white shadow-sm ring-1 ring-slate-100 rounded-2xl group-hover:-rotate-6 transition-transform">
                    <ChartIcon />
                 </div>
              </div>
              
              <div className="relative z-10 w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full bg-gradient-to-r shadow-sm ${getProgressColor(sentimentPercentage)}`}
                  style={{ width: `${sentimentPercentage}%`, transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                  <div className="w-full h-full opacity-30 bg-[length:1rem_1rem] bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] animate-[move_1s_linear_infinite]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary Column */}
          <div className="lg:col-span-8">
             <div className="h-full bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50 via-purple-50/50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-indigo-100/50 transition-colors duration-700"></div>
               
               <div className="relative z-10 flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-800 m-0">สรุปจาก AI</h2>
               </div>
               
               <div className="relative z-10 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-6 border border-slate-200/60 w-full flex-grow flex shadow-sm">
                 <div className="absolute left-0 top-6 w-1 h-12 bg-indigo-500 rounded-r-full"></div>
                 <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line w-full font-medium pl-4">{summary}</p>
               </div>
            </div>
          </div>

          {/* Feedback Points Grid */}
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-2">
            {/* Strengths Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                </div>
                <h3 className="text-xl font-extrabold text-slate-800">จุดแข็งและสิ่งที่ได้รับคำชม</h3>
              </div>
              
              {positiveTopics.length > 0 ? (
                <ul className="space-y-4">
                  {positiveTopics.map((topic: string, i: number) => (
                    <li key={i} className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 hover:-translate-y-1">
                      <div className="mt-0.5 bg-emerald-100/50 p-1.5 rounded-full group-hover:bg-emerald-100 group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="text-slate-700 font-medium leading-relaxed">{topic}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                  <svg className="w-12 h-12 mb-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                  <p className="font-medium">ไม่มีข้อมูลคำชมในขณะนี้</p>
                </div>
              )}
            </div>

            {/* Improvements Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <h3 className="text-xl font-extrabold text-slate-800">จุดที่ควรพัฒนาและปรับปรุง</h3>
              </div>
              
              {improvementTopics.length > 0 ? (
                <ul className="space-y-4">
                  {improvementTopics.map((topic: string, i: number) => (
                    <li key={i} className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 hover:-translate-y-1">
                      <div className="mt-0.5 bg-amber-100/50 p-1.5 rounded-full group-hover:bg-amber-100 group-hover:scale-110 transition-transform">
                        <svg className="w-4 h-4 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                      </div>
                      <span className="text-slate-700 font-medium leading-relaxed">{topic}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                  <svg className="w-12 h-12 mb-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                  <p className="font-medium">ไม่มีข้อมูลที่ต้องปรับปรุงในขณะนี้</p>
                </div>
              )}
            </div>
          </div>

          {/* Neutral Topics Section */}
          {neutralTopics.length > 0 && (
            <div className="lg:col-span-12 bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 mb-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <h3 className="text-xl font-extrabold text-slate-800">ข้อเสนอแนะทั่วไปและอื่นๆ</h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {neutralTopics.map((topic: string, i: number) => (
                  <li key={i} className="group flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-blue-200 transition-all duration-300 hover:-translate-y-1">
                    <div className="mt-0.5 text-blue-400 group-hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"></path></svg>
                    </div>
                    <span className="text-slate-600 font-medium leading-relaxed group-hover:text-slate-800">{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
