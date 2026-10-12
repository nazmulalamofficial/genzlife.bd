import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Search, 
  FileText, 
  Lock, 
  Unlock, 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  Tag, 
  Activity, 
  ShieldAlert, 
  Check, 
  MapPin, 
  Phone 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { LostAd, User, Category } from "../types";
import { useTheme } from "../ThemeContext";

// Bengali Category mapping
const CATEGORY_LABELS: Record<Category, { name: string; banglaName: string; color: string }> = {
  mobile: { name: "Mobile", banglaName: "মোবাইল ফোন", color: "#3b82f6" },
  bike: { name: "Motorcycle", banglaName: "মোটরসাইকেল", color: "#f59e0b" },
  car: { name: "Car", banglaName: "গাড়ি", color: "#ef4444" },
  bicycle: { name: "Bicycle", banglaName: "বাইসাইকেল", color: "#10b981" },
  other: { name: "Other", banglaName: "অন্যান্য আইটেম", color: "#8b5cf6" }
};

interface AdminDashboardProps {
  lang: "bn" | "en";
  onClose: () => void;
  currentUser: User;
  ads: LostAd[];
  setAds: React.Dispatch<React.SetStateAction<LostAd[]>>;
}

export default function AdminDashboard({ lang, onClose, currentUser, ads, setAds }: AdminDashboardProps) {
  const { theme } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState<"analytics" | "moderation" | "users">("analytics");
  const [usersList, setUsersList] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [modFilter, setModFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [notif, setNotif] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Load Users List on tab change / mount
  useEffect(() => {
    if (activeSubTab === "users") {
      fetchUsers();
    }
  }, [activeSubTab]);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotif({ message, type });
    setTimeout(() => setNotif(null), 4000);
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsersList(data);
      } else {
        showNotification(lang === "bn" ? "ব্যবহারকারীদের তালিকা লোড করা সম্ভব হয়নি।" : "Could not load user list.", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification(lang === "bn" ? "নেটওয়ার্ক এরর ঘটেছে।" : "Network error occurred.", "error");
    } finally {
      setUsersLoading(false);
    }
  };

  // Suspend or Active user account
  const handleUserStatusChange = async (userId: string, currentStatus?: "active" | "suspended") => {
    const nextStatus = currentStatus === "suspended" ? "active" : "suspended";
    const confirmMsg = lang === "bn" 
      ? `আপনি কি নিশ্চিতভাবে এই ব্যবহারকারীকে ${nextStatus === "suspended" ? "সাময়িক স্থগিত (Suspend)" : "সক্রিয় (Activate)"} করতে চান?`
      : `Are you sure you want to set this user status to ${nextStatus}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });

      if (res.ok) {
        setUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
        showNotification(
          lang === "bn" 
            ? `ব্যবহারকারীর অ্যাকাউন্ট সফলভাবে ${nextStatus === "suspended" ? "স্থগিত" : "সক্রিয়"} করা হয়েছে!` 
            : `User account successfully ${nextStatus === "suspended" ? "suspended" : "activated"}!`
        );
      } else {
        const errData = await res.json();
        showNotification(errData.error || "Operation failed", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error updating status", "error");
    }
  };

  // Moderate ad: approve or reject
  const handleAdModeration = async (adId: string, approvalStatus: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/ads/${adId}/approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus })
      });

      if (res.ok) {
        // Update both local state
        setAds(prev => prev.map(ad => ad.id === adId ? { ...ad, approvalStatus } : ad));
        showNotification(
          lang === "bn"
            ? `বিজ্ঞপ্তিটি সফলভাবে ${approvalStatus === "approved" ? "অনুমোদন" : "প্রত্যাখ্যান"} করা হয়েছে!`
            : `Advertisement successfully ${approvalStatus === "approved" ? "approved" : "rejected"}!`
        );
      } else {
        const errData = await res.json();
        showNotification(errData.error || "Operation failed", "error");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error updating ad approval", "error");
    }
  };

  // --- ANALYTICS CALCULATIONS ---
  // 1. Daily active posts group by date
  const getDailyPostsData = () => {
    const counts: Record<string, number> = {};
    ads.forEach(ad => {
      const date = ad.createdAt ? ad.createdAt.split("T")[0] : "Pre-seeded";
      counts[date] = (counts[date] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([date, count]) => {
        // Convert to nice localized format
        const formattedDate = new Date(date).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
          month: "short",
          day: "numeric"
        });
        return { date: formattedDate, posts: count };
      })
      .slice(-7); // Last 7 active days
  };

  // 2. Category distribution
  const getCategoryData = () => {
    const counts: Record<string, number> = { mobile: 0, bike: 0, car: 0, bicycle: 0, other: 0 };
    ads.forEach(ad => {
      if (counts[ad.category] !== undefined) {
        counts[ad.category]++;
      } else {
        counts.other = (counts.other || 0) + 1;
      }
    });

    return Object.entries(counts).map(([catId, count]) => {
      const info = CATEGORY_LABELS[catId as Category];
      return {
        id: catId,
        name: lang === "bn" ? info.banglaName : info.name,
        value: count,
        color: info.color
      };
    });
  };

  // 3. Items Found success rate
  const getSuccessRateData = () => {
    let lostCount = 0;
    let foundCount = 0;

    ads.forEach(ad => {
      if (ad.status === "found") {
        foundCount++;
      } else {
        lostCount++;
      }
    });

    const total = lostCount + foundCount;
    const rate = total > 0 ? Math.round((foundCount / total) * 100) : 0;

    const chartData = [
      { name: lang === "bn" ? "উদ্ধারকৃত (Found)" : "Found Items", value: foundCount, color: "#10b981" },
      { name: lang === "bn" ? "হারানো (Lost)" : "Still Lost", value: lostCount, color: "#ef4444" }
    ];

    return { total, lostCount, foundCount, rate, chartData };
  };

  const dailyPosts = getDailyPostsData();
  const categoryData = getCategoryData();
  const successMetrics = getSuccessRateData();

  // Filter ads for moderation queue
  const filteredAdsForMod = ads.filter(ad => {
    if (modFilter === "all") return true;
    if (modFilter === "pending") return ad.approvalStatus === "pending" || !ad.approvalStatus; // treated as pending if not set
    return ad.approvalStatus === modFilter;
  });

  // Filter users list
  const filteredUsers = usersList.filter(user => {
    const q = userSearchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.phone.includes(q) ||
      (user.location && user.location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 pb-20 animate-fade-in" id="admin-dashboard-panel">
      {/* Toast Notification */}
      {notif && (
        <div className={`fixed top-18 right-4 z-50 p-4 rounded-xl shadow-lg border text-xs font-bold flex items-center space-x-2 transition-all duration-300 ${
          notif.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 animate-slide-up"
            : "bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 animate-slide-up"
        }`}>
          {notif.type === "success" ? <CheckCircle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
          <span>{notif.message}</span>
        </div>
      )}

      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer border-none bg-transparent"
            title={lang === "bn" ? "ফিরে যান" : "Go Back"}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <ShieldAlert className="w-6 h-6 text-red-600 animate-pulse" />
              <span>{lang === "bn" ? "অ্যাডমিন ড্যাশবোর্ড" : "Administrative Dashboard"}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === "bn" 
                ? "বিজ্ঞপ্তি মডারেশন, ইউজার সাসপেনশন এবং প্ল্যাটফর্মের রিয়েল-টাইম তথ্য বিশ্লেষণ"
                : "Manage advertisements, moderate user accounts, and review real-time security analytics"}
            </p>
          </div>
        </div>

        {/* Action Tabs Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab("analytics")}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer border-none ${
              activeSubTab === "analytics"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 bg-transparent"
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "তথ্য বিশ্লেষণ" : "Analytics"}</span>
          </button>
          
          <button
            onClick={() => setActiveSubTab("moderation")}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer border-none ${
              activeSubTab === "moderation"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 bg-transparent"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "মডারেশন কিউ" : "Moderation"}</span>
            {ads.filter(ad => ad.approvalStatus === "pending" || !ad.approvalStatus).length > 0 && (
              <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-none animate-bounce">
                {ads.filter(ad => ad.approvalStatus === "pending" || !ad.approvalStatus).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab("users")}
            className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-4 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer border-none ${
              activeSubTab === "users"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 bg-transparent"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{lang === "bn" ? "ব্যবহারকারী তালিকা" : "Users"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================== */}
      {/* 1. ANALYTICS VIEW                                          */}
      {/* ========================================================== */}
      {activeSubTab === "analytics" && (
        <div className="space-y-6">
          {/* Top Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{lang === "bn" ? "মোট বিজ্ঞাপন সংখ্যা" : "Total Advertisements"}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-slate-800 dark:text-white">{ads.length}</span>
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-xl text-blue-600 dark:text-blue-400">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{lang === "bn" ? "মোট উদ্ধারকৃত আইটেম" : "Successfully Found"}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{successMetrics.foundCount}</span>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{lang === "bn" ? "মোট সক্রিয় হারানো আইটেম" : "Currently Still Lost"}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-red-500">{successMetrics.lostCount}</span>
                <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded-xl text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{lang === "bn" ? "হারানো উদ্ধারের সাফল্য হার" : "Recovery Success Rate"}</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-2xl font-black text-[#149777] dark:text-[#19b992]">{successMetrics.rate}%</span>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-emerald-600 dark:text-[#19b992]">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Recharts Panels Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 1. Daily Active Posts (LineChart) - 8 Cols */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xs lg:col-span-8 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-[#149777]" />
                  <span>{lang === "bn" ? "দৈনিক সক্রিয় নোটিশ পোস্ট ট্রেন্ড" : "Daily Active Posts Trend"}</span>
                </h3>
                <p className="text-[10px] text-slate-400 mb-4">{lang === "bn" ? "বিগত দিনগুলোতে হারানো বিজ্ঞপ্তির সংখ্যা" : "Number of lost notices uploaded per day"}</p>
              </div>

              <div className="h-64 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyPosts} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: "12px", 
                        backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff", 
                        border: theme === "dark" ? "1px solid #334155" : "1px solid #cbd5e1" 
                      }} 
                      itemStyle={{ color: theme === "dark" ? "#f1f5f9" : "#1e293b" }}
                      labelStyle={{ color: theme === "dark" ? "#94a3b8" : "#64748b" }}
                    />
                    <Line type="monotone" dataKey="posts" stroke="#0F4D0F" strokeWidth={3} activeDot={{ r: 6 }} name={lang === "bn" ? "পোস্ট" : "Posts"} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Success Rate Donut / Pie Chart - 4 Cols */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xs lg:col-span-4 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{lang === "bn" ? "আইটেম উদ্ধার অনুপাত" : "Items Found Ratio"}</span>
                </h3>
                <p className="text-[10px] text-slate-400 mb-4">{lang === "bn" ? "উদ্ধারকৃত বনাম অবিকল হারানো সংখ্যা" : "Proportion of active cases vs returned items"}</p>
              </div>

              <div className="h-44 w-full flex items-center justify-center relative text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={successMetrics.chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {successMetrics.chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text overlay */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-slate-800 dark:text-white">{successMetrics.rate}%</span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold">{lang === "bn" ? "সফলতা" : "Success"}</span>
                </div>
              </div>

              <div className="flex justify-around border-t border-slate-100 dark:border-slate-700 pt-3 text-[10px]">
                <div className="flex items-center space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">{lang === "bn" ? "উদ্ধার" : "Found"} ({successMetrics.foundCount})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300">{lang === "bn" ? "হারানো" : "Lost"} ({successMetrics.lostCount})</span>
                </div>
              </div>
            </div>

            {/* 3. Category Distribution (BarChart) - 12 Cols */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-xs lg:col-span-12">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center space-x-1.5 mb-1">
                <Tag className="w-4 h-4 text-[#0F4D0F]" />
                <span>{lang === "bn" ? "ক্যাটাগরি ভিত্তিক হারানো আইটেম বিবরণ" : "Category Wise Distribution"}</span>
              </h3>
              <p className="text-[10px] text-slate-400 mb-4">{lang === "bn" ? "কোন ক্যাটাগরিতে কি পরিমাণ আইটেম হারানোর রিপোর্ট এসেছে" : "Total quantity of reports filed per category"}</p>

              <div className="h-56 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: "12px", 
                        backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff", 
                        border: theme === "dark" ? "1px solid #334155" : "1px solid #cbd5e1" 
                      }} 
                      itemStyle={{ color: theme === "dark" ? "#f1f5f9" : "#1e293b" }}
                      labelStyle={{ color: theme === "dark" ? "#94a3b8" : "#64748b" }}
                    />
                    <Bar dataKey="value" name={lang === "bn" ? "মোট রিপোর্ট" : "Reports"} radius={[6, 6, 0, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. MODERATION QUEUE VIEW                                   */}
      {/* ========================================================== */}
      {activeSubTab === "moderation" && (
        <div className="space-y-4">
          {/* Moderation filter tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 pb-2 mb-4 gap-2">
            <button
              onClick={() => setModFilter("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
                modFilter === "pending"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 bg-transparent"
              }`}
            >
              {lang === "bn" ? "অপেক্ষমান (Pending)" : "Pending Review"} ({ads.filter(ad => ad.approvalStatus === "pending" || !ad.approvalStatus).length})
            </button>
            <button
              onClick={() => setModFilter("approved")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
                modFilter === "approved"
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 bg-transparent"
              }`}
            >
              {lang === "bn" ? "অনুমোদিত (Approved)" : "Approved"} ({ads.filter(ad => ad.approvalStatus === "approved").length})
            </button>
            <button
              onClick={() => setModFilter("rejected")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
                modFilter === "rejected"
                  ? "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 bg-transparent"
              }`}
            >
              {lang === "bn" ? "প্রত্যাখ্যাত (Rejected)" : "Rejected"} ({ads.filter(ad => ad.approvalStatus === "rejected").length})
            </button>
            <button
              onClick={() => setModFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
                modFilter === "all"
                  ? "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100"
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 bg-transparent"
              }`}
            >
              {lang === "bn" ? "সবগুলো" : "All"} ({ads.length})
            </button>
          </div>

          {filteredAdsForMod.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/55 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400 dark:text-slate-500">
              <CheckCircle className="w-10 h-10 mx-auto text-emerald-500/80 mb-2" />
              <p className="text-xs font-bold">{lang === "bn" ? "মডারেশনের জন্য কোনো আইটেম বাকি নেই।" : "No items found in this moderation category."}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAdsForMod.map((ad) => {
                const isPending = ad.approvalStatus === "pending" || !ad.approvalStatus;
                return (
                  <div 
                    key={ad.id}
                    className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch justify-between gap-4 transition-all hover:shadow-sm"
                  >
                    {/* Info Side */}
                    <div className="flex-grow space-y-3 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="bg-[#0F4D0F]/10 text-[#0F4D0F] dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider flex items-center space-x-1">
                          <span>{lang === "bn" ? CATEGORY_LABELS[ad.category]?.banglaName : CATEGORY_LABELS[ad.category]?.name}</span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-slate-400 font-mono text-[9px]">
                          {new Date(ad.createdAt).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US")}
                        </span>
                        {isPending && (
                          <span className="bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 px-1.5 py-0.5 rounded-sm font-extrabold text-[9px]">
                            {lang === "bn" ? "অপেক্ষমান" : "Pending Review"}
                          </span>
                        )}
                        {ad.approvalStatus === "approved" && (
                          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-sm font-extrabold text-[9px]">
                            {lang === "bn" ? "অনুমোদিত" : "Approved"}
                          </span>
                        )}
                        {ad.approvalStatus === "rejected" && (
                          <span className="bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400 px-1.5 py-0.5 rounded-sm font-extrabold text-[9px]">
                            {lang === "bn" ? "প্রত্যাখ্যাত" : "Rejected"}
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white leading-tight">
                          {ad.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-300 text-xs mt-1 leading-normal line-clamp-3">
                          {ad.description}
                        </p>
                      </div>

                      {/* Technical specifications */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-t border-b border-slate-100 dark:border-slate-700/80 py-2 text-[10px]">
                        <div>
                          <span className="text-slate-400 uppercase block font-bold">{lang === "bn" ? "ব্র্যান্ড ও মডেল" : "Brand & Model"}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{ad.brand} {ad.modelName || "—"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 uppercase block font-bold">{lang === "bn" ? "জিডি নাম্বার" : "GD Reference"}</span>
                          <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{ad.gdNumber || "—"} ({ad.gdAuthority || "—"})</span>
                        </div>
                        <div>
                          <span className="text-slate-400 uppercase block font-bold">{lang === "bn" ? "রিপোর্টকারী" : "Reporter"}</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                            <span>{ad.userName}</span>
                            <span className="text-slate-400">({ad.userPhone})</span>
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 uppercase block font-bold">{lang === "bn" ? "AI বিশ্বস্ততা স্কোর" : "AI Verification"}</span>
                          <span className={`font-black ${
                            ad.aiVerifiedScore >= 80 
                              ? "text-emerald-600 dark:text-emerald-400" 
                              : ad.aiVerifiedScore >= 50 
                                ? "text-amber-600 dark:text-amber-400" 
                                : "text-red-500 dark:text-red-400"
                          }`}>{ad.aiVerifiedScore}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Side */}
                    <div className="flex flex-row md:flex-col justify-center items-stretch md:w-32 gap-2 flex-shrink-0 md:border-l md:border-slate-100 md:dark:border-slate-700 md:pl-4">
                      {ad.approvalStatus !== "approved" && (
                        <button
                          onClick={() => handleAdModeration(ad.id, "approved")}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors border-none"
                        >
                          <Check className="w-4 h-4" />
                          <span>{lang === "bn" ? "অনুমোদন করুন" : "Approve"}</span>
                        </button>
                      )}

                      {ad.approvalStatus !== "rejected" && (
                        <button
                          onClick={() => handleAdModeration(ad.id, "rejected")}
                          className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center space-x-1 cursor-pointer transition-colors border border-red-100 dark:border-red-900/50"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>{lang === "bn" ? "প্রত্যাখ্যান" : "Reject"}</span>
                        </button>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* 3. USER MANAGEMENT VIEW                                    */}
      {/* ========================================================== */}
      {activeSubTab === "users" && (
        <div className="space-y-4">
          {/* User Search tool */}
          <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 items-center space-x-2 shadow-xs">
            <Search className="w-4 h-4 text-slate-400 ml-1.5" />
            <input 
              type="text"
              placeholder={lang === "bn" ? "নাম, ইমেইল বা ফোন নাম্বার দিয়ে খুঁজুন..." : "Search users by name, email, or phone..."}
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs w-full text-slate-700 dark:text-slate-200 font-medium p-1"
            />
          </div>

          {usersLoading ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-xs font-bold animate-pulse">
              {lang === "bn" ? "ব্যবহারকারীদের তথ্য লোড হচ্ছে..." : "Loading users database..."}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400 dark:text-slate-500">
              <Users className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs font-bold">{lang === "bn" ? "কোনো অ্যাকাউন্ট পাওয়া যায়নি।" : "No user accounts matched your search criteria."}</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-700/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase font-bold text-[9px] tracking-wider">
                      <th className="p-3 sm:p-4">{lang === "bn" ? "ব্যবহারকারী বিবরণ" : "User Details"}</th>
                      <th className="p-3 sm:p-4">{lang === "bn" ? "ফোন নাম্বার" : "Phone"}</th>
                      <th className="p-3 sm:p-4">{lang === "bn" ? "লোকেশন" : "Location"}</th>
                      <th className="p-3 sm:p-4">{lang === "bn" ? "রোল ও স্ট্যাটাস" : "Role & Status"}</th>
                      <th className="p-3 sm:p-4 text-center">{lang === "bn" ? "অ্যাকশন" : "Moderate User"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80 font-medium">
                    {filteredUsers.map((user) => {
                      const isSuspended = user.status === "suspended";
                      const isAdmin = user.role === "admin";
                      return (
                        <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-3 sm:p-4">
                            <div className="flex flex-col">
                              <span className="font-black text-slate-800 dark:text-white flex items-center space-x-1">
                                <span>{user.name}</span>
                                {isAdmin && (
                                  <span className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-extrabold text-[8px] px-1 rounded-sm uppercase tracking-wider">Admin</span>
                                )}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-0.5">{user.email}</span>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                            {user.phone}
                          </td>
                          <td className="p-3 sm:p-4 text-slate-500 dark:text-slate-300 text-[11px]">
                            {user.location || "Bangladesh"}
                          </td>
                          <td className="p-3 sm:p-4">
                            {isSuspended ? (
                              <span className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {lang === "bn" ? "স্থগিত (Suspended)" : "Suspended"}
                              </span>
                            ) : (
                              <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {lang === "bn" ? "সক্রিয় (Active)" : "Active"}
                              </span>
                            )}
                          </td>
                          <td className="p-3 sm:p-4 text-center">
                            {isAdmin ? (
                              <span className="text-[10px] text-slate-400 italic font-semibold">—</span>
                            ) : (
                              <button
                                onClick={() => handleUserStatusChange(user.id, user.status)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border-none cursor-pointer flex items-center space-x-1 mx-auto ${
                                  isSuspended
                                    ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-emerald-400"
                                    : "bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400"
                                }`}
                              >
                                {isSuspended ? (
                                  <>
                                    <Unlock className="w-3 h-3" />
                                    <span>{lang === "bn" ? "স্থগিতাদেশ প্রত্যাহার" : "Unsuspend Account"}</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock className="w-3 h-3" />
                                    <span>{lang === "bn" ? "অ্যাকাউন্ট স্থগিত করুন" : "Suspend Account"}</span>
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
