import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Portfolio Manager",
    company: "Goldman Sachs",
    image: "photo-1494790108755-2616b612b786",
    content: "PortfoliX has revolutionized how I approach portfolio construction. The AI insights are incredibly accurate and have helped me achieve 23% better returns for my clients.",
    rating: 5,
    highlight: "23% better returns"
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Investment Advisor",
    company: "Fidelity Investments",
    image: "photo-1507003211169-0a1dd7228f2d",
    content: "The speed and accuracy of PortfoliX's market analysis is unmatched. What used to take hours now takes minutes, and the results are consistently superior.",
    rating: 5,
    highlight: "Hours to minutes"
  },
  {
    id: 3,
    name: "Emily Thompson",
    role: "Wealth Manager",
    company: "JP Morgan Chase",
    image: "photo-1438761681033-6461ffad8d80",
    content: "My clients love the transparency and real-time insights. PortfoliX has helped me scale my practice while maintaining personalized service for each client.",
    rating: 5,
    highlight: "Scaled practice 3x"
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

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-8">
            Trusted by professionals at leading financial institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-sans-bold text-foreground">Goldman Sachs</div>
            <div className="text-2xl font-sans-bold text-foreground">JP Morgan</div>
            <div className="text-2xl font-sans-bold text-foreground">Fidelity</div>
            <div className="text-2xl font-sans-bold text-foreground">BlackRock</div>
            <div className="text-2xl font-sans-bold text-foreground">Vanguard</div>
          </div>
        </div>
      </div>
    </section>
  );
};