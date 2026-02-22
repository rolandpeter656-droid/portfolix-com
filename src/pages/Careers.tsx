import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

const stats = [
  { value: "500+", label: "Portfolios Created" },
  { value: "2,000+", label: "Active Investors" },
  { value: "2", label: "Open Positions" },
  { value: "🌍", label: "Global Team" },
];

const ctoSkillsBuild = [
  "Scalable cloud infrastructure (AWS/GCP)",
  "AI/ML portfolio recommendation engine",
  "Brokerage API integrations",
  "Financial data pipelines",
  "Security & compliance systems",
  "Mobile + web platform architecture",
  "Database design & optimization",
  "Full product technical roadmap",
];

const ctoSkillsTech = [
  "Full-stack engineering (React, Node/Python/Go)",
  "Cloud infrastructure & DevOps",
  "System architecture & database design",
  "Security for financial data handling",
  "AI/ML integration experience",
  "Has shipped products real users love",
  "Startup or 0-to-1 product experience",
  "API design & third-party integrations",
];

const ctoTraits = [
  { label: "Bias toward action", desc: "Ships first, perfects later" },
  { label: "Honest communicator", desc: "Will tell me when ideas won't work" },
  { label: "Ego-checked", desc: "Comfortable with shared decision-making" },
  { label: "Resilient", desc: "Pre-PMF is messy. You don't bail." },
  { label: "Mission-driven", desc: "Fintech democratization excites you" },
  { label: "Comfortable with ambiguity", desc: "Figures it out as we go" },
];

const growthSkillsOwn = [
  "Social content strategy across all platforms",
  "Viral storytelling & brand narrative",
  "Community building & engagement",
  "Growth experiments & A/B testing",
  "SEO + content marketing",
  "Influencer & creator partnerships",
  "Email marketing & lifecycle flows",
  "Paid acquisition strategy",
];

const growthSkillsValue = [
  "Track record of content that went viral or grew audiences",
  "Strong visual + written storytelling instincts",
  "TikTok, Instagram, LinkedIn, Twitter fluency",
  "Understanding of growth metrics (CAC, LTV, conversion)",
  "Experience with consumer brands or fintech a plus",
  "Scrappy, resourceful, creative with limited budget",
  "SEO fundamentals and content marketing",
  "Data-driven — uses analytics to guide content decisions",
];

const growthTraits = [
  { label: "Natural storyteller", desc: "Makes complex things feel human" },
  { label: "Platform-native", desc: "Understands each platform's culture" },
  { label: "Obsessed with growth", desc: "Thinks about distribution constantly" },
  { label: "Creative experimenter", desc: "Tests fast, doubles down on what works" },
  { label: "Mission-connected", desc: "Believes in democratizing investing" },
  { label: "Self-directed", desc: "Doesn't need a manager to ship content" },
];

const cultureValues = [
  { emoji: "🌍", title: "Global by default", desc: "We're built for Lagos, Mumbai, and New York. Diverse perspectives aren't a checkbox — they're our edge." },
  { emoji: "⚡", title: "Bias toward shipping", desc: "We move fast. Done is better than perfect. We build, learn, and iterate — no endless planning cycles." },
  { emoji: "🔍", title: "Radical honesty", desc: "We say hard things directly. Bad ideas get challenged. That's how we make better decisions together." },
  { emoji: "🎯", title: "Mission > everything", desc: "We're not building a startup to flip it. We're building because portfolio paralysis is a real problem that hurts real people." },
  { emoji: "🏗️", title: "Ownership mindset", desc: "Everyone here owns something meaningful. No passengers — we're all builders at different layers of the stack." },
  { emoji: "🔓", title: "Async & flexible", desc: "We care about what you build, not when you build it. Work from wherever, whenever — just deliver." },
];

