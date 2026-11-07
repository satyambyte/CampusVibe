import { useState, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";

export default function CountdownBadge({ targetDate }) {
  const calculateTimeLeft = useCallback(() => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    if (difference <= 0) return null;

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      mins: Math.floor((difference / 1000 / 60) % 60),
      secs: Math.floor((difference / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!timeLeft) return null;

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-md border border-white/15 shadow-sm">
      <Clock className="w-3.5 h-3.5 text-orange-300 animate-pulse" />
      <span>
        {timeLeft.days}d : {String(timeLeft.hours).padStart(2, "0")}h :{" "}
        {String(timeLeft.mins).padStart(2, "0")}m :{" "}
        {String(timeLeft.secs).padStart(2, "0")}s
      </span>
    </div>
  );
}