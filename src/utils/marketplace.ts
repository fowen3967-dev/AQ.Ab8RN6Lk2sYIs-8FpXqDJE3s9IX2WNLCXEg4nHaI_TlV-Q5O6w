import { Listing, RevenueProjection, Seller } from '../types/marketplace';

/**
 * Format PNG Kina currency with standard thousands separators and symbol K
 */
export function formatKina(amount: number): string {
  if (isNaN(amount) || amount === 0) {
    return 'K0';
  }
  return `K${amount.toLocaleString('en-US')}`;
}

/**
 * Calculate total monthly revenue from packages based on model in business plan
 */
export function calculateMonthlyRevenue(model: RevenueProjection): number {
  const featured = model.featuredCount * model.featuredRate;
  const business = model.businessCount * model.businessRate;
  const premium = model.premiumCount * model.premiumRate;
  return featured + business + premium;
}

/**
 * Calculate seller trust score based on verification and activity
 */
export function calculateSellerTrustScore(seller: Seller): {
  score: number;
  badgeLevel: 'Trusted Gold' | 'Verified Seller' | 'Community Member';
} {
  let score = 50;
  if (seller.isVerified) score += 30;
  if (seller.isBusiness) score += 10;
  if (seller.activeAdsCount >= 5) score += 10;
  score = Math.min(100, Math.max(0, score));

  if (score >= 90) {
    return { score, badgeLevel: 'Trusted Gold' };
  }
  if (score >= 70) {
    return { score, badgeLevel: 'Verified Seller' };
  }
  return { score, badgeLevel: 'Community Member' };
}

/**
 * Filter listings by search query, category, province, and featured state
 */
export function filterListings(
  listings: Listing[],
  options: {
    query?: string;
    category?: string;
    province?: string;
    condition?: string;
    featuredOnly?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  }
): Listing[] {
  return listings
    .filter((item) => {
      // Must be approved to show on public storefront
      if (!item.isApproved) return false;

      // Category filter
      if (options.category && options.category !== 'all' && item.category !== options.category) {
        return false;
      }

      // Province filter
      if (options.province && options.province !== 'all' && item.province !== options.province) {
        return false;
      }

      // Condition filter
      if (options.condition && options.condition !== 'all' && item.condition !== options.condition) {
        return false;
      }

      // Featured only
      if (options.featuredOnly && !item.isFeatured) {
        return false;
      }

      // Price filter
      if (options.minPrice !== undefined && item.price < options.minPrice) {
        return false;
      }
      if (options.maxPrice !== undefined && item.price > options.maxPrice) {
        return false;
      }

      // Text query
      if (options.query && options.query.trim() !== '') {
        const q = options.query.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchDistrict = item.district.toLowerCase().includes(q);
        const matchProvince = item.province.toLowerCase().includes(q);
        const matchSeller = item.seller.name.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchDistrict && !matchProvince && !matchSeller) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // Featured listings always have priority placement when sort is default/newest
      if (options.sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (options.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (options.sortBy === 'popular') {
        return (b.views + b.saves * 3) - (a.views + a.saves * 3);
      }
      // default newest with featured priority
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
}
