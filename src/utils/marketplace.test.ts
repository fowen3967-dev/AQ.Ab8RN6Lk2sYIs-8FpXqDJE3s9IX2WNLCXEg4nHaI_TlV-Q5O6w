import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatKina,
  calculateMonthlyRevenue,
  calculateSellerTrustScore,
  filterListings,
  calculatePriceAlertSavings,
  checkPriceAlertTrigger,
  calculateSellerAverageRating,
  getRatingStarsBreakdown,
} from './marketplace';
import { Listing, SellerReview } from '../types/marketplace';

test('formatKina formats numbers with K prefix and commas', () => {
  assert.equal(formatKina(0), 'K0');
  assert.equal(formatKina(85), 'K85');
  assert.equal(formatKina(1200), 'K1,200');
  assert.equal(formatKina(18000), 'K18,000');
  assert.equal(formatKina(450000), 'K450,000');
});

test('calculateMonthlyRevenue correctly calculates plan packages', () => {
  const model = {
    featuredCount: 100,
    featuredRate: 10,
    businessCount: 30,
    businessRate: 50,
    premiumCount: 10,
    premiumRate: 100,
  };
  // 100 * 10 = 1,000
  // 30 * 50 = 1,500
  // 10 * 100 = 1,000
  // Total = K3,500 as in business blueprint
  assert.equal(calculateMonthlyRevenue(model), 3500);
});

test('calculateSellerTrustScore ranks verified and active sellers higher', () => {
  const unverified = {
    id: 's1',
    name: 'John Doe',
    phone: '+675 7000 1234',
    whatsapp: '+67570001234',
    isVerified: false,
    isBusiness: false,
    packageTier: 'free' as const,
    location: 'Port Moresby',
    joinedDate: '2026-01-01',
    activeAdsCount: 1,
    rating: 4.0,
  };
  const verified = {
    ...unverified,
    isVerified: true,
    isBusiness: true,
    activeAdsCount: 6,
  };

  const unverifiedResult = calculateSellerTrustScore(unverified);
  const verifiedResult = calculateSellerTrustScore(verified);

  assert.equal(unverifiedResult.score, 50);
  assert.equal(unverifiedResult.badgeLevel, 'Community Member');

  assert.equal(verifiedResult.score, 100);
  assert.equal(verifiedResult.badgeLevel, 'Trusted Gold');
});

test('filterListings respects province and category filters', () => {
  const sampleListings: Listing[] = [
    {
      id: '1',
      title: 'Nissan Sentra SV',
      price: 18000,
      priceType: 'fixed',
      category: 'vehicles',
      condition: 'Used - Good',
      province: 'National Capital District',
      district: 'Port Moresby',
      description: 'Reliable sedan',
      images: ['/img1.jpg'],
      seller: {
        id: 's1',
        name: 'PNG Motors Seller',
        phone: '+675 7123 4567',
        whatsapp: '+67571234567',
        isVerified: true,
        isBusiness: true,
        packageTier: 'business',
        location: 'Waigani, NCD',
        joinedDate: '2025-10-12',
        activeAdsCount: 4,
        rating: 4.8,
      },
      isFeatured: true,
      isApproved: true,
      views: 120,
      saves: 15,
      createdAt: '2026-03-01',
    },
    {
      id: '2',
      title: '3-Bed House Tranquility',
      price: 450000,
      priceType: 'fixed',
      category: 'real-estate',
      condition: 'Used - Good',
      province: 'Madang',
      district: 'Madang Town',
      description: 'Beachside home',
      images: ['/img2.jpg'],
      seller: {
        id: 's2',
        name: 'Madang Properties',
        phone: '+675 7987 6543',
        whatsapp: '+67579876543',
        isVerified: true,
        isBusiness: true,
        packageTier: 'premium',
        location: 'Madang Town',
        joinedDate: '2025-08-04',
        activeAdsCount: 8,
        rating: 4.9,
      },
      isFeatured: false,
      isApproved: true,
      views: 200,
      saves: 30,
      createdAt: '2026-03-02',
    },
  ];

  const vehiclesOnly = filterListings(sampleListings, { category: 'vehicles' });
  assert.equal(vehiclesOnly.length, 1);
  assert.equal(vehiclesOnly[0].id, '1');

  const madangOnly = filterListings(sampleListings, { province: 'Madang' });
  assert.equal(madangOnly.length, 1);
  assert.equal(madangOnly[0].id, '2');

  const textSearch = filterListings(sampleListings, { query: 'sedan' });
  assert.equal(textSearch.length, 1);
  assert.equal(textSearch[0].id, '1');
});

