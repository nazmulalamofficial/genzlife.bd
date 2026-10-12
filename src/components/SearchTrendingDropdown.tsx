import React, { useMemo } from "react";
import { 
  TrendingUp, 
  MapPin, 
  Search, 
  Clock, 
  Sparkles, 
  Smartphone, 
  ShieldCheck, 
  Award, 
  X, 
  ArrowUpRight,
  Flame,
  Tag
} from "lucide-react";
import { LostAd } from "../types";

interface SearchTrendingDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  currentInput: string;
  onSelectQuery: (query: string, filterType?: 'query' | 'city' | 'category' | 'thana', value?: string) => void;
  ads: LostAd[];
  lang: 'bn' | 'en';
}

interface TrendingItem {
  id: string;
  titleBn: string;
  titleEn: string;
  query: string;
  category: string;
  count: number;
  type: 'item' | 'location' | 'filter';
  filterKey?: 'city' | 'category' | 'thana' | 'query';
  filterVal?: string;
}

export const SearchTrendingDropdown: React.FC<SearchTrendingDropdownProps> = ({
  isOpen,
  onClose,
  currentInput,
  onSelectQuery,
  ads,
  lang
}) => {
  // Recent searches saved in localStorage
  const [recentSearches, setRecentSearches] = React.useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("looking_bd_recent_searches");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem("looking_bd_recent_searches");
    } catch (err) {
      console.error(err);
    }
  };

  // Compute real-time trending items and locations from live ads
  const { trendingItems, popularLocations, searchMatches } = useMemo(() => {
    // Count brand and model frequencies in active ads
    const brandCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};

    ads.forEach(ad => {
      if (ad.brand) {
        const b = ad.brand.trim();
        brandCounts[b] = (brandCounts[b] || 0) + 1;
      }
      if (ad.modelName) {
        const m = `${ad.brand ? ad.brand + ' ' : ''}${ad.modelName}`.trim();
        brandCounts[m] = (brandCounts[m] || 0) + 1;
      }
      if (ad.thana) {
        const th = ad.thana.split('(')[0].trim();
        locationCounts[th] = (locationCounts[th] || 0) + 1;
      }
      if (ad.city && ad.city !== 'all') {
        locationCounts[ad.city] = (locationCounts[ad.city] || 0) + 1;
      }
    });

    // Default common trending items if ads are few, merged with real-time counts
    const baseItems: { nameBn: string; nameEn: string; query: string; category: string }[] = [
      { nameBn: "আইফোন ১৫ প্রো (iPhone 15 Pro)", nameEn: "iPhone 15 Pro", query: "iPhone 15 Pro", category: "mobile" },
      { nameBn: "ইয়ামাহা এফজেডএস (Yamaha FZS)", nameEn: "Yamaha FZS", query: "Yamaha", category: "bike" },
      { nameBn: "স্যামসাং গ্যালাক্সি (Samsung Galaxy)", nameEn: "Samsung Galaxy", query: "Samsung", category: "mobile" },
      { nameBn: "হোন্ডা সিবি শাইন (Honda CB Shine)", nameEn: "Honda CB Shine", query: "Honda", category: "bike" },
      { nameBn: "টয়োটা করোলা / এলিয়ন (Toyota)", nameEn: "Toyota Corolla", query: "Toyota", category: "car" },
      { nameBn: "সুজুকি জিক্সার (Suzuki Gixxer)", nameEn: "Suzuki Gixxer", query: "Suzuki", category: "bike" },
      { nameBn: "রেডমি নোট (Redmi Note)", nameEn: "Redmi Note", query: "Redmi", category: "mobile" },
      { nameBn: "ওয়ালটন প্রাইমো (Walton Primo)", nameEn: "Walton", query: "Walton", category: "mobile" }
    ];

    const computedItems: TrendingItem[] = baseItems.map((item, idx) => {
      // Find real-time frequency in ads
      let count = 0;
      ads.forEach(ad => {
        const txt = `${ad.title} ${ad.brand || ''} ${ad.modelName || ''}`.toLowerCase();
        if (txt.includes(item.query.toLowerCase())) {
          count++;
        }
      });
      return {
        id: `trend-item-${idx}`,
        titleBn: item.nameBn,
        titleEn: item.nameEn,
        query: item.query,
        category: item.category,
        count: Math.max(count, 1),
        type: 'item' as const
      };
    }).sort((a, b) => b.count - a.count).slice(0, 6);

    // Default popular locations merged with real-time frequencies
    const baseLocations = [
      { nameBn: "মিরপুর, ঢাকা", nameEn: "Mirpur, Dhaka", query: "Mirpur", city: "Dhaka" },
      { nameBn: "উত্তরা, ঢাকা", nameEn: "Uttara, Dhaka", query: "Uttara", city: "Dhaka" },
      { nameBn: "ধানমন্ডি, ঢাকা", nameEn: "Dhanmondi, Dhaka", query: "Dhanmondi", city: "Dhaka" },
      { nameBn: "আগ্রাবাদ, চট্টগ্রাম", nameEn: "Agrabad, Chattogram", query: "Agrabad", city: "Chattogram" },
      { nameBn: "সিলেট সদর, সিলেট", nameEn: "Sylhet Sadar", query: "Sylhet", city: "Sylhet" },
      { nameBn: "মতিঝিল, ঢাকা", nameEn: "Motijheel, Dhaka", query: "Motijheel", city: "Dhaka" },
      { nameBn: "খুলনা সদর", nameEn: "Khulna Sadar", query: "Khulna", city: "Khulna" },
      { nameBn: "রাজশাহী", nameEn: "Rajshahi", query: "Rajshahi", city: "Rajshahi" }
    ];

    const computedLocations: TrendingItem[] = baseLocations.map((loc, idx) => {
      let count = 0;
      ads.forEach(ad => {
        const fullLoc = `${ad.lossLocation || ''} ${ad.city || ''} ${ad.thana || ''}`.toLowerCase();
        if (fullLoc.includes(loc.query.toLowerCase()) || (loc.city && ad.city === loc.city)) {
          count++;
        }
      });
      return {
        id: `trend-loc-${idx}`,
        titleBn: loc.nameBn,
        titleEn: loc.nameEn,
        query: loc.query,
        category: "location",
        count: Math.max(count, 1),
        type: 'location' as const,
        filterKey: 'city' as const,
        filterVal: loc.city
      };
    }).sort((a, b) => b.count - a.count).slice(0, 6);

    // If input is non-empty, compute real-time filtered matches
    let matches: LostAd[] = [];
    if (currentInput.trim()) {
      const q = currentInput.toLowerCase().trim();
      matches = ads.filter(ad => {
        const fullStr = `${ad.title} ${ad.brand || ''} ${ad.modelName || ''} ${ad.serialOrImei || ''} ${ad.lossLocation || ''} ${ad.gdNumber || ''}`.toLowerCase();
        return fullStr.includes(q);
      }).slice(0, 5);
    }

    return {
      trendingItems: computedItems,
      popularLocations: computedLocations,
      searchMatches: matches
    };
  }, [ads, currentInput]);

  const handleItemClick = (query: string, filterType?: 'query' | 'city' | 'category' | 'thana', value?: string) => {
    // Add to recent searches
    if (query.trim()) {
      const updated = [query, ...recentSearches.filter(s => s.toLowerCase() !== query.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      try {
        localStorage.setItem("looking_bd_recent_searches", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }
    onSelectQuery(query, filterType, value);
    onClose();
  };

  if (!isOpen) return null;

  const isTyping = currentInput.trim().length > 0;

  return (
    <div 
      className="absolute top-full left-0 right-0 mt-2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 max-h-[80vh] flex flex-col"
      role="listbox"
      aria-label="Trending Searches"
    >
      <div className="overflow-y-auto p-3.5 space-y-4 text-xs">
        
        {/* MATCHING DIRECT RESULTS (WHEN TYPING) */}
        {isTyping && searchMatches.length > 0 && (
          <div className="space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Search className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? `সরাসরি মিল পাওয়া নোটিশ (${searchMatches.length})` : `Direct Matching Notices (${searchMatches.length})`}</span>
              </span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">
                {lang === 'bn' ? "বিজ্ঞাপনে ক্লিক করুন" : "click to view"}
              </span>
            </div>

            <div className="space-y-1">
              {searchMatches.map((ad) => (
                <div
                  key={ad.id}
                  onClick={() => handleItemClick(ad.serialOrImei || ad.title)}
                  className="p-2 hover:bg-emerald-50/70 dark:hover:bg-slate-800/80 rounded-xl transition-colors cursor-pointer flex items-center justify-between gap-2 group"
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                      {ad.category === 'mobile' ? <Smartphone className="w-3.5 h-3.5" /> : <Tag className="w-3.5 h-3.5" />}
                    </div>
                    <div className="truncate text-left">
                      <p className="font-semibold text-slate-800 dark:text-slate-100 truncate text-xs group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {ad.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {ad.brand} {ad.modelName} • {ad.lossLocation || ad.city}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECENT SEARCHES (IF ANY) */}
        {recentSearches.length > 0 && !isTyping && (
          <div className="space-y-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{lang === 'bn' ? "সাম্প্রতিক অনুসন্ধান" : "Recent Searches"}</span>
              </span>
              <button
                type="button"
                onClick={clearRecentSearches}
                className="text-[10px] text-slate-400 hover:text-red-600 transition-colors lowercase cursor-pointer"
              >
                {lang === 'bn' ? "মুছুন" : "clear"}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleItemClick(term)}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors flex items-center space-x-1.5 cursor-pointer"
                >
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* REAL-TIME TRENDING ITEMS & MODELS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{lang === 'bn' ? "ট্রেন্ডিং অনুসন্ধান সামগ্রী (Trending Items)" : "Trending Items"}</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold lowercase">
              {lang === 'bn' ? "লাইভ আপডেট" : "live active"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {trendingItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item.query)}
                className="p-2 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl transition-all cursor-pointer flex items-center justify-between group text-left"
              >
                <div className="flex items-center space-x-2 truncate">
                  <div className="p-1 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors shadow-xs">
                    {item.category === 'mobile' ? (
                      <Smartphone className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingUp className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors text-xs truncate">
                    {lang === 'bn' ? item.titleBn : item.titleEn}
                  </span>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0 text-[10px] text-slate-400 group-hover:text-emerald-600 font-medium">
                  <span className="bg-slate-200/70 dark:bg-slate-700/80 px-1.5 py-0.2 rounded font-mono text-[9px] text-slate-600 dark:text-slate-300">
                    {item.count} {lang === 'bn' ? 'টি' : 'ads'}
                  </span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* POPULAR LOCATIONS */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>{lang === 'bn' ? "জনপ্রিয় এলাকা (Popular Locations)" : "Popular Locations"}</span>
            </span>
            <span className="text-[10px] text-slate-400 lowercase font-normal">
              {lang === 'bn' ? "এলাকা দিয়ে খুঁজুন" : "filter by city"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {popularLocations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => handleItemClick(loc.query, 'city', loc.filterVal)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700 rounded-lg transition-colors cursor-pointer flex items-center justify-between group text-left"
              >
                <div className="flex items-center space-x-1.5 truncate">
                  <MapPin className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 text-xs truncate">
                    {lang === 'bn' ? loc.titleBn : loc.titleEn}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 group-hover:text-blue-600 flex-shrink-0">
                  {loc.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* QUICK SEARCH CRITERIA BADGES */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
          <span className="text-slate-400 font-semibold text-[10px] uppercase">
            {lang === 'bn' ? "দ্রুত ফিল্টার:" : "Quick Filter:"}
          </span>
          <div className="flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => handleItemClick("GD-", 'query')}
              className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md font-medium text-[10px] hover:bg-emerald-100 dark:hover:bg-emerald-900 cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{lang === 'bn' ? "পুলিশ জিডি ভেরিফাইড" : "GD Verified"}</span>
            </button>
            <button
              type="button"
              onClick={() => handleItemClick("iPhone", 'query')}
              className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-[10px] hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1"
            >
              <Smartphone className="w-3 h-3" />
              <span>iPhone</span>
            </button>
            <button
              type="button"
              onClick={() => handleItemClick("Yamaha", 'query')}
              className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-[10px] hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              <span>Yamaha</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SearchTrendingDropdown;
