/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db, isMockFirebase, handleFirestoreError, OperationType } from "./firebaseConfig";
import { Question, DEFAULT_QUESTIONS, StudentResponse } from "./types";

// Dynamic UUID Generator for Local fallback
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Ensure questions are seeded locally if needed
const getLocalQuestions = (): Question[] => {
  const cached = localStorage.getItem("bu_questions");
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      // Check if cached list contains the new questions with groupTitleTh and orderLabel
      const q3_1 = Array.isArray(parsed) ? parsed.find((q: any) => q.id === "q3_1") : null;
      if (q3_1 && q3_1.groupTitleTh && q3_1.orderLabel) {
        return parsed;
      }
    } catch (e) {
      // Ignored
    }
  }
  localStorage.setItem("bu_questions", JSON.stringify(DEFAULT_QUESTIONS));
  return DEFAULT_QUESTIONS;
};

const getLocalResponses = (): StudentResponse[] => {
  const cached = localStorage.getItem("bu_responses");
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // Ignored
    }
  }
  return [];
};

// 1. Get Questions list
export async function fetchQuestions(): Promise<Question[]> {
  if (isMockFirebase || !db) {
    return getLocalQuestions();
  }

  const path = "questions";
  try {
    const q = query(collection(db, path), orderBy("order", "asc"));
    const snapshot = await getDocs(q);
    const list: Question[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...(docSnap.data() as any) });
    });

    // Check if Firestore is empty or missing q3_1 groupTitle
    const q3_1 = list.find((item) => item.id === "q3_1");
    if (list.length === 0 || !q3_1 || !q3_1.groupTitleTh) {
      console.log("Firestore questions empty or outdated. Seeding defaults...");
      for (const item of DEFAULT_QUESTIONS) {
        await setDoc(doc(db, "questions", item.id), {
          aspectTh: item.aspectTh,
          aspectEn: item.aspectEn,
          textTh: item.textTh,
          textEn: item.textEn,
          descriptionTh: item.descriptionTh || "",
          descriptionEn: item.descriptionEn || "",
          order: item.order,
          orderLabel: item.orderLabel || "",
          groupTitleTh: item.groupTitleTh || "",
          groupTitleEn: item.groupTitleEn || "",
        });
      }
      return DEFAULT_QUESTIONS;
    }
    return list;
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}

// 2. Add or Edit Question
export async function saveQuestion(question: Question): Promise<void> {
  const id = question.id || `q_${generateId()}`;
  const payload = {
    aspectTh: question.aspectTh,
    aspectEn: question.aspectEn,
    textTh: question.textTh,
    textEn: question.textEn,
    descriptionTh: question.descriptionTh || "",
    descriptionEn: question.descriptionEn || "",
    order: Number(question.order),
    orderLabel: question.orderLabel || "",
    groupTitleTh: question.groupTitleTh || "",
    groupTitleEn: question.groupTitleEn || "",
  };

  if (isMockFirebase || !db) {
    const list = getLocalQuestions();
    const existingIndex = list.findIndex((x) => x.id === id);
    if (existingIndex > -1) {
      list[existingIndex] = { id, ...payload };
    } else {
      list.push({ id, ...payload });
    }
    localStorage.setItem("bu_questions", JSON.stringify(list));
    return;
  }

  const path = `questions/${id}`;
  try {
    await setDoc(doc(db, "questions", id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 3. Delete Question
export async function removeQuestion(id: string): Promise<void> {
  if (isMockFirebase || !db) {
    const list = getLocalQuestions();
    const filtered = list.filter((x) => x.id !== id);
    localStorage.setItem("bu_questions", JSON.stringify(filtered));
    return;
  }

  const path = `questions/${id}`;
  try {
    await deleteDoc(doc(db, "questions", id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 4. Submit Student Response
export async function submitResponse(response: StudentResponse): Promise<void> {
  const responseId = `res_${generateId()}`;
  
  if (isMockFirebase || !db) {
    const list = getLocalResponses();
    list.push({
      ...response,
      id: responseId,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("bu_responses", JSON.stringify(list));
    return;
  }

  const path = `responses/${responseId}`;
  try {
    await setDoc(doc(db, "responses", responseId), {
      ...response,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 5. Fetch all Responses (Admin only)
export async function fetchResponses(): Promise<StudentResponse[]> {
  if (isMockFirebase || !db) {
    return getLocalResponses();
  }

  const path = "responses";
  try {
    const snapshot = await getDocs(collection(db, path));
    const list: StudentResponse[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      // Handle server timestamp formats beautifully
      let dateString = new Date().toISOString();
      if (data.createdAt && typeof data.createdAt.toDate === "function") {
        dateString = data.createdAt.toDate().toISOString();
      } else if (data.createdAt && data.createdAt.seconds) {
        dateString = new Date(data.createdAt.seconds * 1000).toISOString();
      } else if (typeof data.createdAt === "string") {
        dateString = data.createdAt;
      }

      list.push({
        id: docSnap.id,
        ...(data as any),
        createdAt: dateString,
      });
    });
    return list;
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}

// 6. Clear All responses (Admin only)
export async function clearAllResponses(): Promise<void> {
  if (isMockFirebase || !db) {
    localStorage.setItem("bu_responses", JSON.stringify([]));
    return;
  }

  const path = "responses";
  try {
    const snapshot = await getDocs(collection(db, path));
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 7. Check if user email is Designated Admin
// The 3 admins designated (pornpun.w@bu.ac.th, and we allow 2 other mocks or custom added ones)
const BU_ADMIN_EMAILS = ["pornpun.w@bu.ac.th", "admin1@bu.ac.th", "admin2@bu.ac.th", "research@bu.ac.th"];

export async function checkIsAdmin(email: string, userId: string): Promise<boolean> {
  const cleanedEmail = email.toLowerCase().trim();
  if (BU_ADMIN_EMAILS.includes(cleanedEmail)) {
    return true;
  }

  if (isMockFirebase || !db) {
    const cachedAdmins = localStorage.getItem("bu_admins");
    if (cachedAdmins) {
      try {
        const list = JSON.parse(cachedAdmins);
        return list.includes(cleanedEmail);
      } catch (e) {
        // Ignored
      }
    }
    return false;
  }

  // Real Firestore check
  const path = `admins/${userId}`;
  try {
    const snapshot = await getDocs(collection(db, "admins"));
    let found = false;
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.email && data.email.toLowerCase().trim() === cleanedEmail) {
        found = true;
      }
    });
    return found;
  } catch (error) {
    // If permission is denied or collection doesn't exist, we fallback
    return false;
  }
}

// 8. Add Dynamic Admin email from admin dashboard
export async function registerAdmin(email: string, docId: string): Promise<void> {
  const cleanedEmail = email.toLowerCase().trim();
  if (isMockFirebase || !db) {
    const cachedAdmins = localStorage.getItem("bu_admins");
    let list = cachedAdmins ? JSON.parse(cachedAdmins) : [];
    if (!list.includes(cleanedEmail)) {
      list.push(cleanedEmail);
    }
    localStorage.setItem("bu_admins", JSON.stringify(list));
    return;
  }

  const path = `admins/${docId}`;
  try {
    await setDoc(doc(db, "admins", docId), {
      email: cleanedEmail,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
