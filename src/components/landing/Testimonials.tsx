import { Star } from "lucide-react";

interface T {
  quote: string;
  name: string;
  role: string;
  city: string;
  initials: string;
  gradient: string;
}

const testimonials: T[] = [
  {
    quote:
      "StarterScope's AI found three opportunities in Indore I would have never considered. The OSM verification made me confident the data was real.",
    name: "Rohan Mehta",
    role: "Founder",
    city: "Indore",
    initials: "RM",
    gradient: "from-accent-emerald to-vivid-blue",
  },
  {
    quote:
      "The competitive density map alone saved me from opening in a saturated location. I pivoted and launched successfully in a gap market.",
    name: "Priya Nair",
    role: "Serial Entrepreneur",
    city: "Bangalore",
    initials: "PN",
    gradient: "from-vivid-rose to-vivid-amber",
  },
  {
    quote:
      "₹499 per month for intelligence that would cost lakhs in traditional market research. The ROI is unreal.",
    name: "Arjun Sharma",
    role: "Business Analyst",
    city: "Pune",
    initials: "AS",
    gradient: "from-vivid-violet to-vivid-blue",
  },
  {
    quote:
      "As a first-time founder, the strategic roadmap feature gave me a complete launch plan. My investors were impressed by the depth.",
    name: "Kavya Reddy",
    role: "Startup Founder",
    city: "Hyderabad",
    initials: "KR",
    gradient: "from-vivid-amber to-accent-emerald",
  },
];

function Card({ t }: { t: T }) {
  return (
    <div className="w-[340px] flex-shrink-0 glass-card p-7">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="w-4 h-4 text-vivid-amber fill-vivid-amber" />
        ))}
      </div>
      <p className="mt-3 font-body text-[15px] text-text-secondary italic leading-[1.75]">
        "{t.quote}"
      </p>
      <div className="mt-5 flex items-center gap-3">
        <div
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm`}
        >
          {t.initials}
        </div>
        <div>
          <div className="font-body font-semibold text-[15px] text-text-primary">
            {t.name}
          </div>
          <div className="font-body text-[13px] text-text-muted">
            {t.role}, {t.city}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const doubled = [...testimonials, ...testimonials];
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow text-accent-emerald">◈ TESTIMONIALS ◈</span>
          <h2 className="mt-4 font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-text-primary">
            Entrepreneurs Trust StarterScope
          </h2>
        </div>
      </div>

      <div className="mt-14 relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="flex gap-5 animate-scroll-x hover:[animation-play-state:paused] w-max">
          {doubled.map((t, i) => (
            <Card key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
