/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { FACULTIES, Question, StudentResponse, RECEIVED_INFO_OPTIONS, RECOMMEND_REASONS, ADHERE_REASONS, COMPLAINT_CHANNELS, IMPROVE_SUGGESTIONS, getProgramsByFaculty } from "../types";
import { submitResponse } from "../dbService";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, Info, Star, Save, LogOut, Languages, Lock, Sparkles } from "lucide-react";

interface QuestionnaireFormProps {
  questions: Question[];
  user?: any;
  onLogout?: () => void;
  onOpenAdmin?: () => void;
  onOpenWelcome?: () => void;
}

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  questions,
  user,
  onLogout,
  onOpenAdmin,
  onOpenWelcome,
}) => {
  const { lang, setLang, t } = useLanguage();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Form states matching StudentResponse schema
  const [faculty, setFaculty] = useState("");
  const [program, setProgram] = useState("");
  const [part1Ratings, setPart1Ratings] = useState<{ [questionId: string]: number }>({});
  
  // Part 2 states
  const [receivedInfo, setReceivedInfo] = useState<string[]>([]);
  const [receivedInfoOther, setReceivedInfoOther] = useState("");
  
  const [recommend, setRecommend] = useState(""); // "" | "Yes" | "No"
  const [recommendReasons, setRecommendReasons] = useState<string[]>([]);
  const [recommendNoReason, setRecommendNoReason] = useState("");

  const [adhere, setAdhere] = useState(""); // "" | "Yes" | "No"
  const [adhereReasons, setAdhereReasons] = useState<string[]>([]);
  const [adhereNoReason, setAdhereNoReason] = useState("");

  const [complaintSubmitted, setComplaintSubmitted] = useState(""); // "" | "Yes" | "No"
  const [complaintDetail, setComplaintDetail] = useState("");
  const [complaintSatisfaction, setComplaintSatisfaction] = useState(3);
  const [complaintChannels, setComplaintChannels] = useState<string[]>([]);
  const [complaintChannelOther, setComplaintChannelOther] = useState("");

  const [loveLoyaltyProud, setLoveLoyaltyProud] = useState(3);
  const [loveLoyaltyCooperate, setLoveLoyaltyCooperate] = useState(3);
  const [loveLoyaltySustain, setLoveLoyaltySustain] = useState(3);

  const [improveSuggestions, setImproveSuggestions] = useState<string[]>([]);
  const [improveSuggestionOther, setImproveSuggestionOther] = useState("");

  // UI Flow State
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Initialize Rating values for dynamic questions
  useEffect(() => {
    if (questions.length > 0) {
      const initialRatings: { [questionId: string]: number } = {};
      questions.forEach((q) => {
        initialRatings[q.id] = 3; // Default intermediate score
      });
      setPart1Ratings(initialRatings);
    }
  }, [questions]);

  // Validation before changing steps
  const validateStep = (nextStep: number): boolean => {
    setValidationError(null);
    if (nextStep > step) {
      if (step === 1) {
        if (!faculty) {
          setValidationError(t("กรุณาเลือกคณะ/วิทยาลัยของท่าน", "Please select your Faculty/School"));
          return false;
        }
        if (!program.trim()) {
          setValidationError(t("กรุณาเลือกสาขาวิชาของท่าน", "Please select your Program / Major"));
          return false;
        }
      }
      if (step === 2) {
        // Validate Part 1 ratings on Educational Management & Support Services (orders 1 - 7)
        const step2Qs = questions.filter(q => q.order <= 7);
        for (const q of step2Qs) {
          if (!part1Ratings[q.id]) {
            setValidationError(t(`กรุณาประเมินคำถามข้อที่ ${q.orderLabel || q.order}`, `Please rate question ${q.orderLabel || q.order}`));
            return false;
          }
        }
      }
      if (step === 3) {
        // Validate Facilities and Infrastructure (orders >= 8)
        const step3Qs = questions.filter(q => q.order >= 8);
        for (const q of step3Qs) {
          if (!part1Ratings[q.id]) {
            setValidationError(t(`กรุณาประเมินคำถามข้อที่ ${q.orderLabel || q.order}`, `Please rate question ${q.orderLabel || q.order}`));
            return false;
          }
        }
      }
      if (step === 4) {
        if (!recommend) {
          setValidationError(t("กรุณาเลือกว่าจะแนะนำเพื่อน/ญาติมาเรียนหรือไม่", "Please specify if you would suggest BU to others"));
          return false;
        }
        if (recommend === "Yes" && recommendReasons.length === 0) {
          setValidationError(t("กรุณาเลือกเหตุผลอย่างน้อย 1 ข้อที่ท่านแนะนำ", "Please select at least one recommendation reason"));
          return false;
        }
        if (recommend === "No" && !recommendNoReason.trim()) {
          setValidationError(t("กรุณาระบุรายละเอียดเหตุผลที่ไม่แนะนำ", "Please specify why you would not suggest BU"));
          return false;
        }
        if (!adhere) {
          setValidationError(t("กรุณาเลือกว่ามหาวิทยาลัยปฏิบัติตามที่ได้ประชาสัมพันธ์ไว้หรือไม่", "Please specify if BU adheres to publicized information"));
          return false;
        }
        if (adhere === "Yes" && adhereReasons.length === 0) {
          setValidationError(t("กรุณาเลือกเหตุผลอย่างน้อย 1 ข้อว่าสนับสนุนในสิ่งใด", "Please select at least one aspect where BU adheres"));
          return false;
        }
        if (adhere === "No" && !adhereNoReason.trim()) {
          setValidationError(t("กรุณาระบุข้อคิดเห็นที่ไม่สนับสนุน", "Please specify why BU does not adhere"));
          return false;
        }
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step + 1)) {
      setStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    setValidationError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRatingChange = (qId: string, value: number) => {
    setPart1Ratings(prev => ({
      ...prev,
      [qId]: value
    }));
  };

  const handleCheckboxToggle = (list: string[], setList: (v: string[]) => void, id: string) => {
    if (list.includes(id)) {
      setList(list.filter(x => x !== id));
    } else {
      setList([...list, id]);
    }
  };

  // Submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    // Validate complaints and suggestions inside step 5
    if (!complaintSubmitted) {
      setValidationError(t("กรุณาตอบคำถามข้อ 19.1 (เคย หรือ ไม่เคย)", "Please answer Question 19.1 (Yes or No)"));
      return;
    }
    if (complaintSubmitted === "Yes") {
      if (!complaintDetail.trim()) {
        setValidationError(t("กรุณาระบุข้อร้องเรียนในข้อ 19.1", "Please specify your complaint in Question 19.1"));
        return;
      }
      if (complaintChannels.length === 0) {
        setValidationError(t("กรุณาเลือกช่องทางร้องเรียนอย่างน้อย 1 ข้อในข้อ 19.3", "Please select at least one complaint channel in Question 19.3"));
        return;
      }
    }
    if (improveSuggestions.length === 0) {
      setValidationError(t("กรุณาเลือกข้อเสนอแนะเพื่อพัฒนาอย่างน้อย 1 ข้อ", "Please select at least one improvement suggestion"));
      return;
    }

    setSubmitting(true);
    setValidationError(null);

    const facultyObj = FACULTIES.find(f => f.id === faculty) || FACULTIES[0];
    const emailToRecord = user?.email || "student@bu.ac.th";

    const finalResponse: StudentResponse = {
      studentEmail: emailToRecord,
      studentFacultyTh: facultyObj.th,
      studentFacultyEn: facultyObj.en,
      studentProgram: program.trim(),
      part1Ratings,
      part2ReceivedInfo: receivedInfo,
      part2ReceivedInfoOther: receivedInfo.includes("info_6") ? receivedInfoOther : "",
      part2Recommend: recommend,
      part2RecommendReasons: recommend === "Yes" ? recommendReasons : [],
      part2RecommendNoReason: recommend === "No" ? recommendNoReason : "",
      part2Adhere: adhere,
      part2AdhereReasons: adhere === "Yes" ? adhereReasons : [],
      part2AdhereNoReason: adhere === "No" ? adhereNoReason : "",
      part2ComplaintSubmitted: complaintSubmitted,
      part2ComplaintDetail: complaintSubmitted === "Yes" ? complaintDetail.trim() : "",
      part2ComplaintSatisfaction: complaintSubmitted === "Yes" ? Number(complaintSatisfaction) : 0,
      part2ComplaintChannels: complaintSubmitted === "Yes" ? complaintChannels : [],
      part2ComplaintChannelOther: complaintSubmitted === "Yes" && complaintChannels.includes("chan_6") ? complaintChannelOther.trim() : "",
      part2LoveLoyaltyProud: Number(loveLoyaltyProud),
      part2LoveLoyaltyCooperate: Number(loveLoyaltyCooperate),
      part2LoveLoyaltySustain: Number(loveLoyaltySustain),
      part2ImproveSuggestions: improveSuggestions,
      part2ImproveSuggestionOther: improveSuggestions.includes("imp_16") ? improveSuggestionOther : "",
      createdAt: null // Set under DB service dynamically via server timestamp
    };

    try {
      await submitResponse(finalResponse);
      setSubmitted(true);
    } catch (err: any) {
      setValidationError(t("เกิดปัญหาในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง", "An error occurred while saving your data. Please retry."));
    } finally {
      setSubmitting(false);
    }
  };

  // Helper rating labels matching Thai standard
  const ratingLabels = [
    { value: 5, th: "มากที่สุด (Strongly Agree)", en: "Strongly Agree" },
    { value: 4, th: "มาก (Agree)", en: "Agree" },
    { value: 3, th: "ปานกลาง (Neutral)", en: "Neutral" },
    { value: 2, th: "น้อย (Disagree)", en: "Disagree" },
    { value: 1, th: "น้อยที่สุด (Strongly Disagree)", en: "Strongly Disagree" }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full border-4 border-emerald-100 shadow-inner">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {t("บันทึกข้อมูลเรียบร้อยแล้ว", "Thank You for Your Feedback!")}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              {t(
                "ทางมหาวิทยาลัยกรุงเทพใคร่ขอขอบคุณในความร่วมมือในการประเมินและเสนอแนะครั้งนี้ ข้อมูลนี้จะถูกนำไปใช้ยกระดับและพัฒนามหาวิทยาลัยอย่างสูงสุด",
                "Your valuable perspective has been recorded. It will greatly contribute to the elevation and assurance of education quality at Bangkok University."
              )}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="font-mono text-xxs text-slate-400 space-y-1">
              <div>EMAIL: {user?.email || "student@bu.ac.th"}</div>
              <div>STATUS: COMPLETED & SYNCED</div>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setStep(1);
                setSubmitted(false);
                setFaculty("");
                setProgram("");
                setRecommend("");
                setAdhere("");
                setComplaintSubmitted("");
                setImproveSuggestions([]);
                setReceivedInfo([]);
              }}
              className="w-full py-2.5 px-4 bg-[#f97316] hover:bg-orange-600 text-white font-semibold text-xs rounded-xl cursor-pointer transition shadow-sm"
              id="renew-survey-btn"
            >
              {t("กรอกแบบสำรวจอื่นเพิ่มเติม (Submit another response)", "Submit another response")}
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5"
                id="finish-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                {t("ออกจากระบบและสิ้นสุด (Log out)", "Logout and Exit")}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-[#f8fafc] overflow-hidden select-none font-sans">
      
      {/* Top Navigation Bar */}
      <nav className="bu-dark text-white px-4 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center shrink-0 z-20 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bu-bg-primary rounded-full flex items-center justify-center font-bold text-lg sm:text-xl italic text-white shadow-inner">
            BU
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-400">
              Bangkok University
            </h1>
            <p className="text-[9px] sm:text-[10px] opacity-75">
              {t("แบบสอบถามเพื่อประกันคุณภาพหลักสูตร (ปีการศึกษา 2568)", "Education Management Survey (A.Y. 2025)")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium">
          {/* Welcome Info trigger */}
          {onOpenWelcome && (
            <button
              type="button"
              onClick={onOpenWelcome}
              id="welcome-info-btn"
              className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 text-xs cursor-pointer"
              title={t("คำชี้แจงและข้อมูลแบบสอบถาม", "Survey Information")}
            >
              <Info className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden md:inline">{t("คำชี้แจง", "Instructions")}</span>
            </button>
          )}

          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setLang(lang === "th" ? "en" : "th")}
            id="lang-toggle-btn"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-orange-400" />
            <span>{lang === "th" ? "EN" : "ไทย"}</span>
          </button>

          {/* Student Email Badge */}
          <span className="opacity-75 hidden xl:inline text-[11px] bg-white/5 px-2.5 py-1.5 rounded-md border border-white/10">
            {t(`นักศึกษา: ${user?.email || "student@bu.ac.th"}`, `Student: ${user?.email || "student@bu.ac.th"}`)}
          </span>

          {/* Dedicated Admin Portal Button */}
          {onOpenAdmin && (
            <button 
              type="button"
              onClick={onOpenAdmin}
              id="admin-portal-nav-btn"
              className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 hover:text-amber-200 font-semibold rounded-lg transition-colors flex items-center gap-1.5 text-xs cursor-pointer shadow-sm"
              title={t("เข้าสู่ระบบเฉพาะผู้ดูแลระบบ (Admin Only)", "Admin Portal (Admin Only)")}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{t("สำหรับผู้ดูแลระบบ", "Admin Portal")}</span>
            </button>
          )}

          {onLogout && (
            <button 
              type="button"
              onClick={onLogout}
              id="student-nav-logout"
              className="px-2.5 py-1.5 border border-white/20 rounded hover:bg-white/10 transition-colors uppercase cursor-pointer text-[10px] tracking-wider text-slate-300"
            >
              {t("รีเซ็ต (Reset)", "Reset")}
            </button>
          )}
        </div>
      </nav>

      {/* Main Multi-Column Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row p-6 gap-6 overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Survey Context & Progress Checklist */}
        <aside className="w-full lg:w-1/4 flex flex-col gap-4 shrink-0 justify-start">
          <div className="glass-panel rounded-xl p-5 shadow-sm">
            <h2 className="text-md font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
              {t("ขั้นตอนทำแบบประเมิน", "Survey Status")}
            </h2>
            <div className="flex flex-col gap-3">
              {/* Step 1 */}
              <div 
                onClick={() => step > 1 && setStep(1)}
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition ${step === 1 ? "bg-orange-50/80 border border-orange-200/50" : "hover:bg-slate-50"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step > 1 ? "bg-emerald-100 text-emerald-600" : step === 1 ? "bg-[#f97316] text-white" : "bg-slate-100 text-slate-400"}`}>
                  {step > 1 ? "✓" : "1"}
                </div>
                <div className="text-xs">
                  <p className={`font-semibold ${step === 1 ? "text-orange-900" : "text-slate-700"}`}>
                    {t("ข้อมูลทั่วไป", "Demographics")}
                  </p>
                  <p className="text-[10px] text-slate-550">{t("คณะและสาขา", "Faculty and Major")}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div 
                onClick={() => step > 2 && setStep(2)}
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition ${step === 2 ? "bg-orange-50/80 border border-orange-200/50" : "hover:bg-slate-50"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step > 2 ? "bg-emerald-100 text-emerald-600" : step === 2 ? "bg-[#f97316] text-white" : "bg-slate-100 text-slate-400"}`}>
                  {step > 2 ? "✓" : "2"}
                </div>
                <div className="text-xs">
                  <p className={`font-semibold ${step === 2 ? "text-orange-900" : "text-slate-700"}`}>
                    {t("การประเมินความพึงพอใจต่อการจัดการศึกษา การบริการนักศึกษา และสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้", "Evaluation of Satisfaction with Education Management (1)")}
                  </p>
                  <p className="text-[10px] text-slate-550">{t("ด้านการจัดการศึกษา ด้านการบริการนักศึกษา", "Educational Management and Student Support Services ")}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div 
                onClick={() => step > 3 && setStep(3)}
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition ${step === 3 ? "bg-orange-50/80 border border-orange-200/50" : "hover:bg-slate-50"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step > 3 ? "bg-emerald-100 text-emerald-600" : step === 3 ? "bg-[#f97316] text-white" : "bg-slate-100 text-slate-400"}`}>
                  {step > 3 ? "✓" : "3"}
                </div>
                <div className="text-xs">
                  <p className={`font-semibold ${step === 3 ? "text-orange-900" : "text-slate-700"}`}>
                    {t("การประเมินความพึงพอใจต่อการจัดการศึกษา การบริการนักศึกษา และสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้", "Evaluation of Satisfaction with Education Management (2)")}
                  </p>
                  <p className="text-[10px] text-slate-550">{t("ด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้", "Facilities and Infrastructure")}</p>
                </div>
              </div>

              {/* Step 4 */}
              <div 
                onClick={() => step > 4 && setStep(4)}
                className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition ${step === 4 ? "bg-orange-50/80 border border-orange-200/50" : "hover:bg-slate-50"}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step > 4 ? "bg-emerald-100 text-emerald-600" : step === 4 ? "bg-[#f97316] text-white" : "bg-slate-100 text-slate-400"}`}>
                  {step > 4 ? "✓" : "4"}
                </div>
                <div className="text-xs">
                  <p className={`font-semibold ${step === 4 ? "text-orange-900" : "text-slate-700"}`}>
                    {t("ความคิดเห็นของนักศึกษา", "Bangkok University Students' Comments")}
                  </p>
                  <p className="text-[10px] text-slate-550">{t("การรับทราบข้อมูล", "The following information ")}</p>
                </div>
              </div>

              {/* Step 5 */}
              <div 
                className={`flex items-center gap-3 p-2 rounded-lg transition ${step === 5 ? "bg-orange-50/80 border border-orange-200/50" : ""}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${step === 5 ? "bg-[#f97316] text-white" : "bg-slate-100 text-slate-400"}`}>
                  5
                </div>
                <div className="text-xs">
                  <p className={`font-semibold ${step === 5 ? "text-orange-900" : "text-slate-700"}`}>
                    {t("ความคิดเห็นของนักศึกษา", "Bangkok University Students' Comments")}
                  </p>
                  <p className="text-[10px] text-slate-550">{t("ข้อร้องเรียน และข้อเสนอแนะ", "Complaints and suggestions")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 shadow-sm hidden lg:block mt-auto text-[10px] text-slate-400 leading-relaxed">
            <span className="block font-bold mb-1 text-slate-500 uppercase tracking-wider">{t("PDPA & ประกันคุณภาพ", "Anonymity Standard")}</span>
            {t("การประเมินนี้จัดทำภายใต้กฎหมายความคุ้มครองข้อมูลส่วนบุคคล (PDPA) นำไปปรับปรุงบริการและการจัดเตรียมข้อมูลเพื่อใช้ประกอบกระบวนการประกันคุณภาพตามเกณฑ์ อว. เท่านั้น", "Responses are securely stored and analyzed in aggregated formats conformant with institutional PDPA standards.")}
          </div>
        </aside>

        {/* Center: Questionnaire Content Dynamic Card */}
        <section className="flex-1 flex flex-col gap-4 overflow-hidden min-w-0">
          <div className="glass-panel rounded-xl flex-1 flex flex-col shadow-sm overflow-hidden bg-white/95">
            
            {/* Upper Stage Header panel in center */}
            <div className="px-5 py-4 border-b border-sidebar border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                {step === 1 && t("ข้อมูลทั่วไปของผู้เข้าร่วมประเมิน", "Student Demographics Info")}
                {step === 2 && t("การจัดการศึกษา การบริการนักศึกษา และสิ่งอำนวยความสะดวก และสิ่งสนับสนุนการเรียนรู้", "Evaluation of Satisfaction with Education Management")}
                {step === 3 && t("การจัดการศึกษา การบริการนักศึกษา และสิ่งอำนวยความสะดวก และสิ่งสนับสนุนการเรียนรู้", "Evaluation of Satisfaction with Education Management")}
                {step === 4 && t("ความคิดเห็นของนักศึกษาต่อมหาวิทยาลัยกรุงเทพ", "Bangkok University Students' Comments")}
                {step === 5 && t("ความคิดเห็นของนักศึกษาต่อมหาวิทยาลัยกรุงเทพ", "Bangkok University Students' Comments")}
              </h3>
              <span className="text-[11px] text-slate-400 font-mono tracking-wider font-semibold">{t(`ขั้นตอน ${step} / 5`, `Step ${step} of 5`)}</span>
            </div>

            {/* Validation Alert Overlay inside layout */}
            {validationError && (
              <div className="bg-rose-50 border-b border-rose-105 p-3 flex items-start gap-2 text-rose-700 text-xs shrink-0 select-none">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-none" />
                <div className="font-semibold">{validationError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 bg-white/40">
                  
                  {/* STEP 1: Student Demographics */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  {t("ส่วนที่ 1: ข้อมูลทั่วไปของประชากร", "Step 1: General Demographics")}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t(
                    "ข้อมูลกลุ่มประชากรระดับคณะและสาขาวิชาเพื่อการเทียบเคียงมาตรฐาน",
                    "Demographic information by faculty and major for quality benchmarking."
                  )}
                </p>
              </div>

              {/* Faculty selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  1. {t("คณะที่สังกัด / สำนักวิชา (Faculty / School)", "Specify your Faculty / School")}
                </label>
                <select
                  value={faculty}
                  onChange={(e) => {
                    const newFac = e.target.value;
                    setFaculty(newFac);
                    setProgram("");
                  }}
                  id="faculty-select"
                  className="w-full p-3 rounded-lg border border-slate-200 focus:border-[#f97316] bg-white text-xs outline-none shadow-sm transition"
                >
                  <option value="">-- {t("กรุณาเลือกคณะของคุณ", "Choose Faculty")} --</option>
                  {FACULTIES.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {t(`${fac.th} (${fac.en})`, `${fac.en} (${fac.th})`)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Program selector */}
              {(() => {
                const availablePrograms = getProgramsByFaculty(faculty);
                const bachelorPrograms = availablePrograms.filter((p) => p.degreeLevel === "bachelor");
                const masterPrograms = availablePrograms.filter((p) => p.degreeLevel === "master");
                const doctoralPrograms = availablePrograms.filter((p) => p.degreeLevel === "doctoral");

                return (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 block">
                        2. {t("สาขาวิชา (Please specify your Program / Major)", "Specify your Program / Major")}
                      </label>
                      {faculty && availablePrograms.length > 0 && (
                        <span className="text-[10px] text-orange-600 font-medium">
                          {t(`(มี ${availablePrograms.length} สาขาวิชาในหลักสูตร)`, `(${availablePrograms.length} programs in faculty)`)}
                        </span>
                      )}
                    </div>

                    {faculty ? (
                      <select
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        id="program-select"
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-[#f97316] bg-white text-xs outline-none shadow-sm transition"
                      >
                        <option value="">-- {t("กรุณาเลือกสาขาวิชาของคุณ", "Select your Program / Major")} --</option>

                        {/* Bachelor Level */}
                        {bachelorPrograms.length > 0 && (
                          <optgroup label={t("🎓 ระดับปริญญาตรี (Bachelor's Degree)", "🎓 Bachelor's Degree")}>
                            {bachelorPrograms.map((p) => (
                              <option key={p.id} value={p.majorTh}>
                                {t(`${p.majorTh} (${p.majorEn})`, `${p.majorEn} (${p.majorTh})`)}
                              </option>
                            ))}
                          </optgroup>
                        )}

                        {/* Master Level */}
                        {masterPrograms.length > 0 && (
                          <optgroup label={t("🎓 ระดับปริญญาโท (Master's Degree)", "🎓 Master's Degree")}>
                            {masterPrograms.map((p) => (
                              <option key={p.id} value={p.majorTh}>
                                {t(`${p.majorTh} (${p.majorEn})`, `${p.majorEn} (${p.majorTh})`)}
                              </option>
                            ))}
                          </optgroup>
                        )}

                        {/* Doctoral Level */}
                        {doctoralPrograms.length > 0 && (
                          <optgroup label={t("🎓 ระดับปริญญาเอก (Doctoral Degree)", "🎓 Doctoral Degree")}>
                            {doctoralPrograms.map((p) => (
                              <option key={p.id} value={p.majorTh}>
                                {t(`${p.majorTh} (${p.majorEn})`, `${p.majorEn} (${p.majorTh})`)}
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    ) : (
                      <div className="w-full p-3 rounded-lg border border-slate-200 bg-slate-100 text-slate-400 text-xs cursor-not-allowed italic">
                        -- {t("กรุณาเลือกคณะสังกัดก่อน เพื่อดูรายชื่อสาขาวิชา", "Please choose faculty first")} --
                      </div>
                    )}
                  </div>
                );
              })()}
            </motion.div>
          )}

          {/* STEP 2: Evaluation Dynamic Questions Part 1 (Q1 - Q6) */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  {t(
                    "ส่วนที่ 2 : การประเมินความพึงพอใจต่อการจัดการศึกษา การบริการนักศึกษา และสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้", "Evaluation of Satisfaction with Education Management"
                  )}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t(
                    "โปรดแสดงความคิดเห็นของท่านระดับ 1-5 (5 = มากที่สุด , 1 = น้อยที่สุด)",
                    "Select checkbox ratings next to numbers 1-5 (5 = Most Satisfied, 1 = Least Satisfied)"
                  )}
                </p>
              </div>

              <div className="space-y-6">
                {(() => {
                  const step2Questions = questions.filter((q) => q.order <= 7);
                  return step2Questions.map((q, idx) => {
                    const aspectLabel = t(q.aspectTh, q.aspectEn);
                    const prevQ = idx > 0 ? step2Questions[idx - 1] : null;
                    const showGroupTitle = Boolean(
                      q.groupTitleTh && (!prevQ || prevQ.groupTitleTh !== q.groupTitleTh)
                    );
                    const numberDisplay = q.orderLabel ? q.orderLabel : `${q.order}.`;

                    return (
                      <React.Fragment key={q.id}>
                        {showGroupTitle && (
                          <div className="p-4 bg-gradient-to-r from-orange-50 via-amber-50/50 to-orange-50/30 border-l-4 border-[#f97316] rounded-r-xl shadow-xs space-y-1 my-3">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-[#f97316] shrink-0" />
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                                {t(q.groupTitleTh!, q.groupTitleEn || q.groupTitleTh!)}
                              </h4>
                            </div>
                            <p className="text-[10px] text-slate-500">
                              {t(
                                "การส่งเสริมและพัฒนานักศึกษาตามอัตลักษณ์ของมหาวิทยาลัย 4 ข้อย่อย (ข้อ 3.1 - 3.4)",
                                "4 sub-aspects according to university identity (3.1 - 3.4)"
                              )}
                            </p>
                          </div>
                        )}

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                          <div className="space-y-1">
                            <span className="inline-block px-2.5 py-0.5 bg-orange-50 text-orange-700 font-mono text-[9px] font-bold rounded-full">
                              {aspectLabel}
                            </span>
                            <h4 className="text-xs font-bold text-slate-800 leading-snug">
                              {numberDisplay} {t(q.textTh, q.textEn)}
                            </h4>
                            {q.descriptionTh && (
                              <p className="text-[11px] text-slate-600 leading-relaxed italic bg-white/70 p-2.5 rounded-lg border border-slate-100/70">
                                {t(q.descriptionTh, q.descriptionEn || "")}
                              </p>
                            )}
                          </div>

                          {/* 5-Level Radio Matrix */}
                          <div className="grid grid-cols-5 gap-2 pt-2">
                            {[5, 4, 3, 2, 1].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => handleRatingChange(q.id, val)}
                                id={`rating-${q.id}-${val}`}
                                className={`py-2 px-1 flex flex-col items-center justify-center rounded-lg border text-center cursor-pointer transition ${
                                  part1Ratings[q.id] === val
                                    ? "bg-[#f97316] border-[#f97316] text-white shadow-md shadow-orange-100 font-bold"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                <span className="font-mono font-bold text-xs">{val}</span>
                                <span className="text-[8px] font-medium mt-0.5 whitespace-nowrap">
                                  {t(
                                    val === 5 ? "มากที่สุด" : val === 4 ? "มาก" : val === 3 ? "ปานกลาง" : val === 2 ? "น้อย" : "น้อยที่สุด",
                                    val === 5 ? "Strongly" : val === 4 ? "Agree" : val === 3 ? "Neutral" : val === 2 ? "Disagree" : "Weak"
                                  )}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  });
                })()}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Evaluation Dynamic Questions Part 1 (Q8 - Q15) */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="space-y-6">
                {questions
                  .filter((q) => q.order >= 8)
                  .map((q) => {
                    const aspectLabel = t(q.aspectTh, q.aspectEn);
                    const numberDisplay = q.orderLabel ? q.orderLabel : `${q.order}.`;
                    return (
                      <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 bg-orange-50 text-orange-700 font-mono text-[9px] font-bold rounded-full">
                            {aspectLabel}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">
                            {numberDisplay} {t(q.textTh, q.textEn)}
                          </h4>
                          {q.descriptionTh && (
                            <p className="text-[11px] text-slate-600 leading-normal italic bg-white/70 p-2.5 rounded-lg border border-slate-100/70">
                              {t(q.descriptionTh, q.descriptionEn || "")}
                            </p>
                          )}
                        </div>

                        {/* Radio Grid */}
                        <div className="grid grid-cols-5 gap-2 pt-2 col-span-1">
                          {[5, 4, 3, 2, 1].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleRatingChange(q.id, val)}
                              id={`rating-${q.id}-${val}`}
                              className={`py-2 px-1 flex flex-col items-center justify-center rounded-lg border text-center cursor-pointer transition ${
                                part1Ratings[q.id] === val
                                  ? "bg-[#f97316] border-[#f97316] text-white shadow-md shadow-orange-100 font-bold"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <span className="font-mono font-bold text-xs">{val}</span>
                              <span className="text-[8px] font-medium mt-0.5">
                                {t(
                                  val === 5 ? "มากที่สุด" : val === 4 ? "มาก" : val === 3 ? "ปานกลาง" : val === 2 ? "น้อย" : "น้อยที่สุด",
                                  val === 5 ? "Strongly" : val === 4 ? "Agree" : val === 3 ? "Neutral" : val === 2 ? "Disagree" : "Weak"
                                )}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </motion.div>
          )}

          {/* STEP 4: Publicity & Recommendation (Q15, Q16, Q17) */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  {t("ส่วนที่ 3 : ความคิดเห็นของนักศึกษาต่อมหาวิทยาลัยกรุงเทพ", "Bangkok University Students' Comments" )}
                </h3>
              </div>
              {/* Q16: Received Info multi-select */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-100">
                <label className="text-xs font-bold text-slate-800 block leading-relaxed">
                  16. {t("นักศึกษารับทราบข้อมูลใดบ้างเมื่อเข้าศึกษาในหลักสูตร/สาขาวิชา (เลือกตอบได้มากกว่า 1 ข้อ)", "Which of the following information when enrolling did you receive? (Multi-select)")}
                </label>
                <div className="space-y-2 pt-1.5 text-xs text-slate-600">
                  {RECEIVED_INFO_OPTIONS.map((opt) => (
                    <label key={opt.id} className="flex gap-2.5 items-start cursor-pointer hover:text-slate-800 select-none">
                      <input
                        type="checkbox"
                        checked={receivedInfo.includes(opt.id)}
                        onChange={() => handleCheckboxToggle(receivedInfo, setReceivedInfo, opt.id)}
                        id={`chk-${opt.id}`}
                        className="w-4 h-4 mt-0.5 cursor-pointer accent-orange-500"
                      />
                      <span className="leading-normal">{t(opt.th, opt.en)}</span>
                    </label>
                  ))}
                  
                  {/* Q16 - Others checkbox */}
                  <label className="flex gap-2.5 items-start cursor-pointer hover:text-slate-800 select-none">
                    <input
                      type="checkbox"
                      checked={receivedInfo.includes("info_6")}
                      onChange={() => handleCheckboxToggle(receivedInfo, setReceivedInfo, "info_6")}
                      id="chk-info-other"
                      className="w-4 h-4 mt-0.5 cursor-pointer accent-orange-500"
                    />
                    <span className="leading-normal">{t("อื่น ๆ (ระบุ / Specify)", "Others (Please Specify)")}</span>
                  </label>

                  {receivedInfo.includes("info_6") && (
                    <motion.input
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      type="text"
                      placeholder={t("โปรดระบุ...", "Please specify details...")}
                      value={receivedInfoOther}
                      onChange={(e) => setReceivedInfoOther(e.target.value)}
                      id="received-info-other-input"
                      className="w-full mt-2 p-2 rounded border border-slate-200 text-xs focus:ring-1 focus:ring-orange-500"
                    />
                  )}
                </div>
              </div>

              {/* Q17: Suggest To Friends */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-3.5 border border-slate-100">
                <label className="text-xs font-bold text-slate-800 block leading-relaxed">
                  17. {t("ถ้านักศึกษามีญาติ/เพื่อน/น้อง ที่กำลังจะศึกษาต่อระดับปริญญาตรี นักศึกษาจะแนะนำให้มาสมัครเรียนที่มหาวิทยาลัยกรุงเทพหรือไม่", "Would you suggest relatives/siblings to enroll at Bangkok University?")}
                </label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setRecommend("Yes"); setRecommendNoReason(""); }}
                    id="recommend-yes-btn"
                    className={`p-3 text-xs font-bold border rounded-lg cursor-pointer text-center transition ${
                      recommend === "Yes"
                        ? "bg-[#f97316] border-[#f97316] text-white shadow"
                        : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    🚀 {t("แนะนำ (Yes, I would suggest)", "Yes, I would suggest")}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRecommend("No"); setRecommendReasons([]); }}
                    id="recommend-no-btn"
                    className={`p-3 text-xs font-bold border rounded-lg cursor-pointer text-center transition ${
                      recommend === "No"
                        ? "bg-[#f97316] border-[#f97316] text-white shadow"
                        : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    ⚠️ {t("ไม่แนะนำ (No, I would not suggest)", "No, I would not suggest")}
                  </button>
                </div>

                {/* Sub-fields for Q17 Yes */}
                {recommend === "Yes" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-white border border-slate-200 rounded-lg space-y-2"
                  >
                    <span className="text-[10px] font-bold text-orange-700 block select-none">
                      {t("โปรดเลือกเหตุผล (เลือกได้มากกว่า 1 ข้อ):", "Choose reasons (You may select more than one option):")}
                    </span>
                    <div className="space-y-2 pt-1 text-xs text-slate-600">
                      {RECOMMEND_REASONS.map((rec) => (
                        <label key={rec.id} className="flex gap-2 items-start cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={recommendReasons.includes(rec.id)}
                            onChange={() => handleCheckboxToggle(recommendReasons, setRecommendReasons, rec.id)}
                            id={`chk-${rec.id}`}
                            className="w-3.5 h-3.5 mt-0.5 accent-orange-500"
                          />
                          <span className="leading-normal">{t(rec.th, rec.en)}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Sub-fields for Q17 No */}
                {recommend === "No" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-1.5"
                  >
                    <label className="text-[10px] font-bold text-amber-700 block select-none">
                      {t("โปรดระบุรายละเอียด / ข้อตักเตือน (Please specify reasons):", "Please write in specifications/reasons for non-recommendation:")}
                    </label>
                    <textarea
                      placeholder={t("กรอกเหตุผลที่ไม่แนะนำ...", "Describe non-recommend reasons...")}
                      rows={3}
                      value={recommendNoReason}
                      onChange={(e) => setRecommendNoReason(e.target.value)}
                      id="rec-no-reason-textarea"
                      className="w-full mt-1 p-2 bg-white border border-slate-200 text-xs rounded-md shadow-inner focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </motion.div>
                )}
              </div>

              {/* Q18: University Publicity Adherence */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-3.5 border border-slate-100">
                <label className="text-xs font-bold text-slate-800 block leading-relaxed">
                  18. {t("มหาวิทยาลัยปฏิบัติต่อนักศึกษาตามสิ่งที่เคยประชาสัมพันธ์/แจ้งไว้ก่อนเข้าเรียนหรือไม่ (เช่น หลักสูตร สิ่งอำนวยความสะดวก การบริการทางด้านการศึกษา ฯลฯ)", "Does the university adhere to what was previously publicized before enrollment (e.g. curriculum, amenities)?")}
                </label>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => { setAdhere("Yes"); setAdhereNoReason(""); }}
                    id="adhere-yes-btn"
                    className={`p-3 text-xs font-bold border rounded-lg cursor-pointer text-center transition ${
                      adhere === "Yes"
                        ? "bg-[#f97316] border-[#f97316] text-white shadow"
                        : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    ✅ {t("ปฏิบัติ (Yes, completely)", "Yes, completely")}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAdhere("No"); setAdhereReasons([]); }}
                    id="adhere-no-btn"
                    className={`p-3 text-xs font-bold border rounded-lg cursor-pointer text-center transition ${
                      adhere === "No"
                        ? "bg-[#f97316] border-[#f97316] text-white shadow"
                        : "bg-white border-slate-200 hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    ❌ {t("ไม่ปฏิบัติ (No, it does not)", "No, it does not")}
                  </button>
                </div>

                {adhere === "Yes" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 font-medium"
                  >
                    <span className="text-[10px] font-bold text-orange-700 block select-none">
                      {t("โปรดเลือกด้านที่ท่านประทับใจ (เลือกได้มากกว่า 1 ข้อ):", "Select aspects met (select more than 1 option):")}
                    </span>
                    <div className="space-y-2 pt-1 text-xs text-slate-600 select-none">
                      {ADHERE_REASONS.map((adh) => (
                        <label key={adh.id} className="flex gap-2 items-start cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={adhereReasons.includes(adh.id)}
                            onChange={() => handleCheckboxToggle(adhereReasons, setAdhereReasons, adh.id)}
                            id={`chk-${adh.id}`}
                            className="w-3.5 h-3.5 mt-0.5 accent-orange-500"
                          />
                          <span className="leading-normal">{t(adh.th, adh.en)}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {adhere === "No" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-1.5"
                  >
                    <label className="text-[10px] font-bold text-amber-700 block select-none">
                      {t("โปรดระบุรายละเอียดสิ่งที่ไม่ตรงตามโฆษณา (Please specify gaps):", "Please specify details or mismatches with pre-publicity:")}
                    </label>
                    <textarea
                      placeholder={t("พิมพ์สิ่งที่ไม่ตรงตามประชาสัมพันธ์...", "Enter details on which publicity was not met...")}
                      rows={3}
                      value={adhereNoReason}
                      onChange={(e) => setAdhereNoReason(e.target.value)}
                      id="adh-no-reason-textarea"
                      className="w-full mt-1 p-2 bg-white border border-slate-200 text-xs rounded-md shadow-inner focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 5: Complaints, Loyalty, & Suggestions (Q18, Q19, Q20) */}
          {step === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Q19: Complaints System */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-4 border border-slate-100">
                <span className="text-xs font-bold text-slate-800 block">
                  19. {t("ข้อเสนอแนะด้านข้อร้องเรียนต่าง ๆ (Suggestions Regarding Complaints)", "Feedback and Complaint channels")}
                </span>

                {/* 19.1 */}
                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold text-slate-700 block leading-relaxed">
                    19.1 {t("นักศึกษาเคยแจ้งข้อร้องเรียนเพื่อแก้ไข/ปรับปรุงพัฒนามหาวิทยาลัยหรือไม่", "Have you ever submitted complaints to improve the university in any way?")}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setComplaintSubmitted("Yes")}
                      id="complaint-yes-btn"
                      className={`p-3 text-xs font-bold border rounded-lg cursor-pointer transition text-left sm:text-center ${
                        complaintSubmitted === "Yes"
                          ? "bg-[#f97316] border-[#f97316] text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      1. {t("เคย", "Yes")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setComplaintSubmitted("No");
                        setComplaintDetail("");
                        setComplaintChannels([]);
                        setComplaintChannelOther("");
                      }}
                      id="complaint-no-btn"
                      className={`p-3 text-xs font-bold border rounded-lg cursor-pointer transition text-left sm:text-center ${
                        complaintSubmitted === "No"
                          ? "bg-[#f97316] border-[#f97316] text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      2. {t("ไม่เคย", "No")}
                    </button>
                  </div>

                  {complaintSubmitted === "Yes" && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-2 space-y-1.5"
                    >
                      <label className="text-[11px] font-semibold text-slate-700 block">
                        {t("โปรดระบุข้อร้องเรียน ........................", "Please specify complaint details ........................")}
                      </label>
                      <textarea
                        rows={3}
                        placeholder={t("โปรดระบุข้อร้องเรียน...", "Please specify complaint details...")}
                        value={complaintDetail}
                        onChange={(e) => setComplaintDetail(e.target.value)}
                        id="complaint-detail-input"
                        className="w-full p-2.5 bg-white border border-slate-200 text-xs rounded-lg shadow-inner focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </motion.div>
                  )}
                </div>

                {/* 19.2 and 19.3 ONLY display if complaintSubmitted === "Yes" */}
                {complaintSubmitted === "Yes" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-4 pt-3 border-t border-slate-200/70"
                  >
                    {/* 19.2: Sat range */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 block leading-relaxed">
                        19.2 {t("นักศึกษามีความพึงพอใจต่อการจัดการข้อร้องเรียนของมหาวิทยาลัยอยู่ที่ระดับใด", "Your satisfaction level with university complaint handling:")}
                      </label>
                      <div className="grid grid-cols-5 gap-2 select-none pt-1">
                        {[5, 4, 3, 2, 1].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setComplaintSatisfaction(num)}
                            id={`complaint-sat-${num}`}
                            className={`py-2 px-1 flex flex-col items-center justify-center rounded-lg border text-center cursor-pointer transition ${
                              complaintSatisfaction === num
                                ? "bg-[#f97316] border-[#f97316] text-white shadow-md shadow-orange-100 font-bold"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className="font-mono font-bold text-xs">{num}</span>
                            <span className="text-[8px] font-medium mt-0.5 whitespace-nowrap">
                              {t(
                                num === 5 ? "มากที่สุด" : num === 4 ? "มาก" : num === 3 ? "ปานกลาง" : num === 2 ? "น้อย" : "น้อยที่สุด",
                                num === 5 ? "Strongly" : num === 4 ? "Agree" : num === 3 ? "Neutral" : num === 2 ? "Disagree" : "Weak"
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        ({complaintSatisfaction} / 5) - {t(
                          complaintSatisfaction === 5 ? "มากที่สุด" : complaintSatisfaction === 4 ? "มาก" : complaintSatisfaction === 3 ? "ปานกลาง" : complaintSatisfaction === 2 ? "น้อย" : "น้อยที่สุด",
                          complaintSatisfaction === 5 ? "Most Satisfied" : complaintSatisfaction === 4 ? "Very" : complaintSatisfaction === 3 ? "Moderate" : complaintSatisfaction === 2 ? "Low" : "Least"
                        )}
                      </div>
                    </div>

                    {/* 19.3: Channels Checklist */}
                    <div className="space-y-2 select-none">
                      <label className="text-[11px] font-bold text-slate-700 block leading-relaxed">
                        19.3 {t("ช่องทางในการร้องเรียน (ระบุได้มากกว่า 1 ข้อ)", "Channels for submitting your complaints (You may select more than 1 options):")}
                      </label>
                      <div className="space-y-2 text-xs pt-1 select-none">
                        {COMPLAINT_CHANNELS.map((ch) => (
                          <label key={ch.id} className="flex gap-2 items-start cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={complaintChannels.includes(ch.id)}
                              onChange={() => handleCheckboxToggle(complaintChannels, setComplaintChannels, ch.id)}
                              id={`chk-${ch.id}`}
                              className="w-3.5 h-3.5 mt-0.5"
                            />
                            <span>{t(ch.th, ch.en)}</span>
                          </label>
                        ))}

                        <label className="flex gap-2 items-start cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={complaintChannels.includes("chan_6")}
                            onChange={() => handleCheckboxToggle(complaintChannels, setComplaintChannels, "chan_6")}
                            id="chk-chan-other"
                            className="w-3.5 h-3.5 mt-0.5"
                          />
                          <span>{t("อื่น ๆ (ระบุ)", "Others (Please Specify)")}</span>
                        </label>

                        {complaintChannels.includes("chan_6") && (
                          <motion.input
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            type="text"
                            placeholder={t("โปรดระบุช่องทางอื่น...", "Please specify other channels...")}
                            value={complaintChannelOther}
                            onChange={(e) => setComplaintChannelOther(e.target.value)}
                            id="complaint-channel-other-input"
                            className="w-full mt-1.5 p-2 bg-white border border-slate-200 text-xs rounded-md focus:outline-none"
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Q20: Love & Loyalty block */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-3.5 border border-slate-100">
                <span className="text-xs font-bold text-slate-800 block">
                  20. {t("นักศึกษามีความรักและผูกพันต่อมหาวิทยาลัยกรุงเทพอยู่ที่ระดับใด", "To what extent do you have love and loyalty towards BU?")}
                </span>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-700">
                      1. {t("ท่านภูมิใจที่เป็นนักศึกษาของมหาวิทยาลัยกรุงเทพ", "I am proud to be a Bangkok University student.")}
                    </p>
                    <div className="grid grid-cols-5 gap-1.5 pt-2 select-none">
                      {[5, 4, 3, 2, 1].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setLoveLoyaltyProud(val)}
                          id={`love-proud-${val}`}
                          className={`py-2 px-1 flex flex-col items-center justify-center rounded-lg border text-center cursor-pointer transition ${
                            loveLoyaltyProud === val
                              ? "bg-[#f97316] border-[#f97316] text-white shadow-md shadow-orange-100 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          <span className="font-mono font-bold text-xs">{val}</span>
                          <span className="text-[8px] font-medium mt-0.5 whitespace-nowrap">
                            {t(
                              val === 5 ? "มากที่สุด" : val === 4 ? "มาก" : val === 3 ? "ปานกลาง" : val === 2 ? "น้อย" : "น้อยที่สุด",
                              val === 5 ? "Strongly" : val === 4 ? "Agree" : val === 3 ? "Neutral" : val === 2 ? "Disagree" : "Weak"
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-700">
                      2. {t("ท่านยินดีให้ความร่วมมือกับมหาวิทยาลัยเมื่อมีกิจกรรม", "I am willing to cooperate with the university in activities.")}
                    </p>
                    <div className="grid grid-cols-5 gap-1.5 pt-2 select-none">
                      {[5, 4, 3, 2, 1].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setLoveLoyaltyCooperate(val)}
                          id={`love-coop-${val}`}
                          className={`py-2 px-1 flex flex-col items-center justify-center rounded-lg border text-center cursor-pointer transition ${
                            loveLoyaltyCooperate === val
                              ? "bg-[#f97316] border-[#f97316] text-white shadow-md shadow-orange-100 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          <span className="font-mono font-bold text-xs">{val}</span>
                          <span className="text-[8px] font-medium mt-0.5 whitespace-nowrap">
                            {t(
                              val === 5 ? "มากที่สุด" : val === 4 ? "มาก" : val === 3 ? "ปานกลาง" : val === 2 ? "น้อย" : "น้อยที่สุด",
                              val === 5 ? "Strongly" : val === 4 ? "Agree" : val === 3 ? "Neutral" : val === 2 ? "Disagree" : "Weak"
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="space-y-1 bg-white p-3 rounded-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-700">
                      3. {t("ท่านจะรักษาและสร้างชื่อเสียงให้กับมหาวิทยาลัย", "I will help maintain and enhance the university's reputation.")}
                    </p>
                    <div className="grid grid-cols-5 gap-1.5 pt-2 select-none">
                      {[5, 4, 3, 2, 1].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setLoveLoyaltySustain(val)}
                          id={`love-sustain-${val}`}
                          className={`py-2 px-1 flex flex-col items-center justify-center rounded-lg border text-center cursor-pointer transition ${
                            loveLoyaltySustain === val
                              ? "bg-[#f97316] border-[#f97316] text-white shadow-md shadow-orange-100 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          <span className="font-mono font-bold text-xs">{val}</span>
                          <span className="text-[8px] font-medium mt-0.5 whitespace-nowrap">
                            {t(
                              val === 5 ? "มากที่สุด" : val === 4 ? "มาก" : val === 3 ? "ปานกลาง" : val === 2 ? "น้อย" : "น้อยที่สุด",
                              val === 5 ? "Strongly" : val === 4 ? "Agree" : val === 3 ? "Neutral" : val === 2 ? "Disagree" : "Weak"
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Q21: Suggestions for university improvement */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-3.5 border border-slate-100">
                <label className="text-xs font-bold text-slate-800 block leading-relaxed">
                  21. {t("ข้อเสนอแนะเพื่อการพัฒนามหาวิทยาลัยให้ดีขึ้น (เลือกตอบได้มากกว่า 1 ข้อ)", "Suggestions for University Improvement (You may select more than one option):")}
                </label>
                <div className="space-y-2 text-xs pt-1 select-none">
                  {IMPROVE_SUGGESTIONS.map((imp) => (
                    <label key={imp.id} className="flex gap-2.5 items-start cursor-pointer hover:text-slate-800 select-none">
                      <input
                        type="checkbox"
                        checked={improveSuggestions.includes(imp.id)}
                        onChange={() => handleCheckboxToggle(improveSuggestions, setImproveSuggestions, imp.id)}
                        id={`chk-${imp.id}`}
                        className="w-4 h-4 mt-0.5 accent-orange-500"
                      />
                      <span className="leading-normal">{t(imp.th, imp.en)}</span>
                    </label>
                  ))}

                  <label className="flex gap-2.5 items-start cursor-pointer hover:text-slate-800 select-none">
                    <input
                      type="checkbox"
                      checked={improveSuggestions.includes("imp_16")}
                      onChange={() => handleCheckboxToggle(improveSuggestions, setImproveSuggestions, "imp_16")}
                      id="chk-imp-other"
                      className="w-4 h-4 mt-0.5 accent-orange-500"
                    />
                    <span>{t("อื่น ๆ (ระบุ / Specify)", "Others (Please Specify)")}</span>
                  </label>

                  {improveSuggestions.includes("imp_16") && (
                    <motion.input
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      type="text"
                      placeholder={t("โปรดระบุข้อเสนอแนะเพิ่มเติม...", "Please state specify suggestions...")}
                      value={improveSuggestionOther}
                      onChange={(e) => setImproveSuggestionOther(e.target.value)}
                      id="improve-suggestion-other-input"
                      className="w-full mt-2 p-2 bg-white border border-slate-200 text-xs rounded-md shadow-inner"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}

              </div>

              {/* Bottom Dynamic Wizard Navigation Panel */}
              <div className="p-4 border-t border-slate-150 flex items-center justify-between bg-slate-50/80 shrink-0 select-none">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    id="wizard-prev-btn"
                    className="flex items-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-650 font-semibold text-xs cursor-pointer transition select-none"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    {t("ย้อนกลับ", "Back")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onLogout}
                    id="student-exit-btn"
                    className="flex items-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-550 font-semibold text-xs cursor-pointer transition select-none"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    {t("ออกจากระบบ", "Exit")}
                  </button>
                )}

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    id="wizard-next-btn"
                    className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-slate-900 text-white font-semibold text-xs cursor-pointer transition shadow select-none"
                  >
                    {t("ขั้นตอนถัดไป", "Next")}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    id="wizard-submit-btn"
                    className="flex items-center gap-1.5 py-2.5 px-5 rounded-lg bg-[#f97316] hover:bg-orange-600 disabled:bg-orange-350 text-white font-bold text-xs cursor-pointer transition shadow select-none"
                  >
                    {submitting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        {t("ส่งแบบสอบถาม (Submit Form)", "Submit responses")}
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

          </div>
        </section>

        {/* Right Column: Selected Faculty & Info */}
        <aside className="w-full lg:w-1/5 flex flex-col gap-4 shrink-0 justify-start">
          <div className="glass-panel bg-white/90 rounded-xl p-4 shadow-sm text-xs">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-wider">{t("คณะที่ท่านประเมินสังกัด", "Student Profile Info")}</h3>
            <div className="space-y-2.5">
              <div className="p-2.5 bg-orange-50/80 border border-orange-100 text-orange-950 rounded font-semibold leading-relaxed">
                <span className="text-[9px] uppercase block tracking-wider text-[#f97316] font-bold mb-0.5">{t("คณะสังกัด (FACULTY)", "FACULTY")}</span>
                {faculty ? (
                  FACULTIES.find(f => f.id === faculty)?.[lang === "th" ? "th" : "en"] || faculty
                ) : (
                  <span className="italic text-slate-400">{t("กรุณาเลือกคณะ...", "Choose Faculty...")}</span>
                )}
              </div>
              
              <div className="p-2.5 bg-slate-50 border border-slate-205 text-slate-705 rounded font-medium leading-relaxed">
                <span className="text-[9.5px] uppercase block tracking-wider text-slate-400 font-bold mb-0.5">{t("สาขาวิชา (PROGRAM)", "PROGRAM / MAJOR")}</span>
                {program ? (
                  <span className="font-semibold text-slate-800">{program}</span>
                ) : (
                  <span className="italic text-slate-400">{t("กรุณาเลือกสาขา...", "Choose Program...")}</span>
                )}
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded font-medium leading-relaxed">
                <span className="text-[9.5px] uppercase block tracking-wider text-slate-400 font-bold mb-0.5">{t("ความคืบหน้า (PROGRESS)", "SURVEY PROGRESS")}</span>
                <span className="text-xs font-semibold text-slate-700">
                  {t(`ขั้นตอนที่ ${step} จากทั้งหมด ${totalSteps}`, `Step ${step} of ${totalSteps}`)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto glass-panel rounded-xl p-4 border-dashed border-2 border-slate-200 bg-slate-50/40">
            <div className="text-center space-y-2 select-none">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t("สำนักมาตรฐานคุณภาพการศึกษา", "Office of Educational Quality Standards")}</p>
              <div className="flex justify-center items-center gap-1 flex-wrap">
                <span className="text-[10px] font-semibold text-slate-600">Firebase</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <span className="text-[10px] font-semibold text-slate-600">Vite React</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <span className="text-[10px] font-semibold text-slate-600">GitHub</span>
              </div>
              <p className="text-[9px] text-emerald-650 font-semibold italic mt-2 flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                ● Secure Sync Active
              </p>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};
