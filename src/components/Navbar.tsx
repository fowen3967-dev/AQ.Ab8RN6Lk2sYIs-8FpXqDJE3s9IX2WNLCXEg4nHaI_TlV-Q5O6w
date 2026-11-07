import React, { useState } from 'react';
import { Bookmark, Shield, Plus, SlidersHorizontal, Settings2, Download } from 'lucide-react';
import { FounderSettings } from '../types/marketplace';

interface NavbarProps {
  founderSettings: FounderSettings;
  onOpenFounderModal: () => void;
  onOpenPostAd: () => void;
  onOpenAdmin: () => void;
  onOpenPricing: () => void;
  onOpenSafety: () => void;
  onSelectCategory: (cat: string) => void;
  savedCount: number;
  onOpenSaved: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenDownload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  founderSettings,
  onOpenFounderModal,
  onOpenPostAd,
  onOpenAdmin,
  onOpenPricing,
  onOpenSafety,
  onSelectCategory,
  savedCount,
  onOpenSaved,
  activeTab,
  setActiveTab,
  onOpenDownload,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveTab('browse');
                onSelectCategory('all');
              }}
              className="text-left group flex items-center gap-2.5 focus:outline-none"
              aria-label="Go to homepage"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-display font-extrabold flex items-center justify-center text-lg shadow-sm group-hover:bg-amber-400 transition-colors">
                P
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
                  {founderSettings.appName.toUpperCase()}
                </span>
              </div>
            </button>

            {/* Quick Founder Decision Pill for interactive brand switching */}
            <button
              onClick={onOpenFounderModal}
              title="Founder Configuration: Brand, Launch City & Budget"
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-400 bg-amber-950/60 border border-amber-800/80 rounded-md hover:bg-amber-900/60 transition-colors whitespace-nowrap"
            >
              <Settings2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Founder Setup</span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single Line, 4-5 items) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
            <button
              onClick={() => {
                setActiveTab('browse');
                onSelectCategory('all');
              }}
              className={`hover:text-amber-400 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'browse' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Browse All
            </button>
            <button
              onClick={() => {
                setActiveTab('browse');
                const el = document.getElementById('categories-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-amber-400 transition-colors whitespace-nowrap py-1"
            >
              Categories
            </button>
            <button
              onClick={onOpenPricing}
              className="hover:text-amber-400 transition-colors whitespace-nowrap py-1"
            >
              Pricing (K0 - K100)
            </button>
            <button
              onClick={onOpenSafety}
              className="hover:text-amber-400 transition-colors whitespace-nowrap py-1 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              Safety Guide
            </button>
            <button
              onClick={onOpenAdmin}
              className="hover:text-amber-400 transition-colors whitespace-nowrap py-1 text-stone-400 hover:text-stone-200"
            >
              Admin Portal
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Download / Install App Button */}
            <button
              onClick={onOpenDownload}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-stone-200 bg-stone-800 hover:bg-stone-700 hover:text-white border border-stone-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
              title="Download or install app on mobile/desktop"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Download App</span>
              <span className="sm:hidden">Install</span>
            </button>

            {/* Saved listings button */}
            <button
              onClick={onOpenSaved}
              className="relative p-2 text-stone-300 hover:text-amber-400 rounded-lg hover:bg-stone-800 transition-colors"
              aria-label={`View saved listings (${savedCount})`}
              title="Saved Favourites"
            >
              <Bookmark className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Post Ad Primary Action Button */}
            <button
              onClick={onOpenPostAd}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-stone-950 bg-amber-400 rounded-lg hover:bg-amber-300 active:scale-[0.98] transition-all shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Post an Ad</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800"
              aria-label="Toggle navigation menu"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-stone-800 flex flex-col gap-2 text-sm text-stone-300">
            <button
              onClick={() => {
                setActiveTab('browse');
                onSelectCategory('all');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-800 hover:text-white"
            >
              Browse Marketplace
            </button>
            <button
              onClick={() => {
                onOpenPricing();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-800 hover:text-white"
            >
              Pricing & Advertising Packages
            </button>
            <button
              onClick={() => {
                onOpenSafety();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-800 hover:text-white"
            >
              Safety Guidelines for PNG
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-800 hover:text-white"
            >
              Admin & Revenue Dashboard
            </button>
            <button
              onClick={() => {
                onOpenDownload();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md hover:bg-stone-800 hover:text-white flex items-center gap-2 text-amber-300 font-medium"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download & Install App</span>
            </button>
            <button
              onClick={() => {
                onOpenFounderModal();
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-md text-amber-400 font-medium hover:bg-stone-800"
            >
              Founder Setup & Research
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
