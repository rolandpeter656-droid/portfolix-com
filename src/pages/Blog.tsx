import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { BlogPostCard } from "@/components/BlogPostCard";
import { blogPosts } from "@/data/blogPosts";
import { useEffect } from "react";

const Blog = () => {
  useEffect(() => {
    document.title = "Blog — PortfoliX";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <header className="pt-28 pb-12 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary mb-4">
            PortfoliX Journal
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Ideas, Stories & Insights from the Team
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            We build in public. Here's what we're learning.
          </p>
        </div>
      </header>

      {/* Article Grid */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl py-12">
        {blogPosts.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
