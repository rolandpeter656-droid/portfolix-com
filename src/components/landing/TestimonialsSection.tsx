import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Portfolio Strategist",
    company: "Ardent Brokerage Ltd (UK)",
    image: "photo-1573496359142-b8d87734a5a2",
    content: "PortfoliX transformed the way we build model portfolios for our clients. The AI-driven insights are sharp, fast, and intuitive — it's like having an in-house quant team without the overhead.",
    rating: 5,
    highlight: "In-house quant team"
  },
  {
    id: 2,
    name: "Michael Odebanjo",
    role: "Founder",
    company: "TradeLynk FinTech (Nigeria)",
    image: "photo-1506794778202-cad84cf45f1d",
    content: "As a fintech, speed and precision matter. PortfoliX lets us deliver smart portfolios in minutes — it's been a game changer for our clients and internal team alike.",
    rating: 5,
    highlight: "Minutes to deliver"
  },
  {
    id: 3,
    name: "Emily Thompson",
    role: "Head of Client Experience",
    company: "WealthFlow Advisory (USA)",
    image: "photo-1580489944761-15a19d654956",
    content: "PortfoliX bridges technology and investing beautifully. Our clients love the efficiency and accuracy it brings to portfolio recommendations.",
    rating: 5,
    highlight: "Tech + investing"
  }
];

export const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-success/10 text-success border-success/20">
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl font-sans-bold text-foreground mb-6">
            Trusted by Investment
            <span className="text-gradient block mt-2">Professionals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what industry leaders are saying about PortfoliX and how it's transforming their investment strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="group bg-gradient-card border-border hover:shadow-card transition-all duration-500 hover-scale relative overflow-hidden"
            >
              {/* Decorative Quote */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-16 w-16 text-primary" />
              </div>

              <CardContent className="p-8 relative z-10">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                  ))}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-foreground leading-relaxed mb-6 text-lg">
                  "{testimonial.content}"
                </blockquote>

                {/* Highlight Metric */}
                <div className="mb-6">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {testimonial.highlight}
                  </Badge>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={`https://images.unsplash.com/${testimonial.image}?auto=format&fit=crop&w=64&q=80`}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-border"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-background" />
                  </div>
                  <div>
                    <div className="font-sans-bold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-primary">{testimonial.company}</div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Wall Street-Level Strategies */}
        <div className="mt-20 text-center">
          <h3 className="text-3xl md:text-4xl font-sans-bold text-foreground mb-4">
            Backed by Wall Street-Level Strategies
          </h3>
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            PortfoliX is built on the same principles and portfolio construction methods used by leading investment managers worldwide.
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            We draw inspiration from the strategies pioneered by global firms like Goldman Sachs, JP Morgan, and BlackRock — but designed for everyday investors. Our portfolios follow time-tested frameworks trusted by institutional investors, adapted for accessibility and simplicity. PortfoliX bridges the gap between Wall Street and Main Street, bringing proven asset allocation methods to your fingertips.
          </p>
          
          {/* Credibility Markers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-foreground font-medium">Inspired by leading institutional frameworks</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-foreground font-medium">Built on rigorous investment research</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-foreground font-medium">Designed for real investors — not just Wall Street insiders</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};