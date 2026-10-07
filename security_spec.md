# Firebase Security Rules Specification

## 1. Data Invariants
1. **Domain Isolation**: Only users authenticated with email addresses ending with `@bu.ac.th` with verified status can submit responses or access the application.
2. **PII and Response Security**: Student responses contain sensitive personal details (e.g. email, faculty, feedback) and must only be globally readable/exports-accessible by verified administrators. Normal students can only write their own responses (and cannot read, modify, or list other responses).
3. **Role-Based Access (Admin)**: Administrators are validated via an explicit dynamic document check in the `/admins` collection using their UID. The standard user email `pornpun.w@bu.ac.th` is bootstrap-authorized as a system administrator. Only administrators can delete or modify questions, manage other admins, delete responses, or clear collections.

---

## 2. The "Dirty Dozen" Malicious/Invalid Payloads

1. **Self-Appointed Admin**: A user attempts to write themselves directly to `/admins/{someUid}`.
2. **Tamper With Other Responses**: An authenticated student tries to modify isVerified on an existing response.
3. **Privilege Escalation**: Attempting to delete or clear all responses as a normal student.
4. **Invalid Domain Submission**: Submitting a response from an email ending with `@gmail.com` or other non-BU domains.
5. **Junk ID Poisoning**: Trying to create a question with a document ID containing special characters or exceeding reasonable lengths (e.g. `/questions/junk?!!!#$`).
6. **Malicious Score Injection**: Injecting a rating value of `10` or a non-integer on Part 1 questions.
7. **Type Spoofing**: Injecting array types instead of strings for the `studentProgram` field.
8. **Bypassing Server Timestamps**: Providing a client-generated date-time for `createdAt` instead of a strict `request.time` server timestamp.
9. **Rogue Field Injection**: Inserting a shadow field `isVerifiedAdmin: true` inside a Response document.
10. **Listing All Submissions**: Attempting a list query to see all responses in the database, breaking standard PII privacy block.
11. **Impersonating Another Student**: Setting `studentEmail` to a different user's email during compilation.
12. **Modifying Immortal Fields**: Attempting to modify a previously submitted Response's `studentEmail` or `createdAt` on update.

---

## 3. Security Rules (DRAFT)

We will write `DRAFT_firestore.rules` and complete validations before producing the final `firestore.rules`.