const ArrowGrid = ({ items }: { items: string[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {items.map((item) => (
      <div key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
        <span className="text-primary mt-0.5 shrink-0">→</span>
        <span>{item}</span>
      </div>
    ))}
  </div>
);

const TraitGrid = ({ traits }: { traits: { label: string; desc: string }[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
    {traits.map((t) => (
      <div key={t.label} className="bg-[#0A0A0A] border border-border rounded-xl p-4">
        <p className="text-sm font-semibold text-foreground mb-1">{t.label}</p>
        <p className="text-xs text-muted-foreground">{t.desc}</p>
      </div>
    ))}
  </div>
);

interface RoleCardProps {
  icon: string;
  title: string;
  subtitle: string;
  badges: string[];
  greenBadgeIndex: number;
  description: string;
  buildTitle: string;
  buildItems: string[];
  skillsTitle: string;
  skillsItems: string[];
  traitsTitle: string;
  traits: { label: string; desc: string }[];
  note: string;
  noteIcon: string;
  applyLabel: string;
  mailto: string;
}

const RoleCard = ({
  icon, title, subtitle, badges, greenBadgeIndex, description,
  buildTitle, buildItems, skillsTitle, skillsItems, traitsTitle, traits,
  note, noteIcon, applyLabel, mailto,
}: RoleCardProps) => (
  <div className="group relative bg-[#141414] border border-border rounded-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5 overflow-hidden">
    {/* Top gradient line on hover */}
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    {/* Header */}
    <div className="flex items-start gap-4 mb-6">
      <div className="flex items-center justify-center w-[52px] h-[52px] rounded-xl bg-primary/10 text-2xl shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="text-xl sm:text-[22px] font-bold text-foreground">{title}</h3>
        <p className="text-sm text-primary mt-0.5">{subtitle}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {badges.map((b, i) => (
            <span
              key={b}
              className={`text-xs px-2.5 py-1 rounded-full border ${
                i === greenBadgeIndex
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Description */}
    <div className="border-l-2 border-primary pl-4 mb-8">
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>

    {/* Build section */}
    <div className="mb-8">
      <h4 className="text-base font-semibold text-foreground mb-4">{buildTitle}</h4>
      <ArrowGrid items={buildItems} />
    </div>

    {/* Skills section */}
    <div className="mb-8">
      <h4 className="text-base font-semibold text-foreground mb-4">{skillsTitle}</h4>
      <ArrowGrid items={skillsItems} />
    </div>

    {/* Traits */}
    <div className="mb-8">
      <h4 className="text-base font-semibold text-foreground mb-4">{traitsTitle}</h4>
      <TraitGrid traits={traits} />
    </div>

    {/* Info note */}
    <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-6">
      <p className="text-sm text-muted-foreground leading-relaxed">
        {noteIcon} {note}
      </p>
    </div>

    {/* Apply button */}
    <a href={mailto} className="block">
      <Button className="w-full sm:w-auto bg-primary hover:bg-primary-glow text-primary-foreground font-semibold text-sm transition-all duration-200 hover:scale-[1.02]">
        {applyLabel}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </a>
  </div>
);

const Careers = () => {
  const ctoMailto = `mailto:peter@portfolixapps.com?subject=${encodeURIComponent("CTO Co-Founder Application — PortfoliX")}&body=${encodeURIComponent(`Hi Roland,

I'm interested in the CTO Co-Founder role at PortfoliX.

Here's a bit about my background:
[Tell us who you are and what you've built]

Here's what excites me about PortfoliX's mission:
[What specifically resonates with you]

Here's one thing I'd build first:
[Your quick technical thinking]

Links / Portfolio:
[GitHub, LinkedIn, website, etc.]`)}`;

  const growthMailto = `mailto:peter@portfolixapps.com?subject=${encodeURIComponent("Growth Marketer Application — PortfoliX")}&body=${encodeURIComponent(`Hi Roland,

I'm interested in the Growth Marketer role at PortfoliX.

Here's my marketing background:
[Tell us what you've grown or created]

Here's an example of content or campaign I'm proud of:
[Share a link or describe it]

Here's how I'd get PortfoliX its first 1,000 users:
[Your quick growth idea]

Links / Portfolio:
[Social accounts, portfolio, LinkedIn, etc.]`)}`;

  const generalMailto = `mailto:peter@portfolixapps.com?subject=${encodeURIComponent("General Interest — PortfoliX")}`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* HERO */}
      <section className="pt-32 pb-16 sm:pt-36 sm:pb-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          {/* Hiring pill */}
          <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-sm font-medium text-primary">We're Hiring</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Build the Future of{" "}
            <br className="hidden sm:block" />
            Global Investing
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12 animate-fade-in" style={{ animationDelay: "200ms" }}>
            We're a small team with a massive mission — making investing accessible to everyone.
            If you want to build something that actually matters, you're in the right place.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center">
                <div className="text-center px-4 sm:px-8">
                  <p className="text-2xl sm:text-3xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</p>
                </div>
                {i < stats.length - 1 && (
                  <div className="hidden sm:block w-px h-10 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION QUOTE */}
      <section className="border-y border-primary/20" style={{ background: "rgba(20,184,166,0.06)" }}>
        <div className="container mx-auto px-4 py-12 sm:py-16 max-w-3xl text-center">
          <p className="text-lg sm:text-xl font-medium text-foreground/90 leading-relaxed italic">
            "We're not building another fintech company. We're building the tool that gives
            someone in <span className="text-primary not-italic font-semibold">Lagos, Mumbai, or Houston</span> the same portfolio intelligence that used
            to cost $500/hour."
          </p>
        </div>
      </section>

      {/* OPEN POSITIONS */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">Open Positions</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Two seats. Outsized impact.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              We don't have a huge payroll to offer. We have equity, mission, and the chance to build something that matters.
            </p>
          </div>

          <div className="space-y-8">
            <RoleCard
              icon="⚙️"
              title="CTO & Co-Founder"
              subtitle="Technical Leadership · Full-Stack · Fintech"
              badges={["Remote · Global", "Part-time to start", "Equity Compensation", "Co-Founder Title"]}
              greenBadgeIndex={2}
              description="PortfoliX helps people build personalized investment portfolios in 3 minutes. We've proven people want this — now we need the technical co-founder who will build the infrastructure to serve millions. You won't just be writing code. You'll be architecting the technical vision, making foundational decisions, and owning the entire engineering function."
              buildTitle="What You'll Build"
              buildItems={ctoSkillsBuild}
              skillsTitle="Technical Skills We're Looking For"
              skillsItems={ctoSkillsTech}
              traitsTitle="Who You Are"
              traits={ctoTraits}
              noteIcon="💡"
              note="This is an equity-based, part-time role to start. We're pre-funding so there's no salary yet — you keep doing what pays your bills. The right person will sketch technical solutions during our first conversation, not ask about equity split before understanding the vision."
              applyLabel="Apply for CTO Role"
              mailto={ctoMailto}
            />

            <RoleCard
              icon="📈"
              title="Growth Marketer"
              subtitle="Content · Storytelling · Viral Growth"
              badges={["Remote · Global", "Part-time · Flexible", "Equity + Revenue Share", "Creative Freedom"]}
              greenBadgeIndex={2}
              description="We built a product that genuinely solves a problem millions of people have. What we need now is someone who can make the world know about it. Not a corporate marketer — a creative force who understands storytelling, makes content people actually share, and can turn a small fintech startup into a known brand."
              buildTitle="What You'll Own"
              buildItems={growthSkillsOwn}
              skillsTitle="Skills & Experience We Value"
              skillsItems={growthSkillsValue}
              traitsTitle="What You're Like"
              traits={growthTraits}
              noteIcon="🚀"
              note="This is a flexible, part-time role — we want your creativity, not your calendar. No rigid hours, no micromanaging. We care about one thing: are we growing? If you can help us get from 20 users to thousands and turn PortfoliX into a name people recognize, we want to talk."
              applyLabel="Apply for Growth Role"
              mailto={growthMailto}
            />
          </div>
        </div>
      </section>

      {/* DON'T SEE YOUR ROLE? */}
      <section className="pb-16 sm:pb-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="border-2 border-dashed border-border rounded-2xl p-8 sm:p-12 text-center">
            <h3 className="text-xl font-bold text-foreground mb-3">Don't see your role?</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              We're always interested in extraordinary people. If you believe in what we're building and have a skill that could help us get there, reach out.
            </p>
            <a href={generalMailto}>
              <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                <Mail className="mr-2 h-4 w-4" />
                Send Us a Note
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CULTURE / VALUES */}
      <section className="pb-16 sm:pb-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">Our Culture</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">What it's like to work here</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cultureValues.map((v) => (
              <div key={v.title} className="bg-[#141414] border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors duration-200">
                <span className="text-3xl mb-4 block">{v.emoji}</span>
                <h4 className="text-base font-semibold text-foreground mb-2">{v.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Careers;
