import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { LostAd, User, Comment } from "./src/types";

// Setup directories
const DATA_DIR = path.join(process.cwd(), "src", "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Pre-seeded Bengali Data
const defaultUsers: User[] = [
  {
    id: "user-1",
    name: "কাজী তানভীর",
    email: "tanvir@gmail.com",
    phone: "01712345678",
    location: "Dhanmondi, Dhaka",
    createdAt: new Date().toISOString()
  },
  {
    id: "user-2",
    name: "রাফিয়া চৌধুরী",
    email: "rafia@gmail.com",
    phone: "01811223344",
    location: "GEC Circle, Chattogram",
    createdAt: new Date().toISOString()
  },
  {
    id: "user-3",
    name: "Rakib Khan",
    email: "rakib@gmail.com",
    phone: "01755667788",
    location: "Dhaka",
    createdAt: new Date().toISOString()
  },
  {
    id: "user-4",
    name: "Mohammad Shahid",
    email: "shahid@gmail.com",
    phone: "01944885522",
    location: "Chattogram",
    createdAt: new Date().toISOString()
  },
  {
    id: "user-5",
    name: "Shuhel Mollah",
    email: "shuhel@gmail.com",
    phone: "01522334455",
    location: "Mymensingh",
    createdAt: new Date().toISOString()
  },
  {
    id: "user-6",
    name: "MD: Masud",
    email: "masud@gmail.com",
    phone: "01311223344",
    location: "Dhaka",
    createdAt: new Date().toISOString()
  },
  {
    id: "user-7",
    name: "Solayman Howlader",
    email: "solayman@gmail.com",
    phone: "01699887766",
    location: "Sylhet",
    createdAt: new Date().toISOString()
  }
];

const defaultAds: LostAd[] = [
  {
    id: "ad-1",
    userId: "user-1",
    userName: "কাজী তানভীর",
    userPhone: "01712345678",
    title: "আইফোন ১৪ প্রো হারিয়েছে (কালো ২০২b সংস্করণ)",
    category: "mobile",
    brand: "Apple",
    modelName: "iPhone 14 Pro",
    serialOrImei: "354896214589632",
    lossDate: "2026-06-15",
    lossLocation: "উত্তরা রবীন্দ্র সরণি, সেক্টর ৭, ঢাকা",
    city: "Dhaka",
    gdNumber: "GD-74291/26",
    gdAuthority: "উত্তরা পশ্চিম থানা",
    reward: 10000,
    hasReward: true,
    proofDetails: "ক্রয় রসিদ ও আইফোনের পেছনের আসল কেসিং বক্স রয়েছে। প্রয়োজনে থ্রি-ডি আইএমইআই ম্যাচ করা যাবে।",
    description: "গত ১৫ই জুন বিকেলে উত্তরা রবীন্দ্র সরণিতে রিকশাযোগে যাওয়ার সময় ফোনটি পকেট থেকে পড়ে যায়। ফোনটিতে অনেক গুরুত্বপূর্ণ অফিসের ফাইল ছিল। আইএমইআই নম্বরটি জিডিতে উল্লেখ আছে। কেউ পেয়ে থাকলে দয়া করে যোগাযোগ করুন। সঠিক প্রমাণ সাপেক্ষে ১০,০০০ টাকা পুরস্কার প্রদান করা হবে।",
    aiVerifiedScore: 92,
    aiExplanation: "১. সঠিক ও পূর্ণাঙ্গ ১৫-ডিজিটের আইএমইআই নম্বর প্রদান করা হয়েছে।\\n২. উত্তরা পশ্চিম থানার বাস্তবসম্মত জিডি নম্বর (GD-74291/26) উল্লিখিত আছে।\\n৩. ক্রয় রসিদ এবং মূল বাক্সের সহজলভ্যতা আদায়ের দাবির বিশ্বাসযোগ্যতা বিপুল বৃদ্ধি করে। তথ্যপ্রমাণ সম্পূর্ণ সন্তোষজনক।",
    safetyTips: "• আইফোনটির কোনো ধরণের লক খোলার চেষ্টা করবেন না, এটি একটি চুরির বা হারানো ডিভাইস হিসেবে চিহ্নিত।\\n• ডিভাইসটি ফেরত প্রদানের সময় একটি জনাকীর্ণ নিরাপদ ও উন্মুক্ত স্থানে দেখা করুন।\\n• উত্তরা পশ্চিম থানার কর্মকর্তার সাথে পরামর্শ সাপেক্ষে ফোনে যোগাযোগ করুন।",
    status: "lost",
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
    comments: [
      {
        id: "comment-1",
        userId: "user-2",
        userName: "রাফিয়া চৌধুরী",
        content: "ভাইয়া, আজ সকালে উত্তরা রাজউক কলেজের কাছে একটা কালো ফোন উদ্ধারের খবর গ্রুপে দেখেছিলাম। রবীন্দ্র সরণি থেকে কাছেই। আপনি কি চেক করে দেখেছেন?",
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        isFounderClaim: false
      }
    ]
  },
  {
    id: "ad-s8",
    userId: "user-3",
    userName: "Rakib Khan",
    userPhone: "01755667788",
    title: "Samsung Galaxy S8",
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S8",
    serialOrImei: "359871142589314",
    lossDate: "2026-06-21",
    lossLocation: "উত্তরা মোড়, ঢাকা বিভাগ",
    city: "Dhaka",
    gdNumber: "GD-9952/26",
    gdAuthority: "উত্তরা মডেল থানা",
    reward: 5000,
    hasReward: true,
    proofDetails: "ক্রয় রসিদ এবং মূল চার্জার বক্সসহ আসল পেপার আছে।",
    description: "Samsung Galaxy S8 মডেলের মোবাইল ফোনটি উত্তরা মোড় সংলগ্ন এলাকায় হারিয়ে গেছে। ফোনটিতে প্রয়োজনীয় ব্যক্তিগত ডক্যুমেন্ট রয়েছে। কোনো নাগরিক খোঁজ পেলে যোগাযোগ করার জন্য বিনীতভাবে অনুরোধ করছি।",
    aiVerifiedScore: 95,
    aiExplanation: "সঠিক আইএমইআই এবং উত্তরা মডেল থানার সাধারণ ডায়রি নম্বর সংযুক্ত করা হয়েছে। প্রমাণের গুণমান সন্তোষজনক।",
    safetyTips: "• টাকা-পয়সা লেনদেনের আগে মোবাইলের আইএমইআই মিলিয়ে দেখুন।\n• উত্তরা মডেল থানার ভেতরে বা জনাকীর্ণ প্রকাশ্য স্থানে দেখা করুন।",
    status: "lost",
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    comments: []
  },
  {
    id: "ad-j2",
    userId: "user-4",
    userName: "Mohammad Shahid",
    userPhone: "01944885522",
    title: "Samsung Galaxy J2",
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy J2",
    serialOrImei: "354112299885544",
    lossDate: "2026-06-20",
    lossLocation: "জিইসি মোড়, চট্টগ্রাম বিভাগ",
    city: "Chattogram",
    gdNumber: "GD-1249/26",
    gdAuthority: "চকবাজার থানা",
    reward: 2000,
    hasReward: true,
    proofDetails: "অরিজিনিয়াল বক্স ও ফোন কেনার ইনভয়েস রশিদ সংরক্ষিত আছে।",
    description: "আমার প্রিয় গোল্ডেন কালার স্যামসাং গ্যালাক্সি জে২ ফোনটি চট্টগ্রাম জিইসি মোড়ে হারিয়ে গেছে। ফোনটিতে দুটি সিমকার্ড সচল ছিল। যদি কেউ উদ্ধার করে থাকেন, অনুগ্রহ করে সরাসরি কল দিন বা হোয়াটসঅ্যাপ করুন।",
    aiVerifiedScore: 89,
    aiExplanation: "রশিদ ভেরিফাইড এবং আইএমইআই সঠিকভাবে এন্ট্রি দেওয়া হয়েছে।",
    safetyTips: "• অবশ্যই ফোনটি অন করে স্ক্রিন ও আইএমইআই চেক করুন।\n• চকবাজার থানার অধীনে প্রকাশ্য স্থানে দেখা করা নিরাপদ।",
    status: "lost",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    comments: []
  },
  {
    id: "ad-note3",
    userId: "user-5",
    userName: "Shuhel Mollah",
    userPhone: "01522334455",
    title: "Samsung Galaxy Note3",
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy Note3",
    serialOrImei: "358741122335588",
    lossDate: "2026-06-19",
    lossLocation: "নতুন বাজার ব্রিজের কাছে, ময়মনসিংহ",
    city: "Mymensingh",
    gdNumber: "GD-4521/26",
    gdAuthority: "কোতোয়ালী থানা, ময়মনসিংহ",
    reward: 4000,
    hasReward: true,
    proofDetails: "আমাদের নিকট আসল লিফলেট এবং ক্রয় রশিদ আছে।",
    description: "স্যামসাং গ্যালাক্সি নোট ৩ (হোয়াইট কালার) ফোনটি ময়মনসিংহের নতুন বাজার ব্রিজের কাছে রাস্তা পার হওয়ার সময় পকেট থেকে পড়ে যায়। খোঁজ দিলে নগদ পুরস্কার দেওয়া হবে।",
    aiVerifiedScore: 90,
    aiExplanation: "কোতোয়ালী থানার রেফারেন্স ডায়রি ও মালিকানা রশিদের বিবরণ শতভাগ খাঁটি ও বিশ্বাসযোগ্য।",
    safetyTips: "• কোনো বিকাশ বা নগদ লেনদেন অগ্রিম করবেন না।\n• কোতোয়ালী রেঞ্জ পুলিশ ফাঁড়ির সামনে নিরাপদ দূরত্বে যোগাযোগ করুন।",
    status: "lost",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    comments: []
  },
  {
    id: "ad-s5",
    userId: "user-6",
    userName: "MD: Masud",
    userPhone: "01311223344",
    title: "Samsung Galaxy S5",
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy S5",
    serialOrImei: "351122883399445",
    lossDate: "2026-06-18",
    lossLocation: "মিরপুর ১০ গোল্ডেন প্লাজা, ঢাকা",
    city: "Dhaka",
    gdNumber: "GD-1102/26",
    gdAuthority: "মিরপুর মডেল থানা",
    reward: 3500,
    hasReward: true,
    proofDetails: "মূল চার্জিং অ্যাডাপ্টার ক্যাবল এবং ক্যাش মেমো কপি আছে।",
    description: "মিরপুর ১০ গোল্ডেন প্লাজমার কাছে কেনাকাটার সময় ব্ল্যাক কালারের স্যামসাং গ্যালাক্সি এস৫ মোবাইলটি পকেট মার হয়েছে। আইএমইআই নম্বরটি মেমো ও বক্সে মিলিয়ে দেখে খোঁজদাতাকে নগদ টাকা প্রদান করা হবে।",
    aiVerifiedScore: 88,
    aiExplanation: "মিরপুর মডেল থানার ডায়রি ও ক্রয়ের প্রমাণ সঠিক রয়েছে।",
    safetyTips: "• ডিভাইসটি অন করে সেটিংসে গিয়ে আইএমইআই ডায়াল করে চেক করুন।\n• মিরপুর গোলচত্বরের জনাকীর্ন স্থানে লেনদেন করুন।",
    status: "lost",
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    comments: []
  },
  {
    id: "ad-z3",
    userId: "user-7",
    userName: "Solayman Howlader",
    userPhone: "01699887766",
    title: "Samsung Galaxy Z3",
    category: "mobile",
    brand: "Samsung",
    modelName: "Galaxy Z3",
    serialOrImei: "358112244558833",
    lossDate: "2026-06-17",
    lossLocation: "কোর্ট পয়েন্ট সংলগ্ন এলাকা, সিলেট",
    city: "Sylhet",
    gdNumber: "GD-844/26",
    gdAuthority: "কোতোয়ালী থানা, সিলেট",
    reward: 8000,
    hasReward: true,
    proofDetails: "অরিজিনাল ইনভয়েস ডকুমেন্ট সংরক্ষিত আছে।",
    description: "সিলেটের কোর্ট পয়েন্ট সংলগ্ন এলাকায় স্যামসাং গ্যালাক্সি জেড৩ ফ্লিপ ফোনটি হারিয়ে যায়। উদ্ধার করতে পারলে নগদ ৮০০০ টাকা পুরস্কার দেওয়া হবে ইনশাআল্লাহ।",
    aiVerifiedScore: 91,
    aiExplanation: "কোতোয়ালী থানার জিডি প্রমাণ এবং আসল ক্রয়ের বিবরণ সম্পূর্ণ সন্তোষজনক।",
    safetyTips: "• টাকা হস্তান্তরের পূর্বে সিলেটের সুপরিচিত কোতোয়ালী জোনের সামনে দেখা করুন।\n• মোবাইলের চার্জিং পোর্ট ও ডিসপ্লে ভালোভাবে দেখে নিন।",
    status: "lost",
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    comments: []
  },
  {
    id: "ad-2",
    userId: "user-2",
    userName: "রাফিয়া চৌধুরী",
    userPhone: "01811223344",
    title: "সুজুকি জিক্সার ১৫৫ সিসি মোটরসাইকেল চুরি হয়েছে",
    category: "bike",
    brand: "Suzuki",
    modelName: "Gixxer 155",
    serialOrImei: "CHASSIS: SZ558459, ENGINE: EN14295",
    lossDate: "2026-06-18",
    lossLocation: "জিইসি মোড় সুপারমার্কেট পার্কিং এলাকা, চট্টগ্রাম",
    city: "Chattogram",
    gdNumber: "GD-558/26",
    gdAuthority: "চকবাজার থানা",
    reward: 15000,
    hasReward: true,
    proofDetails: "মোটরসাইকেলের নীল বই (Bluebook), মূল চাবি ও ট্যাক্স টোকেন আমাদের সঠিক মালিকানার প্রমাণ হিসেবে আছে।",
    description: "জিইসি মোড় সুপারমার্কেটে কেনাকাটা করতে গিয়ে পার্কিংয়ে বাইকটি লক করে রাখি। ঠিক ৩০ মিনিট পর এসে দেখে পার্কিং খালি। বাইকটির নম্বর প্লেট চট-মেট্রো-ল-৫৫৮X। চকবাজার থানায় ঘটনার দিনই সাধারণ ডায়েরি ও অভিযোগ দায়ের করা হয়। খোঁজদাতাকে ১৫,০০০ টাকা পুরস্বৃত করব।",
    aiVerifiedScore: 88,
    aiExplanation: "১. চেসিস ও ইঞ্জিন নম্বর নির্দিষ্ট করে দেওয়া হয়েছে।\\n২. চকবাজার থানায় দায়েরকৃত জিডি নম্বর যুক্ত করা হয়েছে।\\n৩. নীল বই এবং মোটরসাইকেলের মূল মালিকানা কার্ডের প্রমাণ উল্লেখ করায় পোস্টটি অত্যন্ত বিশ্বস্ত ও সত্য হিসেবে নিশ্চিত করা হচ্ছে।",
    safetyTips: "• এই মোটরসাইকেলটি ক্রয়ের ক্ষেত্রে সতর্ক থাকুন। নীল বই যাচাই করা ব্যতীত লেনদেন দণ্ডনীয় অপরাধ।\\n• যদি কেউ গাড়িটির সন্ধান পায়, চকবাজার থানায় অথবা সরাসরি বিজ্ঞাপনে দেয়া নম্বরে অবিলম্বে যোগাযোগ করুন।",
    status: "lost",
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(), // 1 day ago
    comments: []
  },
  {
    id: "ad-3",
    userId: "user-1",
    userName: "কাজী তানভীর",
    userPhone: "01712345678",
    title: "ফিনিক্স সিটি হাইব্রিড বাইসাইকেল হারিয়ে গেছে",
    category: "bicycle",
    brand: "Phoenix",
    modelName: "City Hybrid 2024",
    serialOrImei: "PX-HYBRID-99245",
    lossDate: "2026-06-20",
    lossLocation: "شاہجاলাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় গেট সাজু ল্যাব সংলগ্ন, সিলেট",
    city: "Sylhet",
    gdNumber: "GD-8402/26",
    gdAuthority: "জালালাবাদ থানা, সিলেট",
    reward: 3000,
    hasReward: true,
    proofDetails: "ক্রয় মেমো এবং সাইকেলের ফ্রেমের তলার খোদাই করা PX সিরিজের সিরিয়াল নম্বরের ছবি আমাদের নিকট সংরক্ষিত আছে।",
    description: "আমার শখের লাল-কালো ফিনিক্স সাইকেলটি শাবিপ্রবি মেইন গেটের পাশে একটি দোকানের সামনে তালাবদ্ধ রাখা ছিল। কে বা কারা লক ভেঙে সাইকেলটি নিয়ে যায়। সাইকেলের হ্যান্ডেলবারে লাল রঙের রিং বেল লাগানো ছিল এবং পেছনের মাডগার্ডে একটি নিওন রিফ্লেক্টর স্টিকার লাগানো। দয়া করে ফিরে পেতে সাহায্য করুন।",
    aiVerifiedScore: 85,
    aiExplanation: "১. জালালাবাদ থানায় দায়েরকৃত জিডি নম্বর যুক্ত করা আছে।\\n২. সাইকেলের ফ্রেম সিরিয়াল নম্বর এবং ক্রয় মেমো মালিকানার প্রমাণ দেয়।\\n৩. দৃশ্যমান বৈশিষ্ট্যাবলী (যেমন: নিওন স্টিকার, লাল রিং বেল) সাইকেলটি চটজলদি শনাক্ত করতে সহায়ক ভূমিকা রাখবে।",
    safetyTips: "• সাইকেলটি কেউ কম দামে পার্ক বা সেকেন্ডহ্যান্ড বাজারে বিক্রির চেষ্টা করলে ক্রেতা হিসেবে এটি বয়কট করুন।\\n• বিজ্ঞাপনের যোগাযোগের নম্বরে মালিককে প্রকৃত রসিদের মিল দেখে সাইকেল সরবরাহ করতে আহবান জানানো যাচ্ছে।",
    status: "lost",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
    comments: []
  }
];

// Load Database
let db = {
  users: defaultUsers,
  ads: defaultAds
};

if (fs.existsSync(DB_FILE)) {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    db = JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse database file. Reverting to memory.", e);
  }
} else {
  saveDb();
}

