import { Ticket } from "lucide-react";

export default function Footer({ onOpenTerms }) {
  return (
    <footer
      id="footer"
      className="mt-20 border-t border-slate-800 bg-slate-900 text-slate-400"
    >
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-10">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--campus-primary)] text-white shadow-lg shadow-orange-900/20">
            <Ticket className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="mt-4 text-xl font-bold text-white">
            CampusVibe Events Hub
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
            Discover campus events, find experiences that excite you, and make
            more of your time in the community.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-8 border-t border-slate-800 pt-8 text-center sm:grid-cols-2 sm:text-left">
          <section aria-labelledby="footer-explore-heading">
            <h2
              id="footer-explore-heading"
              className="text-sm font-semibold uppercase tracking-wider text-white"
            >
              Explore
            </h2>
            <nav className="mt-4 flex flex-col items-center gap-3 text-sm sm:items-start">
              <a href="#featured" className="transition-colors hover:text-white">
                Featured events
              </a>
              <a href="#explore" className="transition-colors hover:text-white">
                Browse all events
              </a>
              <button
                type="button"
                onClick={onOpenTerms}
                className="transition-colors hover:text-white"
              >
                Terms & Conditions
              </button>
            </nav>
          </section>

          <section aria-labelledby="footer-community-heading">
            <h2
              id="footer-community-heading"
              className="text-sm font-semibold uppercase tracking-wider text-white"
            >
              Campus community
            </h2>
            <p className="mt-4 text-sm leading-6">
              From workshops and hackathons to music, culture, and sports,
              there&apos;s something to discover and share.
            </p>
          </section>
        </div>

        <div className="mt-9 border-t border-slate-800 pt-5 text-center text-xs leading-5 text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} CampusVibe Inc. All rights
            reserved.
          </p>
          <p className="mt-1">Made for campus communities, one event at a time.</p>
        </div>
      </div>
    </footer>
  );
}
