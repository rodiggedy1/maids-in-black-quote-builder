import { trpc } from "@/lib/trpc";
import AdminLayout from "@/components/AdminLayout";
import { Calendar, Mail, MapPin, Clock, Home, Sparkles, FileText } from "lucide-react";

const TIME_LABELS: Record<string, string> = {
  morning: "8:30 AM",
  midday: "12:30 PM",
  evening: "4:30 PM",
  flexible: "Completely flexible",
};

const TIME_COLORS: Record<string, string> = {
  morning: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  midday: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  evening: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  flexible: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatEstimate(min: string | null, max: string | null) {
  if (!min && !max) return null;
  if (min && max) return `$${Number(min).toFixed(0)}–$${Number(max).toFixed(0)}`;
  if (min) return `$${Number(min).toFixed(0)}+`;
  return `Up to $${Number(max).toFixed(0)}`;
}

export default function AdminBookings() {
  const { data: bookings, isLoading, error } = trpc.quote.listBookings.useQuery();

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-ember font-sans font-medium mb-2">Admin</p>
          <h1 className="font-serif text-4xl font-bold text-white">Bookings</h1>
          <p className="font-sans text-white/50 text-sm mt-2">
            All client booking requests submitted through quote pages.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-400 font-sans text-sm">
            Failed to load bookings. Please refresh the page.
          </div>
        )}

        {bookings && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Calendar className="w-7 h-7 text-white/30" />
            </div>
            <p className="font-serif text-xl text-white/40 mb-2">No bookings yet</p>
            <p className="font-sans text-sm text-white/25">
              When clients submit a booking request from their quote page, it will appear here.
            </p>
          </div>
        )}

        {bookings && bookings.length > 0 && (
          <div className="space-y-4">
            {/* Summary bar */}
            <div className="flex items-center gap-6 mb-6 px-1">
              <span className="font-sans text-white/40 text-sm">
                <span className="text-white font-semibold">{bookings.length}</span> total booking{bookings.length !== 1 ? "s" : ""}
              </span>
            </div>

            {bookings.map((b) => {
              const estimate = formatEstimate(b.estimateMin, b.estimateMax);
              const timeColor = TIME_COLORS[b.timePreference] ?? "text-white/60 bg-white/5 border-white/10";
              return (
                <div
                  key={b.id}
                  className="bg-[#141414] border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-colors"
                >
                  {/* Top row: name + date + time badge */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-white leading-tight">{b.clientName}</h2>
                      <p className="font-sans text-white/35 text-xs mt-1">{formatDate(b.createdAt)}</p>
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-sans font-semibold px-3 py-1.5 rounded-full border ${timeColor}`}>
                      <Clock className="w-3 h-3" />
                      {TIME_LABELS[b.timePreference]}
                    </span>
                  </div>

                  {/* Detail grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-ember mt-0.5 shrink-0" />
                      <div>
                        <p className="font-sans text-[11px] text-white/35 uppercase tracking-wider mb-0.5">Email</p>
                        <a href={`mailto:${b.email}`} className="font-sans text-sm text-white/80 hover:text-ember transition-colors">
                          {b.email}
                        </a>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-ember mt-0.5 shrink-0" />
                      <div>
                        <p className="font-sans text-[11px] text-white/35 uppercase tracking-wider mb-0.5">Address</p>
                        <p className="font-sans text-sm text-white/80">{b.address}</p>
                      </div>
                    </div>

                    {/* Home size + service */}
                    {(b.bedrooms || b.bathrooms || b.serviceType) && (
                      <div className="flex items-start gap-3">
                        <Home className="w-4 h-4 text-ember mt-0.5 shrink-0" />
                        <div>
                          <p className="font-sans text-[11px] text-white/35 uppercase tracking-wider mb-0.5">Property & Service</p>
                          <p className="font-sans text-sm text-white/80">
                            {b.bedrooms != null && b.bathrooms != null
                              ? `${b.bedrooms} bed / ${b.bathrooms} bath`
                              : ""}
                            {b.serviceType ? ` · ${b.serviceType}` : ""}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Preferred date */}
                    {b.preferredDate && (
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-ember mt-0.5 shrink-0" />
                        <div>
                          <p className="font-sans text-[11px] text-white/35 uppercase tracking-wider mb-0.5">Preferred Date</p>
                          <p className="font-sans text-sm text-white/80">
                            {new Date(b.preferredDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Estimate */}
                    {estimate && (
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-ember mt-0.5 shrink-0" />
                        <div>
                          <p className="font-sans text-[11px] text-white/35 uppercase tracking-wider mb-0.5">Estimate</p>
                          <p className="font-serif text-base font-bold text-ember">{estimate}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {b.notes && (
                    <div className="flex items-start gap-3 pt-4 border-t border-white/6">
                      <FileText className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-sans text-[11px] text-white/35 uppercase tracking-wider mb-1">Notes</p>
                        <p className="font-sans text-sm text-white/60 leading-relaxed">{b.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
