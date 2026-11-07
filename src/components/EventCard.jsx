import {
  Calendar,
  MapPin,
  Users,
  ArrowUpRight,
  CheckCircle2,
  Bookmark,
  Share2,
  AlertCircle,
} from "lucide-react";
import CountdownBadge from "./CountdownBadge";

export default function EventCard({
  event,
  onSelectEvent,
  isRegistered,
  isLive,
  isBookmarked,
  onToggleBookmark,
  onShare,
  remainingSeats,
}) {
  const effectiveSeats =
    remainingSeats !== undefined ? remainingSeats : event.seatsLeft;
  const isSoldOut = effectiveSeats <= 0;
  const isFillingFast = effectiveSeats > 0 && effectiveSeats <= 20;

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col relative">
      {/* Event Image & Badges */}
      <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

        {/* Top Floating Badges & Action Buttons */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--campus-primary)] text-white backdrop-blur-md shadow-sm">
              {event.category}
            </span>
            {isLive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            )}
            {isSoldOut ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/90 text-white">
                Sold Out
              </span>
            ) : isFillingFast ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                Filling Fast
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Price Pill */}
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                event.price === "Free"
                  ? "bg-emerald-600 text-white"
                  : "bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white"
              }`}
            >
              {event.price}
            </span>

            {/* Bookmark Button */}
            {onToggleBookmark && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(event.id);
                }}
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark event"}
                className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  isBookmarked
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-slate-900/60 text-white hover:bg-slate-900/90"
                }`}
                title={isBookmarked ? "Saved in bookmarks" : "Save event"}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    isBookmarked ? "fill-current" : ""
                  }`}
                />
              </button>
            )}

            {/* Share Button */}
            {onShare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(event);
                }}
                aria-label="Share event"
                className="p-1.5 rounded-full bg-slate-900/60 text-white hover:bg-slate-900/90 backdrop-blur-md transition-all cursor-pointer"
                title="Share event link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Overlay: Countdown & Registered Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          {!isLive && <CountdownBadge targetDate={event.date} />}
          {isRegistered && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 text-white shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Registered
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[var(--campus-primary)] transition-colors line-clamp-2">
            {event.title}
          </h3>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {event.shortDescription}
          </p>

          {/* Date & Venue Info */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">{event.displayDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Footer & CTA Button */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            {isSoldOut ? (
              <span className="text-rose-500 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                No seats left
              </span>
            ) : (
              <>
                <Users className="w-4 h-4 text-orange-500" />
                <span>{effectiveSeats} seats left</span>
              </>
            )}
          </div>

          <button
            onClick={() => onSelectEvent(event)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm ${
              isRegistered
                ? "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100"
                : isSoldOut
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "text-white bg-[var(--campus-primary)] hover:bg-[var(--campus-primary-dark)] active:scale-95 shadow-orange-900/15"
            }`}
          >
            <span>{isRegistered ? "View Details" : isSoldOut ? "View Info" : "View & Register"}</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
