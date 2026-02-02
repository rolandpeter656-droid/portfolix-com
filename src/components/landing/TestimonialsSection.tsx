import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

// Real testimonials with specific outcomes
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
    <section id="testimonials" className="relative py-12 sm:py-16 md:py-24 bg-secondary/30 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glass-blob glass-blob-purple w-[450px] h-[450px] top-0 right-0 animate-blob-float opacity-10" />
        <div className="glass-blob glass-blob-cyan w-[350px] h-[350px] bottom-0 left-0 animate-blob-float-delayed opacity-10" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <Badge className="mb-3 sm:mb-4 bg-success/10 text-success border-success/20 text-xs sm:text-sm">
            Real Results
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-sans-bold text-foreground mb-4 sm:mb-6">
            From Confused to
            <span className="text-gradient block mt-2">Confident Investors</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
            Real people who stopped overthinking and started investing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="group glass-card glass-glow-hover relative overflow-hidden"
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
                      src={`https://images.unsplash.com/${testimonial.image}?auto=format&fit=crop&w=48&q=60`}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-border"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-success rounded-full border-2 border-background" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-sans-bold text-foreground text-sm sm:text-base">{testimonial.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{testimonial.context}</div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why PortfoliX Works */}
        <div className="mt-12 sm:mt-16 md:mt-20 text-center px-2">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-sans-bold text-foreground mb-3 sm:mb-4">
            Why PortfoliX Works
          </h3>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">
            We turn investment research into clear, actionable portfolios you can use today.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 p-3 glass-card rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full flex-shrink-0"></div>
              <span className="text-foreground font-medium text-xs sm:text-sm">Based on proven investment principles</span>
            </div>
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 p-3 glass-card rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full flex-shrink-0"></div>
              <span className="text-foreground font-medium text-xs sm:text-sm">Personalized to your situation</span>
            </div>
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 p-3 glass-card rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full flex-shrink-0"></div>
              <span className="text-foreground font-medium text-xs sm:text-sm">Plain English explanations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
