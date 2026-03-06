"use client";

import React, { useState, useEffect } from 'react';
import AnalysisDashboard from '@/components/AnalysisDashboard';

// API Route will be mapped to the Next.js API
const API_URL = '/api';

const Spinner = () => <div className="spinner-inline"></div>;

export default function Home() {
  const [feedback, setFeedback] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [submittedFeedback, setSubmittedFeedback] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`${API_URL}/feedback`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setSubmittedFeedback(data); 
        }
      } catch (error) {
        console.error("Failed to fetch existing feedback:", error);
        setNotification({ 
          message: 'ไม่สามารถโหลดข้อเสนอแนะที่มีอยู่ได้', 
          type: 'error' 
        });
      }
    };

    fetchFeedback();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ message: '', type: '' });

    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: feedback }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดที่ไม่คาดคิด');
      }

      setNotification({ message: data.message, type: 'success' });
      setSubmittedFeedback([data.submittedContent, ...submittedFeedback]);
      setFeedback('');
    } catch (error: any) {
      setNotification({ message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setNotification({ message: '', type: '' });
    try {
      const response = await fetch(`${API_URL}/analyze`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'ไม่สามารถวิเคราะห์ข้อมูลได้');
      }

      if (data.message) {
        setNotification({ message: data.message, type: 'success' });
      } else {
        setAnalysisResult(data);
        setShowDashboard(true);
      }
    } catch (error: any) {
      setNotification({ message: error.message, type: 'error' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    setNotification({ message: '', type: '' });
    try {
      const response = await fetch(`${API_URL}/feedback?id=${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'ไม่สามารถลบข้อมูลได้');
      
      setSubmittedFeedback(submittedFeedback.filter(item => item.id !== id));
      setNotification({ message: 'ลบข้อเสนอแนะเรียบร้อย', type: 'success' });
      setItemToDelete(null);
    } catch (error: any) {
      setNotification({ message: error.message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (showDashboard && analysisResult) {
    return (
      <AnalysisDashboard 
        analysisResult={analysisResult} 
        totalFeedback={submittedFeedback.length} 
        onBack={() => setShowDashboard(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <svg className="w-6 h-6 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              ยืนยันการลบ
            </h3>
            <p className="text-slate-500 mb-8 font-medium">คุณแน่ใจหรือไม่ว่าต้องการลบข้อเสนอแนะนี้? การกระทำนี้ไม่สามารถนำข้อมูลกลับมาได้อีก</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 font-semibold rounded-xl transition-colors"
                disabled={isLoading}
              >
                ยกเลิก
              </button>
              <button 
                onClick={() => handleDelete(itemToDelete)}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-xl transition-colors shadow-sm hover:shadow active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                disabled={isLoading}
              >
                {isLoading && <svg className="animate-spin h-5 w-5 text-white -ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                ลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
        
        {/* Header Section */}
        <header className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4 shadow-sm ring-1 ring-indigo-100/50">
             <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            ระบบวิเคราะความคิดเห็น (Demo)
          </h1>
        </header>

        {notification.message && (
          <div className={`p-4 rounded-xl border font-medium flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'error' 
              ? 'bg-rose-50 text-rose-600 border-rose-200' 
              : 'bg-emerald-50 text-emerald-600 border-emerald-200'
          }`}>
            {notification.type === 'error' ? (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            )}
            {notification.message}
          </div>
        )}

        <div className="flex flex-col gap-6 lg:gap-8">
          
          {/* Form Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
               <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
               ส่งข้อเสนอแนะใหม่
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="โปรดแบ่งปันความคิดเห็นของคุณ เกี่ยวกับประสบการณ์ที่ได้รับ..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-y text-slate-700 placeholder-slate-400"
                required
                rows={6}
              />
              <button 
                type="submit" 
                disabled={isLoading || !feedback.trim()}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl transition-all disabled:opacity-50 disabled:hover:bg-slate-900 shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                  <>
                    ส่งข้อเสนอแนะ
                    <svg className="w-5 h-5 ml-1 -mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col">
            <h2 className="text-lg font-extrabold text-slate-800 mb-4 pb-4 border-b border-slate-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
              ข้อเสนอแนะ ({submittedFeedback.length})
            </h2>
            
            <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {submittedFeedback.length > 0 ? (
                <ul className="space-y-3">
                  {submittedFeedback.map((item, index) => (
                    <li key={item.id || index} className="p-4 bg-slate-50 border border-slate-100/60 rounded-2xl text-slate-700 text-sm leading-relaxed hover:bg-slate-100/50 transition-colors flex justify-between items-start gap-4">
                      <span>{item.content || item}</span>
                      {item.id && (
                        <button 
                          onClick={() => setItemToDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors shrink-0 disabled:opacity-50"
                          title="ลบข้อเสนอแนะ"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <svg className="w-12 h-12 mb-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <p>ยังไม่มีข้อเสนอแนะในขณะนี้</p>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50/80 rounded-full group-hover:scale-150 transition-transform duration-700 ease-out z-0 blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div>
                 <h2 className="text-xl font-extrabold mb-2 flex items-center gap-2 text-slate-800">
                   <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                     <svg className="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                   </div>
                   วิเคราะห์ผลรวมด้วย AI
                 </h2>
               </div>
               <button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || submittedFeedback.length === 0}
                className="shrink-0 flex items-center justify-center gap-2 py-3 px-6 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:hover:bg-slate-200 disabled:text-slate-500 active:scale-[0.98]"
              >
                {isAnalyzing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    กำลังประมวลผล...
                  </>
                ) : (
                  'เริ่มการวิเคราะห์'
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
