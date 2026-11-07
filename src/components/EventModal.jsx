import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  MapPin,
  Users,
  Building2,
  CheckCircle2,
  AlertCircle,
  Ticket,
  Copy,
  Printer,
  Check,
} from "lucide-react";
import CountdownBadge from "./CountdownBadge";

export default function EventModal({
  event,
  allEvents,
  liveEventIds,
  currentUser,
  onClose,
  onRegisterSuccess,
}) {
  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(event?.id || "");

  const [errors, setErrors] = useState({});
  const [submittedPass, setSubmittedPass] = useState(null);
  const [copied, setCopied] = useState(false);

  // Sync selected event ID when event prop changes
  const activeEventObj =
    allEvents?.find((e) => e.id === selectedEventId) || event;

  // Escape key listener to close modal
  useEffect(() => {
    if (!event) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [event, onClose]);

  if (!event) return null;

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanedPhone = phone.replace(/\D/g, "");

    if (!name.trim()) {
      newErrors.name = "Participant name is required.";
    } else if (!nameRegex.test(name.trim())) {
      newErrors.name = "Enter a valid full name (at least 3 letters, alphabets only).";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Enter a valid email address (e.g. name@example.com).";
    }

    if (!cleanedPhone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).";
    }

    if (!selectedEventId && !activeEventObj?.id) {
      newErrors.selectedEventId = "Please select an event.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const cleanedPhone = phone.replace(/\D/g, "");
    const newRegistration = {
      passId: "KEXP-" + Math.floor(100000 + Math.random() * 900000),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      userEmail: (currentUser?.email || email.trim()).toLowerCase(),
      phone: cleanedPhone,
      eventId: activeEventObj.id,
      eventTitle: activeEventObj.title,
      eventDate: activeEventObj.displayDate,
      eventVenue: activeEventObj.venue,
      category: activeEventObj.category,
      registeredAt: new Date().toLocaleString(),
    };

    onRegisterSuccess(newRegistration);
    setSubmittedPass(newRegistration);
  };

  const handleCopyPassId = () => {
    if (!submittedPass) return;
    navigator.clipboard.writeText(submittedPass.passId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/75 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Detailed Event Info */}
        <div className="lg:w-1/2 flex flex-col overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          <div className="relative h-56 sm:h-64 shrink-0">
            <img
              src={activeEventObj.image}
              alt={activeEventObj.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--campus-primary)] text-white">
                {activeEventObj.category}
              </span>
              {liveEventIds?.has(activeEventObj.id) && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
              )}
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white text-slate-900">
                {activeEventObj.price}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              {!liveEventIds?.has(activeEventObj.id) && (
                <CountdownBadge targetDate={activeEventObj.date} />
              )}
              <h2 className="mt-2 text-xl sm:text-2xl font-bold text-white leading-snug">
                {activeEventObj.title}
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-5 text-sm text-slate-600 dark:text-slate-300">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1.5">
                About This Event
              </h4>
              <p className="leading-relaxed">{activeEventObj.fullDescription}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Date & Time</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {activeEventObj.displayDate}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Venue</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {activeEventObj.venue}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Organizer</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {activeEventObj.organizer}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Availability</p>
                  <p className="font-semibold text-orange-600 dark:text-orange-400">
                    {activeEventObj.seatsLeft} Seats Available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form OR Confirmation Message */}
        <div className="lg:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-center bg-slate-50/60 dark:bg-slate-900/50">
          {submittedPass ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Registration Confirmed!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                Thank you,{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {submittedPass.name}
                </span>
                ! Your pass has been issued and saved to your account.
              </p>

              {/* Ticket Summary Box */}
              <div className="text-left p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs sm:text-sm shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400">Pass ID:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-orange-600 dark:text-orange-400 text-sm">
                      {submittedPass.passId}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPassId}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      title="Copy Pass ID"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Event:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100 text-right max-w-xs truncate">
                    {submittedPass.eventTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Venue:</span>
                  <span className="text-slate-700 dark:text-slate-300 text-right">
                    {submittedPass.eventDate} ({submittedPass.eventVenue})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {submittedPass.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {submittedPass.phone}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Pass</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--campus-primary)] hover:bg-[var(--campus-primary-dark)] text-white shadow-sm cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Ticket className="w-4 h-4" />
                <span>Instant Event Pass</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Register for This Event
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-5">
                Fill in your details below to reserve your seat immediately.
              </p>

              {currentUser && (
                <div className="mb-4 p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/60 text-xs text-orange-800 dark:text-orange-200 flex items-center justify-between">
                  <span>
                    Auto-filling for <strong>{currentUser.name}</strong> ({currentUser.email})
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Participant Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Participant Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Satyam Kumar"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors({ ...errors, name: "" });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800 border ${
                      errors.name
                        ? "border-rose-500 focus:ring-rose-500"
                        : "border-slate-300 dark:border-slate-700 focus:border-[var(--campus-primary-dark)]"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--campus-primary)]/20 transition-all`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. satyam@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800 border ${
                      errors.email
                        ? "border-rose-500 focus:ring-rose-500"
                        : "border-slate-300 dark:border-slate-700 focus:border-[var(--campus-primary-dark)]"
                    } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--campus-primary)]/20 transition-all`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Phone Number (10 Digits) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setPhone(val);
                        if (errors.phone) setErrors({ ...errors, phone: "" });
                      }}
                      className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800 border ${
                        errors.phone
                          ? "border-rose-500 focus:ring-rose-500"
                          : "border-slate-300 dark:border-slate-700 focus:border-[var(--campus-primary-dark)]"
                      } text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--campus-primary)]/20 transition-all`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.phone}</span>
                    </p>
                  )}
                </div>

                {/* Selected Event Dropdown */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Selected Event *
                  </label>
                  <select
                    value={selectedEventId || activeEventObj.id}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[var(--campus-primary)]/20 focus:border-[var(--campus-primary-dark)]"
                  >
                    {allEvents?.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.title} ({ev.displayDate.split("•")[0].trim()})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 px-5 rounded-xl text-sm font-semibold text-white bg-[var(--campus-primary)] hover:bg-[var(--campus-primary-dark)] active:scale-[0.99] shadow-lg shadow-orange-900/15 transition-all cursor-pointer"
                >
                  Confirm Registration
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
