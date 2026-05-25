import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Phone, MapPin, Star } from "lucide-react";

export default function ThankYouPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: quote, isLoading, error } = trpc.quote.getBySlug.useQuery({ slug });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#E8651A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 font-sans text-xs tracking-widest uppercase">Loading…</p>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center max-w-sm px-6">
          <h1 className="font-serif text-3xl text-white mb-3">Page Not Found</h1>
          <p className="text-white/40 font-sans text-sm">This link may have expired or is invalid.</p>
        </div>
      </div>
    );
  }

  const clientName = quote.clientName;

  const steps = [
    {
      num: "01",
      icon: Phone,
      title: "We'll call to get a card on file",
      desc: `Expect a call from (202) 888-5362. This secures your booking — you're not charged until after the service is complete.`,
    },
    {
      num: "02",
      icon: MapPin,
      title: "Live tracking on the day of service",
      desc: "You'll receive a link so you can see your team's real-time updates — on-the-way ETAs, arrival time, and more.",
    },
    {
      num: "03",
      icon: Star,
      title: "Share your experience",
      desc: "After your cleaning, we'd love to hear how it went. A quick review helps other homeowners find us — and means the world to our team.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Hero video */}
      <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "16/9", maxHeight: "520px" }}>
        <script src="https://fast.wistia.com/player.js" async />
        <script src="https://fast.wistia.com/embed/jtv8f50ale.js" async type="module" />
        <style>{`
          wistia-player[media-id='jtv8f50ale']:not(:defined) {
            background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/jtv8f50ale/swatch');
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
          media-id="jtv8f50ale"
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
          <p className="font-sans text-xs tracking-[0.3em] uppercase mb-1.5" style={{ color: "#E8651A" }}>
            You're all set
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-white" style={{ textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}>
            Maids in Black
          </h1>
          <p className="font-sans text-sm text-white/60 mt-1.5 tracking-wide">
            Thank you, <span className="text-white font-medium">{clientName}</span>
          </p>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="mb-8 md:mb-10">
          <span className="text-xs tracking-[0.3em] uppercase text-ember font-sans font-medium">What Happens Next</span>
          <h2 className="font-serif text-2xl md:text-4xl font-bold text-white mt-2 leading-tight">
            {clientName}, here's what to expect
          </h2>
        </div>

        <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden px-6 md:px-8 py-8 md:py-10 space-y-8">
          {steps.map(({ num, icon: Icon, title, desc }) => (
            <div key={num} className="flex gap-5 items-start">
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="w-11 h-11 rounded-full border border-ember/40 bg-ember/10 flex items-center justify-center">
                  <Icon size={18} className="text-ember" />
                </div>
                <span className="font-sans text-ember/50 text-xs font-bold">{num}</span>
              </div>
              <div className="pt-1">
                <p className="font-sans font-semibold text-white text-sm md:text-base mb-1.5">{title}</p>
                <p className="font-sans text-white/55 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-16 h-0.5 bg-ember/40 mx-auto my-10" />

        <div className="text-center px-4">
          <p className="font-serif text-lg md:text-xl text-white/80 italic leading-relaxed">
            "We can't wait to take care of your home."
          </p>
          <p className="font-sans text-xs text-white/30 mt-3 tracking-widest uppercase">— The Maids in Black Team</p>
        </div>
      </div>

      <footer className="text-center py-8 px-4 border-t border-white/5 mt-4">
        <p className="font-serif text-lg text-white/80 mb-1">Maids in Black</p>
        <p className="font-sans text-xs text-white/30 tracking-widest uppercase">Professional Cleaning Services</p>
      </footer>
    </div>
  );
}
