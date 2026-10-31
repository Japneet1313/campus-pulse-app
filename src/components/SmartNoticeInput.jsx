import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  HelpCircle, 
  FileText, 
  Check, 
  Loader2, 
  Info,
  Wand2,
  Copy
} from 'lucide-react';
import { extractorService } from '../services/extractorService';

export default function SmartNoticeInput({ onNoticeExtracted }) {
  const [inputText, setInputText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState('');

  const sampleTemplates = [
    {
      label: '⚡ Exam Circular',
      text: `EXAMINATION BRANCH NOTIFICATION
Ref No: EXAM/2026/842
Date of Event: 5th November 2026 at 09:30 AM
Venue: Main Examination Hall & Student ERP Portal
Subject: End-Semester Theory Examination Hall Ticket Release

This is to notify all registered 2nd, 3rd, and 4th year B.Tech students that the final hall tickets for Odd Semester 2026 have been generated. Candidates must have minimum 75% attendance to access hall tickets. Any discrepancy or schedule clash must be reported immediately to Room 204 before Nov 3.`
    },
    {
      label: '💼 Placement Drive',
      text: `CAMPUS PLACEMENT ALERT: AMAZON & CISCO
Date: 8th November 2026, 09:00 AM
Venue: APJ Abdul Kalam Auditorium, Block 3
Role: Software Development Engineer Intern (2027 Batch)
Stipend: $1,200/month + Full-Time Conversion Opportunity

Eligibility: CSE, IT, ECE with CGPA 8.0 and above. Dress Code: Strictly Western Business Formals. Bring 2 copies of resume, College ID Card, and personal laptop for the 90-minute online coding round.`
    },
    {
      label: '🚀 Tech Fest Hackathon',
      text: `ANNUAL COLLEGE FEST: HACKPULSE 2026
Venue: Campus Innovation & Robotics Hub
Date: 14th November 2026, 10:00 AM
Categories: AI, Web3, Smart Campus Solutions

Join 200+ student developers for our 24-hour national hackathon. Prize pool $5,000 with startup incubation support. Teams of 2 to 4 members. Register online before November 10th. Free meals and hacker swag included!`
    }
  ];

  const handleExtract = async () => {
    if (!inputText.trim()) {
      setError('Please paste or type notice text into the box above.');
      return;
    }
    setError('');
    setIsExtracting(true);

    try {
      const extracted = await extractorService.extractNotice(inputText);
      onNoticeExtracted(extracted);
    } catch (err) {
      setError(err.message || 'Failed to extract notice data.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleLoadSample = (sampleText) => {
    setInputText(sampleText);
    setError('');
  };

  return (
    <div className="relative rounded-2xl bg-gradient-to-b from-navy-900/90 to-navy-950/90 border border-purple-500/25 p-5 sm:p-6 backdrop-blur-xl shadow-glow-purple">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-pulse-glow border border-purple-500/30">
            <Wand2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              Smart Notice Extractor
            </h2>
            <p className="text-xs text-purple-300/70">
              Paste raw emails, WhatsApp forwards, or official circulars to auto-structure details
            </p>
          </div>
        </div>

        {/* Clear Demo Label */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-[11px] font-semibold text-purple-300">
          <span className="w-2 h-2 rounded-full bg-pulse-purple animate-ping"></span>
          <span>DEMO EXTRACTION MODE (No API Key Required)</span>
        </div>
      </div>

      {/* Demo Mode Notice Callout */}
      <div className="mb-4 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-2.5 text-xs text-purple-200/90">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-purple-300">Hackathon Notice Parser:</strong> Currently running in rule-based heuristic extraction mode. It automatically parses titles, dates, timings, venues, and priorities from college circular formats without requiring paid external AI API keys.
        </div>
      </div>

      {/* Quick Sample Presets */}
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          Try Sample:
        </span>
        {sampleTemplates.map((template, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleLoadSample(template.text)}
            className="text-xs px-2.5 py-1 rounded-lg bg-navy-800/80 hover:bg-purple-900/40 text-slate-300 hover:text-white border border-white/5 hover:border-purple-500/30 transition-all font-medium"
          >
            {template.label}
          </button>
        ))}
        {inputText && (
          <button
            type="button"
            onClick={() => setInputText('')}
            className="text-xs px-2 py-1 text-slate-500 hover:text-slate-300 ml-auto"
          >
            Clear Text
          </button>
        )}
      </div>

      {/* Textarea Input */}
      <div className="relative">
        <textarea
          rows={5}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste raw college announcement text here (e.g., 'Attention students, mid-term timetable is published on Nov 5th at 10 AM in the auditorium...')"
          className="w-full bg-navy-950/90 border border-purple-500/20 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all resize-y font-mono text-xs sm:text-sm"
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-rose-400 font-medium">
          {error}
        </p>
      )}

      {/* Extraction Button */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-[11px] text-slate-400">
          Click below to extract title, venue, dates, urgency & action items.
        </p>

        <button
          onClick={handleExtract}
          disabled={isExtracting || !inputText.trim()}
          className={`
            flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm
            transition-all duration-200 shadow-glow-purple
            ${isExtracting || !inputText.trim() 
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pulse-cyan text-white hover:opacity-95 active:scale-98'}
          `}
        >
          {isExtracting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Notice Heuristics...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Extract Notice Details</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
