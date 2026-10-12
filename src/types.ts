export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  createdAt: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'suspended';
}

export type Category = 'mobile' | 'bike' | 'car' | 'bicycle' | 'other';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  isFounderClaim: boolean;
}

export interface LostAd {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  title: string;
  category: Category;
  brand: string;
  modelName: string;
  serialOrImei: string;
  lossDate: string;
  lossLocation: string; // Detailed area
  city: string; // Main city: Dhaka, Chattogram, etc.
  thana?: string; // Police Station / Upazila
  unionName?: string; // Union Council
  village?: string; // Village / Ward / Area
  gdNumber: string; // Police GD Number
  gdAuthority: string; // Name of police station
  reward: number; // 0 if none
  hasReward: boolean;
  proofDetails: string; // Explanation of extra proof
  description: string;
  aiVerifiedScore: number; // calculated by Gemini or mock fallback
  aiExplanation: string; // explanation of proof quality/analysis in Bengali
  safetyTips: string; // instructions to return safely in Bengali
  status: 'lost' | 'found'; // changed when recovered
  images?: string[]; // list of captured/uploaded images
  gdImage?: string; // base64 representation of uploaded Police GD document
  reunitedImage?: string; // base64 image of reunion
  reunitedStory?: string; // human description of success
  views?: number; // total view counts
  createdAt: string;
  comments: Comment[];
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export interface LocationFilter {
  id: string;
  name: string;
  banglaName: string;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  banglaName: string;
  iconName: string;
}
