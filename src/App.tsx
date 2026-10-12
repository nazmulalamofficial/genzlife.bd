import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  MapPin, 
  Tag, 
  PlusCircle, 
  LogIn, 
  User as UserIcon, 
  Smartphone, 
  Bike as BikeIcon, 
  Car as CarIcon, 
  Plus, 
  CheckCircle, 
  X, 
  MessageSquare, 
  Award, 
  Heart, 
  Info, 
  AlertTriangle, 
  ShieldCheck, 
  LogOut, 
  Clock,
  Sparkles,
  HelpCircle,
  PhoneCall,
  Copy,
  Menu,
  Share2,
  Check,
  Send,
  Flag,
  Map,
  Filter,
  CheckSquare,
  Square,
  Compass,
  ChevronDown,
  ChevronRight,
  Locate,
  RefreshCw,
  Sun,
  Moon,
  ArrowLeft,
  ChevronLeft,
  Camera,
  Image,
  Calendar,
  Eye,
  LayoutDashboard,
  Edit3,
  Circle as CircleIcon,
  ArrowUpRight
} from "lucide-react";
import { BANGLADESH_LOCATIONS } from "./data/bangladeshData";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeContext";
import { User, LostAd, Category, CategoryInfo, LocationFilter } from "./types";
import AdminDashboard from "./components/AdminDashboard";
import ImageAnnotationModal from "./components/ImageAnnotationModal";
import FaqModal from "./components/FaqModal";
import SearchTrendingDropdown from "./components/SearchTrendingDropdown";
import { DICTIONARY } from "./locales";
import { Helmet, HelmetProvider } from "react-helmet-async";

const BANGLADESH_CITIES: LocationFilter[] = [
  { id: "all", name: "All Bangladesh", banglaName: "পুরো বাংলাদেশ" },
  { id: "Dhaka", name: "Dhaka", banglaName: "ঢাকা" },
  { id: "Chattogram", name: "Chattogram", banglaName: "চট্টগ্রাম" },
  { id: "Sylhet", name: "Sylhet", banglaName: "সিলেট" },
  { id: "Khulna", name: "Khulna", banglaName: "খুলনা" },
  { id: "Rajshahi", name: "Rajshahi", banglaName: "রাজশাহী" },
  { id: "Barishal", name: "Barishal", banglaName: "বরিশাল" },
  { id: "Rangpur", name: "Rangpur", banglaName: "রংপুর" },
  { id: "Mymensingh", name: "Mymensingh", banglaName: "ময়মনসিংহ" },
];

const BD_LOCATION_HIERARCHY = BANGLADESH_LOCATIONS;

const CATEGORIES: CategoryInfo[] = [
  { id: "mobile", name: "Mobile Phones", banglaName: "মোবাইল ফোন", iconName: "Smartphone" },
  { id: "bike", name: "Motorbikes", banglaName: "মোটরসাইকেল", iconName: "BikeIcon" },
  { id: "car", name: "Cars & Vehicles", banglaName: "গাড়ি ও যানবাহন", iconName: "CarIcon" },
  { id: "bicycle", name: "Bicycles", banglaName: "বাইসাইকেল/সাইকেল/রিকশা", iconName: "Bike" },
  { id: "other", name: "Other Items", banglaName: "অন্যান্য সামগ্রী", iconName: "HelpCircle" },
];

const BRAND_SUGGESTIONS = [
  { name: "Apple", banglaName: "অ্যাপল" },
  { name: "iPhone", banglaName: "আইফোন" },
  { name: "Samsung", banglaName: "স্যামসাং" },
  { name: "Xiaomi", banglaName: "শাওমি" },
  { name: "Redmi", banglaName: "রেডমি" },
  { name: "Realme", banglaName: "রিয়েলমি" },
  { name: "Vivo", banglaName: "ভিভো" },
  { name: "Oppo", banglaName: "ওপো" },
  { name: "OnePlus", banglaName: "ওয়ানপ্লাস" },
  { name: "Infinix", banglaName: "ইনফিনিক্স" },
  { name: "Tecno", banglaName: "টেকনো" },
  { name: "Nokia", banglaName: "নোকিয়া" },
  { name: "Yamaha", banglaName: "ইয়ামাহা" },
  { name: "Suzuki", banglaName: "সুজুকি" },
  { name: "Honda", banglaName: "হোন্ডা" },
  { name: "Hero", banglaName: "হিরো" },
  { name: "Bajaj", banglaName: "বাজাজ" },
  { name: "TVS", banglaName: "টিভিএস" },
  { name: "Toyota", banglaName: "টয়োটা" },
  { name: "Nissan", banglaName: "নিসান" },
  { name: "Mitsubishi", banglaName: "মিৎসুবিশি" },
  { name: "Phoenix", banglaName: "ফিনিক্স" },
  { name: "Veloce", banglaName: "ভেলোসি" }
];

const DIVISION_LOCATIONS = BANGLADESH_LOCATIONS;