// Normalize roles, status, and approvalStatus for robust runtime backwards-compatibility
db.users = db.users.map((u: any) => {
  const normalizedUser = {
    role: "user",
    status: "active",
    ...u
  };
  // Force কাজী তানভীর (tanvir@gmail.com) and Nazmul Alam to be the admin
  if (normalizedUser.email && (normalizedUser.email.toLowerCase() === "tanvir@gmail.com" || normalizedUser.email.toLowerCase() === "nazmul.alam.official@gmail.com")) {
    normalizedUser.role = "admin";
  }
  return normalizedUser;
});

db.ads = db.ads.map((a: any, idx: number) => ({
  approvalStatus: "approved",
  views: typeof a.views === "number" ? a.views : Math.max(18, 145 - idx * 19),
  ...a
}));

saveDb();

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to write to database file", e);
  }
}

// Gemini API helper
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });
    }
  }
  return aiClient;
}

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable CORS and increase body limits for hosting / base64 image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Accounts API
app.post("/api/auth/register", (req, res) => {
  const { name, email, phone, location, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "সবগুলো ঘর (নাম, ইমেল, ফোন নম্বর এবং পাসওয়ার্ড) সঠিকভাবে পূরণ করুন।" });
  }

  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.phone === phone);
  if (existingUser) {
    return res.status(400).json({ error: "এই ইমেল বা মোবাইল নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা হয়েছে।" });
  }

  const isEmailAdmin = email.toLowerCase() === "tanvir@gmail.com" || email.toLowerCase() === "nazmul.alam.official@gmail.com";
  const newUser: any = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone,
    location: location || "বাংলাদেশ",
    password,
    role: isEmailAdmin ? "admin" : "user",
    status: "active",
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb();
  res.json({ status: "success", user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, location: newUser.location, role: newUser.role, status: newUser.status, createdAt: newUser.createdAt } });
});

