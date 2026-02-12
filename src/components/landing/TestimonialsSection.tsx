import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    context: "First-time investor",
    image: "photo-1573496359142-b8d87734a5a2",
    content: "I had $15K sitting in cash because I didn't know what to buy. PortfoliX gave me a clear plan in 5 minutes. I implemented it the same day.",
    rating: 5,
    highlight: "Invested same day"
  },
  {
    id: 2,
    name: "James K.",
    context: "Investing for 2 years",
    image: "photo-1506794778202-cad84cf45f1d",
    content: "Finally feels like I have a real investment strategy instead of just buying random stocks my friends mention.",
    rating: 5,
    highlight: "Real strategy"
  },
  {
    id: 3,
    name: "Maria L.",
    context: "Building retirement savings",
    image: "photo-1580489944761-15a19d654956",
    content: "The explanations helped me understand why each investment belongs in my portfolio. I actually feel confident now.",
    rating: 5,
    highlight: "Feel confident"
  }
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="relative py-20 sm:py-24 md:py-32 overflow-hidden" style={{ background: 'hsl(0 0% 6%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-16">
          <Badge className="mb-5 bg-success/10 text-success border-success/20 text-sm font-medium">
            Real Results
          </Badge>
          <h2 className="text-foreground mb-5">
            From Confused to{" "}
            <span className="text-gradient">Confident</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real people who stopped overthinking and started investing.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group rounded-xl border border-border bg-card p-6 sm:p-8 hover:border-primary/30 transition-all duration-300 hover-lift relative overflow-hidden"
            >
              {/* Quote watermark */}
              <Quote className="absolute top-4 right-4 h-12 w-12 text-white/[0.03]" />

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-foreground leading-relaxed mb-5 text-[15px]">
                "{testimonial.content}"
              </blockquote>

              {/* Highlight badge */}
              <Badge className="bg-primary/10 text-primary border-primary/10 text-xs mb-5">
                {testimonial.highlight}
              </Badge>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-border">
                <img
                  src={`https://images.unsplash.com/${testimonial.image}?auto=format&fit=crop&w=48&q=60`}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-border"
                  loading="lazy"
                />
                <div>
                  <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.context}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why it works */}
        <div className="mt-20 sm:mt-24 text-center">
          <h3 className="text-foreground mb-8">Why PortfoliX Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              "Based on proven investment principles",
              "Personalized to your situation",
              "Plain English explanations",
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2 p-4 rounded-lg border border-border bg-card">
                <div className="w-1.5 h-1.5 bg-success rounded-full flex-shrink-0" />
                <span className="text-foreground text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
