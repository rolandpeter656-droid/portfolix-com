import { useNavigate } from "react-router-dom";
import type { BlogPost } from "@/data/blogPosts";

interface BlogPostCardProps {
  post: BlogPost;
}

export const BlogPostCard = ({ post }: BlogPostCardProps) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/blog/${post.slug}`)}
      className="group cursor-pointer rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_8px_30px_hsl(var(--primary)/0.12)]"
    >
      {/* Gradient banner */}
      <div className={`h-40 bg-gradient-to-br ${post.coverGradient} relative`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.3) 0%, transparent 50%)' }} />
      </div>

      <div className="p-6 space-y-4">
        {/* Category badge */}
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider font-mono text-primary bg-primary/10 rounded-full">
          {post.category}
        </span>

        {/* Title */}
        <h2 className="text-lg font-bold text-foreground leading-tight line-clamp-3 group-hover:text-primary transition-colors">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Author row */}
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
            {post.authorInitials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{post.author}</p>
            <p className="text-xs text-muted-foreground">
              {post.publishedAt} · {post.readTime}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};
