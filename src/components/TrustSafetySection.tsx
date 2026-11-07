import React from 'react';
import { ShieldCheck, PhoneCall, AlertTriangle, Eye, Lock } from 'lucide-react';

export const TrustSafetySection: React.FC = () => {
  return (
    <section id="safety-section" className="py-16 bg-stone-900 text-white border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Papua New Guinea Community Trust & Safety</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-2">
            5 Simple Rules for Buying & Selling Safely in PNG
          </h2>
          <p className="text-sm text-stone-300 mt-2 leading-relaxed">
            Pawa Market is an advertising and connection platform. Protect yourself against scams by following these practical guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/70">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white mb-2">1. Inspect Before You Pay</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Always physically inspect vehicles, properties, phones, or machinery in person before handing over cash or making a bank transfer.
            </p>
          </div>

          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/70">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white mb-2">2. Never Pay Advance Deposits</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Beware of sellers requesting "holding fees" or advance mobile money transfers for vehicles or rental houses they cannot show in daylight.
            </p>
          </div>

          <div className="bg-stone-800/80 p-6 rounded-2xl border border-stone-700/70">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white mb-2">3. Meet in Public Places</h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Conduct exchanges in secure, populated daytime locations—such as Vision City, Waterfront Mall, Brian Bell plazas, or bank branches.
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-stone-950 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PhoneCall className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-stone-300">
              <span className="font-bold text-white block">See a suspicious advertisement?</span>
              Click the "Report" button on any listing to notify our moderation team immediately.
            </div>
          </div>
          <div className="text-xs text-stone-400">
            PNG Safe Trading Policy · 2026 Edition
          </div>
        </div>
      </div>
    </section>
  );
};
