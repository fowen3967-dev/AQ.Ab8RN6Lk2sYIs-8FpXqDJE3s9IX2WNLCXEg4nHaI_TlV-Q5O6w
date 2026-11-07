import React from 'react';
import { PRICING_PACKAGES } from '../data/mockData';
import { Check, Sparkles } from 'lucide-react';

interface PricingSectionProps {
  onSelectPackage: (packageId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPackage }) => {
  return (
    <section id="pricing-section" className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Clear & Affordable PNG Rates
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-stone-900 mt-1">
            How Pawa Market Makes Advertising Easy
          </h2>
          <p className="text-sm text-stone-600 mt-2 text-balance">
            Start advertising for free. Upgrade whenever you want higher visibility, verified business status, or extra listing volume.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all ${
                pkg.isHighlighted
                  ? 'bg-amber-50/70 border-2 border-amber-400 shadow-md ring-1 ring-amber-400'
                  : 'bg-stone-50 border border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {pkg.name}
                  </span>
                  {pkg.isHighlighted && (
                    <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-stone-950 px-2 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Priority
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <span className="text-3xl sm:text-4xl font-extrabold font-display text-stone-950 tabular-nums">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-stone-500 block mt-1">{pkg.frequency}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-stone-700 mb-6">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectPackage(pkg.id)}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-colors shadow-xs ${
                  pkg.isHighlighted
                    ? 'bg-amber-400 hover:bg-amber-300 text-stone-950'
                    : 'bg-stone-900 hover:bg-stone-800 text-white'
                }`}
              >
                {pkg.ctaText}
              </button>
            </div>
          ))}
        </div>

        {/* Revenue note footnote */}
        <div className="mt-8 text-center text-xs text-stone-400">
          Illustrative launch pricing in Papua New Guinea Kina (K). No commission on normal private buyer-to-seller cash sales.
        </div>
      </div>
    </section>
  );
};
