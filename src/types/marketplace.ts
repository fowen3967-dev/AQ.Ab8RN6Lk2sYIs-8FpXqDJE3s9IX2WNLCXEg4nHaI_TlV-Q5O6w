export type CategoryId =
  | 'vehicles'
  | 'real-estate'
  | 'electronics'
  | 'fashion'
  | 'food-agriculture'
  | 'home-furniture'
  | 'hardware'
  | 'services';

export interface Category {
  id: CategoryId;
  name: string;
  iconName: string;
  count: number;
  image: string;
  description: string;
}

export type ItemCondition = 'Brand New' | 'Like New' | 'Used - Good' | 'Used - Fair' | 'For Rent' | 'Service';

export interface Seller {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  isVerified: boolean;
  isBusiness: boolean;
  businessName?: string;
  packageTier: 'free' | 'business' | 'premium';
  location: string;
  joinedDate: string;
  activeAdsCount: number;
  rating: number;
  reviewCount?: number;
}

export interface SellerReview {
  id: string;
  sellerId: string;
  listingId?: string;
  authorName: string;
  province?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  isVerifiedBuyer?: boolean;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  priceType: 'fixed' | 'negotiable' | 'per-month' | 'contact';
  category: CategoryId;
  condition: ItemCondition;
  province: string;
  district: string;
  description: string;
  images: string[];
  seller: Seller;
  isFeatured: boolean;
  isApproved: boolean;
  views: number;
  saves: number;
  createdAt: string;
}

export interface FounderSettings {
  appName: string;
  tagline: string;
  launchCity: 'Port Moresby first' | 'Madang first' | 'Nationwide from day one';
  budgetTier: 'Under K1,000' | 'K1,000–K3,000' | 'K3,000–K10,000' | 'Over K10,000' | 'Free prototype';
  showWeeklyResearch: boolean;
}

export interface RevenueProjection {
  featuredCount: number;
  featuredRate: number; // K10
  businessCount: number;
  businessRate: number; // K50
  premiumCount: number;
  premiumRate: number; // K100
}

export interface PriceAlert {
  id: string;
  listingId: string;
  listingTitle: string;
  currentPrice: number;
  targetPrice: number;
  notifyContact: string; // phone/WhatsApp or email
  createdAt: string;
  isActive: boolean;
}
