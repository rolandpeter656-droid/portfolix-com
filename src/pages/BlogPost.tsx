import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { blogPosts, type BlogPostSection } from "@/data/blogPosts";
import { ArrowLeft, ArrowRight } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    if (post) document.title = `${post.title} — PortfoliX`;
  }, [post]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-xl text-muted-foreground mb-4">Post not found.</p>
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const renderSection = (section: BlogPostSection, index: number) => {
    switch (section.type) {
      case "paragraph":
        return (
          <p key={index} className="text-[17px] leading-[1.85] text-muted-foreground mb-7">
            {section.text}
          </p>
        );

      case "heading":
        return (
          <h2 key={index} className="text-2xl sm:text-3xl font-bold text-foreground mt-16 mb-5 leading-tight">
            {section.text}
          </h2>
        );

      case "pullquote":
        return (
          <blockquote
            key={index}
            className="border-l-[3px] border-primary pl-6 sm:pl-8 py-4 my-10 bg-primary/5 rounded-r-xl"
          >
            <p className="text-xl sm:text-[22px] italic text-foreground/90 leading-relaxed">
              {section.text}
            </p>
          </blockquote>
        );

      case "highlightbox":
        return (
          <div
            key={index}
            className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 my-10"
          >
            <p className="text-xs font-mono uppercase tracking-[0.15em] text-primary mb-3 font-semibold">
              {section.label}
            </p>
            <p className="text-lg italic text-foreground/90 leading-relaxed">
              {section.text}
            </p>
          </div>
        );

      case "stats":
        return (
          <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
            {section.items.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-6 text-center"
              >
                <p className="text-3xl font-bold text-primary mb-1">{item.number}</p>
                <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        );

      case "timeline":
        return (
          <div key={index} className="relative my-10 pl-8">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-primary/30" />
            <div className="space-y-8">
              {section.items.map((item, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-8 top-1 w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <h3 className="text-base font-medium text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case "cta":
        return (
          <div key={index} className="rounded-2xl border border-border bg-card p-6 sm:p-10 my-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Join the Mission
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              PortfoliX is building the infrastructure for intelligent, personalized investing — for everyone.
              We're at the stage where the right people joining makes all the difference.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "🛠",
                  title: "Join the Team",
                  desc: "We're looking for engineers, designers, and growth leads who want to work on something that matters.",
                  link: "/careers",
                  label: "Apply to join",
                },
                {
                  icon: "🤝",
                  title: "Invest in PortfoliX",
                  desc: "We're seeking angel checks from investors who back mission-driven fintech at the earliest stages.",
                  link: "mailto:hello@portfolixapps.com",
                  label: "Get in touch",
                },
                {
                  icon: "📈",
                  title: "Build Your Portfolio",
                  desc: "Three questions. Three minutes. A personalized portfolio matched to your goals — free, forever.",
                  link: "/?start=builder",
                  label: "Start building",
                },
              ].map((card, i) => (
                <a
                  key={i}
                  href={card.link}
                  className="rounded-xl border border-border bg-background p-5 hover:border-primary transition-colors group block"
                >
                  <p className="text-2xl mb-3">{card.icon}</p>
                  <h3 className="text-base font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{card.desc}</p>
                  <span className="text-sm text-primary font-medium group-hover:underline inline-flex items-center gap-1">
                    {card.label} <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-primary z-[60] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />

      <Navigation />

      {/* Hero */}
      <header className="pt-28 pb-12 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider font-mono text-primary bg-primary/10 rounded-full mb-6">
            {post.category}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-[44px] font-bold text-foreground leading-[1.15] mb-5">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            {post.subtitle}
          </p>

          {/* Author row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
              {post.authorInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{post.author}</p>
              <p className="text-xs text-muted-foreground">
                {post.authorRole} · {post.publishedAt} · {post.readTime}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Article body */}
      <article className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl py-16">
        {post.content.map((section, i) => renderSection(section, i))}
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