function getAdCoordinates(ad: LostAd): { lat: number; lng: number } {
  const DIVISION_CENTERS: Record<string, { lat: number; lng: number }> = {
    "Dhaka": { lat: 23.8103, lng: 90.4125 },
    "Chattogram": { lat: 22.3569, lng: 91.7832 },
    "Sylhet": { lat: 24.8949, lng: 91.8687 },
    "Khulna": { lat: 22.8456, lng: 89.5403 },
    "Rajshahi": { lat: 24.3636, lng: 88.6241 },
    "Barishal": { lat: 22.7010, lng: 90.3535 },
    "Rangpur": { lat: 25.7538, lng: 89.2467 },
    "Mymensingh": { lat: 24.7471, lng: 90.4203 }
  };

  const center = DIVISION_CENTERS[ad.city] || DIVISION_CENTERS["Dhaka"];
  
  const seedString = `${ad.city}-${ad.thana || ""}-${ad.id}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const latOffset = ((Math.abs(hash) % 100) / 100) * 0.12 - 0.06;
  const lngOffset = ((Math.abs(hash >> 8) % 100) / 100) * 0.12 - 0.06;
  
  return {
    lat: center.lat + latOffset,
    lng: center.lng + lngOffset
  };
}

function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(dist: number, lang: 'bn' | 'en'): string {
  if (dist < 1) {
    const meters = Math.round(dist * 1000);
    if (lang === 'bn') {
      const bnMeters = String(meters).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
      return `~${bnMeters} মিটার দূরে`;
    }
    return `~${meters} m away`;
  }
  const kmStr = dist.toFixed(1);
  if (lang === 'bn') {
    const bnKm = kmStr.replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
    return `~${bnKm} কিমি দূরে`;
  }
  return `~${kmStr} km away`;
}

function getAdImage(ad: LostAd): string {
  if (ad.images && ad.images.length > 0) {
    return ad.images[0];
  }
  // fallback based on title/category
  const titleLower = ad.title ? ad.title.toLowerCase() : "";
  if (ad.category === "mobile") {
    if (titleLower.includes("iphone") || titleLower.includes("আইফোন")) {
      return "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=300&q=80";
    }
    return "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80";
  }
  if (ad.category === "bike") {
    return "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=300&q=80";
  }
  if (ad.category === "bicycle") {
    return "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=300&q=80";
  }
  if (ad.category === "car") {
    return "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80";
  }
  return "https://images.unsplash.com/photo-1586769312891-40d9ab8d4a13?auto=format&fit=crop&w=300&q=80";
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  // Authentication & Session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("lost_found_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Language Trigger State
  const [lang, setLang] = useState<'bn' | 'en'>(() => {
    const saved = localStorage.getItem("lost_found_lang");
    return (saved as 'bn' | 'en') || 'bn';
  });

  const toggleLanguage = () => {
    const nextLang = lang === 'bn' ? 'en' : 'bn';
    setLang(nextLang);
    localStorage.setItem("lost_found_lang", nextLang);
    showNotification(nextLang === 'bn' ? "ভাষা পরিবর্তন করা হয়েছে: বাংলা" : "Language changed to English");
  };

  const t = (key: keyof typeof DICTIONARY['bn'], replacements?: Record<string, string | number>) => {
    let text = DICTIONARY[lang][key] || DICTIONARY['bn'][key] || "missing_key";
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  // Main UI Data State
  const [ads, setAds] = useState<LostAd[]>([]);
  const [selectedAd, setSelectedAd] = useState<LostAd | null>(null);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewImageIndex, setPreviewImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [detailImageLoading, setDetailImageLoading] = useState(true);

  // Swipe / Touch state & handlers for image preview
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    const attachedImages = selectedAd 
      ? (selectedAd.images && selectedAd.images.length > 0 ? selectedAd.images : [getAdImage(selectedAd)]) 
      : [];

    if (isLeftSwipe && attachedImages.length > 1) {
      setPreviewImageIndex((prev) => (prev + 1) % attachedImages.length);
    } else if (isRightSwipe && attachedImages.length > 1) {
      setPreviewImageIndex((prev) => (prev - 1 + attachedImages.length) % attachedImages.length);
    }
  };

  // Saved / Bookmarked ads
  const [savedAdIds, setSavedAdIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("lost_found_saved_ads");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleSaveAd = (adId: string) => {
    const isAlreadySaved = savedAdIds.includes(adId);
    let nextSaved: string[];
    if (isAlreadySaved) {
      nextSaved = savedAdIds.filter(id => id !== adId);
      showNotification(lang === 'bn' ? "সংরক্ষণ থেকে সরানো হয়েছে" : "Removed from saved items");
    } else {
      nextSaved = [...savedAdIds, adId];
      showNotification(lang === 'bn' ? "বিজ্ঞাপনটি সংরক্ষণ করা হয়েছে" : "Ad saved successfully");
    }
    setSavedAdIds(nextSaved);
    localStorage.setItem("lost_found_saved_ads", JSON.stringify(nextSaved));
  };

  const isSaved = (adId: string) => savedAdIds.includes(adId);

  // Filters & Search
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>("all");
  const [activeCity, setActiveCity] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [activeThana, setActiveThana] = useState("");
  const [activeUnion, setActiveUnion] = useState("");
  const [activeVillage, setActiveVillage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Extra filter parameters requested
  const [onlyWithGd, setOnlyWithGd] = useState(false);
  const [onlyWithReward, setOnlyWithReward] = useState(false);
  const [isOnlyShowFoundState, setIsOnlyShowFoundState] = useState(false);

  // GD Number Realtime Validation
  const isGdFormatValid = (val: string) => {
    if (!val) return true;
    const regex = /^[Gg][Dd]-\d{3,8}\/\d{2,4}$/;
    return regex.test(val);
  };

  // Hamburger Category Drawer State
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  // Modals & Panels
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'register'>("login");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [smsStatus, setSmsStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [isToastShown, setIsToastShown] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isDismissedManually, setIsDismissedManually] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn("Geolocation permission or error:", error);
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
      );
    }
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);
  const [footerModalType, setFooterModalType] = useState<"terms" | "about" | "privacy" | "faq" | null>(null);

  // Auth Inputs
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "", // Used as emailOrPhone during login
    phone: "",
    location: "Dhaka",
    password: ""
  });
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  const [regDivision, setRegDivision] = useState("Dhaka");
  const [regDistrict, setRegDistrict] = useState("Dhaka (ঢাকা)");
  const [regThana, setRegThana] = useState("Mirpur (মিরপুর)");

  useEffect(() => {
    setAuthForm(prev => ({
      ...prev,
      location: `${regDivision} > ${regDistrict} > ${regThana}`
    }));
  }, [regDivision, regDistrict, regThana]);

  // Create Ad Inputs
  const [postForm, setPostForm] = useState({
    title: "",
    category: "mobile" as Category,
    brand: "",
    modelName: "",
    serialOrImei: "",
    lossDate: "",
    lossLocation: "",
    city: "Dhaka",
    thana: "Mirpur (মিরপুর)",
    unionName: "Section 1 (সেকশন ১)",
    village: "",
    gdNumber: "",
    gdAuthority: "",
    hasReward: false,
    reward: "",
    proofDetails: "",
    description: ""
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [postError, setPostError] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedGdImage, setUploadedGdImage] = useState<string | null>(null);
  const [isGdImageCompressing, setIsGdImageCompressing] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postingStep, setPostingStep] = useState(1); // Step 1: Basic Info, Step 2: Proof details

  // Image annotation states for post-ad creation flow
  const [isAnnotatorOpen, setIsAnnotatorOpen] = useState(false);
  const [annotatingImageIndex, setAnnotatingImageIndex] = useState(0);
  const [originalUploadedImages, setOriginalUploadedImages] = useState<Record<number, string>>({});
  const [annotatedImageIndices, setAnnotatedImageIndices] = useState<number[]>([]);

  // Reunion Form States for Success Stories
  const [reunionImage, setReunionImage] = useState<string | null>(null);
  const [isCompressingReunion, setIsCompressingReunion] = useState(false);
  const [reunionStory, setReunionStory] = useState("");
  const [isShowingReunionForm, setIsShowingReunionForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Pull-to-refresh States
  const [pullDistance, setPullDistance] = useState(0);
  const [pullStatus, setPullStatus] = useState<"idle" | "pulling" | "canRelease" | "refreshing">("idle");
  const dragStartRef = useRef<number | null>(null);

  const resetPullState = () => {
    setPullDistance(0);
    setPullStatus("idle");
    dragStartRef.current = null;
  };

  const handlePullStart = (clientY: number) => {
    if (window.scrollY <= 5 && pullStatus === "idle") {
      dragStartRef.current = clientY;
    }
  };

  const handlePullMove = (clientY: number) => {
    if (dragStartRef.current === null) return;
    const deltaY = clientY - dragStartRef.current;
    if (deltaY > 10) {
      const actualDistance = Math.min(100, deltaY * 0.45);
      setPullDistance(actualDistance);
      if (actualDistance >= 60) {
        setPullStatus("canRelease");
      } else {
        setPullStatus("pulling");
      }
    }
  };

  const handlePullEnd = async () => {
    if (dragStartRef.current === null) return;
    if (pullStatus === "canRelease") {
      setPullStatus("refreshing");
      setPullDistance(60);
      try {
        await fetchAds();
        // Removed notification toast per user request
      } catch (e) {
        console.error("Refresh failed", e);
      }
    }
    setTimeout(() => {
      resetPullState();
    }, 250);
  };

  const compressImageBase64 = (base64Str: string, maxWidth = 900, maxHeight = 900, quality = 0.65): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  const handleGdImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsGdImageCompressing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          try {
            const compressedUrl = await compressImageBase64(reader.result, 900, 900, 0.65);
            setUploadedGdImage(compressedUrl);
            showNotification(lang === 'bn' ? "জিডি ডকুমেন্ট অপ্টিমাইজ ও কম্প্রেস করা হয়েছে সফলভাবে!" : "GD document optimized and attached successfully!");
          } catch (err) {
            console.error("GD Image compression error", err);
            setUploadedGdImage(reader.result);
          } finally {
            setIsGdImageCompressing(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReunionImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsCompressingReunion(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        if (typeof reader.result === 'string') {
          try {
            const compressedUrl = await compressImageBase64(reader.result, 800, 800, 0.65);
            setReunionImage(compressedUrl);
            showNotification(lang === 'bn' ? "পুনর্মিলনের ছবি সফলভাবে সংযুক্ত ও কম্প্রেস হয়েছে!" : "Reunion photo successfully optimized and attached!");
          } catch (err) {
            console.error("Reunion image compression error", err);
            setReunionImage(reader.result);
          } finally {
            setIsCompressingReunion(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            const dataUrl = reader.result;
            setUploadedImages(prev => {
              const newIdx = prev.length;
              setOriginalUploadedImages(orig => ({ ...orig, [newIdx]: dataUrl }));
              return [...prev, dataUrl];
            });
          }
        };
        reader.readAsDataURL(file as any);
      });
      e.target.value = '';
    }
  };

  const handleRemoveUploadedImage = (indexToRemove: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== indexToRemove));
    setAnnotatedImageIndices(prev => 
      prev
        .filter(idx => idx !== indexToRemove)
        .map(idx => (idx > indexToRemove ? idx - 1 : idx))
    );
    setOriginalUploadedImages(prev => {
      const nextMap: Record<number, string> = {};
      Object.entries(prev).forEach(([key, val]) => {
        const k = Number(key);
        if (k < indexToRemove) {
          nextMap[k] = val as string;
        } else if (k > indexToRemove) {
          nextMap[k - 1] = val as string;
        }
      });
      return nextMap;
    });
  };

  const handleSaveAnnotatedImage = (annotatedBase64: string, index = 0) => {
    setUploadedImages(prev => {
      const updated = [...prev];
      updated[index] = annotatedBase64;
      return updated;
    });
    setAnnotatedImageIndices(prev => Array.from(new Set([...prev, index])));
    showNotification(
      lang === 'bn' 
        ? "ছবিতে দাগ ও শনাক্তকারী চিহ্ন সফলভাবে সংরক্ষণ করা হয়েছে!" 
        : "Photo damage and identifying marks highlighted successfully!"
    );
  };

  // Comments / Claims
  const [commentText, setCommentText] = useState("");
  const [isFounderClaim, setIsFounderClaim] = useState(false);

  // Helper to find potential matches comparing category, brand and city
  const getPotentialMatches = (currentAd: LostAd | null) => {
    if (!currentAd) return [];
    return ads
      .filter(ad => ad.id !== currentAd.id)
      .map(ad => {
        let score = 0;
        let reasons: string[] = [];
        let reasonsBn: string[] = [];

        if (ad.category === currentAd.category) {
          score += 3;
          reasons.push("Same Category");
          reasonsBn.push("একই ক্যাটাগরি");
        }
        if (currentAd.brand && ad.brand && ad.brand.toLowerCase().trim() === ad.brand.toLowerCase().trim()) {
          score += 3;
          reasons.push("Same Brand");
          reasonsBn.push("একই ব্র্যান্ড");
        }
        if (ad.city === currentAd.city) {
          score += 2;
          reasons.push("Same Division");
          reasonsBn.push("একই বিভাগ");
        }
        if (currentAd.modelName && ad.modelName && ad.modelName.toLowerCase().trim() === ad.modelName.toLowerCase().trim()) {
          score += 2;
          reasons.push("Same Model");
          reasonsBn.push("একই মডেল");
        }

        return { ad, score, reasons, reasonsBn };
      })
      .filter(item => item.score >= 3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const handleUseCurrentLocation = (target: "search" | "post") => {
    if (!navigator.geolocation) {
      showNotification(lang === 'bn' ? "আপনার ব্রাউজারটি জিপিএস সমর্থন করে না।" : "Your browser does not support Geolocation.");
      return;
    }
    
    showNotification(lang === 'bn' ? "আপনার অবস্থান খোঁজা হচ্ছে..." : "Retrieving your position...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coordinates: Record<string, { lat: number, lng: number }> = {
          "Dhaka": { lat: 23.81, lng: 90.41 },
          "Chattogram": { lat: 22.35, lng: 91.78 },
          "Sylhet": { lat: 24.89, lng: 91.86 },
          "Khulna": { lat: 22.84, lng: 89.54 },
          "Rajshahi": { lat: 24.36, lng: 88.62 },
          "Barishal": { lat: 22.70, lng: 90.35 },
          "Rangpur": { lat: 25.75, lng: 89.24 },
          "Mymensingh": { lat: 24.74, lng: 90.40 }
        };
        
        let nearestCity = "Dhaka";
        let minDistance = Infinity;
        
        Object.entries(coordinates).forEach(([cityId, coords]) => {
          const dist = Math.sqrt(
            Math.pow(latitude - coords.lat, 2) + Math.pow(longitude - coords.lng, 2)
          );
          if (dist < minDistance) {
            minDistance = dist;
            nearestCity = cityId;
          }
        });
        
        const availableThanas = Object.keys(DIVISION_LOCATIONS[nearestCity] || {});
        const selectedThana = availableThanas[0] || "";
        const unions = DIVISION_LOCATIONS[nearestCity]?.[selectedThana] || [];
        const union = unions[0] || "";
        
        if (target === "search") {
          setActiveCity(nearestCity);
          setActiveThana(selectedThana);
          setActiveUnion(union);
          showNotification(
            lang === 'bn' 
              ? `জিপিএস দ্বারা অবস্থান সেট করা হয়েছে: ${nearestCity} ➜ ${selectedThana}` 
              : `GPS resolved location: ${nearestCity} ➜ ${selectedThana}`
          );
        } else {
          setPostForm(prev => ({
            ...prev,
            city: nearestCity,
            thana: selectedThana,
            unionName: union
          }));
          showNotification(
            lang === 'bn' 
              ? `জিপিএস দ্বারা ফরম পূরণ সম্পন্ন: ${nearestCity}, ${selectedThana}` 
              : `GPS auto-filled form details: ${nearestCity}, ${selectedThana}`
          );
        }
      },
      (err) => {
        console.warn("Geolocation fallback activated", err);
        const nearestCity = "Dhaka";
        const selectedThana = "Mirpur (মিরপুর)";
        const unions = DIVISION_LOCATIONS[nearestCity]?.[selectedThana] || [];
        const union = unions[0] || "";
        
        if (target === "search") {
          setActiveCity(nearestCity);
          setActiveThana(selectedThana);
          setActiveUnion(union);
          showNotification(
            lang === 'bn' 
              ? ` অবস্থান সেট করা হয়েছে (ডিফল্ট): ${nearestCity} ➜ ${selectedThana}` 
              : `Set fallback location: ${nearestCity} ➜ ${selectedThana}`
          );
        } else {
          setPostForm(prev => ({
            ...prev,
            city: nearestCity,
            thana: selectedThana,
            unionName: union
          }));
          showNotification(
            lang === 'bn' 
              ? `ফরম পূরণ সম্পন্ন (ডিফল্ট): ${nearestCity}, ${selectedThana}` 
              : `Auto-filled fallback details: ${nearestCity}, ${selectedThana}`
          );
        }
      },
      { timeout: 7000 }
    );
  };

  // Fetch Ads when filters change
  useEffect(() => {
    fetchAds();
    setCurrentPage(1);
  }, [activeCategory, activeCity, activeThana, activeUnion, activeVillage, searchQuery, currentUser]);

  // Reset pagination on local filters updates
  useEffect(() => {
    setCurrentPage(1);
  }, [onlyWithGd, onlyWithReward, selectedBrand, isOnlyShowFoundState]);

  // Reset description collapse and image preview states when changing ads
  useEffect(() => {
    setIsDescExpanded(false);
    setIsPreviewModalOpen(false);
    setPreviewImageIndex(0);
    setDetailImageLoading(true);
  }, [selectedAd]);

  // Safely close admin dashboard if current user is logged out or loses admin privilege
  useEffect(() => {
    if (isAdminDashboardOpen && (!currentUser || currentUser.role !== "admin")) {
      setIsAdminDashboardOpen(false);
    }
  }, [currentUser, isAdminDashboardOpen]);

  // Handle URL path /admin or hash #admin navigation safely
  useEffect(() => {
    const checkAdminNavigation = () => {
      const isPathAdmin = window.location.pathname === "/admin" || 
                          window.location.pathname.endsWith("/admin") || 
                          window.location.hash === "#admin";
      if (isPathAdmin) {
        if (!currentUser) {
          setAuthType("login");
          setIsAuthModalOpen(true);
          setAuthError(lang === "bn" ? "অ্যাডমিন ড্যাশবোর্ড অ্যাক্সেস করতে অনুগ্রহ করে লগইন করুন।" : "Please login to access the admin dashboard.");
          setIsAdminDashboardOpen(false);
        } else if (currentUser.role !== "admin") {
          showNotification(lang === "bn" ? "আপনার অ্যাডমিন অ্যাক্সেস নেই।" : "You do not have admin privileges.");
          setIsAdminDashboardOpen(false);
          // Redirect or clean URL
          window.history.replaceState({}, "", "/");
        } else {
          setIsAdminDashboardOpen(true);
          setIsProfileOpen(false);
          setIsAuthModalOpen(false);
          setSelectedAd(null);
        }
      }
    };
    checkAdminNavigation();
  }, [currentUser, lang]);

  // Synchronize URL path with selected ad to enable direct deep-linking
  useEffect(() => {
    if (selectedAd) {
      const targetPath = `/notice/${selectedAd.id}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ adId: selectedAd.id }, "", targetPath);
      }
    } else {
      if (window.location.pathname.startsWith("/notice/")) {
        window.history.pushState({}, "", "/");
      }
    }
  }, [selectedAd]);

  // Handle browser back/forward and initial notice URL loading
  useEffect(() => {
    const handleNavigation = () => {
      const match = window.location.pathname.match(/\/notice\/([a-zA-Z0-9_-]+)/);
      if (match) {
        const adId = match[1];
        if (ads.length > 0) {
          const ad = ads.find(a => a.id === adId);
          if (ad) {
            setSelectedAd(ad);
          }
        } else {
          fetch(`/api/ads/${adId}`)
            .then(res => {
              if (res.ok) return res.json();
              throw new Error("Ad not found");
            })
            .then(ad => {
              setSelectedAd(ad);
            })
            .catch(err => {
              console.error("Failed to load notice from URL path", err);
            });
        }
      } else if (window.location.pathname === "/" || window.location.pathname === "") {
        setSelectedAd(null);
      }
    };

    handleNavigation();

    window.addEventListener("popstate", handleNavigation);
    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [ads]);

  const fetchAds = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (activeCategory !== "all") queryParams.append("category", activeCategory);
      if (activeCity !== "all") queryParams.append("city", activeCity);
      if (activeThana) queryParams.append("thana", activeThana);
      if (activeUnion) queryParams.append("unionName", activeUnion);
      if (activeVillage) queryParams.append("village", activeVillage);
      if (searchQuery) queryParams.append("query", searchQuery);
      if (currentUser?.role === "admin") queryParams.append("showAll", "true");

      const res = await fetch(`/api/ads?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAds(data);
      }
    } catch (e) {
      console.error("Oops! Failed to connect to server.", e);
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    // Disabled as per user request to never show notification on any page
    return;
  };

  const handleDismissToast = () => {
    setIsDismissedManually(true);
    setIsToastShown(false);
  };

  // Auth Functions
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    try {
      const endpoint = authType === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = authType === "login" 
        ? { emailOrPhone: authForm.email, password: authForm.password }
        : { name: authForm.name, email: authForm.email, phone: authForm.phone, location: authForm.location, password: authForm.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "প্রক্রিয়াটি সম্পন্ন করা যায়নি।");
        return;
      }

      // Success
      setCurrentUser(data.user);
      localStorage.setItem("lost_found_user", JSON.stringify(data.user));
      setAuthSuccess(authType === "login" ? "সফলভাবে লগইন হয়েছে!" : "অ্যাকাউন্ট তৈরি সফল হয়েছে!");
      showNotification(`স্বাগতম, ${data.user.name}!`);
      
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setAuthSuccess("");
        // Clear inputs for security
        setAuthForm({ name: "", email: "", phone: "", location: "Dhaka", password: "" });
      }, 1000);

    } catch (err) {
      setAuthError("সার্ভার সংযোগে সমস্যা হয়েছে। দয়া করে পুনরায় চেষ্টা করুন।");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("lost_found_user");
    showNotification("লগ আউট করা হয়েছে।");
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (postForm.gdNumber && !isGdFormatValid(postForm.gdNumber)) {
      setPostError(lang === 'bn' 
        ? "অনুরোধ অগ্রাহ্য করা হয়েছে! জিডি নম্বর ফরম্যাটটি সঠিক নয়! উদাঃ GD-74291/26" 
        : "Submission failed! GD number format is incorrect! e.g. GD-74291/26"
      );
      return;
    }

    setPostError("");
    setIsPosting(true);

    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          ...postForm,
          images: uploadedImages,
          gdImage: uploadedGdImage,
          reward: postForm.hasReward ? Number(postForm.reward) : 0
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setPostError(data.error || "বিজ্ঞপ্তি পোস্ট করা সম্ভব হয়নি।");
        setIsPosting(false);
        return;
      }

      // Success
      setAds(prev => [data.ad, ...prev]);
      setIsCreateModalOpen(false);
      resetPostForm();
      showNotification("বিজ্ঞপ্তিটি সফলভাবে পোস্ট হয়েছে ও AI দ্বারা যাচাই করা হয়েছে!");
      
      // Auto-preview the newly created ad
      setSelectedAd(data.ad);
    } catch (e) {
      setPostError("সার্ভারে বিজ্ঞপ্তি পাঠানো ব্যর্থ হয়েছে।");
    } finally {
      setIsPosting(false);
    }
  };

  const resetPostForm = () => {
    setPostForm({
      title: "",
      category: "mobile",
      brand: "",
      modelName: "",
      serialOrImei: "",
      lossDate: "",
      lossLocation: "",
      city: "Dhaka",
      thana: "Mirpur (মিরপুর)",
      unionName: "Section 1 (সেকশন ১)",
      village: "",
      gdNumber: "",
      gdAuthority: "",
      hasReward: false,
      reward: "",
      proofDetails: "",
      description: ""
    });
    setUploadedImages([]);
    setUploadedGdImage(null);
    setOriginalUploadedImages({});
    setAnnotatedImageIndices([]);
    setIsAnnotatorOpen(false);
    setPostingStep(1);
    setPostError("");
  };

  // Submit Comments
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedAd || !commentText.trim()) return;

    try {
      const res = await fetch(`/api/ads/${selectedAd.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          content: commentText,
          isFounderClaim
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedAd(data.ad);
        // Sync inside central list too
        setAds(prev => prev.map(a => a.id === data.ad.id ? data.ad : a));
        setCommentText("");
        setIsFounderClaim(false);
        showNotification("আপনার লিড/মন্তব্য জমা হয়েছে!");
      }
    } catch (e) {
      console.error("Failed to add comment", e);
    }
  };

  // Handle Mark as Found (Supports Success Stories with reunion picture & story)
  const handleMarkAsFound = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentUser || !selectedAd) return;
    try {
      const res = await fetch(`/api/ads/${selectedAd.id}/found`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          reunitedImage: reunionImage,
          reunitedStory: reunionStory
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedAd(data.ad);
        setAds(prev => prev.map(a => a.id === data.ad.id ? data.ad : a));
        setReunionImage(null);
        setReunionStory("");
        setIsShowingReunionForm(false);
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
        }, 6500);
        showNotification("অভিনন্দন! পণ্যটি উদ্ধার হয়েছে বলে নিশ্চিত করা হয়েছে 🎉");
      }
    } catch (e) {
      console.error("Failed to mark ad as found", e);
    }
  };

  // Helper render for Category Icons
  const renderCategoryIcon = (category: Category, className = "w-4 h-4") => {
    switch(category) {
      case "mobile": return <Smartphone className={className} />;
      case "bike": return <BikeIcon className={className} />;
      case "car": return <CarIcon className={className} />;
      case "bicycle": return <BikeIcon className={className} />;
      default: return <HelpCircle className={className} />;
    }
  };

  // Return to home or refresh if already on home
  const handleLogoClick = () => {
    const isCurrentlyOnHome = 
      !selectedAd && 
      !isProfileOpen && 
      !isAuthModalOpen && 
      !isCreateModalOpen && 
      !isContactModalOpen && 
      !footerModalType && 
      !isShowingReunionForm &&
      !isOnlyShowFoundState &&
      activeCategory === "all" && 
      activeCity === "all" && 
      activeThana === "" && 
      activeUnion === "" && 
      activeVillage === "" && 
      searchQuery === "";

    if (isCurrentlyOnHome) {
      // If already on Home, trigger refresh (re-fetch ads)
      fetchAds();
      // Removed notification toast per user request
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Close all modals the user might have open
      setSelectedAd(null);
      setIsProfileOpen(false);
      setIsAuthModalOpen(false);
      setIsCreateModalOpen(false);
      setIsContactModalOpen(false);
      setFooterModalType(null);
      setIsShowingReunionForm(false);
      setIsCategoryDrawerOpen(false);
      setIsOnlyShowFoundState(false);

      // Reset all category and location filters to default
      setActiveCategory("all");
      setActiveCity("all");
      setActiveThana("");
      setActiveUnion("");
      setActiveVillage("");
      setSearchQuery("");
      setCurrentSearchInput("");

      // Smoothly scroll back to the very top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showNotification(lang === 'bn' ? "হোম পেজে ফিরিয়ে আনা হয়েছে" : "Returned to Home page");
    }
  };

  // Search logic
  const handleSearchExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(currentSearchInput);
    setShowAutocomplete(false);
  };

  const handleClearSearch = () => {
    setCurrentSearchInput("");
    setSearchQuery("");
    setShowAutocomplete(false);
  };

  const handleOpenAdDetails = (ad: LostAd) => {
    setIsDescExpanded(false);
    const currentViews = (ad.views || 0) + 1;
    const updatedAd = { ...ad, views: currentViews };
    setSelectedAd(updatedAd);
    setAds(prev => prev.map(a => a.id === ad.id ? { ...a, views: currentViews } : a));
    fetch(`/api/ads/${ad.id}/view`, { method: "POST" }).catch(() => {});
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Copy shareable link copy-to-clipboard dummy
  const handleCopyToClipboard = (ad: LostAd) => {
    const dummyUrl = `${window.location.origin}/notice/${ad.id}`;
    navigator.clipboard.writeText(dummyUrl).then(() => {
      showNotification(lang === 'bn' ? "বিজ্ঞপ্তির লিংক ক্লিপবোর্ডে কপি হয়েছে!" : "Notice link copied to clipboard!");
    }).catch(() => {
      showNotification(lang === 'bn' ? "কপি করা যায়নি, অনুগ্রহ করে ম্যানুয়ালি কপি করুন।" : "Could not copy link, please copy manually.");
    });
  };

  const handleSocialShare = async (ad: LostAd) => {
    const shareUrl = `${window.location.origin}/notice/${ad.id}`;
    const shareText = lang === 'bn' 
      ? `Looking.bd তে দেখুন - '${ad.title}' এই হারানো পণ্যটি খুঁজে পেতে বা আমাদের তথ্য দিয়ে সাহায্য করুন।`
      : `Check out on Looking.bd - Help find '${ad.title}'. See details here:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: ad.title,
          text: shareText,
          url: shareUrl
        });
        showNotification(lang === 'bn' ? "সফলভাবে শেয়ার করা হয়েছে!" : "Shared successfully!");
      } catch (err) {
        console.warn("Share API cancelled/failed, copying link", err);
        handleCopyToClipboard(ad);
      }
    } else {
      handleCopyToClipboard(ad);
    }
  };

  const handleShareApp = (platform: 'whatsapp' | 'facebook' | 'telegram' | 'twitter', ad: LostAd) => {
    const shareUrl = `${window.location.origin}/notice/${ad.id}`;
    const shareText = lang === 'bn' 
      ? `Looking.bd তে দেখুন - '${ad.title}' হারানো আইটেমটি খুঁজে পেতে সাহায্য করুন: ${shareUrl}`
      : `Looking.bd - Help find lost item '${ad.title}': ${shareUrl}`;
    
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
    }
  };

  // Client-side filters for Police GD presence, rewards criteria and brand
  const filteredAds = ads.filter(ad => {
    // Only display approved ads on the main feed
    if (ad.approvalStatus && ad.approvalStatus !== "approved") {
      return false;
    }

    if (isOnlyShowFoundState) {
      if (ad.status !== "found") return false;
    } else {
      if (ad.status === "found") return false;
    }
    if (onlyWithGd && !ad.gdNumber) return false;
    if (onlyWithReward && !ad.hasReward) return false;
    if (selectedBrand !== "all") {
      if (!ad.brand || ad.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
    }
    return true;
  });

  const postsPerPage = 20;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredAds.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredAds.length / postsPerPage);

  const dbSuccessStories = ads.filter(ad => ad.status === "found" && ad.reunitedImage);

  const staticSuccessStories = [
    {
      id: "story-static-1",
      title: lang === 'bn' ? "হোন্ডা আরটিআর ১৬০ বাইক উদ্ধার!" : "Honda RTR 160 Recovered!",
      ownerName: lang === 'bn' ? "মোহাম্মদ শাহজাহান" : "Mohammad Shahjahan",
      location: lang === 'bn' ? "মিরপুর, ঢাকা" : "Mirpur, Dhaka",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      story: lang === 'bn' 
        ? "মিরপুর ১০ থেকে চুরি হওয়া বাইকটি এই পোর্টালের জিপিএস লোকেশন ট্র্যাকিং ও জিডি তথ্যের মাধ্যমে বাড্ডা সংলগ্ন এলাকা থেকে উদ্ধার করা সম্ভব হয়েছে।"
        : "The motorcycle stolen from Mirpur-10 was tracked down and successfully retrieved from Badda area via Looking.bd."
    },
    {
      id: "story-static-2",
      title: lang === 'bn' ? "আইফোন ১৫ প্রো উদ্ধার!" : "iPhone 15 Pro Retrieved!",
      ownerName: lang === 'bn' ? "সাদিয়া আক্তার" : "Sadia Akhter",
      location: lang === 'bn' ? "ধানমণ্ডি, ঢাকা" : "Dhanmondi, Dhaka",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      story: lang === 'bn'
        ? "ধানমণ্ডি রবীন্দ্র সরোবরে হারিয়ে যাওয়া আইফোনটি রিকশাচালক ও মালিকানার বক্সের মাধ্যমে উদ্ধার করে মালিককে ফেরত দেওয়া হয়েছে।"
        : "The iPhone was lost in Dhanmondi Lake and has been returned safely thanks to matching serial numbers and the Box verification check."
    }
  ];

  // Dynamic SEO metadata with React Helmet
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://looking.bd';
  const metaTitle = selectedAd
    ? (lang === 'bn' 
        ? `${selectedAd.title} | ${selectedAd.city} এ হারিয়ে যাওয়া বিজ্ঞাপন - লুকিং ডট বিডি` 
        : `${selectedAd.title} | Lost item in ${selectedAd.city} - Looking.bd`)
    : (lang === 'bn'
        ? "হারানো ও প্রাপ্তি পোর্টাল - লুকিং ডট বিডি"
        : "Lost & Found Portal - Looking.bd");

  const metaDescription = selectedAd
    ? (lang === 'bn'
        ? `বিজ্ঞপ্তি: ${selectedAd.title}। বিভাগ: ${selectedAd.city}। হারিয়ে যাওয়ার স্থান: ${selectedAd.lossLocation}। তারিখ: ${new Date(selectedAd.lossDate).toLocaleDateString("bn-BD")}। লুকিং ডট বিডি পোর্টালে বিস্তারিত বিবরণ দেখুন বা কোনো তথ্য জানা থাকলে সাহায্য করুন।`
        : `Listing: ${selectedAd.title}. Division: ${selectedAd.city}. Lost Location: ${selectedAd.lossLocation}. Date: ${new Date(selectedAd.lossDate).toLocaleDateString("en-US")}. Check complete details or help with info on Looking.bd.`)
    : (lang === 'bn'
        ? "লুকিং ডট বিডি - বাংলাদেশের নির্ভরযোগ্য হারিয়ে যাওয়া এবং প্রাপ্তি পোর্টাল। আপনার মোবাইল, মোটরসাইকেল, গাড়ি, গুরুত্বপূর্ণ নথি বা অন্য যেকোনো হারিয়ে যাওয়া পণ্য সহজে খুঁজুন এবং উদ্ধার করুন।"
        : "Looking.bd - Bangladesh's reliable lost & found portal. Easily post notices, search for lost mobile phones, motorbikes, cars, keys, documents, and trace them using community verify checks.");

  const metaKeywords = selectedAd
    ? `${selectedAd.title}, ${selectedAd.category}, ${selectedAd.city}, ${selectedAd.lossLocation || ""}, lost and found Bangladesh, lost item, looking bd`
    : "lost and found, bangladesh, looking bd, mobile phone tracker, lost bike bangladesh, lost key bd, looking.bd, lost items portal dhaka, chattogram, sylhet";

  const metaUrl = selectedAd ? `${origin}/notice/${selectedAd.id}` : origin;
  const metaImage = selectedAd ? getAdImage(selectedAd) : `${origin}/assets/logo.png`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metaUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={metaUrl} />
        <meta property="twitter:title" content={metaTitle} />
        <meta property="twitter:description" content={metaDescription} />
        <meta property="twitter:image" content={metaImage} />
      </Helmet>

      <div 
        className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-sans pb-24 relative select-none transition-colors duration-200" 
        id="app-root"
      onTouchStart={(e) => handlePullStart(e.touches[0].clientY)}
      onTouchMove={(e) => handlePullMove(e.touches[0].clientY)}
      onTouchEnd={handlePullEnd}
      onMouseDown={(e) => handlePullStart(e.clientY)}
      onMouseMove={(e) => {
        if (dragStartRef.current !== null) {
          handlePullMove(e.clientY);
        }
      }}
      onMouseUp={handlePullEnd}
      onMouseLeave={handlePullEnd}
    >
      {/* Dynamic Toast Notification with Slide-in animation */}
      <AnimatePresence>
        {isToastShown && toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%", scale: 0.93 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={
              isDismissedManually
                ? { opacity: 0, x: "120%", scale: 0.95, transition: { duration: 0.25, ease: "easeInOut" } }
                : { opacity: 0, y: -20, x: "-50%", scale: 0.95 }
            }
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={handleDismissToast}
            className="fixed top-5 left-1/2 z-50 flex items-center space-x-2 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl border border-slate-800 dark:border-slate-200 text-xs sm:text-sm font-bold backdrop-blur-xs max-w-[90vw] md:max-w-md cursor-pointer pointer-events-auto select-none hover:bg-slate-800 dark:hover:bg-slate-50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0 animate-pulse" />
            <span className="truncate pr-4">{toastMessage}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDismissToast();
              }}
              className="ml-auto text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-800 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pull down to Refresh Visual Badge */}
      {pullDistance > 0 && (
        <div 
          className="fixed left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-75"
          style={{ 
            top: `${Math.min(100, 15 + pullDistance)}px`,
            opacity: Math.min(1, pullDistance / 45)
          }}
        >
          <div className="bg-white text-slate-800 shadow-xl rounded-full px-4 py-2.5 flex items-center space-x-2.5 border border-slate-100 font-bold text-xs select-none">
            <RefreshCw 
              className={`w-4 h-4 text-[#0F4D0F] ${pullStatus === "refreshing" ? "animate-spin" : ""}`} 
              style={{ transform: pullStatus === "refreshing" ? undefined : `rotate(${pullDistance * 6}deg)` }} 
            />
            <span className="text-slate-700 tracking-tight font-medium">
              {pullStatus === "refreshing" 
                ? (lang === 'bn' ? "রিফ্রেশ হচ্ছে..." : "Refreshing...")
                : pullStatus === "canRelease"
                ? (lang === 'bn' ? "ছেড়ে দিন রিফ্রেশ হবে" : "Release to refresh")
                : (lang === 'bn' ? "টেনে রিফ্রেশ করুন" : "Pull down to refresh")}
            </span>
          </div>
        </div>
      )}

      {/* 1. COMPACT TOP HEADER */}
      <header className="bg-[#0F4D0F] text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 flex items-center justify-between">
          
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Hamburger Categories Button */}
            {!isAuthModalOpen && !isProfileOpen && !isAdminDashboardOpen && (
              <button 
                onClick={() => setIsCategoryDrawerOpen(true)}
                className="p-1.5 hover:bg-[#0b3b0b] rounded-lg transition-colors flex items-center justify-center space-x-1"
                id="hamburger-menu-btn"
                title={t("categoryLabel")}
              >
                <Menu className="w-5 h-5 text-white" />
                <span className="text-xs font-semibold hidden md:inline-block">{lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}</span>
              </button>
            )}

            {/* Logo */}
            <div 
              className="flex items-center space-x-1.5 sm:space-x-2 cursor-pointer flex-shrink-0" 
              onClick={handleLogoClick}
            >
              <div className="bg-[#ffcb05] text-[#0F4D0F] p-1 rounded-md flex items-center justify-center font-bold text-base sm:text-lg shadow-sm flex-shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xs sm:text-sm md:text-base tracking-tight leading-none">Looking.bd</span>
                <span className="text-[8px] sm:text-[9px] text-[#ffcb05] font-semibold leading-none mt-0.5">
                  {lang === 'bn' ? 'হারানো ও প্রাপ্তি পোর্টাল' : 'Lost & Found Portal'}
                </span>
              </div>
            </div>
          </div>

          {/* Right actions: Post Button and Theme Toggle */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Dark & Light theme toggle */}
            <button 
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 bg-[#0b3b0b] hover:bg-[#095f4a] rounded-lg text-white transition-colors flex items-center justify-center cursor-pointer border border-[#0a7057] shadow-sm"
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              id="theme-toggle-btn"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-300" /> : <Moon className="w-4 h-4 text-emerald-100" />}
            </button>

            <button 
              onClick={() => {
                if (!currentUser) {
                  setSelectedAd(null);
                  setIsProfileOpen(false);
                  setAuthType("register");
                  setIsAuthModalOpen(true);
                  setAuthError(t("authRequiredMsg"));
                } else {
                  setIsCreateModalOpen(true);
                }
              }}
              className="bg-[#ffcb05] hover:bg-[#e6b600] text-slate-900 px-3 py-1.5 sm:py-2 rounded-lg font-extrabold text-[10px] sm:text-xs transition-colors flex items-center space-x-1 shadow-sm flex-shrink-0 cursor-pointer"
              id="post-notice-btn"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 h-4 flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">{t("giveNotice")}</span>
              <span className="xs:hidden">{t("postNoticeCompact")}</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. SLENDER BANNER & HIGH-DENSITY SEARCH */}
      {!selectedAd && !isAuthModalOpen && !isProfileOpen && !isAdminDashboardOpen && (
        <section className="bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 py-4 shadow-sm" id="search-section">
        <div className="max-w-6xl mx-auto px-4">
          


          {/* Core Search Form matching mockup: [Select Location] [Select Category] [Options] [Type IMEI/SN] [[Search]] */}
          <form onSubmit={handleSearchExecute} className="flex flex-col lg:flex-row gap-2 items-stretch" id="search-form">
            


            {/* 2. Category Selection */}
            <div className="flex-1 min-w-[140px] px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 flex flex-col justify-center relative shadow-xs">
              <span className="text-[9px] text-slate-400 font-bold uppercase">{lang === 'bn' ? 'ক্যাটাগরি' : 'Select Category'}</span>
              <div className="flex items-center justify-between mt-0.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600 mr-1 flex-shrink-0" />
                <select 
                  value={activeCategory} 
                  onChange={(e) => setActiveCategory(e.target.value as Category | 'all')}
                  className="w-full bg-transparent border-none text-slate-700 dark:text-slate-200 font-bold focus:outline-none focus:ring-0 text-xs cursor-pointer p-0 appearance-none pr-4"
                  id="search-category-select"
                >
                  <option value="all" className="dark:bg-slate-900 dark:text-slate-100">{lang === 'bn' ? 'সব ক্যাটাগরি' : 'All Categories'}</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id} className="dark:bg-slate-900 dark:text-slate-100">{lang === 'bn' ? cat.banglaName : cat.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
              </div>
            </div>



            {/* 4. IMEI / SN Search field with Real-Time Trending Searches Dropdown */}
            <div 
              ref={autocompleteRef}
              className="flex-[2] min-w-[200px] px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 flex flex-col justify-center relative shadow-xs"
            >
              <span className="text-[9px] text-slate-400 font-bold uppercase">{lang === 'bn' ? 'আইএমইআই-১/২ অথবা সিরিয়াল' : 'Type one S/N - IMEI-1/2'}</span>
              <div className="flex items-center mt-0.5">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
                <input 
                  type="text" 
                  placeholder={lang === 'bn' ? "IMEI, মডেল বা সাধারণ ডায়েরি..." : "Enter IMEI-1/2 or Serial or GP..."}
                  value={currentSearchInput}
                  onChange={(e) => {
                    setCurrentSearchInput(e.target.value);
                    setShowAutocomplete(true);
                  }}
                  onFocus={() => setShowAutocomplete(true)}
                  onClick={() => setShowAutocomplete(true)}
                  className="w-full bg-transparent border-none focus:outline-none text-slate-700 dark:text-slate-200 font-semibold text-xs p-0 focus:ring-0"
                  id="search-query-input"
                  autoComplete="off"
                />
                {currentSearchInput && (
                  <button 
                    type="button" 
                    onClick={handleClearSearch}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer border-none bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Real-time Trending Searches Dropdown */}
              <SearchTrendingDropdown
                isOpen={showAutocomplete}
                onClose={() => setShowAutocomplete(false)}
                currentInput={currentSearchInput}
                onSelectQuery={(q, filterType, val) => {
                  setCurrentSearchInput(q);
                  setSearchQuery(q);
                  if (filterType === 'city' && val) {
                    setActiveCity(val);
                  }
                  setShowAutocomplete(false);
                }}
                ads={ads}
                lang={lang}
              />
            </div>

            {/* 5. Submit Button */}
            <button 
              type="submit" 
              className="bg-[#0F4D0F] hover:bg-[#0b3b0b] text-white px-7 py-3 rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 flex-shrink-0 cursor-pointer border-none"
              id="search-submit-btn"
            >
              <Search className="w-4 h-4" />
              <span>{t("searchBtn")}</span>
            </button>

          </form>

          {/* ACTIVE FILTER CRUMBS & CLEAR ALL BUTTON */}
          <div className="mt-3 flex flex-wrap gap-2 items-center justify-center text-[10px] md:text-xs">
            
            {onlyWithGd && (
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                ✓ {t("gdLabel")}
                <button onClick={() => setOnlyWithGd(false)} className="font-bold text-red-700 dark:text-red-400 ml-1 hover:underline cursor-pointer border-none bg-transparent">×</button>
              </span>
            )}

            {onlyWithReward && (
              <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full font-bold">
                ✓ {t("rewardLabel")}
                <button onClick={() => setOnlyWithReward(false)} className="font-bold text-red-700 dark:text-red-400 ml-1 hover:underline cursor-pointer border-none bg-transparent">×</button>
              </span>
            )}

            {activeCategory !== "all" && (
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-bold">
                {lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}: {lang === 'bn' ? CATEGORIES.find(c => c.id === activeCategory)?.banglaName : CATEGORIES.find(c => c.id === activeCategory)?.name}
                <button onClick={() => setActiveCategory("all")} className="font-bold text-red-700 dark:text-red-400 ml-1 hover:underline cursor-pointer border-none bg-transparent">×</button>
              </span>
            )}

            {selectedBrand !== "all" && (
              <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-950 dark:text-purple-300 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 font-bold">
                {lang === 'bn' ? 'ব্র্যান্ড' : 'Brand'}: {selectedBrand}
                <button onClick={() => setSelectedBrand("all")} className="font-bold text-red-700 dark:text-red-400 ml-1 hover:underline cursor-pointer border-none bg-transparent">×</button>
              </span>
            )}

            {activeCity !== "all" && (
              <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-bold">
                {lang === 'bn' ? 'বিভাগ' : 'Division'}: {lang === 'bn' ? BANGLADESH_CITIES.find(c => c.id === activeCity)?.banglaName : BANGLADESH_CITIES.find(c => c.id === activeCity)?.name}
                <button onClick={() => { setActiveCity("all"); setActiveThana(""); setActiveUnion(""); }} className="font-bold text-red-700 dark:text-red-400 ml-1 hover:underline cursor-pointer border-none bg-transparent">×</button>
              </span>
            )}

            {activeThana && (
              <span className="bg-cyan-100 dark:bg-cyan-950/60 text-cyan-950 dark:text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800 font-bold">
                {lang === 'bn' ? 'জেলা' : 'District'}: {activeThana}
                <button onClick={() => { setActiveThana(""); setActiveUnion(""); }} className="font-bold text-red-700 dark:text-red-400 ml-1 hover:underline cursor-pointer border-none bg-transparent">×</button>
              </span>
            )}

            {activeUnion && (
              <span className="bg-indigo-100 dark:bg-indigo-950/60 text-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800 font-bold">
                {lang === 'bn' ? 'থানা' : 'Thana'}: {activeUnion}
                <button onClick={() => setActiveUnion("")} className="font-bold text-red-700 dark:text-red-400 ml-1 hover:underline cursor-pointer border-none bg-transparent">×</button>
              </span>
            )}

            {isOnlyShowFoundState && (
              <span className="bg-[#ffcb05] dark:bg-amber-500 text-slate-900 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-600 font-extrabold shadow-xs">
                {lang === 'bn' ? '✓ শুধু উদ্ধারকৃত নোটিশ' : '✓ Recovered Only'}
                <button onClick={() => setIsOnlyShowFoundState(false)} className="font-bold text-red-700 ml-2 hover:underline cursor-pointer border-none bg-transparent">×</button>
              </span>
            )}

            {(activeCategory !== "all" || activeCity !== "all" || activeThana || activeUnion || searchQuery || onlyWithGd || onlyWithReward || selectedBrand !== "all" || isOnlyShowFoundState) && (
              <button 
                onClick={() => { 
                  setActiveCategory("all"); 
                  setActiveCity("all"); 
                  setActiveThana("");
                  setActiveUnion("");
                  setActiveVillage("");
                  setSearchQuery(""); 
                  setCurrentSearchInput(""); 
                  setOnlyWithGd(false);
                  setOnlyWithReward(false);
                  setSelectedBrand("all");
                  setIsOnlyShowFoundState(false);
                }}
                className="text-red-600 dark:text-red-400 hover:underline font-bold text-[11px] cursor-pointer border-none bg-transparent"
              >
                {t("clearAll")}
              </button>
            )}

          </div>

        </div>
      </section>
      )}

      {/* 3. CORE THREE-COLUMN CLASSIFIED MODULE LAYOUT */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-6">
        
        {isAuthModalOpen && !currentUser ? (
          /* ========================================================== */
          /* 8. USER ACCOUNT PAGE (Login/Register)                      */
          /* ========================================================== */
          <div className="max-w-md mx-auto animate-fade-in py-8" id="auth-modal">
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl p-6 sm:p-8 shadow-md relative"
            >
              <button 
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={lang === "bn" ? "বন্ধ করুন" : "Close"}
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 mb-1">
                {authType === "login" ? "অ্যাকাউন্টে লগইন করুন" : "নতুন নাগরিক অ্যাকাউন্ট তৈরি"}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-450 leading-normal mb-5">
                {authType === "login" 
                  ? "আপনার নিবন্ধিত ইমেল আইডি দিয়ে অবিলম্বে লগইন করুন এবং হারানো নোটিশ ফিরিয়ে দিন।" 
                  : "হারানো বিজ্ঞপ্তি প্রকাশ এবং অন্যদের পোস্টে সাহায্য করতে আপনার অ্যাকাউন্টটি সম্পূর্ণ ফ্রিতে তৈরি করুন।"}
              </p>

              {authError && (
                <div className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 p-3 rounded-lg text-xs font-semibold mb-4 leading-relaxed flex items-start space-x-1.5 border border-red-100 dark:border-red-900/50">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 p-3 rounded-lg text-xs font-semibold mb-4 flex items-center space-x-1.5 border border-emerald-100 dark:border-emerald-900/50">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4" id="auth-form">
                
                {authType === "register" && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">আপনার নাম *</label>
                      <input 
                        type="text" 
                        required
                        value={authForm.name}
                        onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                        placeholder="উদাঃ কাজী তানভীর"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                        id="auth-name-input"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">মোবাইল ফোন নম্বর *</label>
                      <input 
                        type="tel" 
                        required
                        value={authForm.phone}
                        onChange={(e) => setAuthForm({...authForm, phone: e.target.value})}
                        placeholder="উদাঃ 017XXXXXXXX"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
                        id="auth-phone-input"
                      />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">বিভাগ *</label>
                        <select 
                          value={regDivision}
                          onChange={(e) => {
                            const newDiv = e.target.value;
                            const districtsOfNewDiv = Object.keys(BD_LOCATION_HIERARCHY[newDiv] || {});
                            const defaultDist = districtsOfNewDiv[0] || "";
                            const thanasOfNewDist = BD_LOCATION_HIERARCHY[newDiv]?.[defaultDist] || [];
                            const defaultThana = thanasOfNewDist[0] || "";

                            setRegDivision(newDiv);
                            setRegDistrict(defaultDist);
                            setRegThana(defaultThana);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                          id="auth-city-select"
                        >
                          {BANGLADESH_CITIES.filter(c => c.id !== "all").map(city => (
                            <option key={city.id} value={city.name} className="dark:bg-slate-900 dark:text-slate-100">{city.banglaName}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">জেলা *</label>
                        <select 
                          value={regDistrict}
                          onChange={(e) => {
                            const newDist = e.target.value;
                            const thanasOfNewDist = BD_LOCATION_HIERARCHY[regDivision]?.[newDist] || [];
                            const defaultThana = thanasOfNewDist[0] || "";

                            setRegDistrict(newDist);
                            setRegThana(defaultThana);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                          id="auth-district-select"
                        >
                          {Object.keys(BD_LOCATION_HIERARCHY[regDivision] || {}).map(dist => (
                            <option key={dist} value={dist} className="dark:bg-slate-900 dark:text-slate-100">{dist}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">থানা *</label>
                        <select 
                          value={regThana}
                          onChange={(e) => {
                            setRegThana(e.target.value);
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                          id="auth-thana-select"
                        >
                          {(BD_LOCATION_HIERARCHY[regDivision]?.[regDistrict] || []).map(thana => (
                            <option key={thana} value={thana} className="dark:bg-slate-900 dark:text-slate-100">{thana}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  {authType === "login" ? (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">আপনার ইমেইল বা মোবাইল নম্বর *</label>
                      <input 
                        type="text" 
                        required
                        value={authForm.email}
                        onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                        placeholder="উদাঃ user@example.com অথবা 017XXXXXXXX"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-3"
                        id="auth-email-input"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">আপনার ইমেল ঠিকানা *</label>
                      <input 
                        type="email" 
                        required
                        value={authForm.email}
                        onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                        placeholder="উদাঃ user@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100 mb-3"
                        id="auth-email-input"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">পাসওয়ার্ড *</label>
                    <input 
                      type="password" 
                      required
                      value={authForm.password}
                      onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                      placeholder="পাসওয়ার্ড লিখুন"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                      id="auth-password-input"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#0F4D0F] hover:bg-[#0b3b0b] text-white py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-colors mt-2 cursor-pointer border-none"
                  id="auth-submit-btn"
                >
                  {authType === "login" ? "লগইন করুন" : "অ্যাকাউন্ট তৈরি করুন"}
                </button>

              </form>

              <div className="mt-5 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4">
                {authType === "login" ? (
                  <span>
                    কোনো অ্যাকাউন্ট তৈরি করেননি?{" "}
                    <button onClick={() => { setAuthType("register"); setAuthError(""); }} className="text-emerald-600 hover:underline font-bold bg-transparent border-none cursor-pointer">রেজিস্ট্রেশন করুন</button>
                  </span>
                ) : (
                  <span>
                    আগে থেকেই অ্যাকাউন্ট আছে?{" "}
                    <button onClick={() => { setAuthType("login"); setAuthError(""); }} className="text-emerald-600 hover:underline font-bold bg-transparent border-none cursor-pointer">লগইন করুন</button>
                  </span>
                )}
              </div>

            </motion.div>
          </div>
        ) : (isAdminDashboardOpen && currentUser && currentUser.role === 'admin') ? (
          /* ========================================================== */
          /* ADMIN DASHBOARD PAGE                                       */
          /* ========================================================== */
          <AdminDashboard 
            lang={lang} 
            onClose={() => setIsAdminDashboardOpen(false)} 
            currentUser={currentUser}
            ads={ads}
            setAds={setAds}
          />
        ) : isProfileOpen && currentUser ? (
          /* ========================================================== */
          /* USER PROFILE DETAILS PAGE                                  */
          /* ========================================================== */
          <div className="max-w-md mx-auto animate-fade-in py-8" id="user-profile-modal">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl p-6 sm:p-8 shadow-md relative flex flex-col"
            >
              <button
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                title={lang === "bn" ? "বন্ধ করুন" : "Close"}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center justify-center text-center mt-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 p-3 rounded-full mb-3 shadow-xs">
                  <UserIcon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{currentUser.name}</h3>
                <span className="text-xs text-slate-400 font-semibold">{lang === 'bn' ? 'নিবন্ধিত সদস্য' : 'Verified Member'}</span>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{lang === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.email || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{lang === 'bn' ? 'মোবাইল নাম্বার' : 'Phone Number'}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.phone || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500">{lang === 'bn' ? 'ডিফল্ট লোকেশন' : 'Location'}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.location || "Dhaka"}</span>
                </div>
              </div>

              {/* My Saved Items collection */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 pb-2 flex-grow overflow-y-auto max-h-60">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center space-x-1">
                  <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                  <span>{lang === 'bn' ? 'সংরক্ষিত বিজ্ঞাপনসমূহ' : 'My Saved Items'} ({savedAdIds.length})</span>
                </h4>
                {savedAdIds.length === 0 ? (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center py-4">
                    {lang === 'bn' ? 'কোনো আইটেম সংরক্ষিত নেই' : 'No items saved yet'}
                  </p>
                ) : (
                  <div className="space-y-2 pr-1">
                    {ads.filter(ad => savedAdIds.includes(ad.id)).map(ad => (
                      <div 
                        key={ad.id}
                        onClick={() => {
                          setSelectedAd(ad);
                          setIsProfileOpen(false);
                          window.scrollTo({ top: 0, behavior: "instant" });
                        }}
                        className="flex items-center space-x-2 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800/85 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                      >
                        <img 
                          src={getAdImage(ad)} 
                          alt={ad.title} 
                          className="w-8 h-8 rounded object-cover flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-grow min-w-0">
                          <h5 className="font-bold text-slate-700 dark:text-slate-200 text-[11px] truncate leading-tight">{ad.title}</h5>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500 flex items-center space-x-0.5 mt-0.5">
                            <Tag className="w-2.5 h-2.5 text-emerald-600" />
                            <span className="truncate">{lang === 'bn' ? CATEGORIES.find(c => c.id === ad.category)?.banglaName : CATEGORIES.find(c => c.id === ad.category)?.name}</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveAd(ad.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsAdminDashboardOpen(true);
                  }}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer border-none shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Open Admin Dashboard'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setIsProfileOpen(false);
                }}
                className="w-full mt-4 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center space-x-1.5 transition-colors border border-red-100 dark:border-red-900/50 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'লগ-আউট করুন' : 'Log Out Account'}</span>
              </button>
            </motion.div>
          </div>
        ) : selectedAd ? (
          /* ========================================== */
          /* AD DETAILS - NEXT PAGE VIEW (NOT POPUP)      */
          /* ========================================== */
          <div className="space-y-4 max-w-4xl mx-auto animate-fade-in" id="ad-details-page">
            
            {/* Core classified details container */}
            <div className="space-y-4">
              
              {/* Main Ad Card Base Info */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-0 overflow-hidden shadow-sm space-y-0">
                  
                  {/* Title and Share Button Outside and Above the Photo */}
                  <div className="px-3.5 sm:px-4 pt-2.5 pb-1.5 flex items-center justify-between gap-3">
                    <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight leading-tight flex-1">
                      {selectedAd.title}
                    </h1>
                    <button
                      type="button"
                      onClick={() => handleCopyToClipboard(selectedAd)}
                      title={lang === 'bn' ? 'শেয়ার করুন' : 'Share'}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#0F4D0F] rounded-lg transition-all duration-200 hover:scale-105 shadow-xs cursor-pointer flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-600 text-xs font-bold shrink-0"
                      id="details-share-btn"
                      aria-label={lang === 'bn' ? 'শেয়ার করুন' : 'Share'}
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#0F4D0F]" />
                      <span>{lang === 'bn' ? 'শেয়ার' : 'Share'}</span>
                    </button>
                  </div>

                  {/* Status update overlay */}
                  {selectedAd.status === "found" && (
                    <div className="mx-0 mb-3 bg-emerald-50 dark:bg-emerald-950/20 border-y border-emerald-200 dark:border-emerald-800/80 p-4 flex items-center space-x-3 text-emerald-800 dark:text-[#a7f3d0] text-xs shadow-xs">
                      <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold">{lang === 'bn' ? 'সফলভাবে ফেরত পাওয়া গিয়েছে!' : 'Successfully Recovered!'}</h4>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">{lang === 'bn' ? 'এই নোটিশ প্রণেতা নিশ্চিত করেছেন যে তার হারিয়ে যাওয়া জিনিস ফিরিয়ে দেওয়া হয়েছে।' : 'The owner has verified that the item has been returned successfully.'}</p>
                      </div>
                    </div>
                  )}

                  {/* Image Display */}
                  <div className="bg-slate-50 dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-700/80 overflow-hidden p-0 w-full mt-0" id="details-main-image-wrapper">
                    <div 
                      onClick={() => {
                        setPreviewImageIndex(0);
                        setIsPreviewModalOpen(true);
                      }}
                      className="w-full h-72 sm:h-96 bg-slate-100 dark:bg-slate-950 overflow-hidden relative group cursor-zoom-in flex items-center justify-center"
                    >
                      <img 
                        src={getAdImage(selectedAd)}
                        alt={selectedAd.title}
                        className="w-full h-full object-contain mx-auto select-none transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                        loading="eager"
                      />
                      {/* Hint for annotated damage inspection */}
                      {selectedAd.images && selectedAd.images.length > 0 && (
                        <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-1 rounded-md flex items-center space-x-1 shadow pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span>{lang === 'bn' ? 'ক্ষতি/চিহ্ন দেখতে জুম করুন' : 'Click to inspect marks & damages'}</span>
                        </div>
                      )}
                    </div>
                    {/* Multi images gallery */}
                    {selectedAd.images && selectedAd.images.length > 1 && (
                       <div className="flex space-x-2 px-4 sm:px-5 py-3 overflow-x-auto w-full bg-slate-50 dark:bg-slate-900/85 border-t border-slate-200/30 dark:border-slate-800/30">
                        {selectedAd.images.map((imgUrl, i) => (
                          <div 
                            key={i} 
                            onClick={() => {
                              setPreviewImageIndex(i);
                              setIsPreviewModalOpen(true);
                            }}
                            className="w-16 h-16 rounded border border-slate-300 dark:border-slate-600 overflow-hidden flex-shrink-0 cursor-pointer hover:border-emerald-500 bg-white dark:bg-slate-950"
                          >
                            <img src={imgUrl} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="eager" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Metadata bar positioned in series below the image and above Description & Identifiers */}
                  <div className="px-4 sm:px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 dark:bg-emerald-950/40 text-[#0F4D0F] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded-md text-[10px] uppercase font-bold flex items-center space-x-1">
                        {renderCategoryIcon(selectedAd.category, "w-3 h-3 text-[#0F4D0F]")}
                        <span>{lang === 'bn' ? CATEGORIES.find(c => c.id === selectedAd.category)?.banglaName : CATEGORIES.find(c => c.id === selectedAd.category)?.name}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-3 text-slate-500 dark:text-slate-400 text-xs">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold" title={lang === 'bn' ? 'মোট ভিউ' : 'Total Views'}>
                        <Eye className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span>{lang === 'bn' ? (selectedAd.views || 1).toLocaleString("bn-BD") : (selectedAd.views || 1).toLocaleString("en-US")} {lang === 'bn' ? 'ভিউ' : 'views'}</span>
                      </div>
                      <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">
                          {new Date(selectedAd.createdAt).toLocaleDateString(lang === 'bn' ? "bn-BD" : "en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Safety Warning Banner above Description & Identifiers */}
                  <div className="mx-3 sm:mx-4 mt-2.5 bg-amber-50/70 dark:bg-amber-950/15 border border-amber-200/60 dark:border-amber-900/40 rounded-xl p-2.5 sm:p-3 shadow-xs space-y-1 text-left" id="details-safety-warning-banner">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      {lang === 'bn' ? 'নিরাপত্তা সতর্কবার্তা' : 'Safety Warning'}
                    </span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lang === 'bn' 
                        ? 'যেকোনো লেনদেন বা রিওয়ার্ড প্রদানের পূর্বে অবশ্যই থানায় বসে পরীক্ষা করবেন।' 
                        : 'Never pay token charges, courier fees or reward payouts before verified in-person meeting inside local police station premises.'}
                    </p>
                  </div>

                  {/* Core fields & tables */}
                  <div className="pt-2 space-y-1.5 px-0">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-1.5 px-3.5 sm:px-4">
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-widest">
                        {lang === 'bn' ? 'হারানোর বিবরণ ও আইডেন্টিফায়ার' : 'Description & Identifiers'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          setSmsStatus("idle");
                          setIsContactModalOpen(true);
                        }}
                        title={lang === 'bn' ? 'মালিকের সাথে যোগাযোগ' : 'Contact Owner'}
                        className="p-1.5 bg-[#0F4D0F] hover:bg-[#0b3b0b] text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-xs cursor-pointer flex items-center justify-center border-none"
                        id="details-contact-owner-btn"
                        aria-label={lang === 'bn' ? 'মালিকের সাথে যোগাযোগ' : 'Contact Owner'}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-900/50 px-3.5 py-2.5 rounded-none border-x-0 border-y border-slate-100 dark:border-slate-800">
                      <motion.div
                        initial={false}
                        animate={{
                          height: (selectedAd.description.length > 250 && !isDescExpanded) ? 68 : "auto"
                        }}
                        transition={{
                          duration: 0.38,
                          ease: [0.25, 0.1, 0.25, 1.0]
                        }}
                        className="relative overflow-hidden"
                      >
                        <p className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                          {selectedAd.description}
                        </p>
                        {selectedAd.description.length > 250 && !isDescExpanded && (
                          <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-slate-50 dark:from-slate-900/90 via-slate-50/70 dark:via-slate-900/70 to-transparent pointer-events-none" />
                        )}
                      </motion.div>

                      {selectedAd.description.length > 250 && (
                        <button
                          type="button"
                          onClick={() => setIsDescExpanded(!isDescExpanded)}
                          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#0F4D0F] hover:text-[#0b3b0b] focus:outline-none transition-colors border-none bg-transparent cursor-pointer p-0"
                          id="toggle-description-btn"
                          aria-expanded={isDescExpanded}
                        >
                          <span>
                            {isDescExpanded
                              ? (lang === 'bn' ? "কম দেখান" : "Show Less")
                              : (lang === 'bn' ? "আরও দেখান" : "Show More")}
                          </span>
                          <motion.span
                            animate={{ rotate: isDescExpanded ? 180 : 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="inline-flex items-center justify-center"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </motion.span>
                        </button>
                      )}
                    </div>

                    {/* Mobile: Compact card-list layout (visible below md) */}
                    <div className="block md:hidden space-y-1" id="mobile-metadata-card-list">
                      {/* Card 1: Core Information */}
                      <div className="bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/60 rounded-none border-x-0 px-3 py-2">
                        <h4 className="font-bold text-[10.5px] text-[#0F4D0F] uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F4D0F]"></span>
                          {lang === 'bn' ? 'প্রধান তথ্য' : 'Core Information'}
                        </h4>
                        <div className="space-y-0.5 text-[10.5px]">
                          <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/50">
                            <span className="text-slate-400 font-medium">{lang === 'bn' ? 'বিজ্ঞাপনদাতা' : 'Advertiser'}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAd.userName}</span>
                              {selectedAd.userPhone && (
                                <a
                                  href={`tel:${selectedAd.userPhone}`}
                                  className="p-1 bg-emerald-50 dark:bg-emerald-950/40 text-[#0F4D0F] dark:text-emerald-400 hover:bg-[#0F4D0F] hover:text-white border border-emerald-200 dark:border-emerald-800/60 rounded-md transition-all duration-150 flex items-center justify-center shadow-3xs"
                                  title={lang === 'bn' ? 'বিজ্ঞাপনদাতাকে কল করুন' : 'Call'}
                                  aria-label={lang === 'bn' ? 'বিজ্ঞাপনদাতাকে কল করুন' : 'Call'}
                                >
                                  <PhoneCall className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/50">
                            <span className="text-slate-400 font-medium">{lang === 'bn' ? 'হারানোর তারিখ' : 'Date of Loss'}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{new Date(selectedAd.lossDate).toLocaleDateString(lang === 'bn' ? "bn-BD" : "en-US")}</span>
                          </div>
                          <div className="flex justify-between py-0.5 last:border-none">
                            <span className="text-slate-400 font-medium">{lang === 'bn' ? 'পুরস্কার অর্থ' : 'Reward'}</span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                              {selectedAd.hasReward ? `৳ ${lang === 'bn' ? selectedAd.reward.toLocaleString("bn-BD") : selectedAd.reward.toLocaleString("en-US")}` : (lang === 'bn' ? 'নেই' : 'None')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Location Details */}
                      <div className="bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/60 rounded-none border-x-0 px-3 py-2">
                        <h4 className="font-bold text-[10.5px] text-[#0F4D0F] uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F4D0F]"></span>
                          {lang === 'bn' ? 'স্থান সংক্রান্ত তথ্য' : 'Location Details'}
                        </h4>
                        <div className="space-y-0.5 text-[10.5px]">
                          <div className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/50">
                            <span className="text-slate-400 font-medium">{lang === 'bn' ? 'হারানোর স্থান' : 'Loss Location'}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-right max-w-[180px] truncate">{selectedAd.lossLocation}</span>
                          </div>
                          <div className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/50">
                            <span className="text-slate-400 font-medium">{lang === 'bn' ? 'বিভাগ/শহর' : 'Division/City'}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {lang === 'bn' ? (
                                selectedAd.city === 'Dhaka' ? 'ঢাকা বিভাগ' :
                                selectedAd.city === 'Chattogram' ? 'চট্টগ্রাম বিভাগ' :
                                selectedAd.city === 'Sylhet' ? 'সিলেট বিভাগ' :
                                selectedAd.city === 'Khulna' ? 'খুলনা বিভাগ' :
                                selectedAd.city === 'Rajshahi' ? 'রাজশাহী বিভাগ' :
                                selectedAd.city === 'Barishal' ? 'বরিশাল বিভাগ' :
                                selectedAd.city === 'Rangpur' ? 'রংপুর বিভাগ' :
                                selectedAd.city === 'Mymensingh' ? 'ময়মনসিংহ বিভাগ' :
                                selectedAd.city
                              ) : `${selectedAd.city} Division`}
                            </span>
                          </div>
                          {selectedAd.thana && (
                            <div className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/50">
                              <span className="text-slate-400 font-medium">{lang === 'bn' ? 'থানা' : 'Thana'}</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAd.thana}</span>
                            </div>
                          )}
                          {selectedAd.unionName && (
                            <div className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/50">
                              <span className="text-slate-400 font-medium">{lang === 'bn' ? 'ইউনিয়ন' : 'Union'}</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAd.unionName}</span>
                            </div>
                          )}
                          {selectedAd.village && (
                            <div className="flex justify-between py-0.5 last:border-none">
                              <span className="text-slate-400 font-medium">{lang === 'bn' ? 'গ্রাম/মহল্লা' : 'Village'}</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAd.village}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card 3: Item & Verification Details */}
                      <div className="bg-slate-50/50 dark:bg-slate-900/30 border-y border-slate-200/50 dark:border-slate-800/60 rounded-none border-x-0 px-3 py-2">
                        <h4 className="font-bold text-[10.5px] text-[#0F4D0F] uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F4D0F]"></span>
                          {lang === 'bn' ? 'আইটেম ও ভেরিফিকেশন' : 'Item & Verification'}
                        </h4>
                        <div className="space-y-0.5 text-[10.5px]">
                          <div className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/50">
                            <span className="text-slate-400 font-medium">{lang === 'bn' ? 'ব্র্যান্ড ও মডেল' : 'Brand & Model'}</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAd.brand || "—"} ({selectedAd.modelName || "—"})</span>
                          </div>
                          <div className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/50">
                            <span className="text-slate-400 font-medium">{lang === 'bn' ? 'আইডেন্টিফায়ার নম্বর' : 'IMEI / Serial'}</span>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedAd.serialOrImei || "—"}</span>
                          </div>
                          {selectedAd.gdNumber && (
                            <div className="flex justify-between py-0.5 last:border-none">
                              <span className="text-slate-400 font-medium">{lang === 'bn' ? 'থানার জিডি নম্বর' : 'Police GD Docket'}</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{selectedAd.gdNumber} ({selectedAd.gdAuthority})</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Desktop: Grid layout (visible on md and up) */}
                    <div className="hidden md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-2 text-xs text-slate-600 dark:text-slate-400 text-left px-3.5 sm:px-4" id="desktop-metadata-grid">
                      
                      <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-400">{lang === 'bn' ? 'বিজ্ঞাপনদাতা' : 'Advertiser Name'}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAd.userName}</span>
                          {selectedAd.userPhone && (
                            <a
                              href={`tel:${selectedAd.userPhone}`}
                              className="p-1 bg-emerald-50 dark:bg-emerald-950/40 text-[#0F4D0F] dark:text-emerald-400 hover:bg-[#0F4D0F] hover:text-white border border-emerald-200 dark:border-emerald-800/60 rounded-md transition-all duration-150 flex items-center justify-center shadow-3xs cursor-pointer"
                              title={lang === 'bn' ? 'বিজ্ঞাপনদাতাকে কল করুন' : 'Call'}
                              aria-label={lang === 'bn' ? 'বিজ্ঞাপনদাতাকে কল করুন' : 'Call'}
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-400">{lang === 'bn' ? 'হারানোর তারিখ' : 'Date of Loss'}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{new Date(selectedAd.lossDate).toLocaleDateString(lang === 'bn' ? "bn-BD" : "en-US")}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-400">{lang === 'bn' ? 'হারানোর স্থান' : 'Loss Location'}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-right max-w-[160px] truncate">{selectedAd.lossLocation}</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-400">{lang === 'bn' ? 'বিভাগ/শহর' : 'Division/City'}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {lang === 'bn' ? (
                            selectedAd.city === 'Dhaka' ? 'ঢাকা বিভাগ' :
                            selectedAd.city === 'Chattogram' ? 'চট্টগ্রাম বিভাগ' :
                            selectedAd.city === 'Sylhet' ? 'সিলেট বিভাগ' :
                            selectedAd.city === 'Khulna' ? 'খুলনা বিভাগ' :
                            selectedAd.city === 'Rajshahi' ? 'রাজশাহী বিভাগ' :
                            selectedAd.city === 'Barishal' ? 'বরিশাল বিভাগ' :
                            selectedAd.city === 'Rangpur' ? 'রংপুর বিভাগ' :
                            selectedAd.city === 'Mymensingh' ? 'ময়মনসিংহ বিভাগ' :
                            selectedAd.city
                          ) : `${selectedAd.city} Division`}
                        </span>
                      </div>

                      {selectedAd.thana && (
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                          <span className="font-semibold text-slate-400">{lang === 'bn' ? 'থানা' : 'Thana'}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAd.thana}</span>
                        </div>
                      )}

                      {selectedAd.unionName && (
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                          <span className="font-semibold text-slate-400">{lang === 'bn' ? 'ইউনিয়ন' : 'Union'}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAd.unionName}</span>
                        </div>
                      )}

                      {selectedAd.village && (
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                          <span className="font-semibold text-slate-400">{lang === 'bn' ? 'গ্রাম/মহল্লা' : 'Village'}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAd.village}</span>
                        </div>
                      )}

                      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-400">{lang === 'bn' ? 'ব্র্যান্ড ও মডেল' : 'Brand & Model'}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{selectedAd.brand || "—"} ({selectedAd.modelName || "—"})</span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-semibold text-slate-400">{lang === 'bn' ? 'আইএমইআই বা আইডেন্টিফায়ার নম্বর' : 'IMEI / Serial Reference'}</span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{selectedAd.serialOrImei || "—"}</span>
                      </div>

                      {selectedAd.gdNumber && (
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                          <span className="font-semibold text-slate-400">{lang === 'bn' ? 'থানার জিডি ডকেট নম্বর' : 'Police GD Docket'}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAd.gdNumber} ({selectedAd.gdAuthority})</span>
                        </div>
                      )}

                      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 col-span-1 md:col-span-2">
                        <span className="font-semibold text-slate-400">{lang === 'bn' ? 'ঘোষিত পুরস্কার অর্থ' : 'Declared Reward Amount'}</span>
                        <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                          {selectedAd.hasReward ? `৳ ${lang === 'bn' ? selectedAd.reward.toLocaleString("bn-BD") : selectedAd.reward.toLocaleString("en-US")}` : (lang === 'bn' ? 'নেই' : 'None')}
                        </span>
                      </div>

                    </div>

                  </div>

                </div>

                {/* AI Evidence Validation Analysis */}
                <div className="bg-slate-900 text-white rounded-xl p-3 sm:p-3.5 shadow-sm space-y-2 border border-slate-800 relative overflow-hidden text-left">
                  <div className="absolute right-[-15px] top-[-15px] opacity-10 pointer-events-none">
                    <Sparkles className="w-20 h-20 text-emerald-400" />
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5">
                    <div className="flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <h4 className="font-bold text-xs sm:text-sm text-emerald-300">{lang === 'bn' ? 'Looking.bd ভেরিফিকেশন রিপোর্ট' : 'Looking.bd Verification Report'}</h4>
                    </div>
                    <div className="bg-[#0F4D0F]/30 text-emerald-400 text-[10.5px] font-bold border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center space-x-1 self-start md:self-auto">
                      <span>{t("verificationScore")}: {selectedAd.aiVerifiedScore}%</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <p className="font-medium bg-slate-800/60 p-2 rounded-lg border border-slate-800/80 text-[11px]">
                      {selectedAd.aiExplanation || t("aiFallbackExplanation")}
                    </p>
                    
                    <div className="border-t border-slate-800/75 pt-1.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">{lang === 'bn' ? 'নিরাপত্তা লেনদেন নির্দেশিকা' : 'Security Handover Guidelines'}</span>
                      <p className="text-[10.5px] text-slate-400">
                        {selectedAd.safetyTips || t("safetyGuideFallback")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comments Claim section */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 sm:p-3 shadow-sm space-y-2 text-left">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider flex items-center">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                      <span>{t("commentsTitle", { count: selectedAd.comments.length })}</span>
                    </h4>
                  </div>

                  {selectedAd.comments.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-1.5 text-center">{t("emptyComments")}</p>
                  ) : (
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {selectedAd.comments.map(c => (
                        <div key={c.id} className={`p-1.5 sm:p-2 rounded-lg border text-xs leading-normal transition-colors ${
                          c.isFounderClaim 
                            ? "bg-amber-50/70 border-amber-200/50 dark:bg-amber-950/10 dark:border-amber-900/30 text-slate-800 dark:text-slate-100" 
                            : "bg-slate-50 border-slate-100 dark:bg-slate-900/40 dark:border-slate-800/80 text-slate-700 dark:text-slate-300"
                        }`}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5 text-[11px]">
                              <span>{c.userName}</span>
                              {c.isFounderClaim && (
                                <span className="bg-amber-600 text-white text-[8px] px-1.5 py-0.2 rounded font-semibold whitespace-nowrap">
                                  {lang === 'bn' ? 'সন্ধানকারী দাবি' : 'Finder Claim'}
                                </span>
                              )}
                            </span>
                            <span className="text-[8px] text-slate-400 font-medium">{new Date(c.createdAt).toLocaleDateString(lang === 'bn' ? "bn-BD" : "en-US")}</span>
                          </div>
                          <p className="text-[10.5px] whitespace-pre-line leading-relaxed">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add feedback form */}
                  {currentUser ? (
                    <form onSubmit={handleCommentSubmit} className="mt-1 flex flex-col gap-1 border-t border-slate-100 dark:border-slate-700 pt-1.5">
                      <div className="flex items-end gap-1.5">
                        <textarea 
                          rows={2}
                          placeholder={t("commentPlaceholder")}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-grow bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-950 resize-none leading-relaxed text-slate-800 dark:text-slate-100"
                          id="comment-text-input"
                        />
                        <button 
                          type="submit" 
                          className="bg-[#0F4D0F] hover:bg-[#0b3b0b] text-white p-2 rounded-lg transition-colors flex items-center justify-center font-bold self-end shrink-0 cursor-pointer border-none"
                          title={t("commentTooltip")}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <label className="flex items-center space-x-1.5 cursor-pointer select-none text-[9.5px] text-slate-500 font-bold self-start mt-0.5">
                        <input 
                          type="checkbox" 
                          checked={isFounderClaim}
                          onChange={() => setIsFounderClaim(!isFounderClaim)}
                          className="rounded text-amber-600 focus:ring-amber-500 focus:ring-0 w-3 h-3 cursor-pointer"
                        />
                        <span>{t("importantLeadLabel")}</span>
                      </label>
                    </form>
                  ) : (
                    <p className="text-[11px] text-center text-slate-500 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 py-1.5 rounded-lg mt-1">
                      {lang === 'bn' ? (
                        <>পণ্যটির সন্ধান বা দাবি প্রদান করতে অনুগ্রহ করে <button type="button" onClick={() => { setIsAuthModalOpen(true); }} className="text-emerald-600 underline font-extrabold focus:outline-none cursor-pointer border-none bg-transparent">লগইন করুন</button>।</>
                      ) : (
                        <>Please <button type="button" onClick={() => { setIsAuthModalOpen(true); }} className="text-emerald-600 underline font-extrabold focus:outline-none cursor-pointer border-none bg-transparent">Login</button> to report leads or claim items.</>
                      )}
                    </p>
                  )}
                </div>

                {/* Potential Matches Section */}
                {(() => {
                  const matches = getPotentialMatches(selectedAd);
                  if (matches.length === 0) return null;
                  return (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 sm:p-3 shadow-sm space-y-2 text-left">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase tracking-wider flex items-center">
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                          <span>{lang === 'bn' ? 'সম্ভাব্য উদ্ধার হওয়া ঘটনার মিলসমূহ' : 'Potential Matches Found'}</span>
                        </h4>
                        <span className="text-[9.5px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          {matches.length} {lang === 'bn' ? 'টি ম্যাচ' : 'matches'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {matches.map(({ ad, score }) => {
                          const matchPercent = Math.round((score / 10) * 100);
                          return (
                            <div key={ad.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-2 bg-slate-50 dark:bg-slate-900/50 flex space-x-2.5 hover:border-emerald-500/40 transition-colors">
                              <div className="w-12 h-12 bg-white rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 select-none">
                                <img src={getAdImage(ad)} alt="match preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="text-xs min-w-0 flex-1 flex flex-col justify-between">
                                <div className="min-w-0">
                                  <h5 className="font-bold text-slate-800 dark:text-slate-200 truncate leading-tight mb-0.5 text-[11px]">{ad.title}</h5>
                                  <p className="text-[9.5px] text-slate-400 block truncate">
                                    {lang === 'bn' ? 'বিজ্ঞাপনদাতাঃ ' : 'Advertiser: '}<strong>{ad.userName}</strong>
                                  </p>
                                </div>
                                <div className="flex items-center justify-between mt-0.5">
                                  <span className="text-[8.5px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/10 px-1 py-0.2 rounded-sm border border-emerald-100 dark:border-emerald-900/20">
                                    {lang === 'bn' ? 'ম্যাচঃ ' : 'Match: '}{matchPercent}%
                                  </span>
                                  <button 
                                    type="button"
                                    onClick={() => handleOpenAdDetails(ad)}
                                    className="text-[9.5px] text-emerald-600 hover:underline font-bold border-none bg-transparent cursor-pointer"
                                  >
                                    {lang === 'bn' ? 'দেখুন' : 'View'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

            </div>

          </div>
        ) : (
          <>
            {/* 2-COLUMN LAYOUT BLOCK */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* ========================================== */}
              {/* CENTER - Classified Products Feed */}
              {/* ========================================== */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* LOADING STATE */}
                {isLoading ? (
                  <div className="space-y-1.5 animate-pulse" id="feed-skeletons">
                    {[1, 2, 3, 4, 5].map((key) => (
                      <div
                        key={key}
                        className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/85 flex flex-row items-stretch overflow-hidden shadow-[0_4px_12px_-5px_rgba(0,0,0,0.08),0_1px_6px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_16px_-5px_rgba(0,0,0,0.35)] border-b-[2px] border-b-slate-300/80 dark:border-b-slate-900/80"
                      >
                        {/* Left Skeleton Thumbnail */}
                        <div className="w-14 sm:w-18 bg-slate-150 dark:bg-slate-700/60 border-r border-slate-200 dark:border-slate-700 flex-shrink-0" />
                        
                        {/* Right Skeleton Content */}
                        <div className="flex-grow p-1.5 sm:p-2 flex flex-col justify-between">
                          <div className="space-y-1.5">
                            <div className="flex items-start justify-between">
                              <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-1/2 sm:w-1/3" />
                              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-12" />
                            </div>
                            
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16 sm:w-20" />
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20 sm:w-24" />
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-28 sm:w-36" />
                            
                            <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-full hidden sm:block" />
                          </div>
                          
                          <div className="mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded w-16" />
                            <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-16 sm:w-20" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredAds.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs">
                    <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3 animate-pulse" />
                    <h3 className="font-bold text-slate-800 text-sm">{t("noNotice")}</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      {t("emptyFilterDesc")}
                    </p>
                    <button 
                      onClick={() => { setActiveCategory("all"); setActiveCity("all"); setSearchQuery(""); setOnlyWithGd(false); setOnlyWithReward(false); setSelectedBrand("all"); }}
                      className="mt-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      {t("resetBtn")}
                    </button>
                  </div>
                ) : (
                  
                  /* LIST OF HORIZONTAL CLASSIFIED CARDS EXACTLY MATCHING THE MOCKUP */
                  <div className="space-y-1.5">
                    {currentPosts.map((ad, idx) => {
                      const hasPoliceGdAttachment = Boolean(ad.gdImage || ad.gdNumber);
                      
                      // Component for rendering cards
                      const cardElement = (
                        <motion.div
                          key={ad.id}
                          layoutId={`ad-grid-card-${ad.id}`}
                          onClick={() => handleOpenAdDetails(ad)}
                          initial={{ opacity: 0, scale: 0.94, y: 14 }}
                          whileInView={{ opacity: 1, scale: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.12 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 24,
                            mass: 0.7,
                            delay: Math.min((idx % 8) * 0.04, 0.24)
                          }}
                          whileHover={{ 
                            scale: 1.014, 
                            y: -2.5,
                            transition: { type: "spring", stiffness: 420, damping: 20 }
                          }}
                          className={`bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-200/90 dark:border-slate-700/85 cursor-pointer flex flex-row items-stretch relative overflow-hidden transition-[box-shadow,border-color,background-color] duration-300 ease-out transform-gpu shadow-[0_4px_10px_-2px_rgba(0,0,0,0.06),0_2px_4px_-1px_rgba(0,0,0,0.04),inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_0_0_rgba(0,0,0,0.04)] dark:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.5),0_2px_4px_-1px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:shadow-[0_16px_32px_-6px_rgba(0,0,0,0.12),0_8px_16px_-4px_rgba(0,0,0,0.06),0_0_20px_2px_rgba(16,185,129,0.22),0_20px_35px_-10px_rgba(16,185,129,0.18),inset_0_1px_0_0_rgba(255,255,255,1)] dark:hover:shadow-[0_18px_36px_-6px_rgba(0,0,0,0.7),0_10px_20px_-4px_rgba(0,0,0,0.5),0_0_24px_3px_rgba(16,185,129,0.35),0_22px_40px_-10px_rgba(16,185,129,0.28),inset_0_1px_0_0_rgba(255,255,255,0.1)] hover:border-emerald-500 dark:hover:border-emerald-400/90 hover:ring-2 hover:ring-emerald-500/40 dark:hover:ring-emerald-400/40 border-b-[3px] border-b-slate-300/90 dark:border-b-slate-900/95 hover:border-b-emerald-600 active:translate-y-[1px] ${
                            ad.status === "found" ? "ring-1 ring-emerald-500/25 bg-emerald-50/5 dark:bg-emerald-950/15" : ""
                          }`}
                          id={`ad-card-${ad.id}`}
                        >
                          
                          {/* Left: Photos placeholder/category illustration */}
                          <div className="w-[88px] sm:w-[105px] h-[138px] sm:h-[162px] bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 flex flex-col select-none rounded-l-lg shadow-[inset_-2px_0_4px_rgba(0,0,0,0.04)] dark:shadow-[inset_-2px_0_6px_rgba(0,0,0,0.3)]">
                            <div className="w-full h-[84px] sm:h-[102px] overflow-hidden bg-slate-100 dark:bg-slate-950 relative flex-shrink-0">
                              <img 
                                src={getAdImage(ad)} 
                                alt={ad.title} 
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            
                            {/* Tags Container under image */}
                            <div className="flex-grow flex flex-col justify-evenly p-1 space-y-0.5 bg-slate-100/50 dark:bg-slate-900/60">
                              {/* Category Tag */}
                              <div className="text-center">
                                <span className={`inline-block text-[7.5px] sm:text-[8px] px-1 py-0.5 rounded font-extrabold uppercase tracking-tight shadow-3xs leading-none ${
                                  ad.category === "mobile" ? "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200/50" : 
                                  ad.category === "bike" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50" :
                                  ad.category === "car" ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200/50" : "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200/50"
                                }`}>
                                  {lang === 'bn' ? CATEGORIES.find(c => c.id === ad.category)?.banglaName : CATEGORIES.find(c => c.id === ad.category)?.name}
                                </span>
                              </div>
        
                              {/* GD VERIFIED Tag */}
                              {ad.gdNumber ? (
                                <div className="bg-[#0F4D0F] text-white font-extrabold text-[7px] sm:text-[7.5px] py-0.5 rounded-xs text-center tracking-wide flex items-center justify-center space-x-0.5 shadow-2xs leading-none">
                                  <ShieldCheck className="w-2.5 h-2.5 text-white flex-shrink-0" />
                                  <span className="truncate">GD VERIFIED</span>
                                </div>
                              ) : (
                                <div className="text-[7px] text-slate-400 dark:text-slate-500 text-center font-bold uppercase leading-none tracking-tighter">
                                  {lang === 'bn' ? 'যাচাইহীন' : 'Unverified'}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Hidden wrapper to hide the old absolute tag rendering block */}
                          <div className="hidden">
                            <img 
                              src={getAdImage(ad)} 
                              alt={ad.title} 
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              referrerPolicy="no-referrer"
                            />
                            {/* Top corner category identifier */}
                            <div className="absolute top-1 left-1 z-10">
                              <span className={`text-[7px] px-1 py-0.2 rounded font-bold uppercase shadow-sm ${
                                ad.category === "mobile" ? "bg-cyan-100 text-cyan-800" : 
                                ad.category === "bike" ? "bg-emerald-100 text-emerald-800" :
                                ad.category === "car" ? "bg-amber-100 text-amber-800" : "bg-purple-100 text-purple-800"
                              }`}>
                                {lang === 'bn' ? CATEGORIES.find(c => c.id === ad.category)?.banglaName : CATEGORIES.find(c => c.id === ad.category)?.name}
                              </span>
                            </div>
      
                            {/* Highly professional verified metadata */}
                            {ad.gdNumber && (
                              <div className="absolute bottom-1 left-1 right-1 z-10 bg-emerald-600/95 text-white font-bold text-[7px] py-0.2 rounded-xs text-center tracking-wide flex items-center justify-center space-x-0.5 shadow-xs">
                                <ShieldCheck className="w-2 h-2 text-white" />
                                <span>GD VERIFIED</span>
                              </div>
                            )}
                          </div>
     

                      {/* Right: Text and Classified Information */}
                      <div className="flex-grow p-1.5 sm:p-2 flex flex-col justify-between rounded-r-lg shadow-[inset_1px_0_2px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.7),0_2px_4px_rgba(0,0,0,0.03)] dark:shadow-[inset_1px_0_3px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05),0_2px_6px_rgba(0,0,0,0.25)] relative">
                        
                        <div>
                          {/* Title block */}
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-grow">
                              <div className="flex items-center space-x-1 flex-wrap gap-y-1">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-[10.5px] sm:text-xs hover:text-emerald-700 leading-snug line-clamp-2 max-w-full">
                                  {ad.title}
                                </h3>
                                {ad.gdImage && (
                                  <span className="inline-flex items-center bg-blue-50 text-blue-700 text-[7px] font-extrabold px-1 py-0.2 rounded border border-blue-200 shadow-xs uppercase select-none">
                                    <ShieldCheck className="w-2 h-2 text-blue-600 mr-0.5" />
                                    <span>{lang === 'bn' ? 'ডকুমেন্ট' : 'Doc'}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Date & Heart Bookmark Trigger */}
                            <div className="flex items-center space-x-1.5 flex-shrink-0 ml-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaveAd(ad.id);
                                }}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center justify-center cursor-pointer border-none bg-transparent"
                                title={isSaved(ad.id) ? (lang === 'bn' ? "সংরক্ষণ থেকে সরান" : "Remove Bookmark") : (lang === 'bn' ? "সংরক্ষণ করুন" : "Save/Bookmark")}
                              >
                                <Heart className={`w-3.5 h-3.5 ${isSaved(ad.id) ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-500"}`} />
                              </button>
                            </div>
                          </div>
 

 
                          {/* Owner/Seller representation */}
                          <div className="text-[9.5px] text-slate-400 mt-0.5 flex items-center space-x-1 font-medium">
                            <span className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-1 py-0.2 rounded font-mono text-[8px] uppercase">
                              {lang === 'bn' ? 'মালিক' : 'Owner'}
                            </span>
                            <span className="text-slate-600 dark:text-slate-300 font-semibold">{ad.userName}</span>
                          </div>
 
                          {/* Location representation below poster's name as requested */}
                          <div className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-start space-x-1 font-medium">
                            <MapPin className="w-3 h-3 text-rose-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-600 dark:text-slate-300 font-semibold line-clamp-2 max-w-full leading-snug">
                              {[
                                ad.village,
                                ad.unionName,
                                ad.thana,
                                lang === 'bn' ? (
                                  ad.city === 'Dhaka' ? 'ঢাকা বিভাগ' :
                                  ad.city === 'Chattogram' ? 'চট্টগ্রাম বিভাগ' :
                                  ad.city === 'Sylhet' ? 'সিলেট বিভাগ' :
                                  ad.city === 'Khulna' ? 'খুলনা বিভাগ' :
                                  ad.city === 'Rajshahi' ? 'রাজশাহী বিভাগ' :
                                  ad.city === 'Barishal' ? 'বরিশাল বিভাগ' :
                                  ad.city === 'Rangpur' ? 'রংপুর বিভাগ' :
                                  ad.city === 'Mymensingh' ? 'ময়মনসিংহ বিভাগ' :
                                  ad.city
                                ) : ad.city,
                              ].filter(Boolean).join(" - ")}
                            </span>
                          </div>

                          {/* Date and Views representation below location */}
                          <div className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center space-x-2 font-medium flex-wrap">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                              <span className="font-mono text-[8px] text-slate-600 dark:text-slate-300 font-semibold">
                                {new Date(ad.createdAt).toLocaleDateString(lang === 'bn' ? "bn-BD" : "en-US")}
                              </span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
                              <Eye className="w-3 h-3 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                              <span className="text-[8.5px] text-slate-600 dark:text-slate-300 font-semibold">
                                {lang === 'bn' ? (ad.views || 1).toLocaleString("bn-BD") : (ad.views || 1).toLocaleString("en-US")} {lang === 'bn' ? 'ভিউ' : 'views'}
                              </span>
                            </div>
                          </div>

                          {/* Distance Badge using geolocation */}
                          {userCoords && (
                            (() => {
                              const adCoords = getAdCoordinates(ad);
                              const dist = getHaversineDistance(userCoords.lat, userCoords.lng, adCoords.lat, adCoords.lng);
                              return (
                                <div className="inline-flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-200/40 mt-1">
                                  <Compass className="w-2.5 h-2.5 text-emerald-600 animate-pulse" />
                                  <span>{formatDistance(dist, lang)}</span>
                                </div>
                              );
                            })()
                          )}
 
                          {/* Short description preview */}
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal mt-0.5 hidden sm:block">
                            {ad.description}
                          </p>
 
                        </div>
 
                        {/* Bottom verification score & rewards bar */}
                        <div className="mt-1.5 pt-1 border-t border-slate-100 dark:border-slate-700 flex items-center justify-start gap-x-4 text-[9px] flex-wrap">
                          
                          <div>
                            {ad.hasReward ? (
                              <span className="text-[#0F4D0F] dark:text-emerald-400 font-bold flex items-center space-x-0.5 text-[8.5px]">
                                <Award className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
                                <span>{t("declaredReward", { reward: lang === 'bn' ? ad.reward.toLocaleString("bn-BD") : ad.reward.toLocaleString("en-US") })}</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-500 text-[8.5px]">{t("freeNotice")}</span>
                            )}
                          </div>
 
                          <div className="flex items-center space-x-1">
                            <div className="flex items-center space-x-1 bg-slate-50 dark:bg-slate-900 text-emerald-800 dark:text-emerald-300 text-[8.5px] font-bold px-1 py-0.2 rounded border border-slate-200 dark:border-slate-700">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{t("verificationScore")}: {ad.aiVerifiedScore}%</span>
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Status overlay sticker */}
                      {ad.status === "found" && (
                        <div className="absolute inset-0 bg-emerald-950/5 backdrop-blur-xs flex items-center justify-center">
                          <div className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded shadow-md rotate-6 border border-emerald-500 flex items-center space-x-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>{t("foundStatus")}</span>
                          </div>
                        </div>
                      )}

                    </motion.div>
                  );

                  {/* INSERT INTERCONNECTED WARNING ADVERTIZEMENT ROW & GOOGLE ADSENSE FOR EVERY 4 POSTS */}
                  const showAdSense = (idx + 1) % 4 === 0;

                  const googleAdSenseBanner = (
                    <div 
                      key={`google-adsense-${ad.id}`} 
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs relative overflow-hidden text-xs mt-3.5"
                    >
                      <div className="absolute top-1 right-2 flex items-center space-x-1 select-none">
                        <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {lang === 'bn' ? 'বিজ্ঞাপন' : 'Sponsored'}
                        </span>
                        <span className="text-[7px] text-emerald-600 font-extrabold hover:underline">
                          ⓘ Ads by Google
                        </span>
                      </div>

                      <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg border border-emerald-300 flex items-center justify-center text-lg shadow-xs shrink-0 select-none">
                          🎁
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-xs tracking-tight">
                            {lang === 'bn' ? 'Looking.bd নিরাপদ নাগরিক সাহায্য পোর্টাল' : 'Looking.bd Safe Citizen Portal'}
                          </h4>
                          <p className="text-[10px] text-slate-400 leading-relaxed max-w-md">
                            {lang === 'bn' 
                              ? 'বৈধ জিডি ও ক্রয় রশিদ মিলিয়ে হারিয়ে যাওয়া মূল্যবান পণ্য নিরাপদে উদ্ধার নিশ্চিত করুন।' 
                              : 'Validate legal police GD and receipt logs to retrieve your valuable items safely.'}
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          const contactBtn = document.getElementById("post-notice-btn");
                          if (contactBtn) contactBtn.click();
                        }}
                        className="w-full sm:w-auto bg-[#ffcb05] hover:bg-[#e6b600] text-slate-900 border border-slate-300 rounded-lg px-4 py-1.5 font-bold text-[10px] transition-all cursor-pointer text-center shrink-0 uppercase tracking-wide"
                      >
                        {lang === 'bn' ? 'পোস্ট করুন' : 'Post Now'}
                      </button>
                    </div>
                  );

                  if (showAdSense) {
                    return (
                      <React.Fragment key={`adsense-wrap-${ad.id}`}>
                        {cardElement}
                        {googleAdSenseBanner}
                      </React.Fragment>
                    );
                  }

                  return cardElement;

                })}

                {/* Pagination Component */}
                {totalPages > 1 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-6 pb-2 font-sans" id="pagination-panel">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => {
                        setCurrentPage(prev => Math.max(1, prev - 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs flex items-center transition-all cursor-pointer"
                    >
                      {lang === 'bn' ? '⟨ পূর্ববর্তী' : '⟨ Previous'}
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                            currentPage === pageNum
                              ? "bg-[#0F4D0F] text-white border-[#0F4D0F]"
                              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                          }`}
                        >
                          {lang === 'bn' ? pageNum.toLocaleString("bn-BD") : pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => {
                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs flex items-center transition-all cursor-pointer"
                    >
                      {lang === 'bn' ? 'পরবর্তী ⟩' : 'Next ⟩'}
                    </button>
                  </div>
                )}
              </div>

            )}

          </div>

          {/* ========================================== */}
          {/* COLUMN 3: RIGHT - Safety Info & Promo Banners */}
          {/* ========================================== */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Citizens Safe Purchase Info Grid with Check Illustration */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-xs">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xs tracking-wider uppercase mb-3 border-b border-slate-100 dark:border-slate-700 pb-2 flex items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-1.5" />
                <span>{lang === 'bn' ? 'ব্যবহৃত পণ্য ক্রয়ের নির্দেশিকা' : 'Second Hand buying information'}</span>
              </h3>

              {/* Photos For Example mockup visual block */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-md p-3.5 text-center mb-3 select-none flex flex-col items-center justify-center">
                <div className="w-12 h-14 bg-white dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-700 shadow-xs flex flex-col justify-between p-1.5 relative mb-2">
                  <div className="w-full h-1 bg-emerald-500 rounded-sm" />
                  <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-6 flex items-center justify-center rounded">
                    <span className="text-[7px] text-slate-400 dark:text-slate-300 font-bold">IMEI #</span>
                  </div>
                  <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded text-[7px] text-emerald-600 dark:text-emerald-400 font-bold p-0.5">
                    ✓ SECURE
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-400 tracking-wider">Photos For Example</span>
              </div>

              {/* Brief guide lines */}
              <div className="space-y-2.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-[#0F4D0F] rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  <p>
                    <strong className="text-slate-800 dark:text-slate-100">{lang === 'bn' ? 'মোবাইল ক্রয়ের ক্ষেত্রে:' : 'For Mobile Phones:'}</strong>{' '}
                    {lang === 'bn' ? 'আইএমইআই মিল দেখে looking.bd ফীল্ডে সার্চ করে নিশ্চিত হোন ডিভাইসটি চুরির বা হারানো হিসেবে জিডি নোটিশ করা নয়।' : 'Search the IMEI-1/2 on looking.bd to verify if device is reported as stolen or lost.'}
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-[#0F4D0F] rounded-full mt-1.5 mr-2 flex-shrink-0" />
                  <p>
                    <strong className="text-slate-800 dark:text-slate-100">{lang === 'bn' ? 'বাইক বা সাইকেলের ক্ষেত্রে:' : 'For Motorbikes & Cycles:'}</strong>{' '}
                    {lang === 'bn' ? 'নীল বই ও ফ্রেম সিরিয়াল নম্বর খোদাই ঠিক আছে কিনা তা অবশ্যই রেজিস্ট্রি ডাটা ও পুলিশের সাথে মিলিয়ে নিন।' : 'Cross-check the bluebook engine number and cycle frame series identifier safely.'}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setIsFaqModalOpen(true)}
                className="w-full mt-4 bg-slate-900 hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white text-[10px] font-bold py-2 rounded text-center tracking-wider transition-colors cursor-pointer border-none flex items-center justify-center space-x-1"
              >
                <span>{lang === 'bn' ? 'সকল সাধারণ জিজ্ঞাসা ও নিয়মাবলী (FAQ) >>>>' : 'View Safety & Notice FAQ >>>>'}</span>
              </button>

            </div>

            {/* Lavender Promo Warning Advertizement block */}
            <div className="bg-[#e3e2ec] dark:bg-slate-800/90 rounded-lg border border-slate-300 dark:border-slate-700 p-4 shadow-2xs relative overflow-hidden">
              <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-20 dark:opacity-10">
                <ShieldCheck className="w-14 h-14 text-purple-900 dark:text-purple-300" />
              </div>
              <span className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-widest block mb-1">Advertizement</span>
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs mb-1.5">{lang === 'bn' ? 'সুরক্ষিত থাকার জিপিএস গাইড' : 'Classification Security Guard'}</h4>
              <p className="text-[10.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'bn' 
                  ? 'আপনার ব্যবহৃত ডিভাইস বা বাইক ক্রয়ের পূর্বে মূল ক্রয়ের বক্স ও রশিদ নিশ্চিত করুন। অবৈধ হারানো পণ্য নিজের কাছে রাখা আইনত দণ্ডনীয়।' 
                  : 'Ensure the original box and cash memo matches the device setup. Holding onto stolen assets is legally punishable.'}
              </p>
            </div>

            {/* Peach Promo Warning Advertizement block */}
            <div className="bg-[#ffdcd7] dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/50 p-4 shadow-2xs relative overflow-hidden">
              <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-20 dark:opacity-10">
                <AlertTriangle className="w-14 h-14 text-red-900 dark:text-red-400 animate-pulse" />
              </div>
              <span className="text-[9px] uppercase font-bold text-red-500 dark:text-red-400 tracking-widest block mb-1">Advertizement</span>
              <h4 className="font-extrabold text-red-950 dark:text-red-200 text-xs mb-1.5">{lang === 'bn' ? 'বিশেষ সতর্কতা সংকেত' : 'Immediate Counter Frauds alert'}</h4>
              <p className="text-[10.5px] text-red-900 dark:text-red-300 opacity-90 leading-relaxed font-semibold">
                {lang === 'bn' 
                  ? 'উদ্ধারকারী সাজা প্রতারকরা কোনো প্রকার সিকিউরিটি কোড চাইলে দেবেন না। টাকা লেনদেন কেবলমাত্র থ্রি-ডি আইএমইআই স্বচক্ষে থানায় বসে পরীক্ষা করার পর সম্পাদন করুন।' 
                  : 'Do not share codes or dispatch token charges prior to police verification of actual serial references in the local thana premises.'}
              </p>
            </div>

          </div>

        </div>
          </>
        )}

      </main>

      {/* 4. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-1.5 mb-1 text-white font-bold">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
              <span>{t("footerTitle")}</span>
            </div>
            <p className="text-slate-500 max-w-md leading-relaxed text-[11px]">
              {t("footerDesc")}
            </p>
            {/* Elegant Policy Navigation Links */}
            <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              <button onClick={() => setFooterModalType("about")} className="hover:text-emerald-500 transition-colors">
                {lang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
              </button>
              <span>•</span>
              <button onClick={() => setFooterModalType("terms")} className="hover:text-emerald-500 transition-colors">
                {lang === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions'}
              </button>
              <span>•</span>
              <button onClick={() => setFooterModalType("privacy")} className="hover:text-emerald-500 transition-colors">
                {lang === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
              </button>
              <span>•</span>
              <button onClick={() => setIsFaqModalOpen(true)} className="hover:text-emerald-500 transition-colors">
                {lang === 'bn' ? 'জিজ্ঞাসিত প্রশ্নাবলী (FAQ)' : 'FAQ'}
              </button>
              {currentUser && currentUser.role === "admin" && (
                <>
                  <span>•</span>
                  <button 
                    onClick={() => {
                      setSelectedAd(null);
                      setIsProfileOpen(false);
                      setIsAuthModalOpen(false);
                      setIsAdminDashboardOpen(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} 
                    className="text-red-500 dark:text-red-400 hover:text-red-400 hover:underline transition-colors font-black bg-transparent border-none cursor-pointer"
                  >
                    {lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="text-center md:text-right text-[11px]">
            <span className="text-slate-500 block">&copy; {new Date().getFullYear()} Looking.bd. All Rights Reserved.</span>
            <span className="text-emerald-500 hover:underline cursor-pointer block mt-1 font-semibold" onClick={() => showNotification(t("supportAlert"))}>
              {t("contactSupport")}
            </span>
          </div>
        </div>
      </footer>

      {/* ========================================================== */}
      {/* 5. SLIDING SIDEBAR HAMBURGER CATEGORY DRAWER */}
      {/* ========================================================== */}
      <AnimatePresence>
        {isCategoryDrawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop slide curtain */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryDrawerOpen(false)}
              className="fixed inset-0 bg-slate-950/60"
            />

            {/* Sidebar window */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-72 max-w-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 h-full shadow-2xl flex flex-col p-5 overflow-y-auto"
            >
              
              {/* Drawer header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4.5 h-4.5 text-[#0F4D0F] dark:text-[#19b992]" />
                  <span className="font-bold text-slate-800 dark:text-white text-sm">ক্যাটাগরি কাস্টমাইজ</span>
                </div>
                <button 
                  onClick={() => setIsCategoryDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Category buttons */}
              <div className="space-y-1">
                
                <button
                  onClick={() => { setActiveCategory("all"); setIsCategoryDrawerOpen(false); }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                    activeCategory === "all" 
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-l-4 border-emerald-600" 
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>সব হারানো নোটিশ ({ads.length}টি)</span>
                  </span>
                </button>

                {CATEGORIES.map(cat => {
                  const count = ads.filter(ad => ad.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.id); setIsCategoryDrawerOpen(false); }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                        activeCategory === cat.id 
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-l-4 border-emerald-600" 
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        {renderCategoryIcon(cat.id, "w-4 h-4 text-slate-500 dark:text-slate-400")}
                        <span>{cat.banglaName}</span>
                      </span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md font-bold text-slate-500 dark:text-slate-400">
                        {count > 0 ? `${count}টি` : "০"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Additional Options Filter inside Hamburger Drawer */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800" id="hamburger-options-filter">
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                  {lang === 'bn' ? 'অতিরিক্ত ফিল্টার' : 'Options / Filters'}
                </span>
                <div className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/80 flex flex-col justify-center relative shadow-xs">
                  <div className="flex items-center justify-between">
                    <Award className="w-3.5 h-3.5 text-amber-500 mr-1 flex-shrink-0" />
                    <select 
                      value={onlyWithGd && onlyWithReward ? "both" : onlyWithGd ? "gd" : onlyWithReward ? "reward" : "all"}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "gd") {
                          setOnlyWithGd(true);
                          setOnlyWithReward(false);
                        } else if (val === "reward") {
                          setOnlyWithGd(false);
                          setOnlyWithReward(true);
                        } else if (val === "both") {
                          setOnlyWithGd(true);
                          setOnlyWithReward(true);
                        } else {
                          setOnlyWithGd(false);
                          setOnlyWithReward(false);
                        }
                      }}
                      className="w-full bg-transparent border-none text-slate-700 dark:text-slate-200 font-bold focus:outline-none focus:ring-0 text-xs cursor-pointer p-0 appearance-none pr-4"
                      id="drawer-search-options-select"
                    >
                      <option value="all" className="dark:bg-slate-800 dark:text-slate-100">{lang === 'bn' ? 'সব নোটিশ' : 'All Notices'}</option>
                      <option value="gd" className="dark:bg-slate-800 dark:text-slate-100">{lang === 'bn' ? 'শুধু জিডি কন্টেন্ট' : 'Only GD Attached'}</option>
                      <option value="reward" className="dark:bg-slate-800 dark:text-slate-100">{lang === 'bn' ? 'শুধু পুরস্কার ঘোষিত' : 'Only with Reward'}</option>
                      <option value="both" className="dark:bg-slate-800 dark:text-slate-100">{lang === 'bn' ? 'জিডি ও পুরস্কার উভয়ই' : 'Both GD & Reward'}</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Trust & Metrics Dashboard Options inside Hamburger Drawer */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5" id="hamburger-trust-dashboard">
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  {lang === 'bn' ? 'সিস্টেম ট্রাস্ট ও স্ট্যাটস' : 'System Trust & Stats'}
                </span>

                {/* Option 1: সফলতা ও ট্রাস্ট মিটার */}
                <div className="bg-gradient-to-br from-[#0F4D0F] to-[#0b3b0b] text-white rounded-xl p-3.5 shadow-sm relative overflow-hidden flex flex-col justify-between border border-emerald-600/10">
                  <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none">
                    <ShieldCheck className="w-16 h-16" />
                  </div>
                  <div>
                    <span className="text-emerald-100 text-[9px] font-bold uppercase tracking-wider block">
                      {lang === 'bn' ? '১. সফলতা ও ট্রাস্ট মিটার' : '1. Success Indicators'}
                    </span>
                    <div className="mt-1 flex items-baseline space-x-1.5">
                      <span className="text-2xl font-extrabold text-[#ffcb05] font-mono leading-none">
                        {ads.filter(a => a.status === "found").length}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-100">
                        {lang === 'bn' ? 'টি পণ্য সফলভাবে ফেরত' : 'items returned'}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-100/90 mt-1 leading-relaxed">
                      {lang === 'bn' 
                        ? 'জিডি ও রসিদ মিলিয়ে Looking.bd এর মাধ্যমে পণ্য উদ্ধার সুনিশ্চিত।' 
                        : 'Verified with genuine GD & receipts.'}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-emerald-400/20 flex items-center justify-between">
                    <span className="text-[8px] text-emerald-200 font-semibold">{lang === 'bn' ? 'হ্যান্ডওভার ভেরিফাইড' : 'Handover verified'}</span>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsCategoryDrawerOpen(false);
                        setIsOnlyShowFoundState(!isOnlyShowFoundState);
                        showNotification(
                          !isOnlyShowFoundState 
                            ? (lang === 'bn' ? "উদ্ধারকৃত ঘটনার তালিকা দেখানো হচ্ছে" : "Showing found items only") 
                            : (lang === 'bn' ? "সব নোটিশ দেখানো হচ্ছে" : "Showing all notices")
                        );
                      }}
                      className="bg-[#ffcb05] hover:bg-[#e6b600] text-slate-900 text-[9px] font-black px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      {isOnlyShowFoundState 
                        ? (lang === 'bn' ? 'সব নোটিশ' : 'Show All')
                        : (lang === 'bn' ? 'উদ্ধারকৃত পণ্য' : 'Show Found Only')}
                    </button>
                  </div>
                </div>

                {/* Option 2: এআই তথ্যপ্রমাণ বিশ্লেষণ */}
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase block">
                      {lang === 'bn' ? '২. এআই তথ্যপ্রমাণ বিশ্লেষণ' : '2. AI Evidence Analysis'}
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="mt-1 flex items-baseline space-x-1">
                    <span className="text-xl font-extrabold text-slate-800 dark:text-white">৮৯%</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                      {lang === 'bn' ? 'ভেরিফিকেশন স্কোর' : 'avg score'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {lang === 'bn'
                      ? 'ডিজিটাল জেন-এআই জিডি নাম্বার ও রশিদ বিবরণ বিশ্লেষণ করে সত্যতা মূল্যায়ন করে।'
                      : 'AI reviews GD numbers & verification receipts.'}
                  </p>
                </div>

                {/* Option 3: আজকের পোর্টাল ট্র্যাকিং */}
                <div className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 text-[9px] font-bold uppercase block mb-2">
                    {lang === 'bn' ? '৩. আজকের পোর্টাল ট্র্যাকিং' : '3. Live Portal Tracking'}
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCategoryDrawerOpen(false);
                        setIsOnlyShowFoundState(false);
                        setOnlyWithReward(false);
                        showNotification(lang === 'bn' ? "হারানো বিজ্ঞাপনের তালিকা দেখানো হচ্ছে 🔍" : "Showing lost items list 🔍");
                      }}
                      className="bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-lg p-2 border border-slate-100 dark:border-slate-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-center w-full block cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                    >
                      <span className="text-[8px] text-slate-400 dark:text-slate-500 block font-bold uppercase">{lang === 'bn' ? 'হারিয়েছে' : 'Lost'}</span>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-200 font-mono">
                        {ads.filter(a => a.status === "lost").length}টি
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCategoryDrawerOpen(false);
                        setIsOnlyShowFoundState(false);
                        setOnlyWithReward(true);
                        showNotification(lang === 'bn' ? "পুরস্কার ঘোষিত নোটিশের তালিকা দেখানো হচ্ছে 🏆" : "Showing rewarded notices list 🏆");
                      }}
                      className="bg-amber-50/50 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 hover:border-amber-200 dark:hover:border-amber-900/40 rounded-lg p-2 border border-amber-100 dark:border-amber-900/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-center w-full block cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400/30"
                    >
                      <span className="text-[8px] text-amber-800 dark:text-amber-300 block font-bold uppercase">{lang === 'bn' ? 'পুরস্কার' : 'Rewards'}</span>
                      <span className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">
                        {ads.filter(a => a.hasReward).length}টি
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Language toggle section inside Hamburger drawer */}
              <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-5">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                  {lang === 'bn' ? 'ভাষা পরিবর্তন করুন' : 'Change Language'}
                </span>
                
                <div className="grid grid-cols-2 gap-2 text-center">
                  <button
                    onClick={() => {
                      setLang('bn');
                      localStorage.setItem("lost_found_lang", "bn");
                      showNotification("ভাষা পরিবর্তন করে বাংলায় করা হয়েছে!");
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      lang === 'bn'
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm font-extrabold"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    }`}
                  >
                    বাংলা (BN)
                  </button>
                  <button
                    onClick={() => {
                      setLang('en');
                      localStorage.setItem("lost_found_lang", "en");
                      showNotification("Language switched to English!");
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                      lang === 'en'
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm font-extrabold"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    }`}
                  >
                    English (EN)
                  </button>
                </div>
              </div>

              {/* Safety notice signature */}
              <div className="mt-6 bg-slate-50 dark:bg-slate-800/80 rounded-lg p-3 text-[10px] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-500 mb-1" />
                <span>মালিকানার সত্য যাচাই প্রমাণের জন্য জিডি কপি ও রসিদ সব সময় সাথে রাখুন।</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================== */}
      {/* 6. ADVANCED PORTAL DETAIL PREVIEW MODAL */}
      {/* ========================================================== */}
      <AnimatePresence>
        {false && selectedAd && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl max-w-2xl w-full shadow-2xl border dark:border-slate-800 relative my-8 overflow-hidden flex flex-col max-h-[90vh]"
              id="details-modal"
            >
              
              {/* Modal sticky top header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="bg-emerald-600 p-1.5 rounded-lg">
                    {renderCategoryIcon(selectedAd.category, "w-4 h-4 text-white")}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      {CATEGORIES.find(c => c.id === selectedAd.category)?.banglaName} • {selectedAd.city}
                    </span>
                    <h3 className="text-sm font-bold truncate max-w-[340px] md:max-w-md">{selectedAd.title}</h3>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 sm:space-x-2">
                  {/* Social Share Group */}
                  <div className="flex items-center space-x-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60" id="header-social-share-group">
                    {/* WhatsApp */}
                    <button
                      onClick={() => handleShareApp('whatsapp', selectedAd)}
                      className="p-1 hover:bg-emerald-600 rounded text-emerald-400 hover:text-white transition-all cursor-pointer border-none bg-transparent"
                      title={lang === 'bn' ? 'WhatsApp-এ শেয়ার' : 'Share on WhatsApp'}
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.588 2.01 14.113.992 11.53.992 6.095.992 1.67 5.36 1.666 10.79c-.001 1.748.468 3.456 1.354 4.957l-.953 3.483 3.58-.938zm12.55-5.32c-.312-.156-1.848-.91-2.127-1.01-.279-.101-.482-.152-.684.152-.202.303-.78.985-.956 1.186-.176.201-.353.227-.665.071-1.066-.532-1.782-.974-2.485-2.18-.184-.316.184-.294.527-.978.058-.117.029-.221-.014-.309-.044-.089-.396-.955-.543-1.309-.143-.346-.288-.299-.396-.304-.102-.005-.22-.006-.338-.006-.118 0-.31.044-.472.221-.162.177-.618.604-.618 1.472 0 .869.632 1.707.72 1.829.089.122 1.243 1.898 3.011 2.662.42.182.748.29.105.424.421.134.82.115 1.127.07.34-.05 1.053-.43 1.202-.823.149-.393.149-.73.104-.801-.044-.072-.162-.118-.474-.274z" />
                      </svg>
                    </button>
                    {/* Facebook */}
                    <button
                      onClick={() => handleShareApp('facebook', selectedAd)}
                      className="p-1 hover:bg-[#1877F2] rounded text-blue-400 hover:text-white transition-all cursor-pointer border-none bg-transparent"
                      title={lang === 'bn' ? 'Facebook-এ শেয়ার' : 'Share on Facebook'}
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                    {/* Telegram */}
                    <button
                      onClick={() => handleShareApp('telegram', selectedAd)}
                      className="p-1 hover:bg-[#0088cc] rounded text-sky-400 hover:text-white transition-all cursor-pointer border-none bg-transparent"
                      title={lang === 'bn' ? 'Telegram-এ শেয়ার' : 'Share on Telegram'}
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.33-.26-1.98-.47-.8-.26-1.43-.4-1.37-.85.03-.23.35-.47.96-.72 3.76-1.63 6.27-2.71 7.54-3.23 3.59-1.48 4.33-1.74 4.82-1.75.11 0 .35.03.5.16.13.11.17.26.18.37.01.07.01.22 0 .37z" />
                      </svg>
                    </button>
                    {/* Twitter */}
                    <button
                      onClick={() => handleShareApp('twitter', selectedAd)}
                      className="p-1 hover:bg-black rounded text-slate-400 hover:text-white transition-all cursor-pointer border-none bg-transparent"
                      title={lang === 'bn' ? 'Twitter-এ শেয়ার' : 'Share on Twitter/X'}
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </button>
                  </div>

                  <button 
                    onClick={() => handleCopyToClipboard(selectedAd)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors border-none bg-transparent"
                    title="লিংক শেয়ার করুন"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setSelectedAd(null)}
                    className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white border-none bg-transparent"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                
                {selectedAd.status === "found" && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-3 flex items-center space-x-3 text-emerald-800 dark:text-emerald-300 text-xs">
                    <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold">সফলভাবে ফেরত পাওয়া গিয়েছে!</h4>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400">এই নোটিশ প্রণেতা নিশ্চিত করেছেন যে তার হারিয়ে যাওয়া জিনিস ফিরিয়ে দেয়া হয়েছে।</p>
                    </div>
                  </div>
                )}

                {/* Visual Image / Camera Capture display area */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden relative flex flex-col items-center justify-center p-2">
                  <div className="w-full h-48 sm:h-64 bg-slate-100 dark:bg-slate-950/60 rounded-lg overflow-hidden relative">
                    <img 
                      src={getAdImage(selectedAd)}
                      alt={selectedAd.title}
                      className="w-full h-full object-contain mx-auto select-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-2 py-1 rounded">
                      {selectedAd.images && selectedAd.images.length > 0 ? (lang === 'bn' ? 'ব্যবহারকারীর আপলোড করা ছবি' : 'User Uploaded Photo') : (lang === 'bn' ? 'আইটেম রেফারেন্স ছবি' : 'Item Reference Photo')}
                    </div>
                  </div>
                  
                  {/* If they have multiple images, show thumbnails under the main view */}
                  {selectedAd.images && selectedAd.images.length > 1 && (
                    <div className="flex space-x-2 mt-2 self-start overflow-x-auto pb-1 w-full">
                      {selectedAd.images.map((imgUrl, i) => (
                        <div key={i} className="w-12 h-12 rounded border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 cursor-pointer hover:border-emerald-500">
                          <img src={imgUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Social Sharing bar */}
                <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100/60 dark:border-emerald-900/40 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                      {lang === 'bn' ? 'বন্ধুদের সাথে শেয়ার করুন:' : 'Share with friends:'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    {/* Share using Web Share API */}
                    <button
                      onClick={() => handleSocialShare(selectedAd)}
                      className="flex-grow sm:flex-none justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
                      title={lang === 'bn' ? 'অন্যান্য উপায়ে শেয়ার' : 'Share with others'}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{lang === 'bn' ? 'শেয়ার করুন' : 'Share Now'}</span>
                    </button>
                    {/* WhatsApp */}
                    <button
                      onClick={() => handleShareApp('whatsapp', selectedAd)}
                      className="flex-grow sm:flex-none justify-center bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>WhatsApp</span>
                    </button>
                    {/* Facebook */}
                    <button
                      onClick={() => handleShareApp('facebook', selectedAd)}
                      className="flex-grow sm:flex-none justify-center bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
                    >
                      <span>Facebook</span>
                    </button>
                  </div>
                </div>
                  
                {/* 🚫 সতর্কবার্তা ও নাগরিক নির্দেশনা warning banner */}
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-3.5 text-xs text-amber-950 dark:text-amber-200 flex items-start space-x-3.5 shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-amber-300 block mb-0.5">
                      {lang === 'bn' ? '🚫 সতর্কবার্তা ও নাগরিক নির্দেশনা' : '🚫 Secure Classified Notice'}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                      {lang === 'bn' 
                        ? 'কোনো হারানো ফোন বা মোটরসাইকেল ফিরিয়ে দেওয়ার লোভ দেখিয়ে কেউ বিকাশ, রকেট বা নগদে অগ্রিম টাকা চাইলে তা প্রত্যাখ্যান করুন। পুলিশের সাধারণ ডায়েরি ও আইএমইআই আসল প্রমাণ সরাসরি মিলিয়ে না দেখে কোনো লেনদেন করবেন না।' 
                        : 'Reject anyone offering to return your device or vehicle in exchange for advanced financial secure deposits or transfers. Keep transactions strictly offline in public spots under close lookups.'}
                    </p>
                  </div>
                </div>

                {/* Grid layout containing left details & right map mock */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  
                  {/* Left Column information cards */}
                  <div className="md:col-span-3 space-y-3.5">
                    
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">মূল বিবরণ</span>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1 whitespace-pre-line text-justify">
                        {selectedAd.description}
                      </p>
                    </div>

                    {/* Metadata properties */}
                    <div className="bg-slate-50 dark:bg-slate-950/40 rounded-xl p-3 border border-slate-100 dark:border-slate-800/80 text-xs space-y-2 text-slate-800 dark:text-slate-100">
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                        <span className="text-slate-400 dark:text-slate-500">{t("ownerLabel")}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAd.userName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                        <span className="text-slate-400 dark:text-slate-500">{t("lossDateLabel")}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date(selectedAd.lossDate).toLocaleDateString(lang === 'bn' ? "bn-BD" : "en-US")}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                        <span className="text-slate-400 dark:text-slate-500">{t("lossLocationLabel")}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{selectedAd.lossLocation}</span>
                      </div>
                      {/* Full Division, District, Thana & Village as requested */}
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                        <span className="text-slate-400 dark:text-slate-500">{lang === 'bn' ? 'বিভাগ' : 'Division'}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">
                          {lang === 'bn' ? (
                            selectedAd.city === 'Dhaka' ? 'ঢাকা বিভাগ' :
                            selectedAd.city === 'Chattogram' ? 'চট্টগ্রাম বিভাগ' :
                            selectedAd.city === 'Sylhet' ? 'সিলেট বিভাগ' :
                            selectedAd.city === 'Khulna' ? 'খুলনা বিভাগ' :
                            selectedAd.city === 'Rajshahi' ? 'রাজশাহী বিভাগ' :
                            selectedAd.city === 'Barishal' ? 'বরিশাল বিভাগ' :
                            selectedAd.city === 'Rangpur' ? 'রংপুর বিভাগ' :
                            selectedAd.city === 'Mymensingh' ? 'ময়মনসিংহ বিভাগ' :
                            selectedAd.city
                          ) : `${selectedAd.city} Division`}
                        </span>
                      </div>
                      {selectedAd.thana && (
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                          <span className="text-slate-400 dark:text-slate-500">{lang === 'bn' ? 'জেলা' : 'District'}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{selectedAd.thana}</span>
                        </div>
                      )}
                      {selectedAd.unionName && (
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                          <span className="text-slate-400 dark:text-slate-500">{lang === 'bn' ? 'থানা' : 'Thana'}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{selectedAd.unionName}</span>
                        </div>
                      )}
                      {selectedAd.village && (
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                          <span className="text-slate-400 dark:text-slate-500">{lang === 'bn' ? 'গ্রাম / পাড়া / মহল্লা' : 'Village / Area'}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{selectedAd.village}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                        <span className="text-slate-400 dark:text-slate-500">{t("brandModelLabel")}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAd.brand || "—"} ({selectedAd.modelName || "—"})</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                        <span className="text-slate-400 dark:text-slate-500">{t("serialLabel")}</span>
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{selectedAd.serialOrImei || "—"}</span>
                      </div>
                      {selectedAd.gdNumber && (
                        <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                          <span className="text-slate-400 dark:text-slate-500">{t("gdAuthorityLabel")}</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedAd.gdNumber} ({selectedAd.gdAuthority})</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-[#0F4D0F] dark:text-[#19b992] font-semibold">{t("declaredRewardLabel")}</span>
                        <span className="font-bold text-amber-700 dark:text-amber-500">
                          {selectedAd.hasReward ? `৳ ${lang === 'bn' ? selectedAd.reward.toLocaleString("bn-BD") : selectedAd.reward.toLocaleString("en-US")}` : (lang === 'bn' ? 'নেই' : 'None')}
                        </span>
                      </div>
                    </div>

                    {/* Extra evidence owner justification */}
                    {selectedAd.proofDetails && (
                      <div className="bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl p-3">
                        <span className="text-[10px] font-bold text-[#0F4D0F] dark:text-[#19b992] uppercase block">{t("proofTitle")}</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{selectedAd.proofDetails}</p>
                      </div>
                    )}

                    {/* Uploaded Police GD copy display */}
                    {selectedAd.gdImage && (
                      <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl p-3" id="selected-ad-gd-image-preview">
                        <span className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span>{lang === 'bn' ? 'সংযুক্ত পুলিশ জিডি (GD) অনুলিপি' : 'Attached Police GD Copy'}</span>
                        </span>
                        <div className="mt-2 text-center bg-white dark:bg-slate-900 rounded border border-blue-200 dark:border-blue-800 p-1.5 inline-block cursor-zoom-in group max-w-[200px]">
                          <img 
                            src={selectedAd.gdImage} 
                            alt="Uploaded Police GD Copy" 
                            className="max-h-36 object-contain rounded border border-slate-100 dark:border-slate-800 mx-auto" 
                            referrerPolicy="no-referrer"
                          />
                          <p className="text-[8px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{lang === 'bn' ? 'অফিসিয়াল ডকুমেন্ট ভেরিফাইড' : 'Official Document Verified'}</p>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right Column (Radar Map & AI Insights) */}
                  <div className="md:col-span-2 space-y-3.5">
                    
                    {/* Simulated visual radar location marker */}
                    <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-800 relative overflow-hidden h-44 flex flex-col justify-between">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0,transparent_70%)] animate-pulse" />
                      
                      <div className="flex items-center justify-between z-10">
                        <span className="text-[9px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-500/20">
                          {t("radarTitle")}
                        </span>
                        <Map className="w-3.5 h-3.5 text-slate-400" />
                      </div>

                      {/* Radar animation visuals */}
                      <div className="relative flex items-center justify-center h-20">
                        <div className="absolute w-16 h-16 rounded-full border border-emerald-500/30 animate-ping" />
                        <div className="absolute w-24 h-24 rounded-full border border-emerald-500/10 animate-ping duration-1000" />
                        <div className="absolute w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-[10px] font-bold text-white z-10">
                          🎯
                        </div>
                        <span className="absolute bottom-0 text-[9px] text-slate-400 font-medium">{selectedAd.city} {lang === 'bn' ? 'এলাকা' : 'Area'}</span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 z-10 bg-slate-950/60 p-1 rounded">
                        <span className="truncate">{selectedAd.lossLocation.substring(0, 20)}...</span>
                        <span className="text-emerald-400">{t("radarZone")}</span>
                      </div>
                    </div>

                    {/* AI Scoring panel with expandable Bengali context */}
                    <div className="bg-gradient-to-br from-slate-50 to-emerald-50/50 dark:from-slate-900 dark:to-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1">
                          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{t("aiTitle")}</span>
                        </span>
                        <div className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                          {t("verificationScore")}: {selectedAd.aiVerifiedScore}%
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
                        {selectedAd.aiExplanation || t("aiFallbackExplanation")}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 space-y-1">
                        <span className="font-bold text-slate-700 dark:text-slate-200 block text-[11px]">{t("safetyGuideTitle")}</span>
                        <div className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-300">
                          {selectedAd.safetyTips || t("safetyGuideFallback")}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* ========================================== */}
                {/* POTENTIAL MATCHES SECTION IN AD MODAL */}
                {/* ========================================== */}
                {(() => {
                  const matches = getPotentialMatches(selectedAd);
                  if (matches.length === 0) return null;

                  return (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2" id="potential-matches-container">
                      <div className="flex items-center space-x-1.5 mb-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                        <span className="text-[10px] font-extrabold text-[#0F4D0F] dark:text-[#19b992] uppercase tracking-widest block">
                          {lang === 'bn' ? 'সম্ভাব্য ম্যাচসমূহ' : 'Potential Matches'}
                        </span>
                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tight">
                          {lang === 'bn' ? 'এআই ম্যাচিং' : 'AI Affinity Engine'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-3 leading-tight">
                        {lang === 'bn' 
                          ? 'এই বিজ্ঞাপনের ধরন, ব্র্যান্ড বা মডেলের সাথে মিল রয়েছে এমন কয়েকটি পোস্ট নিচে বিশ্লেষণ করা হলো:' 
                          : 'Listings sharing similar attributes like category, brand name, or model:'}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {matches.map(({ ad, score, reasons, reasonsBn }) => (
                          <div 
                            key={ad.id} 
                            onClick={() => {
                              setSelectedAd(ad);
                            }}
                            className="group bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 hover:border-emerald-600/35 hover:bg-emerald-50/5 dark:hover:bg-slate-800 hover:shadow-xs rounded-xl p-3 cursor-pointer transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <span className="text-[8px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold px-1.5 py-0.5 rounded uppercase">
                                  {lang === 'bn' ? CATEGORIES.find(c => c.id === ad.category)?.banglaName : ad.category}
                                </span>
                                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500">
                                  {lang === 'bn' ? `${score}/১০ মিল` : `${score}/10 match`}
                                </span>
                              </div>
                              <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                {ad.title}
                              </h4>
                              <p className="text-[9px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                                {ad.description}
                              </p>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap gap-1">
                              {(lang === 'bn' ? reasonsBn : reasons).map((reason, rIdx) => (
                                <span 
                                  key={rIdx} 
                                  className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[8px] px-1 py-0.5 rounded border border-emerald-100 dark:border-emerald-800/50"
                                >
                                  {reason}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Claims section containing Leads timeline */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                    {t("commentsTitle", { count: selectedAd.comments.length })}
                  </span>
                  
                  {selectedAd.comments.length === 0 ? (
                    <p className="text-xs text-slate-400 dark:text-slate-500 py-4 text-center">{t("emptyComments")}</p>
                  ) : (
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1">
                      {selectedAd.comments.map(c => (
                        <div key={c.id} className={`p-2.5 rounded-xl border text-xs ${
                          c.isFounderClaim 
                            ? "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/40" 
                            : "bg-slate-50 dark:bg-slate-800/70 border-slate-100 dark:border-slate-700/60"
                        }`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-1">
                              <span>{c.userName}</span>
                              {c.isFounderClaim && (
                                <span className="bg-amber-600 text-white text-[9px] px-1.5 py-0.2 rounded font-semibold">
                                  {lang === 'bn' ? 'সন্ধানকারী দাবি' : 'Finder Claim'}
                                </span>
                              )}
                            </span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500">{new Date(c.createdAt).toLocaleDateString(lang === 'bn' ? "bn-BD" : "en-US")}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add commentary / Lead finding submission form */}
                  {currentUser ? (
                    <form onSubmit={handleCommentSubmit} className="mt-3 flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="text" 
                          placeholder={t("commentPlaceholder")}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-grow bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-750"
                          id="comment-text-input"
                        />
                        <button 
                          type="submit" 
                          className="bg-[#0F4D0F] hover:bg-[#0b3b0b] text-white p-2 rounded-lg transition-colors flex items-center justify-center font-bold"
                          title={t("commentTooltip")}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <label className="flex items-center space-x-1.5 cursor-pointer select-none text-[10px] text-slate-500 dark:text-slate-400 font-medium self-start">
                        <input 
                          type="checkbox" 
                          checked={isFounderClaim}
                          onChange={() => setIsFounderClaim(!isFounderClaim)}
                          className="rounded text-amber-600 focus:ring-amber-500 focus:ring-0 w-3 h-3 cursor-pointer"
                        />
                        <span>{t("importantLeadLabel")}</span>
                      </label>
                    </form>
                  ) : (
                    <p className="text-[10px] text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/70 py-2 rounded-lg mt-2 border border-slate-100 dark:border-slate-700/60">
                      {lang === 'bn' ? (
                        <>পণ্যটির সন্ধান বা দাবি প্রদান করতে অনুগ্রহ করে <button onClick={() => { setIsAuthModalOpen(true); }} className="text-emerald-600 dark:text-emerald-400 underline font-semibold">লগইন করুন</button>।</>
                      ) : (
                        <>Please <button onClick={() => { setIsAuthModalOpen(true); }} className="text-emerald-600 dark:text-emerald-400 underline font-semibold">Login</button> to report leads or claim items.</>
                      )}
                    </p>
                  )}

                </div>

              </div>

              {/* Modal sticky footer panel containing primary contact trigger and Mark Found (for owner) */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 items-center justify-between flex-shrink-0 text-xs">
                
                {currentUser && currentUser.id === selectedAd.userId ? (
                  /* Ads Creator controls */
                  <div className="flex flex-col w-full space-y-3">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] text-amber-800 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded border border-amber-200/50 dark:border-amber-900/40">
                        {lang === 'bn' ? 'আপনি এই পোস্টের মালিক' : 'You are the owner of this post'}
                      </span>
                      <div className="flex items-center space-x-2">
                        {selectedAd.status === "lost" ? (
                          !isShowingReunionForm && (
                            <button 
                              onClick={() => setIsShowingReunionForm(true)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 shadow-sm cursor-pointer"
                              id="mark-found-action"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{lang === 'bn' ? 'উদ্ধার হয়েছে নিশ্চিত করুন' : 'Confirm as Recovered'}</span>
                            </button>
                          )
                        ) : (
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>{lang === 'bn' ? 'বিজ্ঞপ্তি সফলভাবে বন্ধ' : 'Notice successfully closed'}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {isShowingReunionForm && (
                      <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-3.5 space-y-3 animate-fade-in text-left w-full" id="success-story-form-block">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-[#0F4D0F] dark:text-[#19b992] text-xs flex items-center space-x-1">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            <span>{lang === 'bn' ? 'হারানো জিনিস পুনর্মিলনী গল্প 🎉' : 'Lost & Found Reunion Story 🎉'}</span>
                          </h4>
                          <button 
                            type="button" 
                            onClick={() => setIsShowingReunionForm(false)} 
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-[10px] font-bold cursor-pointer"
                          >
                            {lang === 'bn' ? 'বন্ধ করুন' : 'Cancel'}
                          </button>
                        </div>
                        
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                          {lang === 'bn' 
                            ? 'অভিনন্দন! আপনার জিনিস ফিরে পাওয়ার খুশির মুহূর্তটি সবার সাথে শেয়ার করুন। মালিক ও জিনিসের পুনর্মিলনীর একটি ছবি আপলোড করুন এবং একটি সংক্ষিপ্ত গল্প লিখুন।' 
                            : 'Congratulations! Share the joyful moment of getting your item back. Please upload a picture of the owner with the recovered item, and write a small reunion story.'}
                        </p>

                        <div className="space-y-1">
                          <label className="block text-[10px] text-slate-600 dark:text-slate-300 font-bold">{lang === 'bn' ? 'পুনর্মিলনী ছবি (বাধ্যতামূলক)' : 'Reunion Image (Required)'}</label>
                          <input 
                            type="file" 
                            id="reunion-file-input" 
                            accept="image/*" 
                            onChange={handleReunionImageChange} 
                            className="hidden" 
                          />
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => document.getElementById("reunion-file-input")?.click()}
                              disabled={isCompressingReunion}
                              className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-extrabold px-3 py-1.5 rounded-lg text-[10px] flex items-center space-x-1.5 cursor-pointer"
                            >
                              <PlusCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>{isCompressingReunion ? (lang === 'bn' ? "কম্প্রেস হচ্ছে..." : "Compressing...") : (lang === 'bn' ? "ছবি সিলেক্ট করুন" : "Select Image")}</span>
                            </button>
                            {reunionImage && (
                              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">✓ {lang === 'bn' ? "সংযুক্ত!" : "Attached!"}</span>
                            )}
                          </div>
                          {reunionImage && (
                            <div className="mt-2 relative inline-block">
                              <img src={reunionImage} alt="Reunion preview" className="h-16 w-24 object-cover rounded-lg border border-emerald-200 dark:border-emerald-800" />
                              <button 
                                type="button"
                                onClick={() => setReunionImage(null)}
                                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] text-slate-600 dark:text-slate-300 font-bold">{lang === 'bn' ? 'আবেগঘন বিবরণ বা ছোট গল্প (বাধ্যতামূলক)' : 'Reunion Short Story / Note (Required)'}</label>
                          <textarea
                            rows={2}
                            required
                            value={reunionStory}
                            onChange={(e) => setReunionStory(e.target.value)}
                            placeholder={lang === 'bn' ? "যেমনঃ প্ল্যাটফর্মের সহযোগিতায় আমরা ৫ ঘন্টার মধ্যে বাইকের সন্ধান পাই। ধন্যবাদ সবাইকে..." : "E.g. We successfully retrieved our bicycle within 5 hours thanks to the platform. Thank you..."}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleMarkAsFound()}
                          disabled={!reunionImage || !reunionStory.trim()}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          <span>{lang === 'bn' ? 'সফলতার গল্প সাবমিট করুন' : 'Submit Success Story'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Normal viewer controls */
                  <div className="flex flex-col items-center justify-center w-full gap-3 py-1 text-center">
                    <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lang === 'bn' ? 'মালিক কন্টাক্ট ভেরিফাইড (আইএমইআই বা চেসিস নম্বর দেখে সত্য নিশ্চিত করুন)' : 'Owner Contact Verified (verify IMEI/chassis number matching)'}</span>
                    </div>

                    <div className="flex justify-center w-full">
                      <button 
                        onClick={() => {
                          setSmsStatus("idle");
                          setIsContactModalOpen(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer w-full sm:w-auto min-w-[220px]"
                        id="contact-owner-btn"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{lang === 'bn' ? 'সরাসরি ফোনেই কথা বলুন' : 'Speak Directly on Phone'}</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================== */}
      {/* 7. CONTACT OWNER BOTTOM SHEET MODAL */}
      {/* ========================================================== */}
      <AnimatePresence>
        {isContactModalOpen && selectedAd && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl relative text-center"
              id="contact-modal"
            >
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/40 text-[#0F4D0F] dark:text-[#19b992] rounded-full flex items-center justify-center mx-auto mb-3">
                <PhoneCall className="w-6 h-6" />
              </div>

              <h4 className="font-bold text-slate-900 dark:text-slate-50 text-sm mb-1">{selectedAd.userName} ({lang === 'bn' ? 'মালিক' : 'Owner'})</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{lang === 'bn' ? 'হারানো ও প্রাপ্তি পোর্টালে নিবন্ধিত তথ্যপ্রমাণ অনুসারে যোগাযোগের নম্বরঃ' : 'Registered contact number according to portal records:'}</p>

              {/* Telephone trigger */}
              <a 
                href={`tel:${selectedAd.userPhone}`}
                className="block w-full bg-[#0F4D0F] hover:bg-[#0b3b0b] text-white text-xs font-bold py-3 rounded-xl shadow-xs transition-colors mb-2"
              >
                {lang === 'bn' ? 'কল করুন:' : 'Call:'} {selectedAd.userPhone}
              </a>

              {/* Whatsapp trigger */}
              <a 
                href={`https://wa.me/88${selectedAd.userPhone}?text=${encodeURIComponent(
                  lang === 'bn' 
                    ? `আসসালামু আলাইকুম, আমি আপনার লুকিং ডট বিডি তে হারানো "${selectedAd.title}" বিজ্ঞাপনটি পোর্টালে দেখেছি এবং যোগাযোগ করতে চাচ্ছিলাম।` 
                    : `Hello, I saw your lost listing for "${selectedAd.title}" on Looking.bd portal and wanted to contact you.`
                )}`}
                target="_blank"
                referrerPolicy="no-referrer"
                className="block w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold py-3 rounded-xl transition-colors"
              >
                💬 {lang === 'bn' ? 'WhatsApp-এ বার্তা দিন' : 'Message on WhatsApp'}
              </a>

              {/* Simulation carrier gateway trigger SMS button */}
              <div className="mt-3 text-left bg-slate-50 dark:bg-slate-850/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase mb-1">
                  {lang === 'bn' ? 'মালিককে দ্রুত এসএমএস পাঠান (সিমুলেটর)' : 'Quick SMS Simulator to Owner'}
                </span>
                
                {smsStatus === "idle" ? (
                  <button
                    onClick={() => {
                      setSmsStatus("sending");
                      setTimeout(() => {
                        setSmsStatus("sent");
                      }, 1200);
                    }}
                    className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-[11px] font-bold py-2 rounded-lg transition-all flex items-center justify-center space-x-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{lang === 'bn' ? 'সরাসরি টেস্ট এসএমএস পাঠান' : 'Send Fast Demo SMS'}</span>
                  </button>
                ) : smsStatus === "sending" ? (
                  <div className="w-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-[11px] font-semibold py-2 rounded-lg flex items-center justify-center space-x-1">
                    <span className="animate-spin text-amber-600 block">⏳</span>
                    <span>{lang === 'bn' ? 'ক্যারিয়ার গেটওয়ের মাধ্যমে পাঠানো হচ্ছে...' : 'Transmitting via Carrier Portal...'}</span>
                  </div>
                ) : (
                  <div className="w-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold p-2 rounded-lg text-center">
                    <p className="font-bold text-emerald-700 dark:text-emerald-400">✓ SMS Sent Successfully!</p>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium leading-tight">
                      {lang === 'bn' ? `মোবাইল ${selectedAd.userPhone} এ আমাদের গেটওয়ে দিয়ে পাঠানো হয়েছে।` : `Delivered to device: ${selectedAd.userPhone} via Looking.bd API.`}
                    </p>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-4 leading-normal">
                ⚠️ সতর্কবাণী: হারানো পণ্য বা বাইক পাওয়ার লোভে আগে কোনো টাকা বিকাশ বা নগদে অগ্রিম পাঠাবেন না। প্রমাণ মিলিয়ে দেখা করুন।
              </p>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* 7.5. POLICY PAGES MODAL (About, Terms, Privacy) */}
      {/* ========================================================== */}
      <AnimatePresence>
        {footerModalType && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative my-8 overflow-hidden flex flex-col max-h-[80vh]"
            >
              <button 
                onClick={() => setFooterModalType(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-[#0F4D0F]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-emerald-100 dark:bg-emerald-950/40 p-2 rounded-full text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-6 h-6 text-[#0F4D0F] dark:text-[#19b992]" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  {footerModalType === "about" && (lang === "bn" ? "Looking.bd সম্পর্কে তথ্য" : "About Looking.bd Portal")}
                  {footerModalType === "terms" && (lang === "bn" ? "শর্তাবলী ও নিয়মাবলি" : "Terms & Conditions")}
                  {footerModalType === "privacy" && (lang === "bn" ? "গোপনীয়তা নীতি এবং সুরক্ষা" : "Privacy Policy & Trust Safety")}
                  {footerModalType === "faq" && (lang === "bn" ? "জিজ্ঞাসিত প্রশ্নাবলী (FAQ)" : "Frequently Asked Questions (FAQ)")}
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 font-medium">
                {footerModalType === "about" && (
                  lang === "bn" ? (
                    <>
                      <p><strong>আমাদের লক্ষ্য ও উদ্দেশ্য:</strong> Looking.bd বাংলাদেশের প্রথম আধুনিক সিটিজেন-লেড লস্ট এন্ড ফাউন্ড নিরাপত্তা পোর্টাল। আমাদের লক্ষ্য হলো চুরি অথবা হারিয়ে যাওয়া ডিজিটাল সামগ্রী ও যানবাহন নিরাপদ এবং নির্ভুল উপায়ে পুনরুদ্ধারে সহায়তা করা।</p>
                      <p><strong>যাচাইকরণ প্রক্রিয়া:</strong> আমরা একটি শক্তিশালী এআই-ভিত্তিক প্রমাণ বিশ্লেষণ প্রযুক্তি ব্যবহার করি যা প্রতিটি বিজ্ঞপ্তির বিশ্বাসযোগ্যতা এবং সাধারণ ডায়েরি (GD) তথ্যের বাস্তবতা যাচাই করে। এর মাধ্যমে আমরা সেকেন্ড-হ্যান্ড সামগ্রী নিরাপদে ক্রয়-বিক্রয়ের নিশ্চয়তা প্রদান করি।</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Mission Goal:</strong> Looking.bd is Bangladesh's pioneering citizen-driven security platform assisting owners in finding lost mobile devices, motorbikes, and keys.</p>
                      <p><strong>Our Verification Engine:</strong> By cross-references with national databases, General Diaries, and purchase serial keys, we calculate distinct credibility levels to shield consumers from fraudulent online deals.</p>
                    </>
                  )
                )}

                {footerModalType === "terms" && (
                  lang === "bn" ? (
                    <>
                      <p>১. পোর্টালে বিজ্ঞপ্তি প্রকাশের পূর্বে নিকটবর্তী থানা হতে নির্ভরযোগ্য সাধারণ ডায়েরি (জিডি) নাম্বার ও বিবরণী সংযুক্ত করা বাধ্যতামূলক।</p>
                      <p>২. কোনো প্রকার মিথ্যা, ভিত্তিহীন, বিভ্রান্তিকর নোটিশ বা প্রতারণামূলক পুরষ্কার দাবি করা ডিজিটাল নিরাপত্তা আইন অনুযায়ী আইনত দণ্ডনীয় অপরাধ।</p>
                      <p>৩. <strong>নিরাপত্তা পরামর্শ:</strong> উদ্ধারকারী দাবীদারের তথ্যের সত্যতা পুলিশ বা থানায় স্বচক্ষে নিরাপদ স্থানে বসে মিলিয়ে তারপর কোনো আর্থিক পুরষ্কার হস্তান্তর করুন। অগ্রিম বিকাশ বা রকেট চার্জ পাঠাবেন না।</p>
                    </>
                  ) : (
                    <>
                      <p>1. <strong>Mandatory Authority:</strong> Listing missing things requires inputting a legal General Diary (GD) reference logged with respective police division.</p>
                      <p>2. <strong>Accuracy Mandate:</strong> Submission of deceitful warnings, duplicate claims, or demands for payments is prosecuted under BD Cyber Protection Acts.</p>
                      <p>3. <strong>Safe Exchange:</strong> Meet in public places, preferably police thana front yards. Never make advance payments or security code deposits to any claim applicant.</p>
                    </>
                  )
                )}

                {footerModalType === "privacy" && (
                  lang === "bn" ? (
                    <>
                      <p>১. ব্যবহারকারীর সংবেদনশীল যোগাযোগ নম্বর, নাম এবং ঠিকানা অত্যন্ত গোপন ও সর্বাধুনিক প্রযুক্তিতে সুরক্ষিত কর্পোরেট ডেটাবেজে সংরক্ষিত থাকে।</p>
                      <p>২. আপনার আইএমইআই (IMEI) বা চেসিস রেফারেন্স নাম্বারসমূহ অন্যান্য নাগরিকের সাথে সুরক্ষিত ও এনক্রিপ্টেড উপায়ে কেবলমাত্র ওয়ান-টু-ওয়ান উপায়ে যাচাই করতে সাহায্য করা হয়।</p>
                      <p>৩. Looking.bd বিজ্ঞাপনদাতাদের সাথে ব্যবহারকারীর ব্যক্তিগত পরিচয়পত্র বা ফোন নম্বর কখনই বাণিজ্যিক উদ্দেশ্যে বিক্রি বা বিনিময় করে না।</p>
                    </>
                  ) : (
                    <>
                      <p>1. <strong>Storage Safety:</strong> Contact numbers, email handles, and listings are encrypted using state-of-the-art secure isolated server clusters.</p>
                      <p>2. <strong>Telemetry Safeguard:</strong> Hardware details like IMEI, chassis references, and GD files are accessed solely for security audit. We never share profile metadata with advertising networks.</p>
                    </>
                  )
                )}

                {footerModalType === "faq" && (
                  lang === "bn" ? (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
                        <p className="font-extrabold text-slate-950 dark:text-slate-100 mb-1 text-sm">১. কীভাবে আমি আমার হারিয়ে যাওয়া জিনিসের পোস্ট দেবো?</p>
                        <p className="text-slate-500 dark:text-slate-400">ওপরের "নোটিশ পোস্ট করুন" বাটনে ক্লিক করে ফর্মটি পূরণ করুন। আপনার নাম, ইমেইল, মোবাইল নম্বর, জিনিসটির ধরন এবং সঠিক জিডি নম্বর দিয়ে সহজে পোস্ট করা যাবে।</p>
                      </div>
                      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
                        <p className="font-extrabold text-slate-950 dark:text-slate-100 mb-1 text-sm">২. পুলিশ সাধারণ ডায়েরি (GD) নম্বর দেওয়া কি বাধ্যতামূলক?</p>
                        <p className="text-slate-500 dark:text-slate-400">হ্যাঁ। প্রতিটি বিজ্ঞপ্তির আসল সত্যতা এবং নাগরিক সুরক্ষা যাচাই করার জন্য একটি বৈধ সাধারণ ডায়েরি (GD) নাম্বার (যেমন GD-74291/26) প্রদান বাঞ্ছনীয়।</p>
                      </div>
                      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
                        <p className="font-extrabold text-slate-950 dark:text-slate-100 mb-1 text-sm">৩. আমার জিনিসটি উদ্ধার হলে আমি কীভাবে ফেরত পাবো?</p>
                        <p className="text-slate-500 dark:text-slate-400">হারিয়ে যাওয়া জিনিসটির মালিকানা নিশ্চিত করার পর জনবহুল বা নিরাপদ স্থানে (যেমন থানা প্রাঙ্গণ বা ফাঁড়ি) সামনাসামনি বসে মূল জিডি কপি ও ক্রয় রশিদ মিলিয়ে দেখে পণ্য হস্তান্তর সম্পন্ন ও নিশ্চিত করুন।</p>
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-950 dark:text-slate-100 mb-1 text-sm">৪. Looking.bd কি কোনো চার্জ বা সেবা ফি কেটে থাকে?</p>
                        <p className="text-slate-500 dark:text-slate-400">না, এটি সম্পূর্ণরূপে জনমুখী ও একটি অবাণিজ্যিক মুক্ত সাহায্যকারী ফোরাম। এখানে বিজ্ঞাপন দেওয়া বা সাহায্য নেওয়ার জন্য কোনো চার্জ দিতে হয় না।</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
                        <p className="font-extrabold text-slate-950 dark:text-slate-100 mb-1 text-sm">1. How do I publish a notice for my lost item?</p>
                        <p className="text-slate-500 dark:text-slate-400">Simply click the "Post Missing Item" on top, fill out details including valid brand names, contact specifics, and submit.</p>
                      </div>
                      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
                        <p className="font-extrabold text-slate-950 dark:text-slate-100 mb-1 text-sm">2. Is specifying a Police GD Number mandatory?</p>
                        <p className="text-slate-500 dark:text-slate-400">Yes. To maintain validation levels and eliminate fraud, any listing submission should append an active GD ID in the verified pattern (e.g. GD-74291/26).</p>
                      </div>
                      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-3">
                        <p className="font-extrabold text-slate-950 dark:text-slate-100 mb-1 text-sm">3. How do I retrieve my lost device/bike securely?</p>
                        <p className="text-slate-500 dark:text-slate-400">Once matched, verify the original purchase logs and ownership claims. Always prioritize public handover spots like Police Station grounds.</p>
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-950 dark:text-slate-100 mb-1 text-sm">4. Does Looking.bd require service fees or subscription?</p>
                        <p className="text-slate-500 dark:text-slate-400">No. It operates entirely as a free, open-access nonprofit initiative serving communities to secure and find their valuable assets without cost.</p>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end mt-4">
                <button 
                  onClick={() => setFooterModalType(null)}
                  className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors border dark:border-slate-700"
                >
                  {lang === "bn" ? "বন্ধ করুন" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>



      {/* ========================================================== */}
      {/* 9. MODAL: CREATE HARANO POST FORM */}
      {/* ========================================================== */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[90vh]"
              id="create-ad-modal"
            >
              
              <div className="bg-[#0F4D0F] text-white px-5 py-3 flex items-center justify-between border-b border-[#0b3b0b] flex-shrink-0">
                <div>
                  <h3 className="font-bold text-sm md:text-base">নতুন হারানো বিজ্ঞপ্তি ফরম</h3>
                  <p className="text-[10px] text-emerald-100">জিডি অনুলিপি ও সুনির্দিষ্ট প্রমাণ দিয়ে পোস্ট করুন</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-emerald-100 hover:text-white p-1 rounded-full hover:bg-emerald-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress visual steps */}
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900 px-5 py-2 flex items-center justify-between text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                <span className={postingStep === 1 ? "text-emerald-900 dark:text-emerald-200 underline font-extrabold" : "text-emerald-600 dark:text-emerald-500"}>ধাপ ১: পণ্য ও স্থানের বিবরণ</span>
                <span className="text-slate-300 dark:text-slate-700">&rarr;</span>
                <span className={postingStep === 2 ? "text-emerald-900 dark:text-emerald-200 underline font-extrabold" : "text-emerald-600 dark:text-emerald-500"}>ধাপ ২: জিডি কপি ও প্রমাণের সত্যতা</span>
              </div>

              <form onSubmit={handlePostSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs" id="ad-create-form">
                
                {postError && (
                  <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300 p-2.5 rounded-lg text-xs font-semibold border border-red-100 dark:border-red-900/50 flex items-start space-x-1.5 animate-bounce">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                    <span>{postError}</span>
                  </div>
                )}

                {/* STEP 1 FORM CONTROLS */}
                {postingStep === 1 ? (
                  <div className="space-y-3">
                    
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">বিজ্ঞপ্তির শিরোনাম *</label>
                      <input 
                        type="text" 
                        required
                        value={postForm.title}
                        onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                        placeholder="উদাঃ রবীন্দ্র সরণিতে আইফোন ১৪ প্রো হারিয়েছে"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800"
                        id="title-input-field"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ক্যাটাগরি *</label>
                        <select 
                          value={postForm.category}
                          onChange={(e) => setPostForm({...postForm, category: e.target.value as Category})}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800"
                          id="category-select-field"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id} className="dark:bg-slate-900 dark:text-slate-100">{cat.banglaName}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-bold text-slate-700 dark:text-slate-300">{lang === 'bn' ? 'বিভাগ/শহর *' : 'Division/City *'}</label>
                          <button
                            type="button"
                            onClick={() => handleUseCurrentLocation("post")}
                            className="text-[9px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-extrabold flex items-center space-x-0.5 cursor-pointer bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                            title={lang === 'bn' ? 'বর্তমান অবস্থান ব্যবহার করুন' : 'Use GPS'}
                          >
                            <Locate className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400 inline-block align-middle animate-pulse" />
                            <span>{lang === 'bn' ? 'জিপিএস' : 'GPS'}</span>
                          </button>
                        </div>
                        <select 
                          value={postForm.city}
                          onChange={(e) => {
                            const selectedCity = e.target.value;
                            const availableThanas = Object.keys(DIVISION_LOCATIONS[selectedCity] || {});
                            const defaultThana = availableThanas[0] || "";
                            const availableUnions = DIVISION_LOCATIONS[selectedCity]?.[defaultThana] || [];
                            const defaultUnion = availableUnions[0] || "";
                            setPostForm({
                              ...postForm,
                              city: selectedCity,
                              thana: defaultThana,
                              unionName: defaultUnion
                            });
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          id="city-select-field"
                        >
                          {BANGLADESH_CITIES.filter(c => c.id !== "all").map(city => (
                            <option key={city.id} value={city.id} className="dark:bg-slate-900 dark:text-slate-100">{city.banglaName}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {lang === 'bn' ? 'জেলা *' : 'District *'}
                        </label>
                        <select
                          required
                          value={postForm.thana}
                          onChange={(e) => {
                            const selectedThana = e.target.value;
                            const availableUnions = DIVISION_LOCATIONS[postForm.city]?.[selectedThana] || [];
                            const defaultUnion = availableUnions[0] || "";
                            setPostForm({
                              ...postForm,
                              thana: selectedThana,
                              unionName: defaultUnion
                            });
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          id="thana-select-field"
                        >
                          {Object.keys(DIVISION_LOCATIONS[postForm.city] || {}).map(th => (
                            <option key={th} value={th} className="dark:bg-slate-900 dark:text-slate-100">{th}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          {lang === 'bn' ? 'থানা / উপজেলা *' : 'Thana / Upazila *'}
                        </label>
                        <select
                          required
                          value={postForm.unionName}
                          onChange={(e) => {
                            setPostForm({
                              ...postForm,
                              unionName: e.target.value
                            });
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          id="union-select-field"
                        >
                          {(DIVISION_LOCATIONS[postForm.city]?.[postForm.thana] || []).map(un => (
                            <option key={un} value={un} className="dark:bg-slate-900 dark:text-slate-100">{un}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">গ্রাম / পাড়া / মহল্লা</label>
                      <input
                        type="text"
                        value={postForm.village}
                        onChange={(e) => setPostForm({...postForm, village: e.target.value})}
                        placeholder="উদাঃ মিরপুর ১০, ময়নামতি রোড"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        id="village-input-field"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ব্র্যান্ড নাম</label>
                        <input 
                          type="text" 
                          value={postForm.brand}
                          onChange={(e) => setPostForm({...postForm, brand: e.target.value})}
                          placeholder="উদাঃ Apple, Bajaj, Giant"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">মডেল নাম / সংস্করণ</label>
                        <input 
                          type="text" 
                          value={postForm.modelName}
                          onChange={(e) => setPostForm({...postForm, modelName: e.target.value})}
                          placeholder="উদাঃ Gixxer 150, iPhone S"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ডিভাইস সিরিয়াল বা IMEI *</label>
                        <input 
                          type="text" 
                          required
                          value={postForm.serialOrImei}
                          onChange={(e) => setPostForm({...postForm, serialOrImei: e.target.value})}
                          placeholder="IMEI নম্বর বা চেসিস নম্বর"
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">হারানোর তারিখ *</label>
                        <input 
                          type="date" 
                          required
                          value={postForm.lossDate}
                          onChange={(e) => setPostForm({...postForm, lossDate: e.target.value})}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">সুনির্দিষ্ট হারানো বা চুরির এলাকা / ঠিকানা *</label>
                      <input 
                        type="text" 
                        required
                        value={postForm.lossLocation}
                        onChange={(e) => setPostForm({...postForm, lossLocation: e.target.value})}
                        placeholder="উদাঃ সেক্টর ৭, বাড্ডা লিংক রোড সংলগ্ন, শাহবাগ মোড়..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs"
                      />
                    </div>

                    {/* Camera Capture and Photo Upload Selector */}
                    <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 mt-2">
                      <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs mb-1.5 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                        <span>আইটেমের ছবি বা ক্রয় রসিদ যুক্ত করুন (ক্যামেরা / গ্যালারি) *</span>
                      </label>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        {/* Hidden Inputs */}
                        <input 
                          type="file" 
                          id="gallery-upload"
                          accept="image/*"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <input 
                          type="file" 
                          id="camera-capture"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageChange}
                          className="hidden"
                        />

                        {/* Interactive trigger controls */}
                        <button
                          type="button"
                          onClick={() => document.getElementById("gallery-upload")?.click()}
                          className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg py-2 px-3 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors duration-150 cursor-pointer"
                        >
                          <Plus className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          <span>গ্যালারি থেকে সিলেক্ট করুন</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => document.getElementById("camera-capture")?.click()}
                          className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg py-2 px-3 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors duration-150 cursor-pointer"
                        >
                          <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>ক্যামেরা দিয়ে ছবি তুলুন</span>
                        </button>
                      </div>

                      {/* Preview Thumbnails and Annotation Tool Integration */}
                      {uploadedImages.length > 0 && (
                        <div className="mt-3.5 space-y-2.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                              <span>
                                {lang === 'bn' 
                                  ? `${uploadedImages.length}টি ছবি সংযুক্ত হয়েছে` 
                                  : `${uploadedImages.length} photo(s) attached`}
                              </span>
                              {annotatedImageIndices.length > 0 && (
                                <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold rounded-full border border-emerald-300 dark:border-emerald-700/50">
                                  {annotatedImageIndices.length} {lang === 'bn' ? 'টিতে দাগ চিহ্নিত' : 'annotated'}
                                </span>
                              )}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {lang === 'bn' ? "দাগ বা ক্ষতি চিহ্নিত করতে ছবিতে ক্লিক করুন" : "Click image to highlight damages"}
                            </span>
                          </div>

                          {/* Image Cards Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {uploadedImages.map((imgBase64, idx) => {
                              const isAnnotated = annotatedImageIndices.includes(idx);
                              return (
                                <div 
                                  key={idx} 
                                  className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow transition-all flex flex-col"
                                >
                                  {/* Photo viewport */}
                                  <div 
                                    onClick={() => {
                                      setAnnotatingImageIndex(idx);
                                      setIsAnnotatorOpen(true);
                                    }}
                                    className="h-28 w-full bg-slate-100 dark:bg-slate-800 relative cursor-pointer overflow-hidden flex items-center justify-center"
                                    title={lang === 'bn' ? "দাগ বা চিহ্ন আঁকতে ক্লিক করুন" : "Click to draw circle or arrow marks"}
                                  >
                                    <img 
                                      src={imgBase64} 
                                      alt={`Uploaded photo ${idx + 1}`} 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                                    />
                                    
                                    {/* Hover prompt overlay */}
                                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1">
                                      <Edit3 className="w-5 h-5 text-emerald-300 drop-shadow mb-1" />
                                      <span className="text-[10px] font-bold text-center bg-black/60 px-2 py-0.5 rounded">
                                        {lang === 'bn' ? "দাগ চিহ্নিত করুন" : "Annotate Photo"}
                                      </span>
                                    </div>

                                    {/* Top Left: Annotated Badge */}
                                    {isAnnotated && (
                                      <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md flex items-center space-x-1 shadow">
                                        <Check className="w-2.5 h-2.5" />
                                        <span>{lang === 'bn' ? "দাগ চিহ্নিত" : "Annotated"}</span>
                                      </div>
                                    )}

                                    {/* Top Right: Delete Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveUploadedImage(idx);
                                      }}
                                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
                                      title={lang === 'bn' ? "ছবিটি মুছুন" : "Remove photo"}
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {/* Card bottom quick action */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setAnnotatingImageIndex(idx);
                                      setIsAnnotatorOpen(true);
                                    }}
                                    className="w-full py-1.5 px-2 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-t border-slate-200 dark:border-slate-700 text-[11px] font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>
                                      {isAnnotated 
                                        ? (lang === 'bn' ? "চিহ্ন পরিবর্তন করুন" : "Edit Marks") 
                                        : (lang === 'bn' ? "দাগ/ক্ষতি আঁকুন" : "Draw Marks")}
                                    </span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          {/* Damage Annotation Highlight Prompt Banner */}
                          <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-2.5 flex items-center justify-between gap-2.5">
                            <div className="flex items-start space-x-2">
                              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                              <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-tight">
                                <p className="font-bold text-emerald-800 dark:text-emerald-200">
                                  {lang === 'bn' 
                                    ? "পণ্যের স্ক্র্যাচ, ফাটা দাগ বা বিশেষ লক্ষণ আছে?" 
                                    : "Has scratches, cracks or identifying marks?"}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                  {lang === 'bn' 
                                    ? "ছবিতে বৃত্ত (Circle) বা তীর (Arrow) এঁকে ক্ষতিগ্রস্ত অংশ হাইলাইট করুন।" 
                                    : "Draw circles or arrows on the photos to highlight damages for easy verification."}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setAnnotatingImageIndex(0);
                                setIsAnnotatorOpen(true);
                              }}
                              className="bg-[#0F4D0F] hover:bg-[#0b3b0b] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 flex-shrink-0 shadow-sm cursor-pointer transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{lang === 'bn' ? "চিহ্নিত করুন" : "Annotate"}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button 
                        type="button" 
                        onClick={() => {
                          if (!postForm.title || !postForm.serialOrImei || !postForm.lossLocation) {
                            setPostError("দয়া করে প্রয়োজনীয় সব তথ্য প্রদান করুন।");
                          } else {
                            setPostError("");
                            setPostingStep(2);
                          }
                        }}
                        className="bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer border-none"
                      >
                        পরবর্তী ধাপ &rarr;
                      </button>
                    </div>

                  </div>
                ) : (
                  
                  /* STEP 2 FORM CONTROLS: Legal proof GD */
                  <div className="space-y-3">
                    
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">থানার জিডি (GD) নাম্বার</label>
                        <input 
                          type="text" 
                          value={postForm.gdNumber}
                          onChange={(e) => setPostForm({...postForm, gdNumber: e.target.value})}
                          placeholder="যেমনঃ GD-74291/26"
                          className={`w-full bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-emerald-500 focus:outline-none ${
                            postForm.gdNumber 
                              ? isGdFormatValid(postForm.gdNumber) 
                                ? "border-emerald-500 dark:border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300" 
                                : "border-rose-400 dark:border-rose-500 bg-rose-50/20 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300" 
                              : "border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100"
                          }`}
                        />
                        {postForm.gdNumber && (
                          <p className={`text-[10px] mt-1 font-bold ${
                            isGdFormatValid(postForm.gdNumber) ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"
                          }`}>
                            {isGdFormatValid(postForm.gdNumber) 
                              ? (lang === 'bn' ? "✓ সঠিক জিডি ফরম্যাট" : "✓ Correct GD format")
                              : (lang === 'bn' ? "✗ সঠিক ফরম্যাটঃ GD-নাম্বার/বছর (উদাঃ GD-74291/26)" : "✗ Format: GD-[number]/[year] (e.g. GD-74291/26)")
                            }
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">পুলিশ থানা / ডায়েরি দাতা</label>
                        <input 
                          type="text" 
                          value={postForm.gdAuthority}
                          onChange={(e) => setPostForm({...postForm, gdAuthority: e.target.value})}
                          placeholder="যেমনঃ উত্তরা পশ্চিম থানা"
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </div>
                    </div>

                    {/* Dedicated GD copy file upload with client-side compression */}
                    <div className="bg-emerald-50/10 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/15 dark:border-emerald-500/30 space-y-1.5" id="gd-document-upload-container">
                      <div className="flex items-center justify-between">
                        <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center space-x-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{lang === 'bn' ? "পুলিশ জিডি (GD) অনুলিপি বা কপি আপলোড করুন" : "Upload Police GD Copy / Invoice *"}</span>
                        </label>
                        {uploadedGdImage && (
                          <span className="text-[9px] text-[#0F4D0F] dark:text-emerald-400 font-semibold bg-emerald-100/50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/60">
                            {lang === 'bn' ? "সংযুক্ত হয়েছে" : "Attached"}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-400 leading-normal">
                        {lang === 'bn' 
                          ? "পুলিশ জিডির ছবি আপলোড করলে স্কোরে 'Official Document' ব্যাজ যোগ হবে এবং বিশ্বাসযোগ্যতা বৃদ্ধি পাবে।" 
                          : "Uploading a GD copy automatically appends an 'Official Document' tag onto your listing."}
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          id="gd-image-upload"
                          accept="image/*"
                          onChange={handleGdImageChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById("gd-image-upload")?.click()}
                          disabled={isGdImageCompressing}
                          className="w-full sm:w-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg py-1.5 px-3 text-[11px] font-bold flex items-center justify-center space-x-1.5 transition disabled:opacity-50 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                          <span>
                            {isGdImageCompressing 
                              ? (lang === 'bn' ? "অপ্টিমাইজ ও কম্প্রেস হচ্ছে..." : "Optimizing & Compressing...") 
                              : (lang === 'bn' ? "জিডি কপি সিলেক্ট করুন (স্মার্ট অপ্টিমাইজড)" : "Select GD Copy (Smart Optimized)")
                            }
                          </span>
                        </button>
                        
                        {uploadedGdImage && (
                          <button
                            type="button"
                            onClick={() => setUploadedGdImage(null)}
                            className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg p-1.5 text-xs font-bold border border-rose-200 dark:border-rose-800 cursor-pointer"
                            title={lang === 'bn' ? 'মুছে ফেলুন' : 'Remove file'}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {uploadedGdImage && (
                        <div className="mt-2 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 max-w-[120px] relative">
                          <img src={uploadedGdImage} alt="GD copy upload preview" className="h-14 object-cover mx-auto rounded" />
                          <span className="text-[8px] text-slate-500 dark:text-slate-400 block text-center mt-1 truncate">GD_Document_Optimized</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">মালিকানার সত্যতার স্বপক্ষে প্রমাণ বিবরণ *</label>
                      <textarea 
                        required
                        value={postForm.proofDetails}
                        onChange={(e) => setPostForm({...postForm, proofDetails: e.target.value})}
                        placeholder="উদাঃ আমাদের নিকট ক্রয় রসিদ, রিলিজ মেমো, এবং আইএমইআই ম্যাচ করা মূল খাঁটি বাক্স সংরক্ষিত রয়েছে..."
                        rows={3}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">বিস্তারিত ঘটনা ও বিবরণ *</label>
                      <textarea 
                        required
                        value={postForm.description}
                        onChange={(e) => setPostForm({...postForm, description: e.target.value})}
                        placeholder="গত ১৫ই জুন বিকেলে রিকশাযোগে যাওয়ার সময় ফোনটি পকেট থেকে পড়ে যায়। চাবি রিং বেল ছিল..."
                        rows={3}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
                      />
                    </div>

                    {/* Reward options toggler */}
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3 border border-amber-200 dark:border-amber-800/60 space-y-3">
                      
                      <label className="flex items-center space-x-2 cursor-pointer font-bold text-amber-900 dark:text-amber-300 select-none">
                        <input 
                          type="checkbox" 
                          checked={postForm.hasReward}
                          onChange={() => setPostForm({...postForm, hasReward: !postForm.hasReward})}
                          className="rounded text-amber-600 focus:ring-0 cursor-pointer"
                        />
                        <span>আমি এই পণ্য বা গাড়ির জন্য সন্ধানদাতা পুরস্কার ঘোষণা করতে চাই</span>
                      </label>

                      {postForm.hasReward && (
                        <div className="pl-5">
                          <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1">ঘোষিত পুরস্কারের পরিমাণ (৳ টাকা) *</label>
                          <input 
                            type="number" 
                            required
                            value={postForm.reward}
                            onChange={(e) => setPostForm({...postForm, reward: e.target.value})}
                            placeholder="যেমনঃ ৫০০০"
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg px-2.5 py-1.5 text-xs w-48 focus:outline-none"
                          />
                        </div>
                      )}

                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <button 
                        type="button" 
                        onClick={() => setPostingStep(1)}
                        className="text-slate-500 dark:text-slate-400 hover:underline font-bold cursor-pointer border-none bg-transparent"
                      >
                        &larr; বিবরণ পরিবর্তন
                      </button>

                      <button 
                        type="submit" 
                        disabled={isPosting}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-lg shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer border-none"
                      >
                        {isPosting ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>AI যাচাই হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>বিজ্ঞপ্তি প্রকাশ করুন</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                )}

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Annotation Tool Modal in post-ad creation flow */}
      {isAnnotatorOpen && uploadedImages.length > 0 && (
        <ImageAnnotationModal
          isOpen={isAnnotatorOpen}
          imageUrl={uploadedImages[annotatingImageIndex] || uploadedImages[0]}
          originalImageUrl={originalUploadedImages[annotatingImageIndex]}
          imageIndex={annotatingImageIndex}
          totalImages={uploadedImages.length}
          onSave={handleSaveAnnotatedImage}
          onClose={() => setIsAnnotatorOpen(false)}
          onSwitchImage={(newIdx) => setAnnotatingImageIndex(newIdx)}
          lang={lang}
        />
      )}

      {/* FAQ & Safety Help Modal */}
      <FaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
        lang={lang}
        onOpenCreateAd={() => {
          if (!currentUser) {
            setSelectedAd(null);
            setIsProfileOpen(false);
            setAuthType("register");
            setIsAuthModalOpen(true);
            setAuthError(t("authRequiredMsg"));
          } else {
            setIsCreateModalOpen(true);
          }
        }}
      />

      {/* ========================================================== */}
      {/* IMAGE PREVIEW MODAL WITH FULL GESTURES & CONTROL NAV */}
      {/* ========================================================== */}
      <AnimatePresence>
        {isPreviewModalOpen && selectedAd && (
          <div 
            className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 select-none"
            id="image-preview-modal-overlay"
          >
            {/* Backdrop element with Framer Motion fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-transparent cursor-pointer"
              onClick={() => setIsPreviewModalOpen(false)}
            />

            {/* Top Bar: Title & Close Button */}
            <div className="relative z-10 w-full flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="text-white text-xs sm:text-sm font-medium truncate max-w-[70%]">
                <span className="font-bold text-emerald-400">
                  {previewImageIndex + 1} / {selectedAd.images && selectedAd.images.length > 0 ? selectedAd.images.length : 1}
                </span>
                <span className="mx-2">•</span>
                <span>{selectedAd.title}</span>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors border-none cursor-pointer"
                aria-label="Close Preview"
                id="close-preview-modal-btn"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Middle Section: Swipable/Interactive Image Display */}
            <div 
              className="relative z-10 flex-grow flex items-center justify-between px-2 sm:px-6 md:px-12"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Desktop Left navigation arrow */}
              {(selectedAd.images && selectedAd.images.length > 1) && (
                <button
                  onClick={() => {
                    const total = selectedAd.images.length;
                    setPreviewImageIndex((prev) => (prev - 1 + total) % total);
                  }}
                  className="hidden md:flex p-3 text-white bg-white/10 hover:bg-white/20 rounded-full border-none cursor-pointer hover:scale-105 transition-transform"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Central Image Container with Zoom effect */}
              <div className="flex-grow h-full max-h-[70vh] flex items-center justify-center relative select-none pointer-events-auto">
                <motion.img
                  key={previewImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  src={
                    selectedAd.images && selectedAd.images.length > 0
                      ? selectedAd.images[previewImageIndex]
                      : getAdImage(selectedAd)
                  }
                  alt={`${selectedAd.title} - preview`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Desktop Right navigation arrow */}
              {(selectedAd.images && selectedAd.images.length > 1) && (
                <button
                  onClick={() => {
                    const total = selectedAd.images.length;
                    setPreviewImageIndex((prev) => (prev + 1) % total);
                  }}
                  className="hidden md:flex p-3 text-white bg-white/10 hover:bg-white/20 rounded-full border-none cursor-pointer hover:scale-105 transition-transform"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Bottom Section: Thumbnails Indicator / Gallery (or Swipe help tip) */}
            <div className="relative z-10 w-full p-4 sm:p-6 flex flex-col items-center justify-center bg-gradient-to-t from-black/90 to-transparent gap-3">
              {selectedAd.images && selectedAd.images.length > 1 ? (
                <div className="flex items-center space-x-2 py-2 overflow-x-auto max-w-full">
                  {selectedAd.images.map((imgUrl, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviewImageIndex(i)}
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded overflow-hidden flex-shrink-0 border-2 transition-all p-0 ${
                        previewImageIndex === i ? 'border-emerald-400 scale-105' : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img src={imgUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-xs text-center font-medium">
                  {lang === 'bn' ? 'মেইন ইমেজ প্রিভিউ' : 'Main Image Preview'}
                </p>
              )}

              {/* Swipe tutorial tooltip for mobile */}
              {(selectedAd.images && selectedAd.images.length > 1) && (
                <span className="text-[10px] text-slate-500 md:hidden animate-pulse">
                  {lang === 'bn' ? '← বামে বা ডানে সোয়াইপ করুন →' : '← Swipe Left or Right to Navigate →'}
                </span>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================== */}
      {/* 10. STICKY BOTTOM NAVIGATION BAR */}
      {/* ========================================================== */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_22px_rgba(0,0,0,0.08)] px-4 py-2.5 flex items-center justify-around h-16">
        <div className="max-w-lg w-full mx-auto flex items-center justify-around">
          
          {/* All Ads Button */}
          <button 
            onClick={() => {
              setActiveCategory("all");
              setActiveCity("all");
              setActiveThana("");
              setActiveUnion("");
              setActiveVillage("");
              setSearchQuery("");
              setCurrentSearchInput("");
              setIsOnlyShowFoundState(false);
              setIsAuthModalOpen(false);
              setIsProfileOpen(false);
              setIsAdminDashboardOpen(false);
              setSelectedAd(null);
              showNotification(lang === 'bn' ? "সব হারানো বিজ্ঞাপন দেখানো হচ্ছে" : "Showing all active lost ads");
            }}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-colors ${
              activeCategory === "all" && activeCity === "all" && !searchQuery && !isOnlyShowFoundState && !isAuthModalOpen && !isProfileOpen && !isAdminDashboardOpen
                ? "text-[#0F4D0F] dark:text-[#19b992] font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] sm:text-xs font-bold leading-none">{lang === 'bn' ? 'সব বিজ্ঞাপন' : 'All Ads'}</span>
          </button>
 
          {/* Categories Button */}
          <button 
            onClick={() => setIsCategoryDrawerOpen(true)}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-colors ${
              isCategoryDrawerOpen ? "text-[#0F4D0F] dark:text-[#19b992] font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] sm:text-xs font-bold leading-none">{lang === 'bn' ? 'ক্যাটাগরি' : 'Category'}</span>
          </button>
 
          {/* Recovered / উদ্ধার হয়েছে Button */}
          <button 
            onClick={() => {
              const newState = !isOnlyShowFoundState;
              setIsOnlyShowFoundState(newState);
              setIsAuthModalOpen(false);
              setIsProfileOpen(false);
              setSelectedAd(null);
              
              if (newState) {
                showNotification(lang === 'bn' ? "উদ্ধারকৃত নোটিশগুলো দেখানো হচ্ছে" : "Showing recovered items");
              } else {
                showNotification(lang === 'bn' ? "সব হারানো নোটিশ দেখানো হচ্ছে" : "Showing active lost ads");
              }
              
              // Scroll to notice feed to see changes immediately
              const feedSec = document.getElementById("search-results-section") || document.getElementById("search-results") || document.getElementById("search-section");
              if (feedSec) {
                feedSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-colors ${
              isOnlyShowFoundState
                ? "text-emerald-600 dark:text-emerald-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <ShieldCheck className={`w-5 h-5 mb-0.5 ${isOnlyShowFoundState ? "text-emerald-600 fill-emerald-500/10" : ""}`} />
            <span className="text-[10px] sm:text-xs font-bold leading-none">{lang === 'bn' ? 'উদ্ধার হয়েছে' : 'Recovered'}</span>
          </button>
 
          {/* Account Button */}
          <button 
            onClick={() => {
              setSelectedAd(null);
              setIsAdminDashboardOpen(false);
              if (!currentUser) {
                setAuthType("login");
                setIsAuthModalOpen(true);
                setIsProfileOpen(false);
              } else {
                setIsProfileOpen(true);
                setIsAuthModalOpen(false);
              }
            }}
            className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-colors ${
              currentUser && isProfileOpen ? "text-[#0F4D0F] dark:text-[#19b992] font-bold" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <UserIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] sm:text-xs font-bold leading-none">
              {currentUser 
                ? (lang === 'bn' ? 'প্রোফাইল' : 'Profile') 
                : (lang === 'bn' ? 'অ্যাকাউন্ট' : 'Account')}
            </span>
          </button>

          {/* Admin Dashboard Button (Only visible to admin) */}
          {currentUser && currentUser.role === "admin" && (
            <button 
              onClick={() => {
                setSelectedAd(null);
                setIsProfileOpen(false);
                setIsAuthModalOpen(false);
                setIsAdminDashboardOpen(!isAdminDashboardOpen);
              }}
              className={`flex flex-col items-center justify-center p-1 cursor-pointer transition-colors ${
                isAdminDashboardOpen
                  ? "text-red-600 dark:text-red-400 font-black animate-pulse"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <LayoutDashboard className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] sm:text-xs font-bold leading-none">{lang === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
            </button>
          )}

        </div>
      </div>

      {/* Confetti Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && <ConfettiCelebration lang={lang} />}
      </AnimatePresence>

    </div>
    </HelmetProvider>
  );
}

interface ConfettiCelebrationProps {
  lang: 'bn' | 'en';
}

function ConfettiCelebration({ lang }: ConfettiCelebrationProps) {
  const colors = ["#10B981", "#F59E0B", "#3B82F6", "#EF4444", "#EC4899", "#8B5CF6", "#0F4D0F", "#FFD700"];
  
  const particles = React.useMemo(() => {
    return Array.from({ length: 140 }).map((_, i) => {
      const angle = Math.random() * 360;
      const distance = 50 + Math.random() * 220;
      const delay = Math.random() * 0.4;
      const size = 6 + Math.random() * 12;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const xDest = Math.cos(angle * Math.PI / 180) * distance;
      const yDest = Math.sin(angle * Math.PI / 180) * distance;
      const rotateDest = 360 + Math.random() * 720;
      
      const shapes = ['circle', 'square', 'emoji', 'emoji-star'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const emojis = ['🎉', '🔑', '🏍️', '📱', '👜', '❤️', '🏆', '⭐', '🎈'];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];

      return {
        id: i,
        xDest,
        yDest,
        rotateDest,
        delay,
        size,
        color,
        shape,
        emoji
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.3, y: 50 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.3, 1.1, 1, 0.8], y: [50, 0, 0, -20] }}
        transition={{ duration: 5, times: [0, 0.1, 0.8, 1], ease: "easeOut" }}
        className="relative z-50 bg-white dark:bg-slate-900 border-2 border-emerald-500 text-slate-900 dark:text-white font-black text-center px-6 py-5 sm:px-10 sm:py-7 rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center space-y-3 pointer-events-auto max-w-[90vw] w-96"
      >
        <div className="text-4xl sm:text-5xl animate-bounce">🎉 🏍️ 📱 🔑 🎉</div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400 uppercase">
          {lang === 'bn' ? 'সফলভাবে উদ্ধার!' : 'Successfully Recovered!'}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
          {lang === 'bn' 
            ? 'অভিনন্দন! আপনার হারিয়ে যাওয়া পণ্যটি সফলভাবে উদ্ধার নিশ্চিত করা হয়েছে!' 
            : 'Congratulations! Your lost item has been successfully marked as recovered!'}
        </p>
        <div className="text-xs font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/60 font-bold">
          {lang === 'bn' ? 'লুকিং ডট বিডি দ্বারা সংরক্ষিত' : 'Protected by Looking.bd'}
        </div>
      </motion.div>

      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: [0, p.xDest, p.xDest * 1.1],
            y: [0, p.yDest, p.yDest + 800],
            scale: [0, 1.2, 1, 0.8, 0],
            rotate: [0, p.rotateDest],
            opacity: [1, 1, 0.9, 0.5, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: p.delay,
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.shape === 'circle' ? p.size : p.shape === 'square' ? p.size : undefined,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '2px' : undefined,
            backgroundColor: (p.shape === 'circle' || p.shape === 'square') ? p.color : undefined,
            fontSize: p.shape.startsWith('emoji') ? `${p.size + 14}px` : undefined,
            zIndex: 90,
          }}
        >
          {p.shape.startsWith('emoji') ? p.emoji : null}
        </motion.div>
      ))}
    </div>
  );
}

// Simple Mock components inline to bypass any outer missing bundle issues beautifully with lucide components
function ForkIconMock(props: { className?: string }) {
  return <BikeIcon className={props.className} />;
}

function GridIconMock(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <rect width="7" height="7" x="3" y="3" rx="1"/>
      <rect width="7" height="7" x="14" y="3" rx="1"/>
      <rect width="7" height="7" x="14" y="14" rx="1"/>
      <rect width="7" height="7" x="3" y="14" rx="1"/>
    </svg>
  );
}
