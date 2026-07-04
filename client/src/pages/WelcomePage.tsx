import { useParams } from "wouter";
import { CheckCircle2, Star, MapPin, Sparkles, Phone, Calendar } from "lucide-react";
import { useLocation } from "wouter";

export default function WelcomePage() {
  const params = useParams<{ name: string }>();
  const clientName = decodeURIComponent(params.name || "there");
  const [, navigate] = useLocation();

  const reasons = [
    {
      icon: Star,
      title: "Top-Rated Service",
      desc: "Consistently 5-star reviews from clients across the DC area.",
    },
    {
      icon: CheckCircle2,
      title: "Vetted & Insured",
      desc: "Every cleaner is background-checked and fully insured for your peace of mind.",
    },
    {
      icon: Sparkles,
      title: "Premium Products",
      desc: "We use professional-grade, eco-friendly cleaning products — safe for kids and pets.",
    },
    {
      icon: MapPin,
      title: "Live Tracking",
      desc: "Know exactly when your cleaner is on the way with our real-time tracking link.",
    },
  ];

  const steps = [
    {
      num: "01",
      icon: Phone,
      title: "We'll call to get a card on file",
      desc: "Expect a call from (202) 888-5362. This secures your booking — you're not charged until after the service.",
    },
    {
      num: "02",
      icon: MapPin,
      title: "Live tracking on the day",
      desc: "You'll get a link to see your team's real-time updates — ETAs, arrival time, and more.",
    },
    {
      num: "03",
      icon: Star,
      title: "Share your experience",
      desc: "After your cleaning, a quick review helps other homeowners find us and means the world to our team.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* ── Hero video — same as quote page ── */}
      <div
        className="relative w-full overflow-hidden bg-black"
        style={{ aspectRatio: "16/9", maxHeight: "520px" }}
      >
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
        {/* @ts-ignore */}
        <wistia-player
          media-id="bzlt49ipk1"
          seo="false"
          aspect="1.7777777777777777"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.45) 0%, transparent 25%, transparent 55%, rgba(10,10,10,0.85) 85%, #0A0A0A 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-7 md:px-12 flex flex-col items-center text-center">
          <p
            className="font-sans text-xs tracking-[0.3em] uppercase mb-1.5"
            style={{ color: "#E8651A" }}
          >
            Professional Cleaning
          </p>
          <h1
            className="font-serif text-3xl md:text-5xl font-bold text-white"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}
          >
            Maids in Black
          </h1>
          <p className="font-sans text-sm text-white/60 mt-1.5 tracking-wide">
            Prepared for <span className="text-white font-medium">{clientName}</span>
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">

        {/* Greeting */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl px-6 md:px-8 py-8 text-center">
          <span className="text-xs tracking-[0.3em] uppercase text-ember font-sans font-medium">
            Hello, {clientName} 👋
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mt-3 mb-4 leading-tight">
            We're excited to take care of your home
          </h2>
          <p className="font-sans text-white/60 text-sm md:text-base leading-relaxed max-w-md mx-auto">
            Maids in Black delivers a premium, stress-free cleaning experience — so you can come
            home to a spotless space without lifting a finger.
          </p>
        </div>

        {/* Why Choose Us */}
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-ember font-sans font-medium mb-4 block">
            Why Choose Us
          </span>
          <h3 className="font-serif text-xl md:text-3xl font-bold text-white mb-2">
            Why folks love us, {clientName}
          </h3>
          <p className="font-sans text-white/45 text-sm mb-6 leading-relaxed">
            Here's what our clients say keeps them coming back.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {reasons.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 p-4 rounded-xl bg-[#141414] border border-white/10"
              >
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

        {/* What Happens Next */}
        <div>
          <span className="text-xs tracking-[0.3em] uppercase text-ember font-sans font-medium mb-4 block">
            What Happens Next
          </span>
          <h3 className="font-serif text-xl md:text-3xl font-bold text-white mb-6">
            Your Journey to Clean
          </h3>
          <div className="bg-[#141414] border border-white/10 rounded-2xl px-6 md:px-8 py-8 space-y-7">
            {steps.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="flex gap-5 items-start">
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="w-11 h-11 rounded-full border border-ember/40 bg-ember/10 flex items-center justify-center">
                    <Icon size={18} className="text-ember" />
                  </div>
                  <span className="font-sans text-ember/50 text-xs font-bold">{num}</span>
                </div>
                <div className="pt-1">
                  <p className="font-sans font-semibold text-white text-sm md:text-base mb-1.5">
                    {title}
                  </p>
                  <p className="font-sans text-white/55 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 pt-2 pb-4">
          <button
            onClick={() => navigate("/q/" + encodeURIComponent(params.name || "") + "/book")}
            className="bg-ember hover:bg-ember/90 active:scale-95 text-white font-sans font-semibold text-base px-10 py-4 rounded-lg transition-all duration-150 flex items-center gap-3"
          >
            <Calendar size={18} />
            Book My Cleaning
          </button>
          <p className="font-sans text-white/30 text-xs">
            No charge until after your service is complete
          </p>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center py-8 px-4 border-t border-white/5 mt-4">
        <p className="font-serif text-lg text-white/80 mb-1">Maids in Black</p>
        <p className="font-sans text-xs text-white/30 tracking-widest uppercase">
          Professional Cleaning Services
        </p>
      </footer>
    </div>
  );
}
