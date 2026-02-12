import { CheckCircle, Clock, Shield, ArrowRight } from "lucide-react";

const valueProps = [
  {
    icon: CheckCircle,
    title: "Stop Guessing, Start Investing",
    description: "Answer 3 simple questions and get a complete portfolio matched to your goals. No confusing financial jargon.",
  },
  {
    icon: Clock,
    title: "Portfolio in Minutes, Not Months",
    description: "Skip the research paralysis. Our portfolios are built by analyzing thousands of successful investment strategies.",
  },
  {
    icon: Shield,
    title: "Use Your Own Brokerage",
    description: "Keep control of your money. We provide the portfolio, you implement it wherever you invest—Fidelity, Vanguard, Schwab, or any other.",
  }
];

const steps = [
  {
    title: "Answer 3 Questions",
    description: "Tell us your goals, timeline, and how you feel about risk. Takes under a minute.",
  },
  {
    title: "Get Your Portfolio",
    description: "Receive a personalized portfolio with exact investments and percentages.",
  },
  {
    title: "Invest with Confidence",
    description: "Copy the portfolio to your brokerage and start building wealth.",
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="relative py-20 sm:py-24 md:py-32 overflow-hidden" style={{ background: 'hsl(0 0% 6%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-foreground mb-5">
            Investing Made{" "}
            <span className="text-gradient">Simple</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            No finance degree. No complicated research. Just clear guidance on what to invest in and why.
          </p>
        </div>

        {/* Value prop cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {valueProps.map((prop, index) => (
            <div
              key={index}
              className="group rounded-xl border border-border bg-card p-8 hover:border-primary/30 transition-all duration-300 hover-lift"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                <prop.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-foreground mb-3 group-hover:text-primary transition-colors">
                {prop.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-[15px]">
                {prop.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mt-24 sm:mt-32 max-w-4xl mx-auto">
          <h2 className="text-foreground text-center mb-12 sm:mb-16">
            How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Connector line (desktop only) */}
                {index < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-7 left-[60%] w-[80%] h-px bg-border" />
                )}
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-primary to-success text-primary-foreground font-bold text-xl mx-auto mb-5 relative z-10 shadow-lg shadow-primary/20">
                  {index + 1}
                </div>
                <h3 className="text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
