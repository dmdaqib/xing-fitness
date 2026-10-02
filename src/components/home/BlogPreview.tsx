import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../../data/blog';

export const BlogPreview: React.FC = () => {
  const latestPosts = BLOG_POSTS.slice(0, 3);

  return (
    <section className="py-20 bg-[#090A0D] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Knowledge & Insights
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white mt-1">
              FITNESS & TRAINING BLOG
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mt-2 leading-relaxed">
              Evidence-based exercise science, desk-worker posture restoration, and realistic nutrition guidance.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:text-[#C5A028] transition-colors group shrink-0"
          >
            <span>Explore All Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="rounded-3xl bg-[#14161D] border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider border border-white/15">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Read Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
