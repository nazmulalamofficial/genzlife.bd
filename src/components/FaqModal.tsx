import React, { useState, useMemo } from "react";
import { 
  HelpCircle, 
  X, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  PhoneCall, 
  Sparkles, 
  PlusCircle, 
  Lock,
  Tag
} from "lucide-react";

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'bn' | 'en';
  onOpenCreateAd?: () => void;
}

interface FaqItem {
  id: string;
  category: 'posting' | 'safety' | 'found' | 'legal';
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
  highlightsBn?: string[];
  highlightsEn?: string[];
}

const FAQ_DATA: FaqItem[] = [
  // Category: Posting Guide
  {
    id: "faq-1",
    category: "posting",
    questionBn: "কিভাবে www.looking.bd পোর্টালে নতুন হারানো বিজ্ঞপ্তি পোস্ট করবেন?",
    questionEn: "How to post a lost notice on www.looking.bd?",
    answerBn: "বিজ্ঞপ্তি পোস্ট করার প্রক্রিয়াটি ২টি সহজ ধাপে সম্পন্ন হয়:\n• ধাপ ১: পণ্যের শিরোনাম, ক্যাটাগরি, ব্র্যান্ড, মডেল, সুনির্দিষ্ট সিরিয়াল বা IMEI নম্বর, হারানো স্থান এবং ছবি সংযুক্ত করুন। আপলোডকৃত ছবিতে দাগ বা ক্ষতি হাইলাইট করতে বৃত্ত বা তীরচিহ্ন এঁকে দিন।\n• ধাপ ২: সংশ্লিষ্ট থানার জিডি (GD) নাম্বার, জিডি অনুলিপি (কাগজের ছবি বা পিডিএফ) এবং কোনো ঘোষিত সন্ধানদাতা পুরস্কার থাকলে তা উল্লেখ করুন। এরপর 'বিজ্ঞপ্তি প্রকাশ করুন' বাটনে চাপলেই পোস্টটি AI ও এডমিন যাচাইয়ের পর লাইভ হবে।",
    answerEn: "Posting a notice is completed in two simple steps:\n• Step 1: Provide notice title, category, brand, model, serial or IMEI number, loss location, and photos. Draw circles or arrows on the photos to highlight specific identifying damages.\n• Step 2: Enter your Police GD Number, attach a photo of the GD document, and declare a reward if desired. Once submitted, your ad is verified and published.",
    highlightsBn: ["পণ্য ও স্থানের বিবরণ", "ছবিতে দাগ/ক্ষতি চিহ্নিতকরণ", "থানার জিডি অনুলিপি"],
    highlightsEn: ["Item details & location", "Damage annotation with circles/arrows", "Official Police GD copy"]
  },
  {
    id: "faq-2",
    category: "posting",
    questionBn: "ছবিতে বৃত্ত (Circle) বা তীর (Arrow) দিয়ে দাগ চিহ্নিত করা কেন জরুরি?",
    questionEn: "Why is it important to draw circles or arrows on uploaded photos?",
    answerBn: "একই মডেলের দুটি ফোন বা বাইক দেখতে একই রকম হতে পারে। কিন্তু ফ্রেমের নির্দিষ্ট স্ক্র্যাচ, ক্যামেরার ফাটা দাগ, বডির ডেন্ট বা কোনো বিশেষ স্টিকারই হলো অনন্য শনাক্তকারী বৈশিষ্ট্য। আমাদের 'ছবিতে দাগ চিহ্নিত করুন' টুল ব্যবহার করে বৃত্ত বা তীরচিহ্ন এঁকে দিলে সন্ধানদাতা ও পুলিশ সহজেই আসল পণ্য ও মালিকানা শনাক্ত করতে পারে।",
    answerEn: "Two devices or bikes of the same model look identical. Specific scratches, camera cracks, body dents, or unique stickers are the definitive proof of ownership. Drawing circles or arrows highlights these distinct marks, allowing police and finders to accurately match your item.",
    highlightsBn: ["অনন্য শনাক্তকারী বৈশিষ্ট্য", "সন্দেহাতীত মালিকানা প্রমাণ", "সহজ ও দ্রুত উদ্ধার"],
    highlightsEn: ["Unique identifying features", "Undeniable ownership proof", "Faster verification"]
  },
  {
    id: "faq-3",
    category: "posting",
    questionBn: "বিজ্ঞপ্তি দেওয়ার পর কি তথ্য সম্পাদনা বা সংশোধন করা যায়?",
    questionEn: "Can I edit or update my notice after submitting?",
    answerBn: "হ্যাঁ, আপনার প্রোফাইল বা 'আমার নোটিশ' সেকশনে গিয়ে যে কোনো সময় বিজ্ঞপ্তির তথ্য আপডেট করতে পারেন। তবে আইনি নিরাপত্তার স্বার্থে IMEI বা সিরিয়াল নম্বর পরিবর্তন করলে পুনরায় স্বয়ংক্রিয় ভেরিফিকেশন প্রযোজ্য হতে পারে।",
    answerEn: "Yes, you can manage and update details from your profile dashboard under 'My Notices'. Changes to critical identifiers like IMEI or serial may trigger security re-verification.",
    highlightsBn: ["প্রোফাইল থেকে নিয়ন্ত্রণ", "তথ্য হালনাগাদ"],
    highlightsEn: ["Manage from profile", "Real-time updates"]
  },

  // Category: Safety & Fraud Prevention
  {
    id: "faq-4",
    category: "safety",
    questionBn: "সন্ধানদাতা অগ্রিম টাকা, কুরিয়ার চার্জ বা রিওয়ার্ড দাবি করলে কী করবেন?",
    questionEn: "What to do if a finder demands advance money, courier fee, or reward?",
    answerBn: "সতর্কতা: কোনো অবস্থাতেই বিকাশ, নগদ বা ব্যাংকে কোনো অগ্রিম টাকা পাঠাবেন না! প্রতারকরা প্রায়শই দাবি করে পণ্যটি কুরিয়ারে আছে বা তেল খরচ বাবদ টাকা প্রয়োজন। সবসময় স্বশরীরে দেখা করে পণ্য হাতে পেয়ে পরীক্ষা করার পর নির্ধারিত রিওয়ার্ড প্রদান করুন। সন্দেহজনক মনে হলে সাথে সাথে আমাদের সাপোর্ট টিমে রিপোর্ট করুন।",
    answerEn: "CRITICAL SAFETY RULE: Never send advance money via bKash, Nagad, or bank! Scammers often claim the item is with a courier or demand transport fare. Only hand over rewards in person after physically inspecting the verified item. Report suspicious users immediately.",
    highlightsBn: ["কখনোই অগ্রিম টাকা দেবেন না", "কুরিয়ারের নামে প্রতারণা এড়িয়ে চলুন", "সন্দেহজনক নম্বর রিপোর্ট করুন"],
    highlightsEn: ["Never send advance cash", "Beware courier scams", "Report suspicious activity"]
  },
  {
    id: "faq-5",
    category: "safety",
    questionBn: "সন্ধানদাতার সাথে সাক্ষাতের সময় কি কি সতর্কতা অবলম্বন করবেন?",
    questionEn: "What safety precautions should I take when meeting a finder in person?",
    answerBn: "১. নির্জন স্থানে কখনোই যাবেন না। সবসময় প্রকাশ্য দিনের আলোতে, জনবহুল স্থানে অথবা সম্ভব হলে নিকটস্থ থানার সামনে বা ভেতরে বসে পণ্য হস্তান্তর করুন।\n২. সাক্ষাতের সময় একা যাবেন না, বিশ্বস্ত বন্ধু বা পরিবারের কাউকে সাথে রাখুন।\n৩. পণ্যের সিরিয়াল, IMEI ও ক্রয় রসিদ মিলিয়ে নিশ্চিত হোন এটি আপনারই পণ্য।",
    answerEn: "1. Never agree to meet in isolated areas. Always choose broad daylight in a crowded public place, ideally right in front of or inside a police station.\n2. Do not go alone; bring a reliable family member or friend.\n3. Verify the serial/IMEI and original cash memo before concluding the handover.",
    highlightsBn: ["জনবহুল বা থানা চত্বরে দেখা করুন", "একা যাবেন না", "সিরিয়াল ও রসিদ মেলান"],
    highlightsEn: ["Meet at police station or public area", "Never go alone", "Verify serial & invoice"]
  },
  {
    id: "faq-6",
    category: "safety",
    questionBn: "ডিভাইস পাসকোড বা ক্লাউড ক্রেডেনশিয়াল কি দেওয়া নিরাপদ?",
    questionEn: "Is it safe to share device passcodes or cloud credentials?",
    answerBn: "কখনোই নয়! ফোন বা ল্যাপটপের পাসকোড, অ্যাপল আইডি পাসওয়ার্ড বা গুগল অ্যাকাউন্টের তথ্য কাউকে জানাবেন না। প্রতারকরা পণ্য ফেরত না দিয়েই রিমোট লক খোলার জন্য পাসকোড সংগ্রহ করার অপচেষ্টা করতে পারে।",
    answerEn: "Never! Do not share lock screen PINs, Apple ID passwords, or Google credentials. Scammers attempt to trick owners into unlocking devices remotely without returning them.",
    highlightsBn: ["পাসকোড গোপন রাখুন", "ক্লাউড লক রিমুভ করবেন না"],
    highlightsEn: ["Keep passcodes private", "Never remove cloud lock remotely"]
  },

  // Category: What to do when item is found
  {
    id: "faq-7",
    category: "found",
    questionBn: "পণ্য বা গাড়ি ফেরত পাওয়ার পর পোর্টালে করণীয় কী?",
    questionEn: "What should I do on the portal after getting my item back?",
    answerBn: "অভিনন্দন! আপনার আইটেমটি ফিরে পাওয়ার পর বিজ্ঞপ্তির পেজে গিয়ে 'উদ্ধার হয়েছে / Mark as Found' বাটনে ক্লিক করুন। এরপর মালিক ও উদ্ধার হওয়া সামগ্রীর একটি সুন্দর ছবি আপলোড করুন এবং একটি সংক্ষিপ্ত পুনর্মিলনের গল্প শেয়ার করুন। এটি সমাজের অন্যান্য নাগরিকদের মনোবল বৃদ্ধি করে এবং বিজ্ঞপ্তির স্ট্যাটাস সমাপ্ত ঘোষণা করে।",
    answerEn: "Congratulations! Navigate to your ad detail page and click the 'Mark as Found' button. Upload a photo of the owner with the recovered item and write a brief reunion story. This closes the active notice and inspires other citizens.",
    highlightsBn: ["স্ট্যাটাস 'উদ্ধার হয়েছে' পরিবর্তন", "পুনর্মিলনের ছবি আপলোড", "নাগরিকদের উদ্বুদ্ধকরণ"],
    highlightsEn: ["Update status to Found", "Upload reunion photo", "Inspire community"]
  },
  {
    id: "faq-8",
    category: "found",
    questionBn: "ঘোষিত সন্ধানদাতা পুরস্কার (Reward) কিভাবে প্রদান করবেন?",
    questionEn: "How should I hand over the declared finder's reward?",
    answerBn: "যে ব্যক্তি আপনার মূল্যবান সামগ্রীটি যত্ন সহকারে ফিরিয়ে দিয়েছেন, পণ্যটি স্বশরীরে বুঝে পাওয়ার পর নগদ অর্থে অথবা তার উপস্থিতিতে মোবাইল ব্যাংকিংয়ের মাধ্যমে প্রতিশ্রুতি অনুযায়ী পুরস্কারের টাকা বুঝিয়ে দিন এবং ধন্যবাদ জানান।",
    answerEn: "Once you have physically inspected and retrieved your item from the honest finder, hand over the promised reward money in person or via mobile banking in their presence with gratitude.",
    highlightsBn: ["পণ্য বুঝে পাওয়ার পর প্রদান", "সরাসরি সামনাসামনি হস্তান্তর"],
    highlightsEn: ["Pay upon physical verification", "Direct in-person handover"]
  },
  {
    id: "faq-9",
    category: "found",
    questionBn: "পণ্য পাওয়ার পর কি থানার জিডি নিষ্পত্তি করা প্রয়োজন?",
    questionEn: "Do I need to inform the police and close the GD after recovery?",
    answerBn: "হ্যাঁ, হারানো পণ্য পাওয়ার পর সংশ্লিষ্ট থানায় গিয়ে তদন্তকারী অফিসারকে লিখিত বা মৌখিকভাবে অবহিত করা আইনি কর্তব্য। এতে পুলিশের ডেটাবেজে পণ্যটি আর নিখোঁজ বা চুরি হিসেবে তালিকাভুক্ত থাকবে না এবং ভবিষ্যতে আইনি জটিলতা এড়ানো যাবে।",
    answerEn: "Yes, it is legally advisable to inform the investigation officer at your local police station that your item was recovered so the GD can be officially closed and legal records cleared.",
    highlightsBn: ["থানায় লিখিত বা মৌখিক তথ্য", "ভবিষ্যত আইনি জটিলতা মুক্ত"],
    highlightsEn: ["Notify local police officer", "Close police GD file"]
  },

  // Category: Legal & GD
  {
    id: "faq-10",
    category: "legal",
    questionBn: "থানায় বা অনলাইনে জিডি (GD) করার সঠিক নিয়ম কী?",
    questionEn: "How to properly file a Police General Diary (GD)?",
    answerBn: "অনলাইনে 'ঢাকা মেট্রোপলিটন পুলিশ অনলাইন জিডি' অ্যাপ বা সেবা দিয়ে অথবা সরাসরি নিকটস্থ থানার ডিউটি অফিসারের কাছে গিয়ে জিডি করতে পারেন। জিডিতে পণ্যের সঠিক IMEI/চেসিস নম্বর, রঙ, ব্র্যান্ড, মডেল এবং হারানো স্থান স্পষ্ট উল্লেখ করুন। জিডি নম্বর ফরম্যাট সাধারণত GD-XXXXX/YY হয়ে থাকে।",
    answerEn: "You can file a GD through the Bangladesh Police Online GD mobile app or directly at the duty officer desk of your local police station. Include the full IMEI/chassis number, color, brand, model, and loss location. A valid GD format resembles GD-XXXXX/YY.",
    highlightsBn: ["অনলাইন জিডি অ্যাপ", "সঠিক IMEI ও তথ্য প্রদান", "জিডি নম্বর সংগ্রহ"],
    highlightsEn: ["Online GD application", "Accurate IMEI & specifics", "Official GD number"]
  }
];

