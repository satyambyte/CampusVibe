import { useEffect } from "react";
import { X, Shield, FileText, CheckCircle } from "lucide-react";

export default function TermsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fadeIn"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Terms & Conditions"
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-200">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2
              id="terms-title"
              className="text-2xl font-bold text-slate-900 dark:text-white"
            >
              Terms & Community Guidelines
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              CampusVibe Events Platform &bull; Updated November 2026
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <section className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-orange-500" />
              1. Account Security & Privacy
            </h3>
            <p className="text-xs sm:text-sm">
              Keep your credentials secure. Your account passwords are encrypted and hashed locally using client-side cryptographic hashing (PBKDF2-SHA256). You are responsible for any registrations made under your account credentials.
            </p>
          </section>

          <section className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-orange-500" />
              2. Event Registrations & Passes
            </h3>
            <p className="text-xs sm:text-sm">
              Registrations create instant verified digital passes. Event organizers reserve the right to verify student identity cards at entry. Please arrive at venues at least 15 minutes before the scheduled start time.
            </p>
          </section>

          <section className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-orange-500" />
              3. Code of Conduct & Respectful Use
            </h3>
            <p className="text-xs sm:text-sm">
              CampusVibe fosters an inclusive, safe environment for students and tech enthusiasts. Disruptive behavior, falsification of identity, or harassment will result in revocation of passes and access.
            </p>
          </section>

          <section className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-orange-500" />
              4. Local Browser Storage
            </h3>
            <p className="text-xs sm:text-sm">
              In this version, your accounts and generated event passes are stored locally in this browser. Clearing your site data or browsing in incognito mode may clear your saved passes.
            </p>
          </section>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-[var(--campus-primary)] px-5 py-3 font-semibold text-white transition-colors hover:bg-[var(--campus-primary-dark)] cursor-pointer"
        >
          I Understand & Agree
        </button>
      </section>
    </div>
  );
}
