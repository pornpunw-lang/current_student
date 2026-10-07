/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useLanguage } from "./LanguageContext";
import { auth, googleProvider, signInWithPopup, isMockFirebase } from "../firebaseConfig";
import { checkIsAdmin } from "../dbService";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  Lock,
  LogIn,
  AlertCircle,
  X,
  UserCheck,
  Building,
  KeyRound,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any, isAdmin: boolean) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customEmail, setCustomEmail] = useState("");

  if (!isOpen) return null;

  // Sign in via Google Auth
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);

    if (isMockFirebase || !auth) {
      // Mock mode fallback
      handleDirectSignIn("pornpun.w@bu.ac.th");
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const email = user.email || "";

      const isAdminUser = await checkIsAdmin(email, user.uid);
      if (!isAdminUser) {
        await auth.signOut();
        setErrorMessage(
          t(
            "อีเมลนี้ไม่ได้รับสิทธิ์ผู้ดูแลระบบ (เฉพาะเจ้าหน้าที่สำนักประกันคุณภาพ/วิจัยสถาบันเท่านั้น)",
            "This Google account is not recognized as an authorized Administrator."
          )
        );
        return;
      }

      onAuthSuccess(user, true);
      onClose();
    } catch (error: any) {
      console.error("Admin sign-in error", error);
      setErrorMessage(error.message || "Google Authentication Failed");
    } finally {
      setLoading(false);
    }
  };

  // Direct / Simulation Admin Sign In
  const handleDirectSignIn = async (email: string) => {
    const cleanedEmail = email.trim().toLowerCase();
    if (!cleanedEmail) {
      setErrorMessage(t("กรุณาระบุอีเมลผู้ดูแลระบบ", "Please enter admin email"));
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const mockUid = "admin_uid_" + Math.random().toString(36).substring(3, 9);
      const isAllowed = await checkIsAdmin(cleanedEmail, mockUid);

      if (!isAllowed) {
        setErrorMessage(
          t(
            "อีเมลนี้ไม่ได้รับสิทธิ์ผู้ดูแลระบบ กรุณาตรวจสอบอีเมลหรือติดต่อผู้ดูแลระบบ",
            "This email is not authorized as an administrator."
          )
        );
        setLoading(false);
        return;
      }

      const adminUser = {
        uid: mockUid,
        email: cleanedEmail,
        displayName: cleanedEmail.split("@")[0].toUpperCase() + " (ADMIN)",
        photoURL: null,
        emailVerified: true,
      };

      onAuthSuccess(adminUser, true);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Admin authorization check failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="bg-[#1e293b] px-6 py-5 text-white flex justify-between items-start border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold tracking-wider uppercase border border-amber-400/20">
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  {t("ส่วนเฉพาะผู้ดูแลระบบ", "Admin Portal Only")}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-1">
                  {t("เข้าสู่ระบบบริหารแบบวิจัยสถาบัน", "Institutional Research Admin Login")}
                </h3>
                <p className="text-xs text-slate-400">
                  {t("มหาวิทยาลัยกรุงเทพ (Bangkok University)", "Bangkok University")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* Warning info */}
            <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="leading-relaxed">
                <p className="font-bold">
                  {t("พื้นที่เฉพาะสำหรับเจ้าหน้าที่และผู้บริหาร", "Restricted Area for Staff & Admins")}
                </p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  {t(
                    "หน้านี้ใช้สำหรับเข้าดูแดชบอร์ดสถิติ 5 ส่วน, จัดการคำถาม และ Export ข้อมูล สำหรับนักศึกษาทั่วไปกรุณากลับไปทำแบบสอบถามในหน้าหลัก",
                    "For Quality Assurance officers and Institutional Research teams to inspect dashboards, configure questions, and export reports."
                  )}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
                <div>
                  <p className="font-bold">{t("การเข้าสู่ระบบไม่สำเร็จ", "Access Denied")}</p>
                  <p className="text-[11px] mt-0.5">{errorMessage}</p>
                </div>
              </motion.div>
            )}

            {/* Google Sign In Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 px-4 bg-[#1e293b] hover:bg-slate-900 active:scale-98 disabled:bg-slate-400 text-white font-semibold text-sm rounded-xl cursor-pointer transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-orange-400" />
                    <span>
                      {isMockFirebase
                        ? t("เข้าสู่ระบบแอดมิน (บัญชีทดสอบด่วน)", "Fast Admin Access (Test Mode)")
                        : t("ลงชื่อเข้าใช้ด้วย Google (@bu.ac.th)", "Sign In with BU Google Account")}
                    </span>
                  </>
                )}
              </button>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                {t("หรือระบุอีเมลผู้ดูแลระบบ", "Or authorized email")}
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Manual Admin Email Entry */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                {t("อีเมลผู้ดูแลระบบ (Admin Email):", "Admin Email:")}
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="pornpun.w@bu.ac.th"
                  className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-800 text-slate-800 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => handleDirectSignIn(customEmail)}
                  disabled={loading || !customEmail.trim()}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                >
                  {t("ยืนยัน", "Verify")}
                </button>
              </div>
            </div>

            {/* Quick Test Admins Buttons */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500 mb-2">
                {t("บัญชีผู้ดูแลระบบที่ได้รับอนุญาตในระบบ:", "Registered Authorized Admin Accounts:")}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleDirectSignIn("pornpun.w@bu.ac.th")}
                  className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#ea580c] text-[11px] font-semibold rounded-lg cursor-pointer transition flex items-center gap-1.5"
                >
                  <KeyRound className="w-3 h-3" />
                  pornpun.w@bu.ac.th
                </button>
                <button
                  type="button"
                  onClick={() => handleDirectSignIn("research@bu.ac.th")}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-medium rounded-lg cursor-pointer transition flex items-center gap-1.5"
                >
                  <KeyRound className="w-3 h-3 text-slate-400" />
                  research@bu.ac.th
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <span className="text-[11px] text-slate-400">
              {t("สำนักวิจัยสถาบัน มหาวิทยาลัยกรุงเทพ", "Institutional Research, BU")}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition"
            >
              {t("กลับสู่หน้าแบบสอบถามนักศึกษา", "Back to Student Survey")}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