test('calculatePriceAlertSavings calculates absolute and percentage discounts', () => {
  // Current K100,000, target K80,000 -> K20,000 savings (20%)
  const savings = calculatePriceAlertSavings(100000, 80000);
  assert.equal(savings.savingsAmount, 20000);
  assert.equal(savings.savingsPercent, 20);

  // If target >= current, savings should be 0
  const noSavings = calculatePriceAlertSavings(18000, 18000);
  assert.equal(noSavings.savingsAmount, 0);
  assert.equal(noSavings.savingsPercent, 0);
});

test('checkPriceAlertTrigger triggers only when new price is at or below target', () => {
  assert.equal(checkPriceAlertTrigger(15000, 14000), true);
  assert.equal(checkPriceAlertTrigger(15000, 15000), true);
  assert.equal(checkPriceAlertTrigger(15000, 16000), false);
  assert.equal(checkPriceAlertTrigger(15000, 0), false);
});

test('calculateSellerAverageRating returns fallback when no reviews exist', () => {
  const result = calculateSellerAverageRating([], 4.8);
  assert.equal(result.average, 4.8);
  assert.equal(result.count, 0);
});

test('calculateSellerAverageRating calculates correct average and count', () => {
  const sampleReviews: SellerReview[] = [
    {
      id: 'rev-1',
      sellerId: 'sel-01',
      authorName: 'Gabriel B.',
      rating: 5,
      comment: 'Excellent seller, inspected car at Waigani.',
      createdAt: '2026-03-01',
      isVerifiedBuyer: true,
    },
    {
      id: 'rev-2',
      sellerId: 'sel-01',
      authorName: 'Mary R.',
      rating: 4,
      comment: 'Very responsive on WhatsApp, fair negotiation.',
      createdAt: '2026-03-02',
      isVerifiedBuyer: true,
    },
    {
      id: 'rev-3',
      sellerId: 'sel-01',
      authorName: 'Alois P.',
      rating: 5,
      comment: 'Honest seller with genuine ownership documents.',
      createdAt: '2026-03-03',
      isVerifiedBuyer: true,
    },
  ];

  // (5 + 4 + 5) / 3 = 14 / 3 = 4.6666... -> 4.7
  const result = calculateSellerAverageRating(sampleReviews);
  assert.equal(result.average, 4.7);
  assert.equal(result.count, 3);
});

test('getRatingStarsBreakdown tallies individual stars accurately', () => {
  const sampleReviews: SellerReview[] = [
    { id: '1', sellerId: 's', authorName: 'A', rating: 5, comment: '', createdAt: '' },
    { id: '2', sellerId: 's', authorName: 'B', rating: 5, comment: '', createdAt: '' },
    { id: '3', sellerId: 's', authorName: 'C', rating: 4, comment: '', createdAt: '' },
    { id: '4', sellerId: 's', authorName: 'D', rating: 1, comment: '', createdAt: '' },
  ];
  const breakdown = getRatingStarsBreakdown(sampleReviews);
  assert.equal(breakdown[5], 2);
  assert.equal(breakdown[4], 1);
  assert.equal(breakdown[3], 0);
  assert.equal(breakdown[2], 0);
  assert.equal(breakdown[1], 1);
});

