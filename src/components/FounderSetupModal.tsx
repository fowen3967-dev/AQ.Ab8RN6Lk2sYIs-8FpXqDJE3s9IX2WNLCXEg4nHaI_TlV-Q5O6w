import React, { useState } from 'react';
import { FounderSettings } from '../types/marketplace';
import { X, CheckCircle2, Building2, MapPin, Wallet, BookOpen, Sparkles } from 'lucide-react';

interface FounderSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FounderSettings;
  onSaveSettings: (newSettings: FounderSettings) => void;
}

const NAME_OPTIONS = [
  {
    name: 'Pawa Market',
    tagline: 'Buy. Sell. Connect. Your marketplace, everywhere in PNG.',
    note: 'Founder Favourite — Short, memorable, strong local identity.',
  },
  {
    name: 'PNG TradeHub',
    tagline: 'Papua New Guinea’s premier digital trade and commerce platform.',
    note: 'Professional — Ideal for individual sellers, SMEs, and corporate dealers.',
  },
  {
    name: 'Wantok Market',
    tagline: 'The friendly community marketplace for all Papua New Guineans.',
    note: 'Community-focused — Warm, trusted, grassroots appeal.',
  },
  {
    name: 'PNG BuySell',
    tagline: 'Simple, direct buying and selling across every province.',
    note: 'Straightforward — Instantly communicates the core utility.',
  },
  {
    name: 'Pasin Market',
    tagline: 'The local way of buying and selling across PNG and the Pacific.',
    note: 'Distinctive cultural brand — Built to scale throughout the Pacific region.',
  },
];

export const FounderSetupModal: React.FC<FounderSetupModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [selectedName, setSelectedName] = useState(settings.appName);
  const [selectedCity, setSelectedCity] = useState(settings.launchCity);
  const [selectedBudget, setSelectedBudget] = useState(settings.budgetTier);
  const [showResearch, setShowResearch] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = NAME_OPTIONS.find((n) => n.name === selectedName);
    const newTagline = matched ? matched.tagline : 'Papua New Guinea Online Marketplace';

    onSaveSettings({
      appName: selectedName,
      tagline: newTagline,
      launchCity: selectedCity,
      budgetTier: selectedBudget,
      showWeeklyResearch: showResearch,
    });

    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 font-display font-extrabold flex items-center justify-center text-sm">
              PM
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Pawa Market — Founder Decision Console
              </h3>
              <p className="text-xs text-stone-400">
                Configure brand name, launch city, budget, and competitive positioning
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

        {/* Form Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {savedNotification ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              <h4 className="text-xl font-bold font-display text-stone-900">
                Founder Decisions Saved!
              </h4>
              <p className="text-sm text-stone-600">
                The marketplace has adapted to <span className="font-bold text-stone-900">{selectedName}</span> launching in <span className="font-bold text-stone-900">{selectedCity}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Decision 1: App Name */}
              <div>
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>1. Choose Your Official Brand Name</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {NAME_OPTIONS.map((item) => (
                    <div
                      key={item.name}
                      onClick={() => setSelectedName(item.name)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedName === item.name
                          ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-stone-900">{item.name}</span>
                        {item.name === 'Pawa Market' && (
                          <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-stone-950 px-2 py-0.5 rounded">
                            Favourite
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-1">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision 2: Launch City */}
              <div>
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>2. Where Should We Launch First?</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'Port Moresby first',
                      title: 'Port Moresby first, then nationwide',
                      desc: 'Highest internet density, commercial hub & car dealers.',
                    },
                    {
                      id: 'Madang first',
                      title: 'Madang first, then nationwide',
                      desc: 'Strong local community focus & proven grassroots testbed.',
                    },
                    {
                      id: 'Nationwide from day one',
                      title: 'Nationwide from day one',
                      desc: 'All 22 provinces open simultaneously with province search.',
                    },
                  ].map((city) => (
                    <div
                      key={city.id}
                      onClick={() => setSelectedCity(city.id as any)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        selectedCity === city.id
                          ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="font-bold text-xs text-stone-900">{city.title}</div>
                      <p className="text-[11px] text-stone-500 mt-1">{city.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision 3: Initial Budget */}
              <div>
                <label className="block text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-amber-600" />
                  <span>3. Initial Startup Budget Allowance</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'Free prototype', label: 'Free Prototype' },
                    { id: 'Under K1,000', label: 'Under K1,000' },
                    { id: 'K1,000–K3,000', label: 'K1,000–K3,000' },
                    { id: 'K3,000–K10,000', label: 'K3,000–K10,000' },
                    { id: 'Over K10,000', label: 'Over K10,000' },
                  ].map((b) => (
                    <button
                      type="button"
                      key={b.id}
                      onClick={() => setSelectedBudget(b.id as any)}
                      className={`py-2 px-2.5 rounded-lg border text-xs font-bold transition-all text-center ${
                        selectedBudget === b.id
                          ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Competitor Research Toggle */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowResearch(!showResearch)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 underline"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{showResearch ? 'Hide' : 'View'} Weekly PNG Marketplace Competitor Research</span>
                </button>

                {showResearch && (
                  <div className="mt-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-3">
                    <h5 className="font-bold text-stone-900 text-sm">
                      PNG Digital Marketplace Landscape Analysis
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-white rounded-lg border border-stone-200">
                        <span className="font-bold text-stone-900 block">MarketMeri</span>
                        <p className="text-stone-500 mt-0.5">
                          Established classifieds, strong brand awareness in NCD, but heavier mobile web load and limited WhatsApp direct-chat integration.
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-stone-200">
                        <span className="font-bold text-stone-900 block">PNG Online</span>
                        <p className="text-stone-500 mt-0.5">
                          Primarily a business directory with product extensions. Lacks fast consumer-to-consumer mobile post-an-ad simplicity.
                        </p>
                      </div>
                      <div className="p-3 bg-white rounded-lg border border-stone-200">
                        <span className="font-bold text-stone-900 block">24Market</span>
                        <p className="text-stone-500 mt-0.5">
                          Products & services listings, but lower seller verification transparency and less province-specific district filtering.
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-amber-950 leading-relaxed">
                      <span className="font-bold">Our Competitive Edge for Pawa Market:</span> Designed lightweight for 2.6M PNG internet users on mobile data packages; verified seller trust badges; direct WhatsApp chat; and affordable K10 listing boosts.
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-lg transition-colors shadow-sm"
                >
                  Save Founder Decisions
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
