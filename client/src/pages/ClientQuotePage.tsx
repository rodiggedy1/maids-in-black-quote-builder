import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight, CheckCircle2, Calendar, MapPin, Sparkles, Star } from "lucide-react";

// ─── Slide types ─────────────────────────────────────────────────────────────
type SlideId = "intro" | "why-choose-us" | "official-quote" | "what-happens-next";

const SLIDE_ORDER: SlideId[] = ["intro", "why-choose-us", "official-quote", "what-happens-next"];

const SLIDE_TITLES: Record<SlideId, string> = {
  "intro": "Intro",
  "why-choose-us": "Why Choose Us",
  "official-quote": "Official Quote",
  "what-happens-next": "What Happens Next",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatEstimate(min: string | null, max: string | null) {
  const minN = min ? Number(min) : null;
  const maxN = max ? Number(max) : null;
  if (minN && maxN && minN !== maxN) return `$${minN} – $${maxN}`;
  if (minN) return `$${minN}`;
  if (maxN) return `$${maxN}`;
  return "Contact for pricing";
}

// ─── Slide components ─────────────────────────────────────────────────────────

function SlideIntro({ clientName }: { clientName: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[520px] text-center px-8 py-12">
      <div className="mb-6">
        <span className="text-xs tracking-[0.3em] uppercase text-ember font-sans font-medium">Your Personal Quote</span>
      </div>
      <h1 className="font-serif text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
        Maids in Black
      </h1>
      <div className="w-16 h-0.5 bg-ember mx-auto my-6" />
      <p className="font-serif text-2xl text-white/90 italic mb-3">
        Hello, {clientName}
      </p>
      <p className="font-sans text-white/60 text-base max-w-md leading-relaxed">
        We've prepared a personalized cleaning quote just for you. Swipe through to see exactly what's included and what to expect.
      </p>
      <div className="mt-10 flex items-center gap-2 text-white/30 text-xs font-sans tracking-widest uppercase">
        <span>Swipe to explore</span>
        <ChevronRight size={14} className="text-ember" />
      </div>
    </div>
  );
}

function SlideWhyChooseUs() {
  const reasons = [
    { icon: Star, title: "Top-Rated Service", desc: "Consistently 5-star reviews from clients across the area." },
    { icon: CheckCircle2, title: "Vetted & Insured", desc: "Every cleaner is background-checked and fully insured." },
    { icon: Sparkles, title: "Premium Products", desc: "We use professional-grade, eco-friendly cleaning products." },
    { icon: MapPin, title: "Live Tracking", desc: "Know exactly when your cleaner is on the way with our tracking link." },
  ];

  return (
    <div className="flex flex-col justify-center min-h-[520px] px-8 py-12">
      <span className="text-xs tracking-[0.3em] uppercase text-ember font-sans font-medium mb-4">Why Choose Us</span>
      <h2 className="font-serif text-4xl font-bold text-white mb-10 leading-tight">
        The Maids in Black<br />Difference
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reasons.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="shrink-0 w-10 h-10 rounded-full bg-ember/15 flex items-center justify-center">
              <Icon size={18} className="text-ember" />
            </div>
            <div>
              <p className="font-sans font-semibold text-white text-sm mb-1">{title}</p>
              <p className="font-sans text-white/55 text-xs leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideOfficialQuote({
  clientName,
  bedrooms,
  bathrooms,
  serviceType,
  extras,
  notes,
  estimateMin,
  estimateMax,
  ctaLabel,
  onCta,
}: {
  clientName: string;
  bedrooms: number;
  bathrooms: number;
  serviceType: string;
  extras: string[];
  notes: string | null;
  estimateMin: string | null;
  estimateMax: string | null;
  ctaLabel: string;
  onCta: () => void;
}) {
  return (
    <div className="flex flex-col justify-center min-h-[520px] px-8 py-10">
      <span className="text-xs tracking-[0.3em] uppercase text-ember font-sans font-medium mb-4">Official Quote</span>
      <h2 className="font-serif text-4xl font-bold text-white mb-1">Your Estimate</h2>
      <p className="font-sans text-white/50 text-sm mb-8">Prepared exclusively for {clientName}</p>

      {/* Property summary — compact */}
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-ember/15 text-ember text-sm font-sans font-medium px-3 py-1.5 rounded-full">
          {bedrooms} bed / {bathrooms} bath
        </span>
        <span className="bg-white/8 text-white/70 text-sm font-sans px-3 py-1.5 rounded-full border border-white/10">
          {serviceType}
        </span>
      </div>

      {/* Cleaning scope */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: "Kitchen", items: ["Counters & surfaces", "Sink & fixtures", "Cabinet exteriors"] },
          { label: "Bathrooms", items: ["Toilets & sinks", "Shower & tub", "Mirrors & fixtures"] },
          { label: "Living Areas", items: ["Dusting all surfaces", "Vacuum & mop floors", "Baseboards"] },
          { label: "Bedrooms", items: ["Dust & wipe surfaces", "Vacuum floors", "Make beds"] },
        ].map(({ label, items }) => (
          <div key={label} className="bg-white/5 border border-white/10 rounded-lg p-3">
            <p className="font-sans text-ember text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
            {items.map(item => (
              <p key={item} className="font-sans text-white/60 text-xs flex items-center gap-1.5 mb-0.5">
                <span className="w-1 h-1 rounded-full bg-ember/60 shrink-0" />
                {item}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Extras */}
      {extras.length > 0 && (
        <div className="mb-5">
          <p className="font-sans text-xs text-white/40 uppercase tracking-wider mb-2">Add-on Services</p>
          <div className="flex flex-wrap gap-2">
            {extras.map(extra => (
              <span key={extra} className="bg-ember/15 text-ember text-xs font-sans px-2.5 py-1 rounded-full border border-ember/30">
                ✓ {extra}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {notes && (
        <div className="mb-5 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
          <p className="font-sans text-xs text-white/40 uppercase tracking-wider mb-1">Special Notes</p>
          <p className="font-sans text-white/70 text-sm">{notes}</p>
        </div>
      )}

      {/* Estimate */}
      <div className="flex items-end justify-between border-t border-white/10 pt-5 mt-2">
        <div>
          <p className="font-sans text-xs text-white/40 uppercase tracking-wider mb-1">Estimated Total</p>
          <p className="font-serif text-4xl font-bold text-ember">{formatEstimate(estimateMin, estimateMax)}</p>
          <p className="font-sans text-white/35 text-xs mt-1">Final price confirmed on booking</p>
        </div>
        <button
          onClick={onCta}
          className="cta-pulse bg-ember hover:bg-ember/90 active:scale-95 text-white font-sans font-semibold text-sm px-6 py-3 rounded-lg transition-all duration-150"
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

function SlideWhatHappensNext({ ctaLabel, onCta }: { ctaLabel: string; onCta: () => void }) {
  const steps = [
    { num: "01", title: "Confirm Date & Time", desc: "Reply to confirm your preferred cleaning date and time window." },
    { num: "02", title: "We Send Confirmation", desc: "You'll receive a booking confirmation with all the details." },
    { num: "03", title: "Magic Tracking Link", desc: "On the day of service, get a live link to track your cleaner in real time." },
    { num: "04", title: "Clean & Happy", desc: "Sit back and come home to a spotless, fresh space." },
  ];

  return (
    <div className="flex flex-col justify-center min-h-[520px] px-8 py-12">
      <span className="text-xs tracking-[0.3em] uppercase text-ember font-sans font-medium mb-4">What Happens Next</span>
      <h2 className="font-serif text-4xl font-bold text-white mb-10">Your Journey to Clean</h2>

      <div className="space-y-5 mb-10">
        {steps.map(({ num, title, desc }) => (
          <div key={num} className="flex gap-5 items-start">
            <div className="shrink-0 w-10 h-10 rounded-full border border-ember/40 flex items-center justify-center">
              <span className="font-sans text-ember text-xs font-bold">{num}</span>
            </div>
            <div className="pt-1">
              <p className="font-sans font-semibold text-white text-sm mb-0.5">{title}</p>
              <p className="font-sans text-white/50 text-xs leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onCta}
          className="cta-pulse bg-ember hover:bg-ember/90 active:scale-95 text-white font-sans font-semibold text-base px-10 py-4 rounded-lg transition-all duration-150 flex items-center gap-3"
        >
          <Calendar size={18} />
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ClientQuotePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: quote, isLoading, error } = trpc.quote.getBySlug.useQuery({ slug });
  const [currentSlide, setCurrentSlide] = useState<SlideId>("intro");
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const currentIndex = SLIDE_ORDER.indexOf(currentSlide);

  const goTo = (id: SlideId, dir: "forward" | "back") => {
    setDirection(dir);
    setCurrentSlide(id);
  };

  const goNext = () => {
    if (currentIndex < SLIDE_ORDER.length - 1) {
      goTo(SLIDE_ORDER[currentIndex + 1], "forward");
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      goTo(SLIDE_ORDER[currentIndex - 1], "back");
    }
  };

  const handleCta = () => {
    window.open("https://www.thumbtack.com", "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#E8651A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 font-sans text-xs tracking-widest uppercase">Loading your quote</p>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <h1 className="font-serif text-3xl text-white mb-3">Quote Not Found</h1>
          <p className="text-white/40 font-sans text-sm">This quote link may have expired or is invalid. Please contact us for a new quote.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero video section — Wistia full-bleed cinematic */}
      <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "16/9", maxHeight: "520px" }}>
        {/* Wistia scripts */}
        <script src="https://fast.wistia.com/player.js" async />
        <script src="https://fast.wistia.com/embed/bzlt49ipk1.js" async type="module" />
        <style>{`
          wistia-player[media-id='bzlt49ipk1']:not(:defined) {
            background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/bzlt49ipk1/swatch');
            display: block;
            filter: blur(5px);
            padding-top: 56.25%;
          }
          wistia-player {
            width: 100% !important;
            height: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
          }
        `}</style>
        {/* @ts-ignore — Wistia custom element */}
        <wistia-player
          media-id="bzlt49ipk1"
          seo="false"
          aspect="1.7777777777777777"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
        {/* Gradient overlays — top fade + bottom fade to black */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.45) 0%, transparent 25%, transparent 55%, rgba(10,10,10,0.85) 85%, #0A0A0A 100%)",
          }}
        />
        {/* Brand overlay bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-7 md:px-12">
          <div className="flex items-end justify-between">
            <div>
              <p
                className="font-sans text-xs tracking-[0.3em] uppercase mb-1.5"
                style={{ color: "#E8651A" }}
              >
                Professional Cleaning
              </p>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white" style={{ textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}>
                Maids in Black
              </h1>
            </div>
            <div className="text-right hidden md:block">
              <p className="font-sans text-xs text-white/50 mb-0.5 tracking-wider uppercase">Prepared for</p>
              <p className="font-serif text-2xl text-white" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
                {quote.clientName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quote deck */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Slide nav tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1 scrollbar-hide">
          {SLIDE_ORDER.map((id, i) => (
            <button
              key={id}
              onClick={() => goTo(id, i > currentIndex ? "forward" : "back")}
              className={`shrink-0 font-sans text-xs px-3 py-1.5 rounded-full transition-all ${
                currentSlide === id
                  ? "bg-ember text-white"
                  : "text-white/40 hover:text-white/70 border border-white/10 hover:border-white/30"
              }`}
            >
              {SLIDE_TITLES[id]}
            </button>
          ))}
        </div>

        {/* Slide content */}
        <div
          className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden"
          style={{ minHeight: 520 }}
        >
          <div
            key={currentSlide}
            className="slide active"
            style={{
              animation: `${direction === "forward" ? "slideIn" : "slideInLeft"} 0.35s cubic-bezier(0.23,1,0.32,1)`,
            }}
          >
            {currentSlide === "intro" && <SlideIntro clientName={quote.clientName} />}
            {currentSlide === "why-choose-us" && <SlideWhyChooseUs />}
            {currentSlide === "official-quote" && (
              <SlideOfficialQuote
                clientName={quote.clientName}
                bedrooms={quote.bedrooms}
                bathrooms={quote.bathrooms}
                serviceType={quote.serviceType}
                extras={quote.extras}
                notes={quote.notes}
                estimateMin={quote.estimateMin}
                estimateMax={quote.estimateMax}
                ctaLabel={quote.ctaLabel}
                onCta={handleCta}
              />
            )}
            {currentSlide === "what-happens-next" && (
              <SlideWhatHappensNext ctaLabel={quote.ctaLabel} onCta={handleCta} />
            )}
          </div>
        </div>

        {/* Prev / Next navigation */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 font-sans text-sm px-4 py-2 rounded-lg transition-all ${
              currentIndex === 0
                ? "text-white/20 cursor-not-allowed"
                : "text-white/60 hover:text-white hover:bg-white/8"
            }`}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {SLIDE_ORDER.map((id, i) => (
              <button
                key={id}
                onClick={() => goTo(id, i > currentIndex ? "forward" : "back")}
                className={`rounded-full transition-all ${
                  currentSlide === id ? "w-5 h-2 bg-ember" : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentIndex === SLIDE_ORDER.length - 1}
            className={`flex items-center gap-2 font-sans text-sm px-4 py-2 rounded-lg transition-all ${
              currentIndex === SLIDE_ORDER.length - 1
                ? "text-white/20 cursor-not-allowed"
                : "text-white/60 hover:text-white hover:bg-white/8"
            }`}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 px-4 border-t border-white/5 mt-4">
        <p className="font-serif text-lg text-white/80 mb-1">Maids in Black</p>
        <p className="font-sans text-xs text-white/30 tracking-widest uppercase">Professional Cleaning Services</p>
      </footer>
    </div>
  );
}