app.post("/api/auth/login", (req, res) => {
  const { emailOrPhone, password } = req.body;
  if (!emailOrPhone || !password) {
    return res.status(400).json({ error: "ইমেল/মোবাইল নম্বর এবং পাসওয়ার্ড প্রদান করুন।" });
  }

  const user = db.users.find(u => 
    u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone
  ) as any;

  if (!user) {
    return res.status(404).json({ error: "অ্যাকাউন্টটি খুঁজে পাওয়া যায়নি। দয়া করে রেজিস্ট্রেশন করুন।" });
  }

  if (user.status === "suspended") {
    return res.status(403).json({ error: "আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত (Suspended) করা হয়েছে।" });
  }

  const userPassword = user.password || "123456"; // Default password for pre-seeded users
  if (password !== userPassword) {
    return res.status(401).json({ error: "ভুল পাসওয়ার্ড! দয়া করে সঠিক পাসওয়ার্ড দিন।" });
  }

  res.json({ status: "success", user: { id: user.id, name: user.name, email: user.email, phone: user.phone, location: user.location, role: user.role || "user", status: user.status || "active", createdAt: user.createdAt } });
});

// Ads API: Read All
app.get("/api/ads", (req, res) => {
  const { category, city, thana, unionName, village, query, userId, showAll } = req.query;
  let filtered = [...db.ads];

  if (userId) {
    filtered = filtered.filter(ad => ad.userId === userId);
  } else if (showAll !== "true") {
    filtered = filtered.filter(ad => !ad.approvalStatus || ad.approvalStatus === "approved");
  }

  if (category && category !== "all") {
    filtered = filtered.filter(ad => ad.category === category);
  }

  if (city && city !== "all") {
    filtered = filtered.filter(ad => ad.city.toLowerCase() === (city as string).toLowerCase());
  }

  if (thana && thana !== "all") {
    filtered = filtered.filter(ad => ad.thana && ad.thana.toLowerCase() === (thana as string).toLowerCase());
  }

  if (unionName) {
    filtered = filtered.filter(ad => ad.unionName && ad.unionName.toLowerCase().includes((unionName as string).toLowerCase()));
  }

  if (village) {
    filtered = filtered.filter(ad => ad.village && ad.village.toLowerCase().includes((village as string).toLowerCase()));
  }

  if (query) {
    const q = (query as string).toLowerCase();
    filtered = filtered.filter(ad => 
      ad.title.toLowerCase().includes(q) ||
      ad.description.toLowerCase().includes(q) ||
      ad.brand.toLowerCase().includes(q) ||
      ad.modelName.toLowerCase().includes(q) ||
      ad.serialOrImei.toLowerCase().includes(q) ||
      ad.gdNumber.toLowerCase().includes(q) ||
      ad.lossLocation.toLowerCase().includes(q) ||
      (ad.thana && ad.thana.toLowerCase().includes(q)) ||
      (ad.unionName && ad.unionName.toLowerCase().includes(q)) ||
      (ad.village && ad.village.toLowerCase().includes(q))
    );
  }

  // Sort by createdAt descending
  filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(filtered);
});

