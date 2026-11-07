import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Flame,
  Compass,
  X,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  ArrowUpDown,
} from "lucide-react";
import { events, categories } from "./data/events";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import EventCard from "./components/EventCard";
import EventModal from "./components/EventModal";
import AuthModal from "./components/AuthModal";
import TermsModal from "./components/TermsModal";
import MyRegistrations from "./components/MyRegistrations";
import Footer from "./components/Footer";
import {
  createLocalAccount,
  getCurrentLocalUser,
  signInLocalAccount,
  resetLocalPassword,
  signOutLocalAccount,
} from "./utils/localAuth";

const EVENT_DURATION_MS = 2 * 60 * 60 * 1000;

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("k_explore_theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("k_explore_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("k_explore_theme", "light");
    }
  }, [darkMode]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceFilter, setPriceFilter] = useState("All"); // "All" | "Free" | "Paid"
  const [sortBy, setSortBy] = useState("upcoming"); // "upcoming" | "seats" | "price-free" | "title"
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentLocalUser);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingEvent, setPendingEvent] = useState(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  useEffect(() => {
    const timerId = window.setInterval(() => setCurrentTime(Date.now()), 30_000);
    return () => window.clearInterval(timerId);
  }, []);

  // Registrations in localStorage
  const [registrations, setRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem("k_explore_registrations");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "k_explore_registrations",
      JSON.stringify(registrations)
    );
  }, [registrations]);

  // Bookmarks in localStorage
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem("k_explore_bookmarks");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("k_explore_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleToggleBookmark = (eventId) => {
    setBookmarks((prev) => {
      const exists = prev.includes(eventId);
      if (exists) {
        showToast("Removed from saved events.", "info");
        return prev.filter((id) => id !== eventId);
      } else {
        showToast("Event saved to your bookmarks!");
        return [...prev, eventId];
      }
    });
  };

  const handleShareEvent = (event) => {
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: `Check out ${event.title} on CampusVibe!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Event link copied to clipboard!");
    }
  };

  // Registrations strictly associated with the current signed-in account only
  const userRegistrations = useMemo(() => {
    if (!currentUser || !currentUser.email) return [];
    const activeEmail = currentUser.email.trim().toLowerCase();
    return registrations.filter((r) => {
      const passEmail = (r.userEmail || r.email || "").trim().toLowerCase();
      return passEmail === activeEmail;
    });
  }, [registrations, currentUser]);

  // Dynamic remaining seats based on registrations
  const eventRegistrationCounts = useMemo(() => {
    const counts = {};
    for (const r of registrations) {
      counts[r.eventId] = (counts[r.eventId] || 0) + 1;
    }
    return counts;
  }, [registrations]);

  const getRemainingSeats = useCallback(
    (event) => {
      const count = eventRegistrationCounts[event.id] || 0;
      return Math.max(0, event.seatsLeft - count);
    },
    [eventRegistrationCounts]
  );

  const handleRegisterSuccess = (newPass) => {
    setRegistrations((prev) => [newPass, ...prev]);
    showToast(`Pass confirmed for ${newPass.eventTitle}!`);
  };

  const handleDeleteRegistration = (passId) => {
    setRegistrations((prev) => prev.filter((item) => item.passId !== passId));
    showToast("Event pass removed.", "info");
  };

  const handleClearAllRegistrations = () => {
    if (!currentUser) return;
    const activeEmail = currentUser.email.trim().toLowerCase();
    setRegistrations((prev) =>
      prev.filter((r) => {
        const passEmail = (r.userEmail || r.email || "").trim().toLowerCase();
        return passEmail !== activeEmail;
      })
    );
    showToast("All passes for this account cleared.");
  };

  const handleSelectEvent = (event) => {
    if (!currentUser) {
      setPendingEvent(event);
      setAuthOpen(true);
      return;
    }

    setSelectedEvent(event);
  };

  const handleAuthenticate = async ({ mode, ...credentials }) => {
    let profile;
    if (mode === "signup") {
      profile = await createLocalAccount(credentials);
      showToast(`Welcome to CampusVibe, ${profile.name}!`);
    } else if (mode === "reset") {
      profile = await resetLocalPassword(credentials);
      showToast("Password updated successfully! Welcome back.");
    } else {
      profile = await signInLocalAccount(credentials);
      showToast(`Welcome back, ${profile.name}!`);
    }

    setCurrentUser(profile);
    setAuthOpen(false);
    if (pendingEvent) {
      setSelectedEvent(pendingEvent);
      setPendingEvent(null);
    }
  };

  const handleSignOut = () => {
    signOutLocalAccount();
    setCurrentUser(null);
    setDrawerOpen(false);
    setSelectedEvent(null);
    showToast("Signed out successfully.", "info");
  };

  const featuredEvents = useMemo(
    () => events.filter((e) => e.featured),
    []
  );

  const liveEventIds = useMemo(
    () =>
      new Set(
        events
          .filter((event) => {
            if (event.isLive) return true;

            const startsAt = new Date(event.date).getTime();
            return (
              startsAt <= currentTime &&
              currentTime < startsAt + EVENT_DURATION_MS
            );
          })
          .map((event) => event.id)
      ),
    [currentTime]
  );

  const filteredEvents = useMemo(() => {
    let result = events.filter((ev) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "All" || ev.category === selectedCategory;

      // Price filter
      const matchesPrice =
        priceFilter === "All" ||
        (priceFilter === "Free" && ev.price === "Free") ||
        (priceFilter === "Paid" && ev.price !== "Free");

      // Bookmarks filter
      const matchesBookmarks = !showBookmarksOnly || bookmarks.includes(ev.id);

      // Search query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        ev.title.toLowerCase().includes(query) ||
        ev.venue.toLowerCase().includes(query) ||
        ev.shortDescription.toLowerCase().includes(query) ||
        ev.category.toLowerCase().includes(query);

      return (
        matchesCategory && matchesPrice && matchesBookmarks && matchesSearch
      );
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "seats") {
        return getRemainingSeats(a) - getRemainingSeats(b);
      }
      if (sortBy === "price-free") {
        if (a.price === "Free" && b.price !== "Free") return -1;
        if (a.price !== "Free" && b.price === "Free") return 1;
        return 0;
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      // default: upcoming soonest
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return result;
  }, [
    searchQuery,
    selectedCategory,
    priceFilter,
    showBookmarksOnly,
    bookmarks,
    sortBy,
    getRemainingSeats,
  ]);

  const registeredEventIds = useMemo(
    () => new Set(userRegistrations.map((r) => r.eventId)),
    [userRegistrations]
  );

  return (
    <div className="min-h-screen bg-[var(--campus-bg)] dark:bg-[var(--campus-bg-dark)] text-[var(--campus-text)] dark:text-[var(--campus-text-light)] transition-colors duration-300 flex flex-col">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[80] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white animate-fadeIn">
          {toast.type === "info" ? (
            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sticky Navbar */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        registeredCount={userRegistrations.length}
        onOpenRegistrations={() => setDrawerOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Hero Banner */}
      <Hero
        totalEvents={events.length}
        featuredCount={featuredEvents.length}
        categoryCount={categories.length - 1}
        liveEventCount={liveEventIds.size}
        freeEventCount={events.filter((event) => event.price === "Free").length}
        onSelectCategory={setSelectedCategory}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full space-y-16 py-8">
        {/* Featured Events */}
        <section id="featured" className="scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
                <Flame className="w-4 h-4" />
                <span>Don't Miss Out</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Featured Flagship Events
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Handpicked high-demand campus & national experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.slice(0, 3).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onSelectEvent={handleSelectEvent}
                isRegistered={registeredEventIds.has(event.id)}
                isLive={liveEventIds.has(event.id)}
                isBookmarked={bookmarks.includes(event.id)}
                onToggleBookmark={handleToggleBookmark}
                onShare={handleShareEvent}
                remainingSeats={getRemainingSeats(event)}
              />
            ))}
          </div>
        </section>

        {/* Explore Events + Search & Filters */}
        <section id="explore" className="scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
                <Compass className="w-4 h-4" />
                <span>Browse & Filter</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Explore Upcoming Events
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-bold text-orange-600 dark:text-orange-400">
                {filteredEvents.length}
              </span>{" "}
              of {events.length} events
            </p>
          </div>

          {/* Search & Filter Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 mb-8">
            {/* Search Input Bar */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name, venue, organizer, or keyword..."
                className="w-full pl-11 pr-10 py-3 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--campus-primary-dark)] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Pills & Saved Toggle */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 mr-1 shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Category:
                </span>
                {categories.map((category) => {
                  const active = selectedCategory === category && !showBookmarksOnly;
                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowBookmarksOnly(false);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-all cursor-pointer ${
                        active
                          ? "bg-[var(--campus-primary)] text-white shadow-sm shadow-orange-900/15"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* Saved Events Filter Button */}
              <button
                type="button"
                onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  showBookmarksOnly
                    ? "bg-rose-500 text-white shadow-sm shadow-rose-900/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    showBookmarksOnly ? "fill-current" : ""
                  }`}
                />
                <span>Saved Events ({bookmarks.length})</span>
              </button>
            </div>

            {/* Secondary Controls: Price Filter & Sort Dropdown */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Price Filter Options */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-semibold">Price:</span>
                {["All", "Free", "Paid"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriceFilter(p)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      priceFilter === p
                        ? "bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-200 border border-orange-200/80 dark:border-orange-900"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-slate-400 font-semibold">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="upcoming">Upcoming Soonest</option>
                  <option value="seats">Filling Fast (Least Seats)</option>
                  <option value="price-free">Free Admission First</option>
                  <option value="title">Alphabetical (A - Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {showBookmarksOnly
                  ? "You haven't saved any events yet"
                  : "No matching events found"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {showBookmarksOnly
                  ? "Click the bookmark icon on any event card to save it here for fast access."
                  : "Try clearing your search query or selecting a different category."}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setPriceFilter("All");
                  setShowBookmarksOnly(false);
                }}
                className="mt-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--campus-primary)] text-white hover:bg-[var(--campus-primary-dark)] cursor-pointer"
              >
                Reset Search & Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelectEvent={handleSelectEvent}
                  isRegistered={registeredEventIds.has(event.id)}
                  isLive={liveEventIds.has(event.id)}
                  isBookmarked={bookmarks.includes(event.id)}
                  onToggleBookmark={handleToggleBookmark}
                  onShare={handleShareEvent}
                  remainingSeats={getRemainingSeats(event)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Event Details & Registration Modal */}
      <EventModal
        key={
          selectedEvent
            ? `${selectedEvent.id}-${currentUser?.email || "guest"}`
            : "event-modal"
        }
        event={selectedEvent}
        allEvents={events}
        liveEventIds={liveEventIds}
        currentUser={currentUser}
        onClose={() => setSelectedEvent(null)}
        onRegisterSuccess={handleRegisterSuccess}
      />

      {/* Auth Modal (Login, Signup, Reset Password) */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => {
          setAuthOpen(false);
          setPendingEvent(null);
        }}
        onAuthenticate={handleAuthenticate}
        onOpenTerms={() => setTermsOpen(true)}
      />

      {/* Terms & Conditions Modal */}
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />

      {/* My Registrations Drawer */}
      <MyRegistrations
        isOpen={drawerOpen && Boolean(currentUser)}
        onClose={() => setDrawerOpen(false)}
        registrations={userRegistrations}
        currentUser={currentUser}
        onDeleteRegistration={handleDeleteRegistration}
        onClearAll={handleClearAllRegistrations}
      />

      <Footer onOpenTerms={() => setTermsOpen(true)} />
    </div>
  );
}
