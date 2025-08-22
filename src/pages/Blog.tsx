import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            PortfoliX Blog
          </h1>
          
          <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-border p-8">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Insights, investing principles, and company updates. First post coming soon.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;