// Ads API: Details
app.get("/api/ads/:id", (req, res) => {
  const ad = db.ads.find(a => a.id === req.params.id);
  if (!ad) {
    return res.status(404).json({ error: "বিজ্ঞপ্তিটি খুঁজে পাওয়া যায়নি।" });
  }
  ad.views = (ad.views || 0) + 1;
  saveDb();
  res.json(ad);
});

// Ads API: Increment View
app.post("/api/ads/:id/view", (req, res) => {
  const ad = db.ads.find(a => a.id === req.params.id);
  if (!ad) {
    return res.status(404).json({ error: "বিজ্ঞপ্তিটি খুঁজে পাওয়া যায়নি।" });
  }
  ad.views = (ad.views || 0) + 1;
  saveDb();
  res.json({ views: ad.views });
});

// Ads API: Create Post (Integrated with server-side Gemini to verify proper evidence!)
app.post("/api/ads", async (req, res) => {
  const {
    userId,
    title,
    category,
    brand,
    modelName,
    serialOrImei,
    lossDate,
    lossLocation,
    city,
    thana,
    unionName,
    village,
    gdNumber,
    gdAuthority,
    reward,
    hasReward,
    proofDetails,
    description,
    images,
    gdImage
  } = req.body;

  // Validate fields
  if (!userId || !title || !category || !lossDate || !lossLocation || !city || !description) {
    return res.status(400).json({ error: "প্রয়োজনীয় ফিল্ডসমূহ পূরণ করুন।" });
  }

  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "অননুমোদিত ব্যবহারকারী।" });
  }

  if (user.status === "suspended") {
    return res.status(403).json({ error: "আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। আপনি নতুন বিজ্ঞাপন পোস্ট করতে পারবেন না।" });
  }

  // Calculate default values if Gemini is offline
  let aiVerifiedScore = 65;
  let aiExplanation = "প্রদত্ত তথ্যের উপর ভিত্তি করে প্রাথমিক নিরাপত্তা পর্যালোচনা সম্পূর্ণ হয়েছে। আরো সুনির্দিষ্ট প্রমাণাদি যেমন জিডি অনুলিপি, ছবি বা ক্রয় রসিদ যুক্ত করলে এই বিশ্বস্ততা স্কোরের মান আরও বুদ্ধিমান মূল্যায়ন অর্জন করবে।";
  let safetyTips = "• কোনো অপরিচিত ব্যক্তি ডিভাইসের সন্ধান দিলে একা দেখা করতে যাবেন না।\\n• ডিভাইস ফেরত পাওয়ার সময় পুলিশ প্রশাসনকে জানাতে পারেন।\\n• নগদ বা অগ্রিম অর্থ লেনদেন এড়িয়ে চলুন।";

  // Trigger Gemini API
  const gemini = getGemini();
  if (gemini) {
    try {
      const prompt = `You are an expert safety inspector in Bangladesh for a Lost & Found classifieds platform (similar to Bikroy but for missing/stolen high-value things). Our goal is to verify the "proof of ownership" / "evidence of loss" (সঠিক তথ্যপ্রমাণ) that users submit to determine if this is a genuine claim or potential fraud.
Analyze the following user-submitted lost item details:
Category: ${category}
Title: ${title}
Brand: ${brand || "Not custom spec"}
Model: ${modelName || "Not custom spec"}
Serial Number / IMEI (if applicable): ${serialOrImei || "None provided"}
District/City: ${city}
Thana/Upazila: ${thana || "None provided"}
Union: ${unionName || "None provided"}
Village: ${village || "None provided"}
Loss Micro-location: ${lossLocation}
GD (General Diary) Number: ${gdNumber || "None provided"}
GD Police Thana/Station Authority: ${gdAuthority || "None provided"}
Reward: ${hasReward ? `${reward} BDT` : "No financial reward"}
Detailed description of loss: ${description}
Owner's claim of extra proof: ${proofDetails || "None provided"}

Perform these security reviews:
1. Valid credentials check: Is there a realistic GD Number or Police Station Authority provided? If realistically cited like 'Adabor Thana' or 'উত্তরা থানা' with a GD reference, raise the score.
2. Serial or IMEI check: For mobiles, check if it looks like a valid 15-digit number. For bikes or cars, does engine/chassis number format match typical systems?
3. Location accuracy: Does the Thana/Union/Village location details match realistic regions?
4. Sincerity/Detail of Loss check: Is the loss explanation detailed enough to feel authentic? Or is it empty?
5. Extra proof validity: Do they reference receipts, boxes, or photo backups?

Based on your analysis, return a strict JSON response. Do NOT include markdown delimiters (\`\`\`json etc.). Return ONLY the JSON text string.
Required JSON schema:
{
  "score": number, // an integer from 0 to 100 representing the credibility/verification level
  "explanation": "string", // A clean, human-like, helpful analysis in elegant Bengali, explaining your analysis of their serial number, Thana details, and GD details. Keep it polite.
  "safetyTips": "string" // Practical advice in elegant Bengali for this specific search case. (For example, warn them about lock bypasses or advance fee scams. Use Bullet points separated by '\\n').
}`;

      const response = await gemini.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "";
      try {
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        if (typeof parsed.score === "number" && parsed.explanation && parsed.safetyTips) {
          aiVerifiedScore = parsed.score;
          aiExplanation = parsed.explanation;
          safetyTips = parsed.safetyTips;
        }
      } catch (err) {
        console.warn("Failed to parse Gemini JSON, but request succeeded. Response text was:", responseText, err);
      }
    } catch (e) {
      console.error("Gemini API call failed", e);
    }
  } else {
    // If key missing, update with realistic custom calculations for dynamic response based on provided parameters!
    if (gdNumber && gdAuthority) {
      aiVerifiedScore += 15;
    }
    if (serialOrImei && serialOrImei.length > 5) {
      aiVerifiedScore += 15;
    }
    if (proofDetails && proofDetails.length > 20) {
      aiVerifiedScore += 5;
    }
    if (aiVerifiedScore > 100) aiVerifiedScore = 100;
  }

  const newAd: LostAd = {
    id: `ad-${Date.now()}`,
    userId,
    userName: user.name,
    userPhone: user.phone,
    title,
    category,
    brand: brand || "",
    modelName: modelName || "",
    serialOrImei: serialOrImei || "",
    lossDate,
    lossLocation,
    city,
    thana: thana || "",
    unionName: unionName || "",
    village: village || "",
    gdNumber: gdNumber || "",
    gdAuthority: gdAuthority || "",
    reward: Number(reward) || 0,
    hasReward: !!hasReward,
    proofDetails: proofDetails || "",
    description,
    aiVerifiedScore,
    aiExplanation,
    safetyTips,
    status: "lost",
    images: Array.isArray(images) ? images : [],
    gdImage: gdImage || "",
    views: 1,
    createdAt: new Date().toISOString(),
    comments: [],
    approvalStatus: "pending"
  };

  db.ads.push(newAd);
  saveDb();
  res.json({ status: "success", ad: newAd });
});

