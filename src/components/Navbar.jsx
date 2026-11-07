import { useState, useRef, useEffect } from "react";
import {
  Sun,
  Moon,
  Ticket,
  Menu,
  X,
  LogIn,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Navbar({
  darkMode,
  setDarkMode,
  registeredCount,
  onOpenRegistrations,
  currentUser,
  onOpenAuth,
  onSignOut,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    if (userDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Initials for avatar
  const initials = currentUser?.name
    ? currentUser.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-[var(--campus-primary)] flex items-center justify-center text-white shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-[var(--campus-primary-dark)] to-[var(--campus-primary)] bg-clip-text text-transparent">
              CampusVibe
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-900 dark:text-orange-200 border border-orange-200 dark:border-orange-900">
              Events Hub
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a
            href="#featured"
            className="hover:text-[var(--campus-primary)] transition-colors"
          >
            Featured
          </a>
          <a
            href="#explore"
            className="hover:text-[var(--campus-primary)] transition-colors"
          >
            Explore Events
          </a>
          <a
            href="#footer"
            className="hover:text-[var(--campus-primary)] transition-colors"
          >
            About Platform
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* My Passes Button - Only shown when signed in */}
          {currentUser && (
            <button
              onClick={onOpenRegistrations}
              className="relative inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="hidden sm:inline">My Passes</span>
              {registeredCount > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-bold rounded-full bg-[var(--campus-primary)] text-white animate-pulse">
                  {registeredCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Sign In */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--campus-primary)] text-xs font-bold text-white shadow-sm">
                  {initials}
                </span>
                <span className="hidden max-w-28 truncate text-sm font-semibold text-slate-800 dark:text-slate-200 sm:inline">
                  {currentUser.name}
                </span>
                <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 p-2 shadow-2xl border border-slate-200 dark:border-slate-800 animate-fadeIn z-50">
                  <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-semibold text-slate-400">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenRegistrations();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-orange-500" />
                        My Registered Passes
                      </span>
                      <span className="px-1.5 py-0.5 rounded-md bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-200 text-[10px]">
                        {registeredCount}
                      </span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              aria-label="Sign in"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--campus-primary)] px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-orange-900/15 transition-all hover:bg-[var(--campus-primary-dark)] active:scale-95 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark Mode"
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-orange-300 transition-all cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-fadeIn">
          {currentUser && (
            <div className="p-3 mb-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--campus-primary)] text-sm font-bold text-white shrink-0">
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
          )}

          <a
            href="#featured"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Featured Events
          </a>
          <a
            href="#explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Explore All Events
          </a>
          {currentUser && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegistrations();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
            >
              <span className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-orange-500" />
                My Passes
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[var(--campus-primary)] text-white text-xs font-bold">
                {registeredCount}
              </span>
            </button>
          )}

          {currentUser ? (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSignOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--campus-primary)] text-white font-semibold text-sm shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  );
}
