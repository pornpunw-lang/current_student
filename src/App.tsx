/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { LanguageProvider, useLanguage } from "./components/LanguageContext";
import { QuestionnaireForm } from "./components/QuestionnaireForm";
import { AdminDashboard } from "./components/AdminDashboard";
import { StudentWelcomeModal } from "./components/StudentWelcomeModal";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { fetchQuestions } from "./dbService";
import { auth, isMockFirebase } from "./firebaseConfig";
import { Question } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Loader2 } from "lucide-react";

function MainApp() {
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Student identification and modal state
  const [studentEmail, setStudentEmail] = useState<string>("student@bu.ac.th");
  const [showWelcomeModal, setShowWelcomeModal] = useState<boolean>(true);
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);

  // 1. Fetch dynamic questions from Firestore / Storage
  const loadSurveyQuestions = async () => {
    try {
      const list = await fetchQuestions();
      setQuestions(list);
    } catch (err) {
      console.error("Error loading questionnaire items: ", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    loadSurveyQuestions();
  }, []);

  // 2. Track Firebase Auth state changes
  useEffect(() => {
    if (isMockFirebase || !auth) {
      // In Mock/Standalone mode, check sessionStorage for persistent mock login
      const cachedString = sessionStorage.getItem("bu_mock_user");
      if (cachedString) {
        try {
          const cached = JSON.parse(cachedString);
          setCurrentUser(cached.user);
          setIsAdmin(cached.isAdmin);
        } catch (e) {
          // Ignored
        }
      }
      setLoadingAuth(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Double check admin role
        const { checkIsAdmin } = await import("./dbService");
        const adminRole = await checkIsAdmin(user.email || "", user.uid);
        
        setCurrentUser(user);
        setIsAdmin(adminRole);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Login handler
  const handleAuthSuccess = (user: any, isAdminUser: boolean) => {
    setCurrentUser(user);
    setIsAdmin(isAdminUser);
    if (isMockFirebase) {
      sessionStorage.setItem("bu_mock_user", JSON.stringify({ user, isAdmin: isAdminUser }));
    }
  };

  // Sign out handler
  const handleLogout = async () => {
    if (!isMockFirebase && auth) {
      await auth.signOut();
    } else {
      sessionStorage.removeItem("bu_mock_user");
    }
    setCurrentUser(null);
    setIsAdmin(false);
  };

  // Render elegant loading splash screen
  if (loadingAuth || loadingQuestions) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none">
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 border border-orange-200 rounded-full text-[#f97316] mb-4 shadow"
        >
          <GraduationCap className="w-8 h-8" />
        </motion.div>
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs mt-2 font-mono uppercase tracking-wider">
          <Loader2 className="w-4 h-4 text-[#f97316] animate-spin" />
          {t("กำลังเชื่อมต่อระบบแบบประเมินมหาวิทยาลัยกรุงเทพ...", "Loading Bangkok University Survey...")}
        </div>
      </div>
    );
  }

  // Active student object
  const activeStudent = currentUser || {
    email: studentEmail,
    displayName: "นักศึกษามหาวิทยาลัยกรุงเทพ",
    uid: "bu_student",
  };

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-orange-500/10 selection:text-orange-600">
      
      {/* Dynamic Navigation routing */}
      <AnimatePresence mode="wait">
        {isAdmin ? (
          <motion.div
            key="admin-dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AdminDashboard
              questions={questions}
              onQuestionsChange={loadSurveyQuestions}
              user={currentUser}
              onLogout={handleLogout}
            />
          </motion.div>
        ) : (
          <motion.div
            key="student-questionnaire"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <QuestionnaireForm
              questions={questions}
              user={activeStudent}
              onLogout={() => {
                setStudentEmail("student@bu.ac.th");
                setShowWelcomeModal(true);
              }}
              onOpenAdmin={() => setShowAdminModal(true)}
              onOpenWelcome={() => setShowWelcomeModal(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop up ต้อนรับนักศึกษาที่เข้าร่วมตอบแบบสอบถาม */}
      <StudentWelcomeModal
        isOpen={showWelcomeModal && !isAdmin}
        onClose={() => setShowWelcomeModal(false)}
        currentEmail={studentEmail}
        onEmailChange={(email) => setStudentEmail(email)}
        onOpenAdmin={() => {
          setShowWelcomeModal(false);
          setShowAdminModal(true);
        }}
      />

      {/* ส่วนของแอดมินเข้าเฉพาะ (Dedicated Admin Login Modal) */}
      <AdminLoginModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}

// Wrap inside localization Context Provider
export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}
