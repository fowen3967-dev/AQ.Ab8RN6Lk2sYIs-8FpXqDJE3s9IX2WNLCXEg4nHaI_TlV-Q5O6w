import React, { useState } from 'react';
import { PNG_PROVINCES, PROVINCE_DISTRICTS } from '../data/mockData';
import { X, ShieldCheck, CheckCircle2, Building, User, KeyRound } from 'lucide-react';

interface SellerRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackage?: string;
  onRegistered: (sellerData: any) => void;
}

export const SellerRegisterModal: React.FC<SellerRegisterModalProps> = ({
  isOpen,
  onClose,
  initialPackage = 'free',
  onRegistered,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isBusiness, setIsBusiness] = useState(initialPackage === 'business' || initialPackage === 'premium');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [phone, setPhone] = useState('+675 ');
  const [province, setProvince] = useState(PNG_PROVINCES[0]);
  const [district, setDistrict] = useState(PROVINCE_DISTRICTS[PNG_PROVINCES[0]][0]);
  const [selectedPlan, setSelectedPlan] = useState(initialPackage);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode] = useState('8419');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentDistricts = PROVINCE_DISTRICTS[province] || ['Town'];

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name or representative name');
      return;
    }
    if (!phone.trim() || phone.trim() === '+675') {
      setError('Please provide a valid PNG phone number');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleVerifyPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim() !== generatedCode) {
      setError(`Please enter the simulation code: ${generatedCode}`);
      return;
    }
    setIsVerified(true);
    setError('');
    setStep(3);
  };

  const handleFinish = () => {
    onRegistered({
      name,
      businessName: isBusiness ? businessName : undefined,
      phone,
      whatsapp: phone.replace(/[^0-9]/g, ''),
      isVerified: true,
      isBusiness,
      packageTier: selectedPlan,
      location: `${district}, ${province}`,
    });
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="font-display font-bold text-lg text-stone-900">
              Seller Account & Verification
            </h3>
            <p className="text-xs text-stone-500">
              Step {step} of 3 — Join verified Papua New Guinea sellers
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-semibold">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBusiness(false)}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      !isBusiness
                        ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-400/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <User className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Individual Seller</div>
                      <div className="text-[11px] text-stone-500">Free 5 active ads</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsBusiness(true)}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      isBusiness
                        ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-400/20'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Building className="w-5 h-5 text-amber-600" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Registered Business</div>
                      <div className="text-[11px] text-stone-500">Shop, Dealer, Agency</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grace Abal"
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg outline-none"
                  required
                />
              </div>

              {isBusiness && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Business / Trade Name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Melanesian Motor Group Ltd"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg outline-none"
                    required={isBusiness}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Mobile Phone Number (Digicel / Vodafone / Bmobile) *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+675 7... (used for buyer WhatsApp & calls)"
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      const d = PROVINCE_DISTRICTS[e.target.value] || ['Town'];
                      setDistrict(d[0]);
                    }}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white"
                  >
                    {PNG_PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    District / Town
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white"
                  >
                    {currentDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg shadow-sm"
                >
                  Continue to Phone Verification
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyPhone} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <KeyRound className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">SMS Verification Simulation:</span>
                  We simulated sending an SMS to <span className="font-bold">{phone}</span> with verification code: <span className="font-mono font-extrabold bg-amber-200 px-1.5 py-0.5 rounded text-amber-950">{generatedCode}</span>.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Enter 4-Digit Code *
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="e.g. 8419"
                  className="w-full text-center tracking-widest font-mono text-lg font-bold p-3 border border-stone-300 rounded-lg outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-stone-500 hover:text-stone-800"
                >
                  Back to Details
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg shadow-sm"
                >
                  Verify Number & Claim Badge
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-5 text-center py-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-lg font-bold font-display text-stone-900">
                  Seller Profile Verified!
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                  Congratulations <span className="font-bold text-stone-900">{name}</span>! Your phone <span className="font-bold text-stone-900">{phone}</span> is verified. Your ads will now display the official <span className="text-emerald-700 font-bold">Verified Seller Badge</span>.
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-left">
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Location:</span>
                  <span className="font-bold text-stone-900">{district}, {province}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-stone-100">
                  <span className="text-stone-500">Plan:</span>
                  <span className="font-bold text-amber-700 capitalize">{selectedPlan} Tier</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg shadow-sm"
              >
                Go to Marketplace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
