/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  HelpCircle,
  X,
  Languages,
  UserCheck
} from "lucide-react";

interface StudentWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail?: string;
  onEmailChange?: (email: string) => void;
  onOpenAdmin: () => void;
}

export const StudentWelcomeModal: React.FC<StudentWelcomeModalProps> = ({
  isOpen,
  onClose,
  onOpenAdmin,
}) => {
  const { lang, setLang, t } = useLanguage();

  if (!isOpen) return null;

  const handleStartSurvey = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-900/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-150 overflow-hidden my-auto"
        >
          {/* Header decorative banner */}
          <div className="relative bg-gradient-to-r from-slate-900 via-[#1e293b] to-slate-900 px-6 pt-6 pb-5 text-white overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute -top-10 -right-10 w-44 h-44 bg-orange-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-[#f97316] flex items-center justify-center text-white shadow-lg ring-4 ring-white/10 shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[11px] font-semibold tracking-wide border border-orange-400/30">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                    {t("ยินดีต้อนรับนักศึกษา มหาวิทยาลัยกรุงเทพ", "Welcome Bangkok University Students")}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
                    {t("แบบประเมินความพึงพอใจต่อการจัดการศึกษา", "Student Perspectives Questionnaire")}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {t("ปีการศึกษา 2568 (Academic Year 2025)", "Academic Year 2025")}
                  </p>
                </div>
              </div>

              {/* Close & Language toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLang(lang === "th" ? "en" : "th")}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors"
                >
                  <Languages className="w-3.5 h-3.5 text-orange-400" />
                  {lang === "th" ? "EN" : "TH"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Welcome statement */}
            <div className="bg-orange-50/70 border border-orange-200/60 rounded-2xl p-4.5 space-y-2">
              <div className="flex items-center gap-2 text-orange-950 font-bold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
                {t(
                  "สวัสดีนักศึกษามหาวิทยาลัยกรุงเทพทุกท่าน",
                  "Warm Welcome to all Bangkok University Students"
                )}
              </div>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                {t(
                  "มหาวิทยาลัยกรุงเทพขอขอบพระคุณในความร่วมมือในการตอบแบบประเมินชุดนี้ ความคิดเห็นและข้อเสนอแนะอันมีค่าของท่านจะถูกนำไปใช้โดยตรงในการยกระดับและพัฒนาคุณภาพการเรียนการสอน การให้บริการ สิ่งสนับสนุนการเรียนรู้ และสิ่งอำนวยความสะดวกในทุกมิติ",
                  "Bangkok University appreciates your participation. Your constructive feedback will be used to continually elevate educational management, student support, facilities, and academic infrastructure."
                )}
              </p>
            </div>

            {/* 5 Parts Summary */}
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#f97316]" />
                {t("โครงสร้างแบบประเมิน (ครอบคลุม 5 ส่วน)", "Survey Structure (5 Parts)")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {t("ข้อมูลทั่วไป", "Demographics")}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t("คณะและสาขาวิชาของนักศึกษา", "Faculty and Major")}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {t("การจัดการศึกษา & บริการนักศึกษา", "Educational Management & Services")}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t("ข้อที่ 1 - 7 (หลักสูตร, การสอน, อัตลักษณ์ ม.กรุงเทพ 3.1-3.4, การบริการ)", "Questions 1 - 7 (Curriculum, Teaching, Identity, Services)")}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {t("สิ่งอำนวยความสะดวก & สนับสนุน", "Facilities & Infrastructure")}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t("ข้อที่ 8 - 15 (ห้องเรียน, Lab, คอมพิวเตอร์, WiFi, บรรยากาศ)", "Questions 8 - 15 (Classrooms, Labs, WiFi, Facilities)")}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {t("การรับทราบข้อมูลข่าวสาร", "Information & Communication")}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t("ข้อที่ 16 - 18 (ช่องทางข่าวสาร, การบอกต่อ, สิ่งที่ประชาสัมพันธ์)", "Questions 16 - 18 (Info Channels, Recommend, Publicity)")}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 flex items-start gap-2.5 sm:col-span-2">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    5
                  </span>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {t("ความคิดเห็น ข้อร้องเรียน & ข้อเสนอแนะ", "Complaints & Suggestions")}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {t("ข้อที่ 19 - 21 (ข้อร้องเรียน, ความผูกพันต่อมหาวิทยาลัย, ข้อเสนอแนะพัฒนา)", "Questions 19 - 21 (Complaints, Loyalty, Improvement)")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & PDPA Guarantee */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-start gap-3 text-emerald-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">
                  {t("การรักษาความลับและความเป็นส่วนตัว (Confidentiality Guaranteed)", "Confidentiality Guaranteed")}
                </p>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  {t(
                    "การตอบแบบประเมินนี้ไม่มีผลกระทบต่อผลการเรียน ข้อมูลจะได้รับการประมวลผลเป็นภาพรวมเชิงสถิติเพื่อการประกันคุณภาพการศึกษาและการวิจัยสถาบันเท่านั้น",
                    "Responses will be analyzed anonymously in aggregate for institutional research and quality assurance without affecting academic records."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer / CTAs */}
          <div className="p-5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Dedicated Admin Portal Link */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1.5 cursor-pointer transition-colors py-1 px-2 rounded-lg hover:bg-slate-200/60"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>{t("สำหรับผู้ดูแลระบบ (Admin Only)", "Admin Portal (Admin Only)")}</span>
            </button>

            {/* Start Survey CTA */}
            <button
              type="button"
              onClick={handleStartSurvey}
              className="w-full sm:w-auto px-6 py-3 bg-[#f97316] hover:bg-orange-600 active:scale-98 text-white font-bold text-sm rounded-xl cursor-pointer transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>{t("เริ่มตอบแบบสอบถาม", "Start Survey Now")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
