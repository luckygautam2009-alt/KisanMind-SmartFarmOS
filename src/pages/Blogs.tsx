import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calendar, User, ArrowRight, Share2, Bookmark, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const BLOG_POSTS = [
  {
    id: 1,
    title: "Organic Pest Control: The Ultimate Guide for Indian Farmers",
    titleHi: "जैविक कीट नियंत्रण: भारतीय किसानों के लिए अंतिम गाइड",
    excerpt: "Learn how to protect your crops using natural methods available in your own backyard. From Neem oil to Dashparni Ark.",
    excerptHi: "अपने घर के पिछवाड़े में उपलब्ध प्राकृतिक तरीकों का उपयोग करके अपनी फसलों की रक्षा करना सीखें। नीम के तेल से लेकर दशपर्णी अर्क तक।",
    contentHi: `जैविक कीट नियंत्रण रसायनों के बिना आपकी फसलों को बचाने का सबसे प्रभावी तरीका है। 
    
1. **नीम का तेल (Neem Oil):** यह लगभग सभी प्रकार के कीटों के लिए रामबाण है। 1 लीटर पानी में 5 मिली नीम का तेल और थोड़ा साबुन मिलाकर छिड़काव करें।
2. **दशपर्णी अर्क (Dashparni Ark):** 10 अलग-अलग कड़वी पत्तियों से बना यह अर्क इल्लियों और रस चूसने वाले कीटों के खिलाफ बहुत प्रभावी है।
3. **पीला स्टिकी ट्रैप (Yellow Sticky Traps):** सफेद मक्खी और अन्य उड़ने वाले कीटों को पकड़ने के लिए इनका उपयोग करें।

प्राकृतिक खेती न केवल आपकी लागत कम करती है बल्कि मिट्टी की उर्वरता को भी बनाए रखती है।`,
    author: "Dr. Rajesh Kumar",
    date: "April 28, 2026",
    category: "Organic Farming",
    image: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?auto=format&fit=crop&q=80&w=800",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "Understanding Soil Health: NPK Ratios Decoded",
    titleHi: "मिट्टी के स्वास्थ्य को समझना: NPK अनुपात का रहस्य",
    excerpt: "Does your soil lack vitality? We break down the complex science of nitrogen, phosphorus, and potassium for maximizing yield.",
    excerptHi: "क्या आपकी मिट्टी में जीवन शक्ति की कमी है? हम उपज को अधिकतम करने के लिए नाइट्रोजन, फास्फोरस और पोटेशियम के जटिल विज्ञान को सरल बनाते हैं।",
    contentHi: `NPK का मतलब है नाइट्रोजन (N), फास्फोरस (P) और पोटेशियम (K)। ये पौधों के लिए तीन सबसे महत्वपूर्ण पोषक तत्व हैं।

- **नाइट्रोजन (N):** यह पौधों की पत्तियों और वानस्पतिक विकास के लिए जिम्मेदार है।
- **फास्फोरस (P):** यह जड़ों के विकास और फूलों/फलों के निर्माण में मदद करता है।
- **पोटेशियम (K):** यह पौधों की रोग प्रतिरोधक क्षमता बढ़ाता है और दाने की गुणवत्ता सुधारता है।

मिट्टी परीक्षण (Soil Testing) हर साल अवश्य कराएं ताकि आप जरूरत के अनुसार ही खाद डालें।`,
    author: "Anita Sharma",
    date: "April 25, 2026",
    category: "Soil Science",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=800",
    readTime: "12 min read"
  },
  {
    id: 3,
    title: "Drip Irrigation: A Game Changer for Water-Scarce Regions",
    titleHi: "ड्रिप सिंचाई: पानी की कमी वाले क्षेत्रों के लिए एक बड़ा बदलाव",
    excerpt: "How small-scale farmers in Rajasthan increased their profits by 40% using affordable drip systems.",
    excerptHi: "राजस्थान में छोटे पैमाने के किसानों ने किफायती ड्रिप सिस्टम का उपयोग करके अपने मुनाफे में 40% की वृद्धि कैसे की।",
    contentHi: `ड्रिप सिंचाई (टपक सिंचाई) पानी के कुशल उपयोग की एक आधुनिक विधि है।

**इसके फायदे:**
- 70% तक पानी की बचत।
- उर्वरकों का सीधा जड़ों तक पहुंचना (फर्टिगेशन)।
- खरपतवारों में कमी क्योंकि पानी केवल पौधों की जड़ों को मिलता है।

राजस्थान के कई जिलों में किसानों ने ड्रिप अपनाकर कम पानी में अधिक उत्पादन लेना शुरू कर दिया है। सरकार इस पर 80-90% तक सब्सिडी भी दे रही है।`,
    author: "Vikram Singh",
    date: "April 22, 2026",
    category: "Irrigation",
    image: "https://images.unsplash.com/photo-1594498257602-32638e9858d3?auto=format&fit=crop&q=80&w=800",
    readTime: "10 min read"
  },
  {
    id: 4,
    title: "Government Subsidies 2026: What You Need to Know",
    titleHi: "सरकारी सब्सिडी 2026: आपको क्या जानने की जरूरत है",
    excerpt: "A comprehensive list of latest PM-Kisan updates and state-level machinery subsidies to apply for this month.",
    excerptHi: "इस महीने आवेदन करने के लिए नवीनतम PM-किसान अपडेट और राज्य-स्तरीय मशीनरी सब्सिडी की एक विस्तृत सूची।",
    contentHi: `2026 के लिए कृषि बजट में कई महत्वपूर्ण सब्सिडी घोषणाएं की गई हैं:

1. **PM-Kisan:** अब किसानों को सालाना 6000 की जगह 8000 रुपये मिलेंगे।
2. **ट्रैक्टर सब्सिडी:** छोटे और सीमांत किसानों के लिए 50% तक की छूट।
3. **सोलर पंप (KUSUM Yojana):** खेतों में सौर ऊर्जा पंप लगाने के लिए 90% तक सरकारी मदद।

इन योजनाओं का लाभ लेने के लिए अपने नजदीकी कृषि सेवा केंद्र (CSC) से संपर्क करें या सरकारी पोर्टल पर ऑनलाइन आवेदन करें।`,
    author: "Legal Desk",
    date: "April 20, 2026",
    category: "Policy",
    image: "https://images.unsplash.com/photo-1532187875605-1ff64ef4d99e?auto=format&fit=crop&q=80&w=800",
    readTime: "15 min read"
  }
];

