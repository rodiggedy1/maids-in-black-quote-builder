import { useState, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Calendar, MapPin, Mail, CheckCircle2, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

const TIME_OPTIONS: { id: "morning" | "midday" | "evening" | "flexible"; label: string; time: string; desc: string }[] = [
  { id: "morning", label: "Morning", time: "8:30 AM", desc: "Early start, fresh home by noon" },
  { id: "midday", label: "Midday", time: "12:30 PM", desc: "Perfect mid-day refresh" },
  { id: "evening", label: "Afternoon", time: "4:30 PM", desc: "Ready for your evening" },
  { id: "flexible", label: "I'm completely flexible", time: "", desc: "We'll find the best slot for you" },
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function formatDateDisplay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function toIso(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function InlineCalendar({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate());

  const cells = useMemo(() => {
    const arr: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    return arr;
  }, [firstDay, daysInMonth]);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  const isPast = (day: number) => toIso(viewYear, viewMonth, day) < todayIso;
  const isSelected = (day: number) => value === toIso(viewYear, viewMonth, day);
  const isToday = (day: number) => toIso(viewYear, viewMonth, day) === todayIso;

  // Don't allow navigating to months before current
  const canGoPrev = viewYear > today.getFullYear() || (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  return (
    <div className="bg-[#141414] border border-white/10 rounded-xl p-4 select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            canGoPrev ? "text-white/60 hover:text-white hover:bg-white/8" : "text-white/15 cursor-not-allowed"
          }`}
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-sans font-semibold text-sm text-white">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/8 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center font-sans text-xs text-white/30 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const past = isPast(day);
          const selected = isSelected(day);
          const today_ = isToday(day);
          return (
            <button
              key={day}
              type="button"
              disabled={past}
              onClick={() => !past && onChange(toIso(viewYear, viewMonth, day))}
              className={`
                mx-auto w-8 h-8 rounded-full flex items-center justify-center font-sans text-sm transition-all
                ${selected ? "bg-ember text-white font-semibold" : ""}
                ${!selected && today_ ? "border border-ember/60 text-ember" : ""}
                ${!selected && !today_ && !past ? "text-white/70 hover:bg-white/10 hover:text-white" : ""}
                ${past ? "text-white/15 cursor-not-allowed" : ""}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BookingPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [, navigate] = useLocation();

  const { data: quote, isLoading } = trpc.quote.getBySlug.useQuery({ slug });

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [timePreference, setTimePreference] = useState<"morning" | "midday" | "evening" | "flexible" | "">("");
  const [preferredDate, setPreferredDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitBooking = trpc.quote.submitBooking.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => { setError(err.message); setSubmitting(false); },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !address || !timePreference) {
      setError("Please fill in all fields and select a time preference.");
      return;
    }
    setError(null);
    setSubmitting(true);
    submitBooking.mutate({
      slug,
      email,
      address,
      timePreference: timePreference as "morning" | "midday" | "evening" | "flexible",
      preferredDate: preferredDate || undefined,
      bookingNotes: bookingNotes || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#E8651A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-white/50 font-sans text-sm">Quote not found.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-ember/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-ember" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">You're all set, {quote.clientName}!</h1>
          <p className="font-sans text-white/55 text-base leading-relaxed mb-8">
            We've received your booking request. You'll get a confirmation email shortly with all the details. We can't wait to make your home shine. ✨
          </p>
          <div className="bg-[#141414] border border-white/10 rounded-xl px-6 py-5 text-left space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <Mail size={15} className="text-ember shrink-0" />
              <span className="font-sans text-white/70 text-sm">{email}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={15} className="text-ember shrink-0 mt-0.5" />
              <span className="font-sans text-white/70 text-sm">{address}</span>
            </div>
            {preferredDate && (
              <div className="flex items-center gap-3">
                <Calendar size={15} className="text-ember shrink-0" />
                <span className="font-sans text-white/70 text-sm">{formatDateDisplay(preferredDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar size={15} className="text-ember shrink-0" />
              <span className="font-sans text-white/70 text-sm">
                {TIME_OPTIONS.find(t => t.id === timePreference)?.label}
                {TIME_OPTIONS.find(t => t.id === timePreference)?.time ? ` · ${TIME_OPTIONS.find(t => t.id === timePreference)?.time}` : ""}
              </span>
            </div>
          </div>
          <p className="font-sans text-white/30 text-xs">Maids in Black · Professional Cleaning Services</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <div className="border-b border-white/8 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(`/q/${slug}`)}
          className="flex items-center gap-1.5 text-white/40 hover:text-white/70 font-sans text-sm transition-colors"
        >
          <ChevronLeft size={16} />
          Back to quote
        </button>
        <div className="flex-1" />
        <span className="font-serif text-white/60 text-sm">Maids in Black</span>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 py-10">
        {/* Greeting */}
        <div className="mb-8">
          <span className="text-xs tracking-[0.3em] uppercase text-ember font-sans font-medium">Almost there</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mt-2 mb-2">
            Let's lock in your clean, {quote.clientName} 🗓️
          </h1>
          <p className="font-sans text-white/50 text-sm leading-relaxed">
            Just a few quick details and we'll have everything ready to confirm your booking.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Email */}
          <div>
            <label className="block font-sans text-xs text-white/50 uppercase tracking-wider mb-2">
              <Mail size={12} className="inline mr-1.5 text-ember" />
              Email address — for your confirmation
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-[#141414] border border-white/15 rounded-lg px-4 py-3 font-sans text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-ember/60 transition-colors"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-sans text-xs text-white/50 uppercase tracking-wider mb-2">
              <MapPin size={12} className="inline mr-1.5 text-ember" />
              Address — we'll see you soon 👋
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Main St, City, State"
              required
              className="w-full bg-[#141414] border border-white/15 rounded-lg px-4 py-3 font-sans text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-ember/60 transition-colors"
            />
          </div>

          {/* Date picker */}
          <div>
            <label className="block font-sans text-xs text-white/50 uppercase tracking-wider mb-3">
              <Calendar size={12} className="inline mr-1.5 text-ember" />
              Preferred date
              {preferredDate && (
                <span className="ml-2 text-ember normal-case tracking-normal font-medium">
                  — {formatDateDisplay(preferredDate)}
                </span>
              )}
            </label>
            <InlineCalendar value={preferredDate} onChange={setPreferredDate} />
          </div>

          {/* Time preference */}
          <div>
            <label className="block font-sans text-xs text-white/50 uppercase tracking-wider mb-3">
              <Calendar size={12} className="inline mr-1.5 text-ember" />
              Time preference — pick what works best
            </label>
            <div className="space-y-2.5">
              {TIME_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTimePreference(opt.id)}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg border transition-all text-left ${
                    timePreference === opt.id
                      ? "bg-ember/15 border-ember/50 text-white"
                      : "bg-[#141414] border-white/10 text-white/60 hover:border-white/25 hover:text-white/80"
                  }`}
                >
                  <div>
                    <p className="font-sans font-semibold text-sm">
                      {opt.label}
                      {opt.time && <span className="ml-2 font-normal text-ember text-xs">{opt.time}</span>}
                    </p>
                    <p className="font-sans text-xs text-white/40 mt-0.5">{opt.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${
                    timePreference === opt.id ? "border-ember bg-ember" : "border-white/20"
                  }`} />
                </button>
              ))}
            </div>
          </div>

          {/* Booking notes */}
          <div>
            <label className="block font-sans text-xs text-white/50 uppercase tracking-wider mb-2">
              <MessageSquare size={12} className="inline mr-1.5 text-ember" />
              Anything we should know? (optional)
            </label>
            <textarea
              value={bookingNotes}
              onChange={e => setBookingNotes(e.target.value)}
              placeholder="Pets, parking, gate codes, areas to focus on…"
              rows={3}
              className="w-full bg-[#141414] border border-white/15 rounded-lg px-4 py-3 font-sans text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-ember/60 transition-colors resize-none"
            />
          </div>

          {error && (
            <p className="font-sans text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full cta-pulse bg-ember hover:bg-ember/90 active:scale-[0.98] disabled:opacity-50 text-white font-sans font-semibold text-base py-4 rounded-lg transition-all duration-150 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirming…
              </>
            ) : (
              <>
                <Calendar size={18} />
                Confirm My Date &amp; Time
              </>
            )}
          </button>
        </form>

        <p className="text-center font-sans text-white/20 text-xs mt-8">
          Maids in Black · Professional Cleaning Services
        </p>
      </div>
    </div>
  );
}
