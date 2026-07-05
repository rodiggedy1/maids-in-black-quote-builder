import { useParams } from "wouter";
import { CheckCircle2, Star, MapPin, Sparkles, Phone, CalendarCheck, Mail, Navigation, Headphones } from "lucide-react";

export default function WelcomePage() {
  const params = useParams<{ name: string }>();
  const clientName = decodeURIComponent(params.name || "there");

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
      icon: CalendarCheck,
      title: "Book Your Service",
      desc: "Just give us your name, phone, and email — we handle everything else. No lengthy forms, no back-and-forth. We'll confirm your date and get a card on file to secure your spot.",
    },
    {
      num: "02",
      icon: Mail,
      title: "Confirmation Email",
      desc: "Once you're booked, you'll receive a confirmation email with all the details — date, time window, and what to expect. Everything in one place so there are no surprises.",
    },
    {
      num: "03",
      icon: Navigation,
      title: "Live Tracking on the Day",
      desc: "On the morning of your service, we'll send you a link so you can follow your team in real time — see when they're on the way, get live ETAs, and know the exact moment they arrive.",
    },
    {
      num: "04",
      icon: Sparkles,
      title: "Team Arrives & Does a Great Job",
      desc: "Your Maids in Black team shows up on time, fully equipped, and ready to work. We treat your home with care and attention to detail — leaving every room spotless from top to bottom.",
    },
    {
      num: "05",
      icon: Headphones,
      title: "7 Days a Week Customer Support",
      desc: "We're available 7 days a week — so whenever you need us, we're here. Whether you have a question before your service, need a touch-up after, or just want to rebook, reach us by phone, text, or email any day of the week.",
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

        {/* Team Photo */}
        <div className="relative overflow-hidden rounded-2xl" style={{ maxHeight: '420px' }}>
          <img
            src="/manus-storage/mib-team-photo_eac8c843.webp"
            alt="Maids in Black team member"
            className="w-full object-cover object-top"
            style={{ maxHeight: '420px' }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, transparent 50%, #0A0A0A 100%)'
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
            <p className="font-serif text-white text-lg md:text-xl font-bold" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              Real people. Real results.
            </p>
            <p className="font-sans text-white/60 text-sm mt-1">Your Maids in Black team, ready to work.</p>
          </div>
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
        <div className="bg-[#141414] border border-ember/30 rounded-2xl px-6 md:px-8 py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-ember/15 flex items-center justify-center mx-auto mb-4">
            <Phone size={22} className="text-ember" />
          </div>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
            Ready to get scheduled, {clientName}?
          </h3>
          <p className="font-sans text-white/65 text-sm md:text-base leading-relaxed max-w-sm mx-auto mb-2">
            All we need is your <span className="text-white font-medium">name, phone, and email</span> — and we'll take care of the rest.
          </p>
          <p className="font-sans text-ember text-sm font-semibold tracking-wide">
            No forms to fill out. No stress.
          </p>
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="font-sans text-white/40 text-xs uppercase tracking-widest mb-3">Reach us directly</p>
            <div className="flex gap-3 justify-center">
              <a
                href="tel:2028885362"
                className="flex items-center gap-2 bg-ember hover:bg-ember/90 active:scale-95 text-white font-sans font-semibold text-sm px-5 py-3 rounded-lg transition-all duration-150"
              >
                <Phone size={15} />
                Call Us
              </a>
              <a
                href="sms:2028885362"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/15 active:scale-95 text-white font-sans font-semibold text-sm px-5 py-3 rounded-lg transition-all duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Text Us
              </a>
            </div>
            <p className="font-sans text-white/30 text-xs mt-3">(202) 888-5362</p>
          </div>
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
