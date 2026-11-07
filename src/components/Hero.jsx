import {
  Calendar,
  CalendarDays,
  MapPin,
  ArrowRight,
  Trophy,
  Ticket,
  Sparkles,
} from "lucide-react";

export default function Hero({
  totalEvents,
  featuredCount,
  categoryCount,
  liveEventCount,
  freeEventCount,
  onSelectCategory,
}) {
  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-orange-100/60 via-white to-white dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[38rem] h-[38rem] bg-orange-400/15 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 dark:bg-orange-950/60 border border-orange-200/80 dark:border-orange-900 text-orange-900 dark:text-orange-200 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <CalendarDays className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span>Campus & National Event Discovery Platform</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
          Discover Events. Create Memories.
          <span className="block text-[var(--campus-primary-dark)]">
            Live the Experience.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Explore upcoming hackathons, live concerts, hands-on technical bootcamps, cultural fests, and championship sports—all in one seamless platform with instant pass generation.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white bg-[var(--campus-primary)] hover:bg-[var(--campus-primary-dark)] shadow-lg shadow-orange-900/20 hover:-translate-y-0.5 transition-all"
          >
            <span>Explore {totalEvents} Upcoming Events</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#featured"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
          >
            <span>View Featured Highlights</span>
          </a>
        </div>

        {/* Quick Tag Pills */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Trending:
          </span>
          {["Tech & Hackathons", "Music & Concerts", "Workshops", "Sports"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                if (onSelectCategory) onSelectCategory(cat);
                const el = document.getElementById("explore");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Event Overview Stats */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
          {[
            {
              icon: Calendar,
              value: liveEventCount,
              label: liveEventCount === 1 ? "Event live now" : "Events live now",
              isLive: liveEventCount > 0,
              iconStyle: "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
            },
            {
              icon: MapPin,
              value: categoryCount,
              label: "Event categories",
              iconStyle: "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
            },
            {
              icon: Trophy,
              value: featuredCount,
              label: "Featured flagships",
              iconStyle: "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
            },
            {
              icon: Ticket,
              value: freeEventCount,
              label: "Free admission",
              iconStyle: "bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-200",
            },
          ].map(({ icon: Icon, value, label, iconStyle, isLive }) => (
            <div
              key={label}
              className="flex items-center gap-3 sm:gap-4 rounded-2xl bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-3 sm:p-5 shadow-sm"
            >
              <div className={`shrink-0 rounded-xl p-2.5 sm:p-3 ${iconStyle}`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {value}
                </p>
                <p className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                  {isLive && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      LIVE
                    </span>
                  )}
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