// Ads API: Add Comment / Founder Claim
app.post("/api/ads/:id/comments", (req, res) => {
  const { userId, content, isFounderClaim } = req.body;
  if (!userId || !content) {
    return res.status(400).json({ error: "মন্তব্য বা বিবরণের অংশ ফাঁকা হতে পারবে না।" });
  }

  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "অননুমোদিত ব্যবহারকারী।" });
  }

  if (user.status === "suspended") {
    return res.status(403).json({ error: "আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। আপনি কোনো মন্তব্য বা দাবি করতে পারবেন না।" });
  }

  const adIndex = db.ads.findIndex(a => a.id === req.params.id);
  if (adIndex === -1) {
    return res.status(404).json({ error: "বিজ্ঞপ্তিটি খুঁজে পাওয়া যায়নি।" });
  }

  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    userId,
    userName: user.name,
    content,
    createdAt: new Date().toISOString(),
    isFounderClaim: !!isFounderClaim
  };

  db.ads[adIndex].comments.push(newComment);
  saveDb();
  res.json({ status: "success", comment: newComment, ad: db.ads[adIndex] });
});

// Ads API: Mark Ad as Found
app.post("/api/ads/:id/found", (req, res) => {
  const { userId, reunitedImage, reunitedStory } = req.body;
  const adIndex = db.ads.findIndex(a => a.id === req.params.id);
  if (adIndex === -1) {
    return res.status(404).json({ error: "বিজ্ঞপ্তিটি পাওয়া যায়নি।" });
  }

  const ad = db.ads[adIndex];
  if (ad.userId !== userId) {
    return res.status(403).json({ error: "আপনি এই বিজ্ঞপ্তির মালিক নন।" });
  }

  ad.status = "found";
  if (reunitedImage) ad.reunitedImage = reunitedImage;
  if (reunitedStory) ad.reunitedStory = reunitedStory;
  
  saveDb();
  res.json({ status: "success", ad });
});

