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
    <section id="testimonials" className="py-12 sm:py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <Badge className="mb-3 sm:mb-4 bg-success/10 text-success border-success/20 text-xs sm:text-sm">
            Testimonials
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans-bold text-foreground mb-4 sm:mb-6">
            Trusted by Investment
            <span className="text-gradient block mt-2">Professionals</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            See what industry leaders are saying about PortfoliX and how it's transforming their investment strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="group bg-gradient-card border-border hover:shadow-card transition-all duration-500 hover-scale relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-primary" />
              </div>

              <CardContent className="p-4 sm:p-6 md:p-8 relative z-10">
                <div className="flex items-center gap-1 mb-4 sm:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-warning text-warning" />
                  ))}
                </div>

                <blockquote className="text-foreground leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
                  "{testimonial.content}"
                </blockquote>

                <div className="mb-4 sm:mb-6">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm">
                    {testimonial.highlight}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={`https://images.unsplash.com/${testimonial.image}?auto=format&fit=crop&w=64&q=80`}
                      alt={testimonial.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-border"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-success rounded-full border-2 border-background" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-sans-bold text-foreground text-sm sm:text-base truncate">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground truncate">{testimonial.role}</div>
                    <div className="text-xs sm:text-sm text-primary truncate">{testimonial.company}</div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Wall Street-Level Strategies */}
        <div className="mt-12 sm:mt-16 md:mt-20 text-center px-2">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-sans-bold text-foreground mb-3 sm:mb-4">
            Backed by Wall Street-Level Strategies
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4 sm:mb-6 max-w-3xl mx-auto">
            PortfoliX is built on the same principles and portfolio construction methods used by leading investment managers worldwide.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed">
            We draw inspiration from the strategies pioneered by global firms like Goldman Sachs, JP Morgan, and BlackRock — but designed for everyday investors.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 p-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span className="text-foreground font-medium text-xs sm:text-sm">Inspired by leading institutional frameworks</span>
            </div>
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 p-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span className="text-foreground font-medium text-xs sm:text-sm">Built on rigorous investment research</span>
            </div>
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 p-2">
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <span className="text-foreground font-medium text-xs sm:text-sm">Designed for real investors</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};