export function Blogs() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { lang, t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">
            {t('farmersJournal')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            {lang === 'hi' 
              ? 'कृषि परिदृश्य से विशेषज्ञ अंतर्दृष्टि, आधुनिक तकनीक और सफलता की कहानियां।' 
              : 'Expert insights, modern techniques, and success stories from across the agricultural landscape.'}
          </p>
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
            className={`group glass-panel rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-brand-500/50 transition-all flex flex-col h-full shadow-xl shadow-slate-200/50 dark:shadow-none ${expandedId === post.id ? 'lg:col-span-2 row-span-2' : ''}`}
          >
            <div className={`relative ${expandedId === post.id ? 'aspect-[21/9]' : 'aspect-[16/10]'} overflow-hidden`}>
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
               {expandedId === post.id && (
                 <button 
                  onClick={() => setExpandedId(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
                 >
                   <X className="w-5 h-5" />
                 </button>
               )}
            </div>

            <div className="p-8 flex flex-col flex-1">
               <div className="flex items-center gap-4 text-xs font-bold text-slate-400 mb-4">
                  <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</div>
                  <div className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {post.author}</div>
                  <div className="ml-auto text-brand-500">{post.readTime}</div>
               </div>
               
               <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 transition-colors leading-tight">
                 {lang === 'hi' ? post.titleHi : post.title}
               </h2>
               
               <p className="text-slate-600 dark:text-slate-400 text-base mb-6 font-medium leading-relaxed">
                 {lang === 'hi' ? post.excerptHi : post.excerpt}
               </p>

               <AnimatePresence>
                 {expandedId === post.id && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     className="mb-6 overflow-hidden border-t border-slate-100 dark:border-slate-800 pt-6"
                   >
                     <p className="text-slate-700 dark:text-slate-300 text-lg whitespace-pre-line font-medium leading-loose">
                       {post.contentHi}
                     </p>
                     <p className="mt-8 text-xs text-slate-400 italic">
                       {lang === 'hi' ? 'यह सामग्री विशेष रूप से हिंदी में उपलब्ध है।' : 'This detailed content is available exclusively in Hindi.'}
                     </p>
                   </motion.div>
                 )}
               </AnimatePresence>

               <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-brand-500">
                        <Share2 className="w-4 h-4" />
                     </button>
                     <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-brand-500">
                        <Bookmark className="w-4 h-4" />
                     </button>
                  </div>
                  {expandedId !== post.id && (
                    <button 
                      onClick={() => setExpandedId(post.id)}
                      className="flex items-center gap-2 text-sm font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest group/btn hover:scale-105 transition-transform"
                    >
                      {t('readMore')} <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  )}
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
