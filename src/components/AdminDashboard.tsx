/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import {
  Question,
  StudentResponse,
  FACULTIES,
  RECEIVED_INFO_OPTIONS,
  RECOMMEND_REASONS,
  ADHERE_REASONS,
  COMPLAINT_CHANNELS,
  IMPROVE_SUGGESTIONS,
  getProgramsByFaculty
} from "../types";
import { saveQuestion, removeQuestion, fetchResponses, clearAllResponses, registerAdmin } from "../dbService";
import { isMockFirebase } from "../firebaseConfig";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  Download, Plus, Trash2, Edit3, AlertTriangle, Users, BookOpen, Settings, LogOut,
  Sparkles, CheckCircle, RefreshCw, Mail, ShieldAlert, GraduationCap, BarChart2
} from "lucide-react";

interface AdminDashboardProps {
  questions: Question[];
  onQuestionsChange: () => void;
  user: any;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  questions,
  onQuestionsChange,
  user,
  onLogout,
}) => {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"analytics" | "questions" | "settings">("analytics");
  const [responses, setResponses] = useState<StudentResponse[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filters for analytics
  const [filterFaculty, setFilterFaculty] = useState<string>("all");
  const [filterProgram, setFilterProgram] = useState<string>("all");
  const [surveyPartTab, setSurveyPartTab] = useState<number>(1);

  // Question editing modal states
  const [isEditing, setIsEditing] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Partial<Question> | null>(null);

  // Form / Action states
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [purging, setPurging] = useState(false);
  const [adminRegisterEmail, setAdminRegisterEmail] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch responses
  useEffect(() => {
    const loadResponses = async () => {
      setLoadingResponses(true);
      try {
        const data = await fetchResponses();
        setResponses(data);
      } catch (err) {
        console.error("Error loading survey responses: ", err);
      } finally {
        setLoadingResponses(false);
      }
    };
    loadResponses();
  }, [refreshTrigger, questions]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    onQuestionsChange();
  };

  // Derived active responses array after applying filters
  const activeResponses = responses.filter((r) => {
    const matchFaculty = filterFaculty === "all" || r.studentFacultyTh === filterFaculty || r.studentFacultyEn === filterFaculty;
    const matchProgram = filterProgram === "all" || r.studentProgram === filterProgram;
    return matchFaculty && matchProgram;
  });

  // Get list of unique available programs from filtered/unfiltered responses
  const getAvailablePrograms = () => {
    const list = new Set<string>();
    if (filterFaculty !== "all") {
      const official = getProgramsByFaculty(filterFaculty);
      official.forEach((p) => list.add(p.majorTh));
    }
    responses.forEach((r) => {
      if (filterFaculty === "all" || r.studentFacultyTh === filterFaculty || r.studentFacultyEn === filterFaculty) {
        if (r.studentProgram) {
          list.add(r.studentProgram);
        }
      }
    });
    return Array.from(list).sort();
  };

  // Helper score math
  const getAverageScoreForQuestion = (qId: string) => {
    if (activeResponses.length === 0) return 0;
    const scores = activeResponses.map((r) => r.part1Ratings?.[qId] || 3);
    const sum = scores.reduce((a, b) => a + b, 0);
    return Number((sum / activeResponses.length).toFixed(2));
  };

  // 1. Process Chart Data: Aspect Averages
  const aspectAverages = () => {
    const aspects = [
      { id: "edu", th: "ด้านการจัดการศึกษา", en: "Educational Management", total: 0, count: 0 },
      { id: "support", th: "ด้านการบริการนักศึกษา", en: "Student Support Services", total: 0, count: 0 },
      { id: "facility", th: "ด้านสิ่งสนับสนุนการเรียนรู้", en: "Facilities & Infrastructure", total: 0, count: 0 },
    ];

    questions.forEach((q) => {
      const avg = getAverageScoreForQuestion(q.id);
      if (q.aspectTh.includes("การจัดการศึกษา") || q.aspectEn.includes("Education")) {
        aspects[0].total += avg;
        aspects[0].count += 1;
      } else if (q.aspectTh.includes("บริการนักศึกษา") || q.aspectEn.includes("Support")) {
        aspects[1].total += avg;
        aspects[1].count += 1;
      } else {
        aspects[2].total += avg;
        aspects[2].count += 1;
      }
    });

    return aspects.map((asp) => ({
      name: t(asp.th, asp.en),
      rating: asp.count > 0 ? Number((asp.total / asp.count).toFixed(2)) : 0,
    }));
  };

  // 2. Process Chart Data: Recommend ratio
  const recommendRatioData = () => {
    let yesCount = 0;
    let noCount = 0;
    activeResponses.forEach((r) => {
      if (r.part2Recommend === "Yes") yesCount++;
      else if (r.part2Recommend === "No") noCount++;
    });
    return [
      { name: t("แนะนำ (Recommend)", "Recommend"), value: yesCount, color: "#f97316" },
      { name: t("ไม่แนะนำ (Not Recommend)", "Not Recommend"), value: noCount, color: "#f43f5e" },
    ];
  };

  // 3. Process Chart Data: Faculty distribution
  const facultyDistributionData = () => {
    const counts: { [facTh: string]: number } = {};
    FACULTIES.forEach((f) => {
      counts[t(f.th, f.en)] = 0;
    });

    activeResponses.forEach((r) => {
      const facName = t(r.studentFacultyTh, r.studentFacultyEn);
      if (facName) {
        counts[facName] = (counts[facName] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter((x) => x.value > 0);
  };

  // 4. Process Chart Data: Received Info
  const receivedInfoStats = () => {
    const counts: { [key: string]: number } = {};
    RECEIVED_INFO_OPTIONS.forEach((opt) => {
      counts[t(opt.th, opt.en)] = 0;
    });
    let otherCount = 0;

    activeResponses.forEach((r) => {
      if (r.part2ReceivedInfo) {
        r.part2ReceivedInfo.forEach((val) => {
          const opt = RECEIVED_INFO_OPTIONS.find((o) => o.id === val);
          if (opt) {
            const label = t(opt.th, opt.en);
            counts[label] = (counts[label] || 0) + 1;
          } else if (val === "info_6" || val.includes("other") || val.toLowerCase() === "other") {
            otherCount++;
          }
        });
      }
    });

    const list = Object.entries(counts).map(([name, value]) => ({ name, value }));
    if (otherCount > 0) {
      list.push({ name: t("อื่น ๆ (Other)", "Other"), value: otherCount });
    }
    return list.sort((a, b) => b.value - a.value);
  };

  // 5. Recommend reasons count
  const recommendReasonsStats = () => {
    const counts: { [key: string]: number } = {};
    RECOMMEND_REASONS.forEach((opt) => {
      counts[t(opt.th, opt.en)] = 0;
    });

    activeResponses.forEach((r) => {
      if (r.part2RecommendReasons) {
        r.part2RecommendReasons.forEach((val) => {
          const opt = RECOMMEND_REASONS.find((o) => o.id === val);
          if (opt) {
            const label = t(opt.th, opt.en);
            counts[label] = (counts[label] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter((x) => x.value > 0)
      .sort((a, b) => b.value - a.value);
  };

  // 6. Adhere to expectations
  const adhereRatioData = () => {
    let yesCount = 0;
    let noCount = 0;
    activeResponses.forEach((r) => {
      if (r.part2Adhere === "Yes") yesCount++;
      else if (r.part2Adhere === "No") noCount++;
    });
    return [
      { name: t("ตรงตามจริง (As Advertised)", "As Advertised"), value: yesCount, color: "#10b981" },
      { name: t("ไม่ตรงตามจริง (Not as)", "Not as Advertised"), value: noCount, color: "#ef4444" },
    ];
  };

  const adhereReasonsStats = () => {
    const counts: { [key: string]: number } = {};
    ADHERE_REASONS.forEach((opt) => {
      counts[t(opt.th, opt.en)] = 0;
    });

    activeResponses.forEach((r) => {
      if (r.part2AdhereReasons) {
        r.part2AdhereReasons.forEach((val) => {
          const opt = ADHERE_REASONS.find((o) => o.id === val);
          if (opt) {
            const label = t(opt.th, opt.en);
            counts[label] = (counts[label] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .filter((x) => x.value > 0)
      .sort((a, b) => b.value - a.value);
  };

  // 7. Complaint System stats
  const complaintSubmittedRatio = () => {
    let yesCount = 0;
    let noCount = 0;
    activeResponses.forEach((r) => {
      if (r.part2ComplaintSubmitted === "Yes") yesCount++;
      else if (r.part2ComplaintSubmitted === "No") noCount++;
    });
    return [
      { name: t("เคยแจ้งเรื่องร้องเรียน (Yes)", "Yes, submitted"), value: yesCount, color: "#f97316" },
      { name: t("ไม่เคยแจ้ง (No)", "No, never"), value: noCount, color: "#94a3b8" },
    ];
  };

  const getAverageComplaintSatisfaction = () => {
    const validResponses = activeResponses.filter((r) => r.part2ComplaintSatisfaction && r.part2ComplaintSatisfaction > 0);
    if (validResponses.length === 0) return 0;
    const sum = validResponses.reduce((acc, r) => acc + r.part2ComplaintSatisfaction, 0);
    return Number((sum / validResponses.length).toFixed(2));
  };

  const complaintChannelsStats = () => {
    const counts: { [key: string]: number } = {};
    COMPLAINT_CHANNELS.forEach((opt) => {
      counts[t(opt.th, opt.en)] = 0;
    });
    let otherCount = 0;

    activeResponses.forEach((r) => {
      if (r.part2ComplaintChannels) {
        r.part2ComplaintChannels.forEach((val) => {
          const opt = COMPLAINT_CHANNELS.find((o) => o.id === val);
          if (opt) {
            const label = t(opt.th, opt.en);
            counts[label] = (counts[label] || 0) + 1;
          } else if (val === "chan_6" || val.includes("other") || val.toLowerCase() === "other") {
            otherCount++;
          }
        });
      }
    });

    const list = Object.entries(counts).map(([name, value]) => ({ name, value }));
    if (otherCount > 0) {
      list.push({ name: t("อื่น ๆ (Other)", "Other"), value: otherCount });
    }
    return list.filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
  };

  // 8. Loyalty indicators
  const getLoyaltyAverages = () => {
    if (activeResponses.length === 0) return [];

    let sumProud = 0, countProud = 0;
    let sumCoop = 0, countCoop = 0;
    let sumSustain = 0, countSustain = 0;

    activeResponses.forEach((r) => {
      if (r.part2LoveLoyaltyProud) {
        sumProud += r.part2LoveLoyaltyProud;
        countProud++;
      }
      if (r.part2LoveLoyaltyCooperate) {
        sumCoop += r.part2LoveLoyaltyCooperate;
        countCoop++;
      }
      if (r.part2LoveLoyaltySustain) {
        sumSustain += r.part2LoveLoyaltySustain;
        countSustain++;
      }
    });

    return [
      {
        id: "proud",
        name: t("ความภาคภูมิใจสถาบัน", "Pride to be BU student"),
        average: countProud > 0 ? Number((sumProud / countProud).toFixed(2)) : 0,
      },
      {
        id: "cooperate",
        name: t("ความร่วมมือกับกิจกรรม", "Willingness for university activities"),
        average: countCoop > 0 ? Number((sumCoop / countCoop).toFixed(2)) : 0,
      },
      {
        id: "sustain",
        name: t("การรักษา/สร้างชื่อเสียง", "Reputation maintenance & protection"),
        average: countSustain > 0 ? Number((sumSustain / countSustain).toFixed(2)) : 0,
      },
    ];
  };

  // 9. Top Improvement Suggestions requested
  const improvementSuggestionsStats = () => {
    const counts: { [key: string]: number } = {};
    IMPROVE_SUGGESTIONS.forEach((opt) => {
      counts[t(opt.th, opt.en)] = 0;
    });
    let otherCount = 0;

    activeResponses.forEach((r) => {
      if (r.part2ImproveSuggestions) {
        r.part2ImproveSuggestions.forEach((val) => {
          const opt = IMPROVE_SUGGESTIONS.find((o) => o.id === val);
          if (opt) {
            const label = t(opt.th, opt.en);
            counts[label] = (counts[label] || 0) + 1;
          } else if (val === "imp_16" || val.includes("other") || val.toLowerCase() === "other") {
            otherCount++;
          }
        });
      }
    });

    const list = Object.entries(counts).map(([name, value]) => ({ name, value }));
    if (otherCount > 0) {
      list.push({ name: t("อื่น ๆ (Other)", "Other"), value: otherCount });
    }
    return list.filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
  };

  // Create or Update Question Actions
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion?.textTh || !selectedQuestion?.textEn || !selectedQuestion?.aspectTh) {
      setActionError(t("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน", "Please fill in all required question fields"));
      return;
    }

    setSavingQuestion(true);
    setActionError(null);
    setActionSuccess(null);

    try {
      const finalQ: Question = {
        id: selectedQuestion.id || "",
        order: Number(selectedQuestion.order) || questions.length + 1,
        aspectTh: selectedQuestion.aspectTh,
        aspectEn: selectedQuestion.aspectEn || selectedQuestion.aspectTh,
        textTh: selectedQuestion.textTh,
        textEn: selectedQuestion.textEn,
        descriptionTh: selectedQuestion.descriptionTh || "",
        descriptionEn: selectedQuestion.descriptionEn || "",
      };

      await saveQuestion(finalQ);
      setActionSuccess(t("บันทึกคำถามเรียบร้อยแล้ว", "Successfully updated the dynamic question"));
      setIsEditing(false);
      setSelectedQuestion(null);
      triggerRefresh();
    } catch (err: any) {
      setActionError(err.message || "Failed to save question");
    } finally {
      setSavingQuestion(false);
    }
  };

  // Delete Question Action
  const handleDeleteQuestion = async (id: string) => {
    if (!confirm(t("ยืนยันการลบคำถามนี้หรือไม่? มีผลทันทีต่อแบบฟอร์มประเมิน", "Are you sure you want to delete this question? This affects the student form immediately."))) {
      return;
    }

    try {
      await removeQuestion(id);
      setActionSuccess(t("ลบคำถามออกแล้ว", "Successfully removed question"));
      triggerRefresh();
    } catch (err: any) {
      setActionError(err.message || "Failed to delete question");
    }
  };

  // dynamic addition click
  const handleAddQuestionClick = () => {
    setSelectedQuestion({
      order: questions.length + 1,
      aspectTh: "ด้านการจัดการศึกษา",
      aspectEn: "Educational Management",
      textTh: "",
      textEn: "",
      descriptionTh: "",
      descriptionEn: "",
    });
    setIsEditing(true);
  };

  // dynamic edit click
  const handleEditQuestionClick = (q: Question) => {
    setSelectedQuestion(q);
    setIsEditing(true);
  };

  // Clear all databases responses
  const handleClearAll = async () => {
    const doubleCheck = confirm(t(
      "⚠️ คำเตือนสำคัญที่สุด! คุณต้องการล้างฐานข้อมูลการตอบกลับ survey ทั้งหมดใช่หรือไม่? รายการตอบกลับจะสูญหายถาวรทันทีและไม่สามารถกู้คืนได้",
      "⚠️ CRITICAL WARNING! Are you sure you want to clear ALL student responses from the database? This is permanent and cannot be undone."
    ));
    if (!doubleCheck) return;

    setPurging(true);
    setActionSuccess(null);
    setActionError(null);
    try {
      await clearAllResponses();
      setActionSuccess(t("ล้างข้อมูลการตอบกลับทั้งหมดสำเร็จแล้ว", "Successfully purged all respondent data from Firestore"));
      triggerRefresh();
    } catch (err: any) {
      setActionError(err.message || "Purge execution failed");
    } finally {
      setPurging(false);
    }
  };

  // Register dynamic authorized Admin
  const handleRegisterAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminRegisterEmail.trim()) return;

    setActionSuccess(null);
    setActionError(null);
    try {
      const compactUid = "adm_" + Math.random().toString(36).substring(2, 6);
      await registerAdmin(adminRegisterEmail, compactUid);
      setActionSuccess(t(`จำลองแต่งตั้ง ${adminRegisterEmail} เป็นแอดมินระบบเรียบร้อยแล้ว`, `Assigned admin role to ${adminRegisterEmail} successfully.`));
      setAdminRegisterEmail("");
    } catch (err: any) {
      setActionError(err.message || "Admin creation failed");
    }
  };

  // Clean, high contrast CSV exporter (Bilingual headers, character code safety BOM \uFEFF)
  const handleExportCSV = () => {
    if (responses.length === 0) {
      alert(t("ไม่มีข้อมูลสถิติสำหรับการส่งออก", "There are no submission records to export."));
      return;
    }

    // Prepare CSV header values
    const headers = [
      "No", "Timestamp", "Student Email", "Faculty (TH)", "Faculty (EN)", "Program/Major",
      ...questions.map((q) => `Q${q.order} (${q.textEn})`),
      "Part 2: Received Info", "Part 2: Received Info Other",
      "Part 2: Suggest BU to Others?", "Part 2: Suggest Reasons", "Part 2: Non-suggest reasons",
      "Part 2: Meets Publicity?", "Part 2: Meets Reasons", "Part 2: Non-meets reasons",
      "Part 2: Submitted Complaint?", "Part 2: Complaint Detail", "Part 2: Complaint Satisfaction Rating (1-5)",
      "Part 2: Complaint Channels Used", "Part 2: Complaint Channel Other",
      "Part 2: Loyalty - Proud to be BU student (1-5)", "Part 2: Loyalty - Willing to cooperate in activities (1-5)",
      "Part 2: Loyalty - Will sustain reputation (1-5)",
      "Part 2: Improvements Requested", "Part 2: Improvements Other Specification"
    ];

    // Build rows
    const rows = responses.map((res, index) => {
      // Map dynamic part 1 rating values
      const p1Scores = questions.map((q) => res.part1Ratings?.[q.id] || "");

      // Handle arrays formatting nicely for CSV block
      const escape = (str?: string) => `"${(str || "").replace(/"/g, '""')}"`;
      
      const recInfoStr = res.part2ReceivedInfo?.join(", ") || "";
      const recReasonsStr = res.part2RecommendReasons?.join(", ") || "";
      const adhReasonsStr = res.part2AdhereReasons?.join(", ") || "";
      const compChannelsStr = res.part2ComplaintChannels?.join(", ") || "";
      const improveStr = res.part2ImproveSuggestions?.join(", ") || "";

      return [
        index + 1,
        res.createdAt || "",
        res.studentEmail,
        escape(res.studentFacultyTh),
        escape(res.studentFacultyEn),
        escape(res.studentProgram),
        ...p1Scores,
        escape(recInfoStr),
        escape(res.part2ReceivedInfoOther),
        res.part2Recommend,
        escape(recReasonsStr),
        escape(res.part2RecommendNoReason),
        res.part2Adhere,
        escape(adhReasonsStr),
        escape(res.part2AdhereNoReason),
        res.part2ComplaintSubmitted,
        escape(res.part2ComplaintDetail),
        res.part2ComplaintSatisfaction,
        escape(compChannelsStr),
        escape(res.part2ComplaintChannelOther),
        res.part2LoveLoyaltyProud,
        res.part2LoveLoyaltyCooperate,
        res.part2LoveLoyaltySustain,
        escape(improveStr),
        escape(res.part2ImproveSuggestionOther)
      ];
    });

    const csvContent = 
      "\uFEFF" + // Add BOM for Excel UTF-8 Thai compatibility
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `BU_Survey_Responses_Export_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Google Apps Script template for Email alerts logic advising user
  const googleAppsScriptCode = `/**
 * Google Apps Script Webhook for Student Questionnaire Alerts
 * Set up for FREE under your Google Account to send SMTP alerts
 * without needing custom Node.js servers or Cloud Run!
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var recipient = "pornpun.w@bu.ac.th"; // Put primary admin recipient here
    
    var subject = "⚠️ แจ้งเตือน: นักศึกษาตอบแบบสอบถามคุณภาพการจัดการศึกษา BU 2024 ใหม่";
    var body = "มีแบบสอบถามใหม่ได้รับการส่งเข้าระบบ:\\n\\n" +
               "👤 จากอีเมล: " + data.studentEmail + "\\n" +
               "🏫 คณะ: " + data.studentFacultyTh + " (" + data.studentFacultyEn + ")\\n" +
               "📚 สาขาวิชา: " + data.studentProgram + "\\n" +
               "🕒 เวลาส่ง: " + new Date().toLocaleString() + "\\n\\n" +
               "เข้าสู่ระบบเพื่อดูรายละเอียดภาพรวมและดึงข้อมูล CSV ทันที.";
               
    GmailApp.sendEmail(recipient, subject, body);
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}`;

  // Render survey questions table helper
  const renderSurveyQuestionsTable = (aspectFilters: string[]) => {
    const filtered = questions.filter(q => 
      aspectFilters.some(val => q.aspectTh.includes(val) || q.aspectEn.toLowerCase().includes(val.toLowerCase()))
    );

    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="border-b border-slate-50 pb-2">
          <h4 className="text-xs font-extrabold text-slate-850">
            {t("ดัชนีคะแนนความพึงพอใจรายข้อคำถาม (Satisfaction Scale Rating Index)", "Detailed Satisfaction Score Index")}
          </h4>
        </div>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-150 font-bold">
                <th className="p-3 w-16">{t("ข้อที่", "No")}</th>
                <th className="p-3">{t("เนื้อหาข้อประเมิน (Evaluation details)", "Question Statement")}</th>
                <th className="p-3 text-center w-28">{t("จำนวนข้อตอบ", "Response Count")}</th>
                <th className="p-3 text-right w-24">{t("คะแนนเฉลี่ย", "Mean Score")}</th>
                <th className="p-3 text-center w-36">{t("ระดับความพึงพอใจ", "Satisfaction Rating")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filtered.map((q) => {
                const avgValue = getAverageScoreForQuestion(q.id);
                let ratingText = t("ปานกลาง", "Neutral");
                let ratingColor = "bg-amber-100 text-amber-800";
                if (avgValue >= 4.55) {
                  ratingText = t("มากที่สุด (ดีเยี่ยม)", "Strongly Satisfied");
                  ratingColor = "bg-teal-100 text-teal-800";
                } else if (avgValue >= 3.55) {
                  ratingText = t("มาก", "Very Satisfied");
                  ratingColor = "bg-emerald-100 text-emerald-800";
                } else if (avgValue < 2.50) {
                  ratingText = t("น้อยค่อนควรปรับปรุง", "Needs Improvement");
                  ratingColor = "bg-rose-100 text-rose-800";
                }

                return (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-slate-800">{q.order}</td>
                    <td className="p-3">
                      <p className="font-bold text-slate-850">{t(q.textTh, q.textEn)}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed italic">{t(q.aspectTh, q.aspectEn)}</p>
                    </td>
                    <td className="p-3 text-center font-mono">{activeResponses.length}</td>
                    <td className="p-3 text-right font-extrabold font-mono text-orange-600">{avgValue.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${ratingColor}`}>
                        {ratingText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans transition-colors duration-300">
      
      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#f97316] flex items-center justify-center text-white font-black shadow-inner">
            BU
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">
              {t("แผงควบคุมระบบบริหารแบบวิจัยสถาบัน", "Educational Quality Bureau Dashboard")}
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">
              ROLE: SECURE_QA_ADMIN | {user.email}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerRefresh}
            id="refresh-stats-btn"
            className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-350 cursor-pointer transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t("รีเฟรชข้อมูล", "Sync Data")}
          </button>
          <button
            onClick={onLogout}
            id="admin-logout-btn"
            className="p-2.5 rounded-lg border border-slate-700 hover:bg-rose-950 hover:text-rose-400 text-slate-300 cursor-pointer transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t("ออกจากระบบ", "Sign Out")}
          </button>
        </div>
      </header>

      {/* Subheader tabs below header */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-2">
        <div className="bg-black/20 w-fit px-1 py-1 rounded-lg flex gap-1">
          {[
            { id: "analytics", label: t("📊 ผลการสำรวจ & สถิติ", "📊 Survey Analytics"), icon: BarChart2 },
            { id: "questions", label: t("📝 จัดการข้อถาม Part 1", "📝 Manage Part 1 Questions"), icon: BookOpen },
            { id: "settings", label: t("⚙️ ตั้งค่าความปลอดภัย & SMTP", "⚙️ Security & SMTP config"), icon: Settings }
          ].map((tab) => {
            const IconComp = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                id={`tab-${tab.id}`}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer transition ${
                  activeTab === tab.id
                    ? "bg-[#f97316] text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        <AnimatePresence mode="wait">
          {/* Tab: ANALYTICS PANEL */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              
              {/* Filter Bar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100/70 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">{t("จำแนกตามคณะ (Filter Faculty)", "Filter Faculty")}</label>
                    <select
                      value={filterFaculty}
                      onChange={(e) => {
                        setFilterFaculty(e.target.value);
                        setFilterProgram("all"); // Reset program filter when faculty changes
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100/100 transition"
                    >
                      <option value="all">{t("🏫 คณะทั้งหมด (All Faculties)", "All Faculties")}</option>
                      {FACULTIES.map((fac) => (
                        <option key={fac.id} value={fac.th}>
                          {t(fac.th, fac.en)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1 space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">{t("จำแนกตามสาขาวิชา (Filter Program/Major)", "Filter Program/Major")}</label>
                    <select
                      value={filterProgram}
                      onChange={(e) => setFilterProgram(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold text-slate-700 cursor-pointer hover:bg-slate-100/100 transition"
                    >
                      <option value="all">{t("📚 สาขาวิชาทั้งหมด (All Programs)", "All Programs")}</option>
                      {getAvailablePrograms().map((prog) => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 py-2.5 px-4 rounded-xl bg-orange-50/60 border border-orange-100/70 justify-between md:justify-start shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider leading-none mb-1">
                      {t("จำนวนผู้ตอบข้อถามกลุ่มนี้", "Active Respondents")}
                    </div>
                    <div className="text-lg font-black text-orange-600 font-mono leading-none">
                      {activeResponses.length} <span className="text-slate-400 font-normal text-xs">/ {responses.length} {t("คน", "people")}</span>
                    </div>
                  </div>
                  <div className="text-right border-l border-orange-200/50 pl-4 h-8 flex flex-col justify-center">
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider leading-none mb-1">
                      {t("สัดส่วนกลุ่มนี้", "Percentage Proportion")}
                    </div>
                    <div className="text-md font-black text-slate-700 font-mono leading-none">
                      {responses.length > 0 ? Math.round((activeResponses.length / responses.length) * 100) : 0}%
                    </div>
                  </div>
                </div>

                {/* Exporter Section Inside Filter Bar */}
                <div className="shrink-0 flex items-end">
                  <button
                    onClick={handleExportCSV}
                    id="export-csv-btn"
                    className="w-full md:w-auto h-11 flex items-center justify-center gap-2 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {t("ส่งออกข้อมูล (Export CSV)", "Export CSV")}
                  </button>
                </div>
              </div>

              {/* Sub-tabs matching the 5 survey parts styling based on user image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                {[
                  { id: 1, label: t("ข้อมูลทั่วไป", "General Info"), sub: t("ส่วนที่ 1: คณะและสาขา", "Part 1: Faculty & Programs") },
                  { id: 2, label: t("ความพึงพอใจการศึกษา", "Educational Satisfaction"), sub: t("การจัดการศึกษา และการบริการนักศึกษา", "Educational Management & Services") },
                  { id: 3, label: t("ความพึงพอใจการศึกษา", "Educational Facilities"), sub: t("สิ่งอำนวยความสะดวก และสิ่งสนับสนุนการเรียนรู้", "Amenities & Learning Infrastructure") },
                  { id: 4, label: t("ความคิดเห็นของนักศึกษา", "Student Sentiment"), sub: t("การรับทราบข้อมูล", "Information Awareness & Marketing") },
                  { id: 5, label: t("ข้อร้องเรียนและข้อเสนอแนะ", "Complaints & Suggestions"), sub: t("ข้อร้องเรียน และข้อเสนอแนะ", "Complaints, Loyalty & Recommendations") }
                ].map((pt) => {
                  const isSelected = surveyPartTab === pt.id;
                  return (
                    <button
                      key={pt.id}
                      onClick={() => setSurveyPartTab(pt.id)}
                      className={`p-4 text-left rounded-xl border flex items-start gap-3 transition-all relative overflow-hidden cursor-pointer ${
                        isSelected
                          ? "border-orange-500 bg-orange-50/50 shadow-sm ring-1 ring-orange-500/50 pl-5"
                          : "border-slate-200 bg-white hover:bg-slate-50/90"
                      }`}
                    >
                      {/* Orange left thick border for selection matching image */}
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f97316]" />
                      )}
                      
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? "bg-[#f97316] text-white shadow-sm"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {pt.id}
                      </div>

                      <div className="space-y-0.5">
                        <div className={`text-xs font-bold leading-tight ${isSelected ? "text-orange-950 font-extrabold" : "text-slate-700"}`}>
                          {pt.label}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium leading-snug">
                          {pt.sub}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {activeResponses.length === 0 ? (
                <div className="p-16 text-center bg-white rounded-2xl border border-dashed border-slate-250 text-slate-400 space-y-3">
                  <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-semibold text-lg">{t("ไม่พบข้อมูลสำหรับการตั้งค่าตัวกรองนี้", "No respondent data found for current filters")}</p>
                  <p className="text-xs max-w-sm mx-auto leading-normal">
                    {t(
                      "ไม่มีข้อมูลนักศึกษาในคณะหรือสาขาวิชานี้ตอบแบบสอบถามเข้ามา กรุณาล้างหรือเลือกตัวกรองอื่นเพื่อจำแนกสถิติ",
                      "No student contributions belong to this specific selection. Try resetting or selecting a different Faculty/Major."
                    )}
                  </p>
                </div>
              ) : (
                <>
                  {/* Part 1: ข้อมูลทั่วไป (ส่วนที่ 1: คณะและสาขา) */}
                  {surveyPartTab === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Faculty Participation Bar Chart */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-8">
                          <div className="border-b border-slate-50 pb-2 flex justify-between items-center">
                            <h4 className="text-xs font-extrabold text-slate-800 leading-none">
                              {t("สถิติการตอบจำแนกตามคณะ (Submissions counts by Faculty)", "Student Participation Distribution by Faculty")}
                            </h4>
                          </div>
                          <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={facultyDistributionData()}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Major programs stats list */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-4 flex flex-col">
                          <div className="border-b border-slate-50 pb-2 flex justify-between items-center">
                            <h4 className="text-xs font-extrabold text-slate-800 leading-none">
                              {t("จำแนกสัดส่วนตามสาขาวิชา (Submissions by Major Program)", "Distribution by Major Program")}
                            </h4>
                            <span className="bg-orange-55 text-[#f97316] font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-orange-100">
                              {getAvailablePrograms().length} {t("สาขาวิชา", "Majors")}
                            </span>
                          </div>
                          
                          <div className="flex-1 max-h-72 overflow-y-auto pr-2 space-y-3 mt-2">
                            {(() => {
                              const counts: { [prog: string]: number } = {};
                              activeResponses.forEach(r => {
                                if (r.studentProgram) counts[r.studentProgram] = (counts[r.studentProgram] || 0) + 1;
                              });
                              const progDist = Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a,b)=> b.value - a.value);

                              return progDist.length === 0 ? (
                                <div className="text-center text-slate-300 text-xs py-12">
                                  {t("ไม่มีข้อมูลสาขาวิชาในกลุ่มนี้", "No program data found")}
                                </div>
                              ) : (
                                progDist.map((item, idx) => {
                                  const percentage = Math.round((item.value / activeResponses.length) * 100);
                                  return (
                                    <div key={idx} className="space-y-1">
                                      <div className="flex justify-between text-xs font-medium text-slate-700">
                                        <span className="truncate max-w-[70%] font-semibold" title={item.name}>{item.name}</span>
                                        <span className="font-mono text-slate-500">{item.value} {t("คน", "people")} ({percentage}%)</span>
                                      </div>
                                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#f97316] h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                                      </div>
                                    </div>
                                  );
                                })
                              );
                            })()}
                          </div>
                        </div>

                        {/* Recent log submissions list */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-12">
                          <div className="border-b border-slate-50 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800 leading-none">
                              {t("รายชื่อผู้ตอบแบบสอบถามระบบล่าสุดในกลุ่มนี้ (Submissions Logs list)", "Submission Logs list in Active Selection")}
                            </h4>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-150 text-slate-600 font-bold">
                                  <th className="p-3">{t("อีเมลนักศึกษา", "Student Email")}</th>
                                  <th className="p-3">{t("คณะ", "Faculty")}</th>
                                  <th className="p-3">{t("สาขาวิชา/หลักสูตร (Program)", "Program/Department")}</th>
                                  <th className="p-3 text-right">{t("วันที่ เวลาส่งข้อเสนอ", "Submitted On")}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-650">
                                {activeResponses.slice(0, 15).map((r, index) => (
                                  <tr key={index} className="hover:bg-slate-50">
                                    <td className="p-3 font-medium text-slate-850">{r.studentEmail}</td>
                                    <td className="p-3">{t(r.studentFacultyTh, r.studentFacultyEn)}</td>
                                    <td className="p-3 font-semibold text-slate-755">{r.studentProgram || "-"}</td>
                                    <td className="p-3 text-right text-slate-400 font-mono text-[10px]">
                                      {r.createdAt ? r.createdAt.substring(0, 16).replace("T", " ") : "-"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Part 2: ความพึงพอใจการศึกษา / การจัดการศึกษา และการบริการนักศึกษา */}
                  {surveyPartTab === 2 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Satisfaction Scale Averages aspect chart */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-12">
                          <div className="border-b border-slate-50 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {t("ระดับความพึงพอใจเฉลี่ยแยกตามด้าน (Satisfaction Scale Averages by Aspect)", "Satisfaction Scale Averages by Aspect")}
                            </h4>
                          </div>
                          <div className="h-64 max-w-2xl">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={aspectAverages().slice(0, 2)}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                                <Bar dataKey="rating" fill="#f97316" radius={[4, 4, 0, 0]} barSize={50}>
                                  {aspectAverages().slice(0, 2).map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? "#f97316" : "#ec4899"} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Filtered questions Detailed Index */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-12">
                          <div className="border-b border-slate-50 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-850">
                              {t("วิเคราะห์คะแนนความพึงพอใจรายข้อถาม: ส่วนที่ 2 (Satisfaction Index for Educational Management & Services)", "Detailed Score Index for Part 2")}
                            </h4>
                          </div>
                          <div className="overflow-x-auto text-xs">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50 text-slate-550 border-b border-slate-150 font-bold">
                                  <th className="p-3">{t("ข้อที่", "No")}</th>
                                  <th className="p-3">{t("เนื้อหาข้อประเมิน (Evaluation details)", "Question Statement")}</th>
                                  <th className="p-3 text-center">{t("จำนวนข้อตอบ", "Response Count")}</th>
                                  <th className="p-3 text-right">{t("คะแนนเฉลี่ย", "Mean Score")}</th>
                                  <th className="p-3 text-center">{t("ระดับความพึงพอใจ", "Satisfaction Rating")}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-600">
                                {questions
                                  .filter((q) => q.aspectTh.includes("การจัดการศึกษา") || q.aspectTh.includes("การบริการนักศึกษา") || q.aspectEn.includes("Education") || q.aspectEn.includes("Support"))
                                  .map((q) => {
                                    const avgValue = getAverageScoreForQuestion(q.id);
                                    let ratingText = t("ปานกลาง", "Neutral");
                                    let ratingColor = "bg-amber-100 text-amber-800";
                                    if (avgValue >= 4.50) {
                                      ratingText = t("มากที่สุด (ดีเยี่ยม)", "Strongly Satisfied");
                                      ratingColor = "bg-teal-100 text-teal-800";
                                    } else if (avgValue >= 3.50) {
                                      ratingText = t("มาก", "Very Satisfied");
                                      ratingColor = "bg-emerald-100 text-emerald-800";
                                    } else if (avgValue < 2.50) {
                                      ratingText = t("น้อยค่อนควรปรับปรุง", "Needs Improvement");
                                      ratingColor = "bg-rose-100 text-rose-800";
                                    }

                                    return (
                                      <tr key={q.id} className="hover:bg-slate-50">
                                        <td className="p-3 font-mono font-bold text-slate-800">{q.orderLabel || q.order}</td>
                                        <td className="p-3">
                                          {q.groupTitleTh && (
                                            <span className="text-[10px] font-bold text-orange-600 block mb-0.5">
                                              {t(q.groupTitleTh, q.groupTitleEn || q.groupTitleTh)}
                                            </span>
                                          )}
                                          <p className="font-bold text-slate-850">{t(q.textTh, q.textEn)}</p>
                                          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed italic">{t(q.aspectTh, q.aspectEn)}</p>
                                        </td>
                                        <td className="p-3 text-center font-mono">{activeResponses.length}</td>
                                        <td className="p-3 text-right font-extrabold font-mono text-orange-600">{avgValue.toFixed(2)}</td>
                                        <td className="p-3 text-center">
                                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${ratingColor}`}>
                                            {ratingText}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Part 3: ความพึงพอใจการศึกษา / สิ่งอำนวยความสะดวก และสิ่งสนับสนุนการเรียนรู้ */}
                  {surveyPartTab === 3 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Facilities Satisfaction Gauge Metrics */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-12">
                          <div className="border-b border-slate-50 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {t("สถิติระดับความพึงพอใจเฉลี่ยด้านสิ่งอำนวยความสะดวก (Satisfaction Averages by Aspect)", "Satisfaction Scale Averages by Aspect")}
                            </h4>
                          </div>
                          <div className="h-64 max-w-2xl">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[aspectAverages()[2]]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={10} tickLine={false} />
                                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                                <Bar dataKey="rating" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={50}>
                                  <Cell fill="#f59e0b" />
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Filtered questions table detail */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 lg:col-span-12">
                          <div className="border-b border-slate-50 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {t("วิเคราะห์คะแนนความพึงพอใจรายข้อถาม: ส่วนที่ 3 (Satisfaction Index for Amenities & Facilities)", "Detailed Score Index for Part 3")}
                            </h4>
                          </div>
                          <div className="overflow-x-auto text-xs">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-slate-50 text-slate-550 border-b border-slate-150 font-bold">
                                  <th className="p-3">{t("ข้อที่", "No")}</th>
                                  <th className="p-3">{t("เนื้อหาข้อประเมิน (Evaluation details)", "Question Statement")}</th>
                                  <th className="p-3 text-center">{t("จำนวนข้อตอบ", "Response Count")}</th>
                                  <th className="p-3 text-right">{t("คะแนนเฉลี่ย", "Mean Score")}</th>
                                  <th className="p-3 text-center">{t("ระดับความพึงพอใจ", "Satisfaction Rating")}</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 text-slate-600">
                                {questions
                                  .filter((q) => q.aspectTh.includes("เรียนรู้") || q.aspectTh.includes("อำนวยความสะดวก") || q.aspectEn.includes("Facilities") || q.aspectEn.includes("Infrastructure"))
                                  .map((q) => {
                                    const avgValue = getAverageScoreForQuestion(q.id);
                                    let ratingText = t("ปานกลาง", "Neutral");
                                    let ratingColor = "bg-amber-100 text-amber-800";
                                    if (avgValue >= 4.50) {
                                      ratingText = t("มากที่สุด (ดีเยี่ยม)", "Strongly Satisfied");
                                      ratingColor = "bg-teal-100 text-teal-800";
                                    } else if (avgValue >= 3.50) {
                                      ratingText = t("มาก", "Very Satisfied");
                                      ratingColor = "bg-emerald-100 text-emerald-800";
                                    } else if (avgValue < 2.50) {
                                      ratingText = t("น้อยค่อนควรปรับปรุง", "Needs Improvement");
                                      ratingColor = "bg-rose-100 text-rose-800";
                                    }

                                    return (
                                      <tr key={q.id} className="hover:bg-slate-50">
                                        <td className="p-3 font-mono font-bold text-slate-800">{q.order}</td>
                                        <td className="p-3">
                                          <p className="font-bold text-slate-850">{t(q.textTh, q.textEn)}</p>
                                          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed italic">{t(q.aspectTh, q.aspectEn)}</p>
                                        </td>
                                        <td className="p-3 text-center font-mono">{activeResponses.length}</td>
                                        <td className="p-3 text-right font-extrabold font-mono text-orange-600">{avgValue.toFixed(2)}</td>
                                        <td className="p-3 text-center">
                                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${ratingColor}`}>
                                            {ratingText}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Part 4: ความคิดเห็นของนักศึกษา / การรับทราบข้อมูล */}
                  {surveyPartTab === 4 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Received Info stats bar */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                          <div className="border-b border-slate-50 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {t("ช่องทางการรับรู้ข้อมูลข่าวสารหลักสูตร/สถาบัน (Information Channels)", "Primary Channels of Information Received (Q16)")}
                            </h4>
                          </div>
                          <div className="h-64">
                            {receivedInfoStats().length === 0 ? (
                              <div className="text-center text-slate-350 text-xs py-10">
                                {t("ไม่มีสถิติช่องข่าวสาร", "No Outreach data loaded")}
                              </div>
                            ) : (
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={receivedInfoStats()} layout="vertical">
                                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                  <XAxis type="number" stroke="#94a3b8" fontSize={9} tickLine={false} />
                                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} tickLine={false} width={130} />
                                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        </div>

                        {/* Recomend ratio pie and reasons layout */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                          <div className="border-b border-slate-50 pb-2 flex justify-between items-center">
                            <h4 className="text-xs font-extrabold text-slate-850">
                              {t("อัตราการแนะนำสถาบันให้แก่ผู้อื่น (Recommendation Ratio)", "Recommendation Ratio (Q17)")}
                            </h4>
                          </div>
                          <div className="h-64 flex flex-col sm:flex-row items-center gap-4">
                            <div className="w-full h-44">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={recommendRatioData()}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={65}
                                    paddingAngle={5}
                                    dataKey="value"
                                  >
                                    {recommendRatioData().map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="space-y-3.5 text-xs flex-none w-full sm:w-auto text-slate-700">
                              {recommendRatioData().map((it, idx) => (
                                <div key={idx} className="flex items-center gap-2.5">
                                  <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: it.color }}></span>
                                  <span className="font-semibold leading-none">
                                    {it.name}: <strong className="font-mono text-[#f97316] text-sm ml-1">{it.value} {t("คน", "Students")}</strong>
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Top reasons to recommend progress bars */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 md:col-span-2">
                          <div className="border-b border-slate-50 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {t("เหตุผลยอดนิยมสูงสุดในการแนะนำศึกษาต่อ (Top Recommendation Factors)", "Top Reasons to recommend (Q17 Reasons)")}
                            </h4>
                          </div>
                          <div className="max-h-60 overflow-y-auto pr-2 space-y-3 text-xs">
                            {recommendReasonsStats().length === 0 ? (
                              <div className="text-center text-slate-350 text-xs py-10">
                                {t("ไม่มีประวัติเหตุผลการนำเสนอ", "No recommendation reasons registered yet")}
                              </div>
                            ) : (
                              recommendReasonsStats().map((item, idx) => {
                                const total = activeResponses.length || 1;
                                const percentage = Math.round((item.value / total) * 100);
                                return (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-slate-700 font-semibold">
                                      <span className="truncate max-w-[80%]" title={item.name}>{item.name}</span>
                                      <span className="font-mono">{item.value} {t("คน", "people")} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                      <div className="bg-[#f97316] h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* expected publicity adherence */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                          <div className="border-b border-slate-55 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {t("การจัดการเป็นไปตามโฆษณาประชาสัมพันธ์ (Expected Adherence Ratio)", "Publicity & Practice Adherence (Q18)")}
                            </h4>
                          </div>
                          <div className="h-64 flex flex-col items-center justify-center">
                            <div className="w-full h-44">
                              <ResponsiveContainer width="105%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={adhereRatioData()}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={55}
                                    paddingAngle={5}
                                    dataKey="value"
                                  >
                                    {adhereRatioData().map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div className="flex gap-4 text-[10px] font-bold">
                              {adhereRatioData().map((it, idx) => (
                                <div key={idx} className="flex items-center gap-1">
                                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: it.color }}></span>
                                  <span className="text-slate-650 shrink-0">{it.name}: <strong className="font-mono text-[#f97316] text-sm ml-1">{it.value}</strong></span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* areas adherent to publicity */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                          <div className="border-b border-slate-50 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {t("ด้านที่เห็นพ้องว่าดำเนินงานได้ตรงตามประชาสัมพันธ์จริง (Areas Adhering to Publicity)", "Areas Adherent to Publicity (Q18 Reasons)")}
                            </h4>
                          </div>
                          <div className="h-64 overflow-y-auto pr-2 space-y-3.5 text-xs">
                            {adhereReasonsStats().length === 0 ? (
                              <div className="text-center text-slate-350 text-xs py-12">
                                {t("ไม่มีข้อมูลเหตุผลสำหรับข้อนี้", "No adherence reasons submitted")}
                              </div>
                            ) : (
                              adhereReasonsStats().map((item, idx) => {
                                const total = activeResponses.length || 1;
                                const percentage = Math.round((item.value / total) * 100);
                                return (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-slate-700 font-semibold">
                                      <span className="truncate max-w-[80%]" title={item.name}>{item.name}</span>
                                      <span className="font-mono">{item.value} {t("คน", "people")} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-105 h-2 rounded-full overflow-hidden">
                                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Part 5: ข้อร้องเรียนและข้อเสนอแนะ / ข้อร้องเรียน และข้อเสนอแนะ */}
                  {surveyPartTab === 5 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* Complaint History pie */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 md:col-span-4 flex flex-col justify-between">
                          <div className="border-b border-slate-50 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {t("สถิติประวัติการยื่นเรื่องร้องเรียนของนักศึกษา (Complaint History)", "Complaint Submission Rate (Q19.1)")}
                            </h4>
                          </div>
                          <div className="h-32 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={complaintSubmittedRatio()}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={25}
                                  outerRadius={40}
                                  paddingAngle={4}
                                  dataKey="value"
                                >
                                  {complaintSubmittedRatio().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8 }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] font-semibold text-slate-600">
                            {complaintSubmittedRatio().map((it, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: it.color }}></span>
                                <span>{it.name}: <strong className="font-mono">{it.value}</strong></span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Complaint satisfaction score dial */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 md:col-span-4 flex flex-col justify-between">
                          <div className="border-b border-slate-55 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {t("ความพึงพอใจการตอบสนองและแก้ไขเรื่องร้องเรียน (Complaint Satisfaction Mean)", "Complaint Resolution Satisfaction (Q19.2)")}
                            </h4>
                          </div>
                          <div className="flex-1 flex flex-col items-center justify-center space-y-2 py-3">
                            <span className="text-4xl font-extrabold text-orange-650 font-mono tracking-tight leading-none">
                              {getAverageComplaintSatisfaction()}
                            </span>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden max-w-xs mx-auto">
                              <div 
                                className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${(getAverageComplaintSatisfaction() / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold">
                              {t("คะแนนเฉลี่ยสะสม (สูงสุด 5.00 คะแนน)", "Cumulative score (Max 5.00 points)")}
                            </span>
                            <div className="text-xs font-bold text-slate-800 text-center mt-1">
                              {getAverageComplaintSatisfaction() >= 4.5
                                ? t("ระดับ: ความเห็นชอบสูงสุด (ระดับ 5)", "Rating: Strongly Satisfied (Level 5)")
                                : getAverageComplaintSatisfaction() >= 3.5
                                ? t("ระดับ: มาก (ระดับ 4)", "Rating: Satisfied (Level 4)")
                                : getAverageComplaintSatisfaction() >= 2.5
                                ? t("ระดับ: ปานกลาง (ระดับ 3)", "Rating: Neutral (Level 3)")
                                : getAverageComplaintSatisfaction() >= 1.5
                                ? t("ระดับ: น้อย (ระดับ 2)", "Rating: Dissatisfied (Level 2)")
                                : getAverageComplaintSatisfaction() > 0
                                ? t("ระดับ: น้อยที่สุด (ระดับ 1)", "Rating: Strongly Dissatisfied (Level 1)")
                                : t("ไม่มีประเมินเรื่องร้องเรียนเข้าสู่ระบบ", "No ratings submitted")}
                            </div>
                          </div>
                        </div>

                        {/* Preferred complaint channels chart */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 md:col-span-4 flex flex-col justify-between">
                          <div className="border-b border-slate-50 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {t("ช่องทางการร้องเรียนหลักที่เลือกใช้ประเมิน (Channels Chosen)", "Preferred Communication Channels (Q19.3 Channels)")}
                            </h4>
                          </div>
                          <div className="h-32">
                            {complaintChannelsStats().length === 0 ? (
                              <div className="text-center text-slate-350 text-xs py-8">
                                {t("ไม่มีประวัติผู้ร้องเรียนผ่านช่องทาง", "No channels data available")}
                              </div>
                            ) : (
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={complaintChannelsStats()}>
                                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#f1f5f9" />
                                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} />
                                  <YAxis stroke="#94a3b8" fontSize={8} tickLine={false} />
                                  <Tooltip contentStyle={{ fontSize: 9, borderRadius: 6 }} />
                                  <Bar dataKey="value" fill="#f97316" radius={[2, 2, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        </div>

                        {/* Love & Loyalty Metrics Q19 progress bars */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 md:col-span-6">
                          <div className="border-b border-slate-50 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {t("ความผูกพันและปรารถนาดีต่อมหาวิทยาลัย (Institutional Loyalty & Bond Score)", "Love & Loyalty Metrics Averages (Q20)")}
                            </h4>
                          </div>
                          <div className="space-y-4 py-2">
                            {getLoyaltyAverages().map((item, idx) => {
                              const percentage = (item.average / 5) * 100;
                              return (
                                <div key={idx} className="space-y-1">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-semibold text-slate-700">{item.name}</span>
                                    <span className="font-black text-[#f97316] font-mono text-sm leading-none">
                                      {item.average.toFixed(2)} / 5.00
                                    </span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-[#f97316] h-full rounded-full transition-all duration-350"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-[10px] text-right font-bold text-slate-400">
                                    {item.average >= 4.5
                                      ? t("ระดับความคิดเห็น: มากที่สุด (Strongly Agree)", "Strongly Agree")
                                      : item.average >= 3.5
                                      ? t("ระดับความคิดเห็น: มาก (Agree)", "Agree")
                                      : item.average >= 2.5
                                      ? t("ระดับความคิดเห็น: ปานกลาง (Neutral)", "Neutral")
                                      : item.average >= 1.5
                                      ? t("ระดับความคิดเห็น: น้อย (Disagree)", "Disagree")
                                      : item.average > 0
                                      ? t("ระดับความคิดเห็น: น้อยที่สุด (Strongly Disagree)", "Strongly Disagree")
                                      : "-"}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Q20 Strategic growth and improvements suggestions progress bars */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 md:col-span-6 flex flex-col">
                          <div className="border-b border-slate-55 pb-2">
                            <h4 className="text-xs font-extrabold text-slate-800">
                              {t("ประเด็นที่เสนอแนะเพื่อพัฒนาสถาบันสูงสุด (Primary Improvement Requests)", "Top Strategic Growth & Improvement Suggestions (Q21)")}
                            </h4>
                          </div>
                          <div className="flex-1 max-h-72 overflow-y-auto pr-2 space-y-3 mt-1 text-xs">
                            {improvementSuggestionsStats().length === 0 ? (
                              <div className="text-center text-slate-350 text-xs py-12">
                                {t("ไม่มีข้อความเสนอแนะจากนักกลุ่มวิเคราะห์นี้", "No improvement proposals yet")}
                              </div>
                            ) : (
                              improvementSuggestionsStats().map((item, idx) => {
                                const total = activeResponses.length || 1;
                                const percentage = Math.round((item.value / total) * 100);
                                return (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex justify-between text-slate-700 font-semibold">
                                      <span className="truncate max-w-[80%]" title={item.name}>{item.name}</span>
                                      <span className="font-mono text-slate-550 shrink-0 font-bold">{item.value} {t("คน", "people")} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                </>
              )}
            </div>
          )}

          {/* Tab: QUESTIONS CRUD LISTING */}
          {activeTab === "questions" && (
            <div className="space-y-6">
              
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-850">
                    {t("รายการและข้อประเมินความพึงพอใจ Part 1", "Manage Part 1 Question Index")}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {t(
                      "ผู้ส่งสามารถแก้ไข ถอนออก หรือเพิ่มหัวข้อคำถามที่จะไปปรากฏในแบบฟอร์มประเมินของนักศึกษาได้แบบ Real-time",
                      "Changes synchronize of student forms dynamically. Defaults seeded automatically."
                    )}
                  </p>
                </div>
                <button
                  onClick={handleAddQuestionClick}
                  id="add-question-btn"
                  className="px-4 py-2 bg-[#f97316] hover:bg-orange-600 text-white font-bold text-xs rounded-lg cursor-pointer transition shadow flex items-center gap-1.5 self-start"
                >
                  <Plus className="w-4 h-4" />
                  {t("เพิ่มข้อคำถาม (New Question)", "Add Question")}
                </button>
              </div>

              {/* Editing Form Modal Card Overlay */}
              {isEditing && selectedQuestion && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 bg-slate-900 text-white rounded-xl shadow-xl space-y-4 border border-slate-800"
                >
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h4 className="text-xs font-extrabold flex items-center gap-1.5 uppercase text-orange-400">
                      <Sparkles className="w-4 h-4 text-[#f97316]" />
                      {selectedQuestion.id ? t("แก้ไขข้อคำถามประเมิน", "Edit Question Details") : t("เพิ่มข้อคำถามใหม่เข้ารายวิจัย", "Add New Question")}
                    </h4>
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setSelectedQuestion(null); }}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      {t("ยกเลิก", "Cancel")}
                    </button>
                  </div>

                  <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Order Input */}
                      <div className="space-y-1">
                        <label className="text-slate-400 block font-bold">{t("รหัสลำดับการแสดงผล (Sort Order)", "Order")}</label>
                        <input
                          type="number"
                          required
                          value={selectedQuestion.order || ""}
                          onChange={(e) => setSelectedQuestion({ ...selectedQuestion, order: Number(e.target.value) })}
                          className="w-full p-2.5 bg-slate-800 rounded border border-slate-700 outline-none text-white text-xs"
                        />
                      </div>

                      {/* Aspect selector */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-slate-400 block font-bold">{t("คณะฝ่ายที่ประเมิน (Evaluation Aspect)", "Aspect")}</label>
                        <select
                          value={selectedQuestion.aspectTh}
                          onChange={(e) => {
                            const val = e.target.value;
                            const tLabel = val === "ด้านการจัดการศึกษา" ? "Educational Management" : val === "ด้านการบริการนักศึกษา" ? "Student Support Services" : "Facilities and Infrastructure";
                            setSelectedQuestion({ ...selectedQuestion, aspectTh: val, aspectEn: tLabel });
                          }}
                          className="w-full p-2.5 bg-slate-800 rounded border border-slate-700 outline-none text-white text-xs"
                        >
                          <option value="ด้านการจัดการศึกษา">ด้านการจัดการศึกษา (Educational Management)</option>
                          <option value="ด้านการบริการนักศึกษา">ด้านการบริการนักศึกษา (Student Support Services)</option>
                          <option value="ด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้">ด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้ (Facilities)</option>
                        </select>
                      </div>
                    </div>

                    {/* Question text TH */}
                    <div className="space-y-1">
                      <label className="text-slate-400 block font-bold">{t("หัวข้อคำถาม (ภาษาไทย)*", "Question Text (Thai)*")}</label>
                      <input
                        type="text"
                        required
                        value={selectedQuestion.textTh || ""}
                        onChange={(e) => setSelectedQuestion({ ...selectedQuestion, textTh: e.target.value })}
                        className="w-full p-2.5 bg-slate-800 rounded border border-slate-700 outline-none text-white text-xs"
                        placeholder="กรอกคำถามภาษาไทย..."
                      />
                    </div>

                    {/* Question text EN */}
                    <div className="space-y-1">
                      <label className="text-slate-400 block font-bold">{t("หัวข้อคำถาม (English)*", "Question Text (English)*")}</label>
                      <input
                        type="text"
                        required
                        value={selectedQuestion.textEn || ""}
                        onChange={(e) => setSelectedQuestion({ ...selectedQuestion, textEn: e.target.value })}
                        className="w-full p-2.5 bg-slate-800 rounded border border-slate-700 outline-none text-white text-xs"
                        placeholder="Enter English statement..."
                      />
                    </div>

                    {/* Details TH */}
                    <div className="space-y-1">
                      <label className="text-slate-400 block font-bold">{t("รายละเอียดคำอธิบายอย่างง่าย (ภาษาไทย)", "Context Description (Thai)")}</label>
                      <textarea
                        rows={2}
                        value={selectedQuestion.descriptionTh || ""}
                        onChange={(e) => setSelectedQuestion({ ...selectedQuestion, descriptionTh: e.target.value })}
                        className="w-full p-2.5 bg-slate-800 rounded border border-slate-700 outline-none text-white text-xs"
                        placeholder="คำรายละเอียดอธิบายความปลอดภัย การวางแผนหลักสูตร..."
                      />
                    </div>

                    {/* Details EN */}
                    <div className="space-y-1">
                      <label className="text-slate-400 block font-bold">{t("รายละเอียดคำอธิบายอย่างง่าย (English)", "Context Description (English)")}</label>
                      <textarea
                        rows={2}
                        value={selectedQuestion.descriptionEn || ""}
                        onChange={(e) => setSelectedQuestion({ ...selectedQuestion, descriptionEn: e.target.value })}
                        className="w-full p-2.5 bg-slate-800 rounded border border-slate-700 outline-none text-white text-xs"
                        placeholder="Context info concerning security, labs, e-books details..."
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => { setIsEditing(false); setSelectedQuestion(null); }}
                        className="py-2 px-4 rounded bg-slate-800 hover:bg-slate-700 font-semibold"
                      >
                        {t("ยกเลิก", "Cancel")}
                      </button>
                      <button
                        type="submit"
                        disabled={savingQuestion}
                        className="py-2 px-5 rounded bg-[#f97316] hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold flex items-center gap-1.5"
                      >
                        {savingQuestion ? (
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          t("บันทึกคำถาม", "Apply changes")
                        )}
                      </button>
                    </div>

                  </form>
                </motion.div>
              )}

              {/* LISTING CONTAINER */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
                {questions.map((q) => (
                  <div key={q.id} className="p-4 flex items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="min-w-6 px-1.5 h-6 rounded bg-slate-100 flex items-center justify-center font-mono font-black text-slate-800 text-xs">
                          {q.orderLabel || q.order}
                        </span>
                        <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-700 font-mono text-[9px] font-bold rounded">
                          {t(q.aspectTh, q.aspectEn)}
                        </span>
                      </div>
                      {q.groupTitleTh && (
                        <div className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{t(q.groupTitleTh, q.groupTitleEn || q.groupTitleTh)}</span>
                        </div>
                      )}
                      <p className="font-bold text-slate-850 pt-1 leading-normal">
                        🇹🇭 {q.textTh}
                      </p>
                      <p className="font-semibold text-slate-500 leading-normal font-mono">
                        🇬🇧 {q.textEn}
                      </p>
                      {(q.descriptionTh || q.descriptionEn) && (
                        <p className="text-[10px] text-slate-400 italic max-w-xl pl-4 border-l border-orange-200 mt-1">
                          {t(q.descriptionTh || "", q.descriptionEn || "")}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-none items-center gap-1.5">
                      <button
                        onClick={() => handleEditQuestionClick(q)}
                        id={`edit-question-${q.id}`}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-lg cursor-pointer transition shadow-sm"
                        title={t("แก้ไขข้อมูล", "Edit")}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        id={`delete-question-${q.id}`}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer transition shadow-sm"
                        title={t("ลบข้อมูล", "Delete")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: SETTINGS & SMTP EMAIL ALERTS GUIDE */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              
              {/* Seeding Dynamic Admins simulation */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                    {t("🔒 บัญชีผู้ดูแลระบบสถาบันเสริม (Authorized Administrative Officers)", "Assign Additional Q.A. Officer")}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    {t(
                      "แต่งตั้งผู้ดูแลระบบเพิ่ม โดยระบุที่อยู่อีเมลเพื่ออนุญาตให้เข้าดูแดชบอร์ดและประเมินผลคำถาม",
                      "Standard secure logins are constrained. Enter email to add secondary administrators."
                    )}
                  </p>
                </div>
                <form onSubmit={handleRegisterAdmin} className="flex gap-2 text-xs">
                  <input
                    type="email"
                    required
                    placeholder="e.g. associate@bu.ac.th"
                    value={adminRegisterEmail}
                    onChange={(e) => setAdminRegisterEmail(e.target.value)}
                    id="admin-email-input"
                    className="flex-1 p-2 rounded border border-slate-200 focus:outline-none max-w-sm"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-bold cursor-pointer transition text-xxs"
                  >
                    + {t("มอบอำนาจ", "Assign Role")}
                  </button>
                </form>
              </div>

              {/* SMTP Email Alerts Google Apps Script section  */}
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-orange-700">
                  <Mail className="w-5 h-5 flex-none text-[#f97316]" />
                  <h4 className="text-xs font-extrabold text-slate-850 uppercase tracking-wider">
                    {t("📨 ระบบแจ้งเตือนทางอีเมลอัตโนมัติด้วย Google Apps Script (SMTP Integration)", "Serverless Email Alerts with Gmail SMTP")}
                  </h4>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed space-y-3 p-4 bg-orange-50/50 rounded-xl border border-orange-150">
                  <p>
                    {t(
                      "📌 เนื่องจากนโยบายรักษาความปลอดภัยและนวัตกรรมการให้บริการสถาบัน คณะผู้สร้างจำกัดการใช้ Google Cloud Run หมาด โดยท่านสามารถตั้งค่าการส่งอีเมลแจ้งรายงานสำคัญ (เช่นมีนักศึกษาทำแบบสำรวจเข้ามาใหม่) ได้แบบ ฟรี 100% ผ่านบริการ Google Apps Script!",
                      "📌 As Google Cloud Run hosting is restricted in our build workspace, you can easily integrate instant alert email dispatches for completely free using Google Apps Script under your Bangkok University domain workspace!"
                    )}
                  </p>
                  <p className="font-bold">
                    {t("ขั้นตอนการติตตั้งใช้งานง่ายๆ ใน 2 นาที:", "Quick 2-minute Deployment Instructions:")}
                  </p>
                  <ul className="list-decimal pl-5 space-y-1.5 text-xxs sm:text-xs">
                    <li>{t("เปิดเว็บบราวเซอร์และเข้าไปที่ script.google.com ด้วยบัญชี @bu.ac.th ของท่าน", "Sign-in to script.google.com using your @bu.ac.th Google credentials")}</li>
                    <li>{t("กดปุ่ม 'New Project' และ คัดลอก Code กล่องรหัสคำสั่งด้านล่าง ลงในบทเขียนสคริปต์", "Press 'New Project' and replace all initial editor template code with the code block below")}</li>
                    <li>{t("กดปุ่ม 'Deploy' &gt; เลือกประเภท 'Web App' &gt; ตั้งค่าสิทธิ์การเข้าถึงเป็น 'Anyone' (เพื่อยอมรับ Webhook)", "Click Deploy &gt; Choose New Deployment &gt; Select 'Web App' type &gt; Change Access scope to 'Anyone'")}</li>
                    <li>{t("คัดลอก 'Web App URL' ที่ได้ และนำไปผูกใน Cloud Webhook เพื่อยิงระบบแจ้งลอนทันที!", "Copy the generated 'Web App URL' for instant webhook alerting integration!")}</li>
                  </ul>
                </div>

                {/* COPYABLE GAS EDITOR */}
                <div className="relative font-mono text-[10px] bg-slate-900 text-slate-350 p-4 rounded-xl shadow-inner max-h-72 overflow-y-auto">
                  <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded bg-slate-800 text-[8px] text-[#f97316] font-bold uppercase tracking-wider select-none">
                    Google Apps Script
                  </span>
                  <pre className="whitespace-pre-wrap">{googleAppsScriptCode}</pre>
                </div>
              </div>

              {/* DANGEROUS SYSTEM PURGE PANEL */}
              <div className="bg-rose-50 p-5 rounded-xl border border-rose-100 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-800">
                  <AlertTriangle className="w-5 h-5 flex-none" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wide">
                    {t("🚨 พื้นที่เสี่ยงอันตราย (Dangerous Prune Operations)", "Administrative Prune Space")}
                  </h4>
                </div>
                <p className="text-xs text-rose-700/80 leading-normal">
                  {t(
                    "ปุ่มคำสั่งนี้จะทำลายสารบัญและข้อมูลการประเมินนักศึกษาทั้งหมดในระบบ เป็นกระบวนการที่แอดมินใช้เตรียมเริ่มวงรอบปีการศึกษาใหม่ถัดไป",
                    "This operation permanently forces purging all responses inside Firestore. Only execute under quality circle compliance."
                  )}
                </p>
                <button
                  onClick={handleClearAll}
                  disabled={purging}
                  id="purge-responses-btn"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-black text-xs rounded-lg cursor-pointer transition shadow"
                >
                  {purging ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    t("ล้างข้อมูลการตอบกลับทั้งหมด (Purge Database)", "Purge all student responses")
                  )}
                </button>
              </div>

            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
