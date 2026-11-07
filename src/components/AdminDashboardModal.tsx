import React, { useState } from 'react';
import { Listing, RevenueProjection } from '../types/marketplace';
import { formatKina, calculateMonthlyRevenue } from '../utils/marketplace';
import {
  X,
  ShieldCheck,
  TrendingUp,
  Check,
  Trash2,
  Sparkles,
  BarChart3,
  Users,
  Coins,
  DollarSign,
  AlertOctagon,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: Listing[];
  onToggleApproval: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onDeleteListing: (id: string) => void;
  onToggleVerifySeller: (sellerId: string) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  listings,
  onToggleApproval,
  onToggleFeatured,
  onDeleteListing,
  onToggleVerifySeller,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'revenue' | 'moderation'>('revenue');

  // Revenue model simulation state matching blueprint targets
  const [revenueModel, setRevenueModel] = useState<RevenueProjection>({
    featuredCount: 100,
    featuredRate: 10,
    businessCount: 30,
    businessRate: 50,
    premiumCount: 10,
    premiumRate: 100,
  });

  if (!isOpen) return null;

  const currentMonthlyRevenue = calculateMonthlyRevenue(revenueModel);
  const annualizedRevenue = currentMonthlyRevenue * 12;

  const totalListings = listings.length;
  const approvedListings = listings.filter((l) => l.isApproved).length;
  const featuredCount = listings.filter((l) => l.isFeatured).length;
  const verifiedSellersCount = Array.from(new Set(listings.filter((l) => l.seller.isVerified).map((l) => l.seller.id))).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 font-display font-bold flex items-center justify-center text-sm">
              PM
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Pawa Market Administrator Dashboard
              </h3>
              <p className="text-xs text-stone-400">
                Business control, revenue projections, and moderation management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('revenue')}
            className={`py-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'revenue'
                ? 'border-amber-500 text-amber-700 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Revenue Model & Projections (K3,500/mo)</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`py-3 px-2 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'listings'
                ? 'border-amber-500 text-amber-700 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>All Listings Moderation ({totalListings})</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Top KPI Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block">Live Listings</span>
              <div className="text-2xl font-bold font-display text-stone-900 mt-1 tabular-nums">
                {approvedListings}
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">Across 22 Provinces</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block">Featured Ads</span>
              <div className="text-2xl font-bold font-display text-amber-600 mt-1 tabular-nums">
                {featuredCount}
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">K10 per listing</span>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 font-medium block">Verified Sellers</span>
              <div className="text-2xl font-bold font-display text-emerald-600 mt-1 tabular-nums">
                {verifiedSellersCount}
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">Phone & ID Verified</span>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 font-medium block">Projected Monthly</span>
              <div className="text-2xl font-bold font-display text-stone-950 mt-1 tabular-nums">
                {formatKina(currentMonthlyRevenue)}
              </div>
              <span className="text-[11px] text-amber-700 mt-0.5 block">
                {formatKina(annualizedRevenue)} / year
              </span>
            </div>
          </div>

          {activeTab === 'revenue' && (
            <div className="space-y-6">
              {/* Business Blueprint Revenue Breakdown */}
              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h4 className="font-bold text-stone-900 text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-500" />
                      Freemium Monetization Model (PNG Kina)
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Adjust customer targets below to simulate monthly revenue growth
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-500">Target Monthly Gross</span>
                    <div className="text-2xl font-extrabold font-display text-emerald-700 tabular-nums">
                      {formatKina(currentMonthlyRevenue)}
                    </div>
                  </div>
                </div>

                {/* Interactive Revenue Sliders Table */}
                <div className="space-y-4 pt-2">
                  {/* Row 1: Featured Listings */}
                  <div className="bg-white p-4 rounded-xl border border-stone-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-4">
                      <div className="font-bold text-sm text-stone-900">Featured Priority Ads</div>
                      <div className="text-xs text-stone-500">K10 per 7-day boost</div>
                    </div>
                    <div className="md:col-span-5 flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="300"
                        step="5"
                        value={revenueModel.featuredCount}
                        onChange={(e) =>
                          setRevenueModel({ ...revenueModel, featuredCount: parseInt(e.target.value) || 0 })
                        }
                        className="w-full accent-amber-500"
                      />
                      <span className="text-xs font-bold text-stone-800 w-16 text-right tabular-nums">
                        {revenueModel.featuredCount} ads
                      </span>
                    </div>
                    <div className="md:col-span-3 text-right">
                      <span className="font-display font-bold text-sm text-stone-900 tabular-nums">
                        {formatKina(revenueModel.featuredCount * revenueModel.featuredRate)}
                      </span>
                      <span className="text-[11px] text-stone-400 block">/ month</span>
                    </div>
                  </div>

                  {/* Row 2: Business Package */}
                  <div className="bg-white p-4 rounded-xl border border-stone-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-4">
                      <div className="font-bold text-sm text-stone-900">Business Package</div>
                      <div className="text-xs text-stone-500">K50/month (up to 30 listings)</div>
                    </div>
                    <div className="md:col-span-5 flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="2"
                        value={revenueModel.businessCount}
                        onChange={(e) =>
                          setRevenueModel({ ...revenueModel, businessCount: parseInt(e.target.value) || 0 })
                        }
                        className="w-full accent-amber-500"
                      />
                      <span className="text-xs font-bold text-stone-800 w-16 text-right tabular-nums">
                        {revenueModel.businessCount} sellers
                      </span>
                    </div>
                    <div className="md:col-span-3 text-right">
                      <span className="font-display font-bold text-sm text-stone-900 tabular-nums">
                        {formatKina(revenueModel.businessCount * revenueModel.businessRate)}
                      </span>
                      <span className="text-[11px] text-stone-400 block">/ month</span>
                    </div>
                  </div>

                  {/* Row 3: Premium Package */}
                  <div className="bg-white p-4 rounded-xl border border-stone-200 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-4">
                      <div className="font-bold text-sm text-stone-900">Premium Enterprise</div>
                      <div className="text-xs text-stone-500">K100/month (dealers & real estate)</div>
                    </div>
                    <div className="md:col-span-5 flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="1"
                        value={revenueModel.premiumCount}
                        onChange={(e) =>
                          setRevenueModel({ ...revenueModel, premiumCount: parseInt(e.target.value) || 0 })
                        }
                        className="w-full accent-amber-500"
                      />
                      <span className="text-xs font-bold text-stone-800 w-16 text-right tabular-nums">
                        {revenueModel.premiumCount} dealers
                      </span>
                    </div>
                    <div className="md:col-span-3 text-right">
                      <span className="font-display font-bold text-sm text-stone-900 tabular-nums">
                        {formatKina(revenueModel.premiumCount * revenueModel.premiumRate)}
                      </span>
                      <span className="text-[11px] text-stone-400 block">/ month</span>
                    </div>
                  </div>
                </div>

                {/* Reset to Blueprint Default button */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() =>
                      setRevenueModel({
                        featuredCount: 100,
                        featuredRate: 10,
                        businessCount: 30,
                        businessRate: 50,
                        premiumCount: 10,
                        premiumRate: 100,
                      })
                    }
                    className="text-xs text-stone-500 hover:text-stone-800 underline"
                  >
                    Reset to Blueprint Targets (100 Featured + 30 Business + 10 Premium = K3,500)
                  </button>
                </div>
              </div>

              {/* Startup Budget & Roadmap Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-stone-200 bg-white">
                  <h5 className="font-bold text-stone-900 text-sm mb-2">Startup Budget Planning</h5>
                  <div className="text-xs text-stone-600 space-y-1.5">
                    <div className="flex justify-between">
                      <span>Domain & Hosting:</span>
                      <span className="font-semibold text-stone-900">K300–K800</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Branding & Design:</span>
                      <span className="font-semibold text-stone-900">K300–K1,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Website Development:</span>
                      <span className="font-semibold text-stone-900">K2,000–K6,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Testing & Initial Marketing:</span>
                      <span className="font-semibold text-stone-900">K1,000–K2,000</span>
                    </div>
                    <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900">
                      <span>Estimated Total:</span>
                      <span className="text-emerald-700">K3,600–K9,800</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-white">
                  <h5 className="font-bold text-stone-900 text-sm mb-2">Payment Integration Roadmap</h5>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Phase 1 relies on direct cash on collection and direct bank transfer between buyers and sellers to avoid escrow overhead. In Phase 2, integrate with licensed PNG Payment Service Providers (such as Pay It Now PNG, licensed in Sept 2026 by BPNG) for automated K10 listing boosts and merchant subscriptions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="space-y-3">
              <div className="text-xs text-stone-500 font-medium">
                Manage, verify, feature, or remove advertisements from the live platform.
              </div>

              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Item</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Province</th>
                      <th className="py-3 px-4">Seller</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 bg-white">
                    {listings.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-stone-900 max-w-[200px] truncate">
                          {item.title}
                        </td>
                        <td className="py-3 px-4 capitalize text-stone-600">
                          {item.category.replace('-', ' ')}
                        </td>
                        <td className="py-3 px-4 font-display font-bold text-stone-950 tabular-nums">
                          {formatKina(item.price)}
                        </td>
                        <td className="py-3 px-4 text-stone-600">{item.province}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => onToggleVerifySeller(item.seller.id)}
                            className="flex items-center gap-1 text-stone-800 hover:text-emerald-700"
                            title="Click to toggle verification badge"
                          >
                            <span>{item.seller.name}</span>
                            {item.seller.isVerified ? (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <span className="text-[10px] text-stone-400">(unverified)</span>
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.isApproved
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {item.isApproved ? 'Approved' : 'Pending'}
                            </span>
                            {item.isFeatured && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-stone-950">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onToggleFeatured(item.id)}
                              className={`p-1.5 rounded transition-colors ${
                                item.isFeatured
                                  ? 'bg-amber-400 text-stone-950'
                                  : 'text-stone-400 hover:text-stone-700 bg-stone-100'
                              }`}
                              title={item.isFeatured ? 'Remove featured boost' : 'Boost to featured (K10)'}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onToggleApproval(item.id)}
                              className={`p-1.5 rounded transition-colors ${
                                item.isApproved
                                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                                  : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                              }`}
                              title={item.isApproved ? 'Unapprove / Suspend' : 'Approve Ad'}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteListing(item.id)}
                              className="p-1.5 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