// Admin Dashboard APIs
app.get("/api/admin/users", (req, res) => {
  const usersList = db.users.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    location: u.location,
    role: u.role || "user",
    status: u.status || "active",
    createdAt: u.createdAt
  }));
  res.json(usersList);
});

app.post("/api/admin/users/:id/status", (req, res) => {
  const { status } = req.body;
  if (status !== "active" && status !== "suspended") {
    return res.status(400).json({ error: "অবৈধ স্ট্যাটাস ভ্যালু।" });
  }

  const userIndex = db.users.findIndex(u => u.id === req.params.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "ব্যবহারকারী খুঁজে পাওয়া যায়নি।" });
  }

  db.users[userIndex].status = status;
  saveDb();
  res.json({ status: "success", user: { id: db.users[userIndex].id, status: db.users[userIndex].status } });
});

app.post("/api/admin/ads/:id/approval", (req, res) => {
  const { approvalStatus } = req.body;
  if (approvalStatus !== "approved" && approvalStatus !== "rejected" && approvalStatus !== "pending") {
    return res.status(400).json({ error: "অবৈধ অনুমোদন ভ্যালু।" });
  }

  const adIndex = db.ads.findIndex(a => a.id === req.params.id);
  if (adIndex === -1) {
    return res.status(404).json({ error: "বিজ্ঞপ্তিটি খুঁজে পাওয়া যায়নি।" });
  }

  db.ads[adIndex].approvalStatus = approvalStatus;
  saveDb();
  res.json({ status: "success", ad: db.ads[adIndex] });
});

// Admin Database Backup & Restore API for Easy Hosting Migrations
app.get("/api/admin/db/export", (req, res) => {
  res.setHeader("Content-Disposition", "attachment; filename=db_backup.json");
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(db, null, 2));
});

app.post("/api/admin/db/import", (req, res) => {
  const incomingDb = req.body;
  if (!incomingDb || !Array.isArray(incomingDb.users) || !Array.isArray(incomingDb.ads)) {
    return res.status(400).json({ error: "Invalid backup format. Ensure both users and ads arrays are present." });
  }
  
  db = {
    users: incomingDb.users,
    ads: incomingDb.ads
  };
  saveDb();
  res.json({ status: "success", message: "Database restored successfully!", counts: { users: db.users.length, ads: db.ads.length } });
});

// Vite Setup for Development vs Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lost & Found Server started at http://localhost:${PORT}`);
  });
}

startServer();
