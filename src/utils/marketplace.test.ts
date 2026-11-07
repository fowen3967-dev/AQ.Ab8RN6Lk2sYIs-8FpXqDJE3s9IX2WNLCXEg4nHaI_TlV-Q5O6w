import test from 'node:test';
import assert from 'node:assert/strict';
import { formatKina, calculateMonthlyRevenue, calculateSellerTrustScore, filterListings } from './marketplace';
import { Listing } from '../types/marketplace';

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
