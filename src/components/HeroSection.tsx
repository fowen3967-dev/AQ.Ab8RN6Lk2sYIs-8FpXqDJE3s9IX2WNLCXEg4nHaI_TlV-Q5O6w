import React from 'react';
import { Search, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { PNG_PROVINCES } from '../data/mockData';
import { FounderSettings } from '../types/marketplace';

interface HeroSectionProps {
  founderSettings: FounderSettings;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProvince: string;
  setSelectedProvince: (prov: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onSelectQuickTag: (tag: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  founderSettings,
  searchQuery,
  setSearchQuery,
  selectedProvince,
  setSelectedProvince,
  onSearchSubmit,
  onSelectQuickTag,
}) => {
  return (
    <section className="relative bg-stone-950 text-white overflow-hidden border-b border-stone-800">
      {/* Background Hero Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_png_marketplace_1794060138177.jpg"
          alt="Papua New Guinea commerce and coastline"
          className="w-full h-full object-cover opacity-25 filter saturate-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-stone-950/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          {/* Trust Kicker - Unboxed clean text */}
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-3 tracking-wide">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>DIRECT BUYER-TO-SELLER CONNECTIONS ACROSS PAPUA NEW GUINEA</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-[1.15]">
            One platform to buy, sell, and discover anything in{' '}
            <span className="text-amber-400 underline decoration-amber-500/40 decoration-4 underline-offset-6">
              Papua New Guinea
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed text-balance">
            {founderSettings.tagline} Verified sellers, affordable business advertising, and direct
            WhatsApp chat for fast local deals.
          </p>

          {/* Interactive Search Bar Box */}
          <form
            onSubmit={onSearchSubmit}
            className="mt-8 bg-white/95 backdrop-blur-md rounded-xl p-2 sm:p-2.5 shadow-xl border border-white/20 flex flex-col md:flex-row items-stretch gap-2"
          >
            {/* Keyword Input */}
            <div className="flex-1 flex items-center px-3 py-2 bg-stone-50 rounded-lg border border-stone-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
              <Search className="w-5 h-5 text-stone-400 shrink-0 mr-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cars, houses, phones, coffee, bilums..."
                className="w-full bg-transparent text-stone-900 placeholder-stone-500 text-sm sm:text-base focus:outline-none"
              />
            </div>

            {/* Province Dropdown */}
            <div className="flex items-center px-3 py-2 bg-stone-50 rounded-lg border border-stone-200 md:w-64 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mr-2" />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full bg-transparent text-stone-900 text-sm focus:outline-none cursor-pointer"
                aria-label="Filter by province"
              >
                <option value="all">All 22 Provinces (Nationwide)</option>
                {PNG_PROVINCES.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm sm:text-base rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap active:scale-[0.98]"
            >
              <span>Search Marketplace</span>
            </button>
          </form>

          {/* Quick Trending Searches */}
          <div className="mt-4 flex items-center gap-2 flex-wrap text-xs text-stone-400">
            <span className="font-semibold text-stone-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Popular:
            </span>
            {['Port Moresby', 'Toyota Land Cruiser', 'Madang', 'iPhone', 'Bilum', 'Lae', 'Coffee Beans'].map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectQuickTag(tag)}
                  className="px-2.5 py-1 rounded bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-700/60 transition-colors whitespace-nowrap"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>

        {/* 4-Column Proof Row below Hero */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-300">
          <div>
            <div className="text-xl sm:text-2xl font-bold font-display text-amber-400 tabular-nums">22</div>
            <div className="text-xs text-stone-400 mt-0.5">Provinces Covered</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-display text-amber-400 tabular-nums">0%</div>
            <div className="text-xs text-stone-400 mt-0.5">Commission on Direct Sales</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-display text-amber-400">Direct</div>
            <div className="text-xs text-stone-400 mt-0.5">Phone & WhatsApp Contact</div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold font-display text-amber-400">Verified</div>
            <div className="text-xs text-stone-400 mt-0.5">Seller Trust Badges</div>
          </div>
        </div>
      </div>
    </section>
  );
};
