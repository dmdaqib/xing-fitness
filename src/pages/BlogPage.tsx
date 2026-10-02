import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Clock,
  ChevronRight,
  Search,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { BLOG_POSTS } from '../data/blog';
import type { BlogPost } from '../types';

interface BlogPageProps {
  onOpenTrialModal?: (topic?: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onOpenTrialModal = () => {} }) => {
  const { slug } = useParams<{ slug?: string }>();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(() => {
    if (slug) {
      return BLOG_POSTS.find((p) => p.slug === slug) || null;
    }
    return null;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Strength Training',
    'Weight Loss',
    'Personal Training',
    'HIIT',
    'Yoga',
    'Functional Training',
    'Nutrition',
    'Beginner Fitness',
    'Gym Tips'
  ];

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        post.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="pt-28 pb-20 bg-[#090A0D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {selectedPost ? (
          /* ======================================================== */
          /* INDIVIDUAL ARTICLE READER VIEW                          */
          /* ======================================================== */
          <article className="max-w-3xl mx-auto animate-in fade-in duration-200">
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37] hover:underline mb-8"
            >
              ← Back to All Articles
            </button>

            <div className="rounded-3xl overflow-hidden aspect-[16/9] mb-8 border border-white/10 shadow-2xl">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/20">
                {selectedPost.category}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                <Clock className="w-3.5 h-3.5" />
                <span>{selectedPost.readTime}</span>
              </span>
              <span className="text-xs text-[#94A3B8]">•</span>
              <span className="text-xs text-[#94A3B8]">{selectedPost.date}</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight mb-6 leading-tight">
              {selectedPost.title}
            </h1>

            <p className="text-base sm:text-lg text-gray-300 font-medium leading-relaxed mb-8 pb-6 border-b border-white/10">
              {selectedPost.summary}
            </p>

            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-6 text-sm sm:text-base">
              {selectedPost.content.split('\n\n').map((block, idx) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith('### ')) {
                  return (
                    <h2
                      key={idx}
                      className="font-display font-bold text-xl sm:text-2xl text-white pt-4 pb-1 border-b border-white/5"
                    >
                      {trimmed.replace('### ', '')}
                    </h2>
                  );
                }

                if (trimmed.startsWith('1. ') || trimmed.startsWith('- ')) {
                  const items = trimmed.split('\n');
                  return (
                    <ul key={idx} className="space-y-2 pl-4">
                      {items.map((item, iIdx) => (
                        <li key={iIdx} className="text-gray-300 list-disc">
                          {item.replace(/^[0-9]+\.\s+/, '').replace(/^-\s+/, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p key={idx} className="text-gray-300 leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Article Action Card */}
            <div className="mt-12 p-8 rounded-3xl bg-[#14161D] border border-[#D4AF37]/30 text-center relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block mb-2">
                Put Science Into Practice
              </span>
              <h3 className="font-display font-black text-xl sm:text-2xl text-white mb-3">
                TEST YOUR FORM AT XING FITNESS BROOKEFIELD
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto mb-6">
                Our certified coaching team is on the training floor to ensure you execute movements safely and effectively. Book a complimentary 1-Day Trial Pass.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onOpenTrialModal(selectedPost.title)}
                  className="px-6 py-3 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
                >
                  <span>Book Free Trial Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-display font-bold text-xs uppercase tracking-wider border border-white/10 transition-all"
                >
                  View More Articles
                </button>
              </div>
            </div>
          </article>
        ) : (
          /* ======================================================== */
          /* BLOG LISTING & DIRECTORY VIEW                            */
          /* ======================================================== */
          <>
            <SectionHeading
              eyebrow="Evidence-Based Guidance"
              title="XING FITNESS KNOWLEDGE HUB"
              subtitle="Practical, research-backed training, nutrition, and recovery insights tailored for real lifters and working professionals in Bengaluru."
            />

            {/* Search & Category Filter Controls */}
            <div className="mb-12 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles, topics..."
                    className="w-full bg-[#14161D] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="text-xs text-[#94A3B8]">
                  Showing <strong className="text-white">{filteredPosts.length}</strong> verified articles
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20'
                        : 'bg-white/5 text-[#94A3B8] hover:text-white border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Article Hero (When no search active) */}
            {!searchQuery && selectedCategory === 'All' && featuredPost && (
              <div className="mb-16 rounded-3xl bg-[#14161D] border border-[#D4AF37]/30 overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-0 group">
                <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full bg-[#D4AF37] text-black text-xs font-black uppercase tracking-wider shadow-lg">
                      Featured Guide
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-bold uppercase tracking-wider mb-2">
                      <span>{featuredPost.category}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                    </div>

                    <h2 className="font-display font-black text-2xl sm:text-3xl text-white mb-4 leading-snug">
                      {featuredPost.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
                      {featuredPost.summary}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedPost(featuredPost)}
                    className="w-full sm:w-auto self-start px-6 py-3.5 rounded-full bg-[#D4AF37] text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Article Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-3xl bg-[#14161D] border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
                >
                  <div>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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

                      <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setSelectedPost(post)}
                      className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#D4AF37] hover:text-black border border-white/10 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Read Article</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16 bg-[#14161D] rounded-3xl border border-white/10 p-8">
                <BookOpen className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                <h3 className="font-display font-bold text-lg text-white mb-1">
                  No Articles Found
                </h3>
                <p className="text-xs text-[#94A3B8] mb-4">
                  No articles matched your filter criteria "{searchQuery || selectedCategory}".
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
