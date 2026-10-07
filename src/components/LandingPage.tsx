/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { auth, googleProvider, signInWithPopup, isMockFirebase } from "../firebaseConfig";
import { checkIsAdmin, registerAdmin } from "../dbService";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, LogIn, ChevronRight, GraduationCap, ShieldCheck, Languages, AlertCircle } from "lucide-react";

interface LandingPageProps {
  onAuthSuccess: (user: any, isAdmin: boolean) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onAuthSuccess }) => {
  const { lang, setLang, t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showMockModal, setShowMockModal] = useState(false);
  const [mockEmailInput, setMockEmailInput] = useState("");

  // MOCK Auth for Testing / Standalone evaluations when Firebase hasn't been provisioned
  const handleMockSignIn = async (email: string) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const mockUser = {
        uid: "mock_user_" + Math.random().toString(36).substring(3, 9),
        email: email,
        displayName: email.split("@")[0].toUpperCase(),
        photoURL: null,
        emailVerified: true
      };

      const isAdminUser = await checkIsAdmin(email, mockUser.uid);
      if (selectedRole === "admin" && !isAdminUser) {
        setErrorMessage(t(
          "อีเมลนี้ไม่ได้รับสิทธิ์ผู้ดูแลระบบ (This email does not have admin privileges.)",
          "This email does not have administrator privileges."
        ));
        setLoading(false);
        return;
      }

      if (selectedRole === "student" && !email.toLowerCase().endsWith("@bu.ac.th")) {
        setErrorMessage(t(
          "เฉพาะอีเมลโดเมน @bu.ac.th เท่านั้นที่สามารถเข้าร่วมทำแบบสอบถามนี้ (Only @bu.ac.th emails are allowed.)",
          "Only @bu.ac.th domain emails are permitted to do this survey."
        ));
        setLoading(false);
        return;
      }

      onAuthSuccess(mockUser, isAdminUser);
    } catch (e: any) {
      setErrorMessage(e.message || "Sign-in error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isMockFirebase || !auth) {
      // In Mock mode, open our custom simulation modal instead of window.prompt which gets blocked by the browser in iframes
      setMockEmailInput(selectedRole === "admin" ? "pornpun.w@bu.ac.th" : "student@bu.ac.th");
      setShowMockModal(true);
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email || "";

      const isAdminUser = await checkIsAdmin(email, user.uid);

      if (selectedRole === "admin") {
        if (!isAdminUser) {
          await auth.signOut();
          setErrorMessage(t(
            "บัญชีนี้ไม่ใช่ผู้ดูแลระบบที่ได้รับการอนุญาต (This account is not an authorized administrator.)",
            "This account is not an authorized administrator."
          ));
          return;
        }
      } else {
        // Enforce @bu.ac.th restriction for students
        const isBUEmail = email.toLowerCase().endsWith("@bu.ac.th");
        if (!isBUEmail) {
          await auth.signOut();
          setErrorMessage(t(
            "ระบบจำกัดสิทธิ์เฉพาะบัญชี @bu.ac.th เท่านั้น เพื่อความน่าเชื่อถือของผลงานวิจัย (Access restricted to @bu.ac.th accounts only.)",
            "Access is strictly restricted to Bangkok University (@bu.ac.th) Google accounts."
          ));
          return;
        }
      }

      onAuthSuccess(user, isAdminUser);
    } catch (error: any) {
      console.error("Sign-in popup error", error);
      setErrorMessage(error.message || "Google Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-sans transition-colors duration-300">
      
      {/* Background visual graphics */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] rounded-full bg-orange-500 blur-3xl"></div>
        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] rounded-full bg-slate-800 blur-3xl"></div>
      </div>

      <div className="w-full max-w-xl glass-panel rounded-2xl shadow-xl overflow-hidden relative z-10">
        
        {/* Header Ribbon / Language Toggle */}
        <div className="px-6 pt-5 pb-3 flex justify-between items-center border-b border-slate-200/80">
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {t("ปีการศึกษา 2568", "Academic Year 2024")}
          </div>
          <button
            onClick={() => setLang(lang === "th" ? "en" : "th")}
            id="lang-btn"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full cursor-pointer transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-[#f97316]" />
            {lang === "th" ? "English" : "ไทย"}
          </button>
        </div>

        {/* Brand Information Area */}
        <div className="p-6 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 border-4 border-orange-100 text-[#f97316] mb-4 shadow-sm">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug">
            {t(
              "แบบสำรวจข้อมูลความคิดเห็นต่อการจัดการศึกษา",
              "Student Perspectives Questionnaire"
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
            {t(
              "มหาวิทยาลัยกรุงเทพ (Bangkok University) เพื่อยกระดับและพัฒนาคุณภาพการเรียนการสอนให้มีประสิทธิภาพสูงสุด",
              "Aiming to elevate and assure standards of education management at Bangkok University."
            )}
          </p>
        </div>

        {/* Roles Select tab */}
        <div className="px-6 pb-2">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => { setSelectedRole("student"); setErrorMessage(null); }}
              id="role-student-btn"
              className={`py-2 text-sm font-semibold rounded-md transition ${
                selectedRole === "student"
                  ? "bg-white text-[#f97316] shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-700 font-medium"
              }`}
            >
              {t("👨‍🎓 นักศึกษา (Student)", "👨‍🎓 BU student")}
            </button>
            <button
              onClick={() => { setSelectedRole("admin"); setErrorMessage(null); }}
              id="role-admin-btn"
              className={`py-2 text-sm font-semibold rounded-md transition ${
                selectedRole === "admin"
                  ? "bg-white text-[#f97316] shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-700 font-medium"
              }`}
            >
              {t("🔒 ผู้ดูแลระบบ (Admin)", "🔒 Bureau Admin")}
            </button>
          </div>
        </div>

        {/* Security Warning Notice */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-none" />
            <div>
              <p className="font-bold">{t("การเข้าสู่ระบบถูกปฏิเสธ", "Sign-in Denied")}</p>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Bottom Panel Description and Auth CTA */}
        <div className="p-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 space-y-2.5">
            {selectedRole === "student" ? (
              <>
                <div className="flex items-center gap-2 text-orange-700 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  {t("ข้อแนะนำและขอบเขตสิทธิ์", "Verification standard")}
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  {t(
                    "นักศึกษาจะต้องล็อกอินด้วยบัญชี @bu.ac.th เท่านั้น เพื่อป้องกันการสวมสิทธิ์และยืนยันสถานะการประเมิน ผลการประเมินจะได้รับการรักษาความเป็นส่วนตัวอย่างปลอดภัยสูงสุด",
                    "A valid Bangkok University Google account ending with @bu.ac.th is strictly required to verify eligibility. Your responses are anonymized."
                  )}
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  {t("ทางเข้าสิทธิ์ดูแลระบบ", "Admin authentication")}
                </div>
                <p className="text-xs text-slate-500 leading-normal">
                  {t(
                    "สำหรับเจ้าหน้าที่สำนักประกันคุณภาพผู้ดูแลคำถามและสถิติเท่านั้น บุคคลภายนอกไม่สามารถเข้าถึงฐานข้อมูลดิบนี้ได้",
                    "Restricted to verified educational quality assurance bureau officers. Raw student data export, dynamic question edits, and collection purging actions allowed."
                  )}
                </p>
              </>
            )}
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            id="google-signin-btn"
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 bg-[#1e293b] hover:bg-slate-900 disabled:bg-slate-400 text-white font-semibold text-sm rounded-xl cursor-pointer transition-all shadow-md hover:shadow-lg focus:outline-none"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                {isMockFirebase ? (
                  <span>{t("ลงชื่อเข้าใช้ด้วยบัญชีทดสอบ", "Sign-in with Simulation Account")}</span>
                ) : (
                  <span>{t("ลงชื่อเข้าใช้ด้วย Google สำหรับ BU", "Sign-in with Google Account")}</span>
                )}
              </>
            )}
          </button>

          {isMockFirebase && (
            <p className="text-[10px] text-center text-orange-600 font-medium italic">
              {t(
                "⚠️ หมายเหตุ: ขณะนี้แอปทำงานในระบบจำลอง (Simulation Mode) เนื่องจากยังไม่ได้เปิดใช้งาน Firebase กรุณากดปุ่มเพื่อสวมสิทธิ์ทดสอบ",
                "⚠️ Note: Firebase is operating in Simulation Mode. Feel free to use test emails to bypass permissions."
              )}
            </p>
          )}

          <div className="text-xxs sm:text-xs text-center text-slate-400 font-medium">
            {t("สนับสนุนสอดคล้องตามเกณฑ์ อว. และประกันคุณภาพสถาบัน", "Aligned with MHESI standards & institutional QA guarantee.")}
          </div>
        </div>

      </div>

      {/* Simulation/Mock Login Custom Modal Dialog to circumvent window.prompt iframe blocks */}
      <AnimatePresence>
        {showMockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative"
            >
              <div className="p-6 space-y-4">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse"></span>
                    {t("จำลองการลงชื่อเข้าใช้งานสำหรับทดสอบระบบ", "Simulation Test Accounts")}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowMockModal(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                  >
                    {t("ปิด", "Close")}
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-slate-500 leading-normal">
                    {t(
                      "เนื่องจากระบบอยู่ในโหมดจำลอง (Simulation Mode) คุณสามารถเลือกใช้อีเมลทดสอบบทบาทการใช้งานของทางสถาบันได้ทันที:",
                      "Since Firebase is currently running in Simulation Mode, you can bypass real logins by selecting or typing a test account:"
                    )}
                  </p>

                  <div className="grid grid-cols-1 gap-2 border-b border-slate-100 pb-3">
                    {selectedRole === "student" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setMockEmailInput("student@bu.ac.th");
                            handleMockSignIn("student@bu.ac.th");
                            setShowMockModal(false);
                          }}
                          className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50/20 transition text-xs flex justify-between items-center group cursor-pointer"
                        >
                          <div>
                            <p className="font-bold text-slate-800 group-hover:text-orange-950">student@bu.ac.th</p>
                            <p className="text-[10px] text-slate-400">{t("🎓 บทบาท: นักศึกษาทั่วไปสำหรับการทดสอบ", "🎓 Role: Student")}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#f97316]" />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setMockEmailInput("pornpun.w@bu.ac.th");
                            handleMockSignIn("pornpun.w@bu.ac.th");
                            setShowMockModal(false);
                          }}
                          className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50/20 transition text-xs flex justify-between items-center group cursor-pointer"
                        >
                          <div>
                            <p className="font-bold text-slate-800 group-hover:text-orange-950">pornpun.w@bu.ac.th</p>
                            <p className="text-[10px] text-slate-400">{t("🎓 บทบาท: นักศึกษา (ใช้อีเมลของคุณ)", "🎓 Role: Student (Your Personal Email)")}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#f97316]" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setMockEmailInput("pornpun.w@bu.ac.th");
                            handleMockSignIn("pornpun.w@bu.ac.th");
                            setShowMockModal(false);
                          }}
                          className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50/20 transition text-xs flex justify-between items-center group cursor-pointer"
                        >
                          <div>
                            <p className="font-bold text-slate-800 group-hover:text-orange-950">pornpun.w@bu.ac.th</p>
                            <p className="text-[10px] text-slate-400">{t("🔒 บทบาท: ผู้ดูแลระบบ (อีเมลของคุณ - ได้รับสิทธิ์เข้าถึง)", "🔒 Role: Admin (Your Email - Access Approved)")}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#f97316]" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setMockEmailInput("research@bu.ac.th");
                            handleMockSignIn("research@bu.ac.th");
                            setShowMockModal(false);
                          }}
                          className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-orange-500 hover:bg-orange-50/20 transition text-xs flex justify-between items-center group cursor-pointer"
                        >
                          <div>
                            <p className="font-bold text-slate-800 group-hover:text-orange-950">research@bu.ac.th</p>
                            <p className="text-[10px] text-slate-400">{t("🔒 บทบาท: ผู้ประสานงานสถิติหลักสูตร", "🔒 Role: Education Quality Officer")}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#f97316]" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="pt-1 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {t("หรือระบุอีเมลอื่น ๆ ด้วยตัวเองเพื่อทดสอบ:", "Or specify other email to test:")}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={mockEmailInput}
                        onChange={(e) => setMockEmailInput(e.target.value)}
                        placeholder="example@bu.ac.th"
                        id="custom-mock-email-input"
                        className="flex-1 p-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (mockEmailInput.trim()) {
                            handleMockSignIn(mockEmailInput.trim());
                            setShowMockModal(false);
                          }
                        }}
                        className="py-2 px-4 bg-[#f97316] hover:bg-orange-600 font-semibold text-white text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        {t("เข้าสู่ระบบ", "Sign In")}
                      </button>
                    </div>
                    {selectedRole === "student" && (
                      <p className="text-[10px] text-orange-600 font-medium italic">
                        * {t("กรุณาใช้ @bu.ac.th สำหรับการกรอกแบบประเมินในบทบาทนักศึกษา", "* Note: Please use @bu.ac.th suffix for students.")}
                      </p>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