export const FaqModal: React.FC<FaqModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenCreateAd
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'posting' | 'safety' | 'found' | 'legal'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  const categories = useMemo(() => [
    { id: 'all', labelBn: 'সব প্রশ্ন (All)', labelEn: 'All Questions' },
    { id: 'posting', labelBn: 'বিজ্ঞপ্তি পোস্ট (Post Guide)', labelEn: 'Posting Guide' },
    { id: 'safety', labelBn: 'নিরাপত্তা ও প্রতারণা রোধ', labelEn: 'Safety & Scams' },
    { id: 'found', labelBn: 'পণ্য পাওয়ার পর করণীয়', labelEn: 'Item Found Steps' },
    { id: 'legal', labelBn: 'জিডি ও আইনি সহায়তা', labelEn: 'Police GD & Legal' },
  ], []);

  // Filtered FAQs based on category and search query
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const question = lang === 'bn' ? item.questionBn.toLowerCase() : item.questionEn.toLowerCase();
      const answer = lang === 'bn' ? item.answerBn.toLowerCase() : item.answerEn.toLowerCase();
      return question.includes(q) || answer.includes(q);
    });
  }, [selectedCategory, searchQuery, lang]);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col w-full max-w-3xl max-h-[92vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-[#149777] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-[#0f7c61] flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="bg-[#ffcb05] text-[#149777] p-1.5 rounded-lg shadow-sm">
              <HelpCircle className="w-5 h-5 text-slate-900" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {lang === 'bn' ? "সাধারণ জিজ্ঞাসা ও নাগরিক সহায়িকা (FAQ)" : "Frequently Asked Questions & Help"}
              </h3>
              <p className="text-[11px] text-emerald-100">
                {lang === 'bn' 
                  ? "হারানো বিজ্ঞপ্তি দেওয়া, প্রতারণা এড়ানো ও পণ্য উদ্ধার পরবর্তী নিয়মাবলী" 
                  : "Guides on posting notices, safety precautions, and item recovery"}
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded-full hover:bg-emerald-800 transition-colors cursor-pointer"
            title={lang === 'bn' ? "বন্ধ করুন" : "Close"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input in FAQ */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 space-y-2.5 flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'bn' ? "প্রশ্ন বা বিষয় খুঁজুন (উদাঃ জিডি, অগ্রিম টাকা, দাগ মার্ক, পুরস্কার)..." : "Search questions (e.g. GD, advance money, marks, reward)..."}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#149777] text-white shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {lang === 'bn' ? cat.labelBn : cat.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 space-y-2">
              <HelpCircle className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-medium">
                {lang === 'bn' ? "আপনার অনুসন্ধানের সাথে কোনো প্রশ্নোত্তর মেলেনি।" : "No FAQs matched your search."}
              </p>
              <button
                type="button"
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
              >
                {lang === 'bn' ? "সব প্রশ্ন পুনরায় দেখুন" : "View all questions"}
              </button>
            </div>
          ) : (
            filteredFaqs.map((item) => {
              const isExpanded = expandedId === item.id;
              const question = lang === 'bn' ? item.questionBn : item.questionEn;
              const answer = lang === 'bn' ? item.answerBn : item.answerEn;
              const highlights = lang === 'bn' ? item.highlightsBn : item.highlightsEn;

              // Distinct category badge style
              const getCategoryBadge = (cat: string) => {
                switch (cat) {
                  case 'safety':
                    return { label: lang === 'bn' ? 'নিরাপত্তা সতর্কতা' : 'Safety Alert', color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50' };
                  case 'posting':
                    return { label: lang === 'bn' ? 'বিজ্ঞপ্তি পোস্ট' : 'Posting Guide', color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50' };
                  case 'found':
                    return { label: lang === 'bn' ? 'পণ্য প্রাপ্তি' : 'Recovery Step', color: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/50' };
                  case 'legal':
                    return { label: lang === 'bn' ? 'আইনি ও জিডি' : 'Legal & GD', color: 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/50' };
                  default:
                    return { label: 'FAQ', color: 'text-slate-700 bg-slate-100' };
                }
              };

              const badge = getCategoryBadge(item.category);

              return (
                <div 
                  key={item.id}
                  className={`border rounded-xl transition-all overflow-hidden ${
                    isExpanded 
                      ? "border-emerald-500/50 bg-emerald-50/15 dark:bg-emerald-950/10 shadow-xs" 
                      : "border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="w-full text-left p-3.5 sm:p-4 flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                        {question}
                      </h4>
                    </div>

                    <div className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mt-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3.5 sm:px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 space-y-3 leading-relaxed">
                      <div className="whitespace-pre-line">
                        {answer}
                      </div>

                      {highlights && highlights.length > 0 && (
                        <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                          <span className="text-slate-400 font-bold uppercase mr-1">
                            {lang === 'bn' ? "গুরুত্বপূর্ণ বিষয়:" : "Highlights:"}
                          </span>
                          {highlights.map((h, i) => (
                            <span 
                              key={i}
                              className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium border border-slate-200 dark:border-slate-700"
                            >
                              ✓ {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 flex-shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="text-[11px]">
              {lang === 'bn' 
                ? "জরুরি সহায়তায় nazmul.alam.official@gmail.com এ যোগাযোগ করুন।" 
                : "For urgent inquiries, email nazmul.alam.official@gmail.com"}
            </span>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            {onOpenCreateAd && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenCreateAd();
                }}
                className="bg-[#149777] hover:bg-[#0f7c61] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? "নতুন বিজ্ঞাপন দিন" : "Post a Notice"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              {lang === 'bn' ? "বন্ধ করুন" : "Close"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FaqModal;
