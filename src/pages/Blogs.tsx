import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, User, ArrowRight, Share2, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const BLOG_POSTS = [
  {
    id: 1,
    title: "Organic Pest Control: The Ultimate Guide for Indian Farmers",
    excerpt: "Learn how to protect your crops using natural methods available in your own backyard. From Neem oil to Dashparni Ark.",
    author: "Dr. Rajesh Kumar",
    date: "April 28, 2026",
    category: "Organic Farming",
    image: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=800",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "Understanding Soil Health: NPK Ratios Decoded",
    excerpt: "Does your soil lack vitality? We break down the complex science of nitrogen, phosphorus, and potassium for maximizing yield.",
    author: "Anita Sharma",
    date: "April 25, 2026",
    category: "Soil Science",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800",
    readTime: "12 min read"
  },
  {
    id: 3,
    title: "Drip Irrigation: A Game Changer for Water-Scarce Regions",
    excerpt: "How small-scale farmers in Rajasthan increased their profits by 40% using affordable drip systems.",
    author: "Vikram Singh",
    date: "April 22, 2026",
    category: "Irrigation",
    image: "https://images.unsplash.com/photo-1594498257602-32638e9858d3?auto=format&fit=crop&q=80&w=800",
    readTime: "10 min read"
  },
  {
    id: 4,
    title: "Government Subsidies 2026: What You Need to Know",
    excerpt: "A comprehensive list of latest PM-Kisan updates and state-level machinery subsidies to apply for this month.",
    author: "Legal Desk",
    date: "April 20, 2026",
    category: "Policy",
    image: "https://images.unsplash.com/photo-1532187875605-1ff64ef4d99e?auto=format&fit=crop&q=80&w=800",
    readTime: "15 min read"
  }
];

export function Blogs() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">Farmer's Journal</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">Expert insights, modern techniques, and success stories from across the agricultural landscape.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-6 py-2.5 bg-brand-600 text-white rounded-full text-sm font-bold shadow-lg shadow-brand-500/30">Latest</button>
            <button className="px-6 py-2.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-full text-sm font-bold border border-slate-200 dark:border-slate-800">Trending</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post, idx) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group glass-panel rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-500/50 transition-all flex flex-col h-full shadow-xl shadow-slate-200/50 dark:shadow-none"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
               <img 
                 src={post.image} 
                 alt={post.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
               />
               <div className="absolute top-4 left-4">
                 <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-brand-600 shadow-sm leading-none border border-brand-500/10">
                   {post.category}
                 </span>
               </div>
            </div>

            <div className="p-8 flex flex-col flex-1">
               <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                  <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</div>
                  <div className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {post.author}</div>
               </div>
               
               <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 transition-colors leading-tight">
                 {post.title}
               </h2>
               
               <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 font-medium">
                 {post.excerpt}
               </p>

               <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-brand-500">
                        <Share2 className="w-4 h-4" />
                     </button>
                     <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-brand-500">
                        <Bookmark className="w-4 h-4" />
                     </button>
                  </div>
                  <button className="flex items-center gap-2 text-sm font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest group/btn">
                    Read More <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
               </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Featured Newsletter Box */}
      <section className="mt-20 glass-panel rounded-[3rem] p-8 md:p-16 bg-gradient-to-br from-brand-500 to-brand-700 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
         
         <div className="relative z-10 max-w-2xl">
            <BookOpen className="w-16 h-16 text-white mb-8 opacity-20" />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-[1.1]">Join 50,000+ Farmers subscribing to our insights.</h2>
            <p className="text-white/80 text-lg mb-10 font-medium tracking-wide leading-relaxed">
              Get the latest crop techniques, market trends, and policy updates delivered straight to your WhatsApp and email.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
               <input 
                 type="text" 
                 placeholder="Your phone or email" 
                 className="flex-1 px-8 py-5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-white transition-all font-bold"
               />
               <button className="px-10 py-5 bg-white text-brand-600 rounded-full font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl">
                 Subscribe
               </button>
            </div>
         </div>
      </section>
    </div>
  );
}
