import React from 'react';
import { FounderSettings } from '../types/marketplace';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  founderSettings: FounderSettings;
  onSelectProvince: (prov: string) => void;
  onSelectCategory: (cat: string) => void;
  onOpenPricing: () => void;
  onOpenSafety: () => void;
  onOpenFounderModal: () => void;
  onOpenDownload: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  founderSettings,
  onSelectProvince,
  onSelectCategory,
  onOpenPricing,
  onOpenSafety,
  onOpenFounderModal,
  onOpenDownload,
}) => {
  return (
    <footer className="bg-stone-950 text-stone-400 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Wordmark & Story */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-stone-950 font-display font-extrabold flex items-center justify-center text-sm">
                P
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                {founderSettings.appName.toUpperCase()}
              </span>
            </div>
            <p className="text-stone-400 leading-relaxed text-balance">
              The trusted buying and selling marketplace platform for Papua New Guinea. Empowering local individuals, farmers, artisans, and registered businesses across all 22 provinces.
            </p>
            <div className="text-amber-400/90 text-[11px] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Built for mobile accessibility & light data usage</span>
            </div>
          </div>

          {/* Col 2: Top Provinces */}
          <div>
            <h4 className="font-bold text-stone-200 uppercase tracking-wider mb-3">
              Key Provinces
            </h4>
            <ul className="space-y-2">
              {[
                'National Capital District',
                'Morobe',
                'Madang',
                'Eastern Highlands',
                'Western Highlands',
                'East New Britain',
              ].map((prov) => (
                <li key={prov}>
                  <button
                    onClick={() => onSelectProvince(prov)}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    {prov}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h4 className="font-bold text-stone-200 uppercase tracking-wider mb-3">
              Popular Categories
            </h4>
            <ul className="space-y-2">
              {[
                { id: 'vehicles', name: 'Cars & 4x4 Vehicles' },
                { id: 'real-estate', name: 'Houses & Land Plots' },
                { id: 'electronics', name: 'Smartphones & Solar Tech' },
                { id: 'food-agriculture', name: 'Highlands Coffee & Produce' },
                { id: 'fashion', name: 'Traditional Goroka Bilums' },
              ].map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onSelectCategory(cat.id)}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Platform & Founder */}
          <div>
            <h4 className="font-bold text-stone-200 uppercase tracking-wider mb-3">
              Platform & Growth
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenPricing} className="hover:text-amber-400 transition-colors text-left">
                  Advertising Packages (K0 - K100)
                </button>
              </li>
              <li>
                <button onClick={onOpenSafety} className="hover:text-amber-400 transition-colors text-left">
                  PNG Buyer & Seller Safety
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDownload}
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors text-left flex items-center gap-1.5"
                >
                  <span>Download App & Source Code (.ZIP)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFounderModal}
                  className="text-stone-400 hover:text-stone-200 transition-colors text-left"
                >
                  Founder Setup: {founderSettings.appName} ({founderSettings.launchCity})
                </button>
              </li>
            </ul>

            <div className="mt-6 p-3 bg-stone-900 rounded-xl border border-stone-800 text-[11px] text-stone-400">
              <span className="font-bold text-stone-200 block mb-0.5">Currency & Transactions</span>
              All listings and promotional packages priced in Papua New Guinea Kina (K).
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500">
          <div>
            © 2026 {founderSettings.appName} PNG. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Designed with care for Papua New Guinea commerce</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
