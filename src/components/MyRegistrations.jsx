import { useState, useEffect } from "react";
import {
  X,
  Ticket,
  Trash2,
  Calendar,
  MapPin,
  User,
  Copy,
  Check,
  Compass,
} from "lucide-react";

export default function MyRegistrations({
  isOpen,
  onClose,
  registrations,
  onDeleteRegistration,
  onClearAll,
  currentUser,
}) {
  const [copiedId, setCopiedId] = useState(null);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (passId) => {
    navigator.clipboard.writeText(passId);
    setCopiedId(passId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearWithConfirm = () => {
    if (window.confirm("Are you sure you want to remove all your registered passes from this browser?")) {
      onClearAll();
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-200">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                My Registered Passes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser ? (
                  <>
                    Account:{" "}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {currentUser.email}
                    </span>{" "}
                    ({registrations.length})
                  </>
                ) : (
                  `Registered Passes (${registrations.length})`
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close passes drawer"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Registration List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {registrations.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Ticket className="w-8 h-8" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                  No Event Passes Yet
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto mt-1 leading-relaxed">
                  Browse upcoming hackathons, tech talks, or concerts and register to generate your verified instant pass.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--campus-primary)] text-white hover:bg-[var(--campus-primary-dark)] cursor-pointer shadow-sm transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Events Now</span>
              </button>
            </div>
          ) : (
            registrations.map((reg) => (
              <div
                key={reg.passId}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 space-y-3 relative group shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-200 border border-orange-200/60 dark:border-orange-900/60">
                      {reg.passId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(reg.passId)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Copy Pass ID"
                    >
                      {copiedId === reg.passId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => onDeleteRegistration(reg.passId)}
                    title="Cancel & Delete Pass"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                  {reg.eventTitle}
                </h4>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {reg.name}
                    </span>
                    {reg.phone && (
                      <span className="text-slate-400">({reg.phone})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{reg.eventDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{reg.eventVenue}</span>
                  </div>
                </div>

                {reg.registeredAt && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                    Issued on {reg.registeredAt}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {registrations.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={handleClearWithConfirm}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:underline cursor-pointer"
            >
              Clear All Passes
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Close Drawer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
