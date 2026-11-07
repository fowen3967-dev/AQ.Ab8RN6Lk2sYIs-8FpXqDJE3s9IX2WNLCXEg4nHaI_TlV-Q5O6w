import React, { useState } from 'react';
import { CategoryId, ItemCondition, Listing } from '../types/marketplace';
import { PNG_PROVINCES, PROVINCE_DISTRICTS, CATEGORIES } from '../data/mockData';
import { X, Upload, Sparkles, CheckCircle2, ShieldCheck, Camera } from 'lucide-react';

interface PostAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newListing: Listing) => void;
}

export const PostAdModal: React.FC<PostAdModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('vehicles');
  const [condition, setCondition] = useState<ItemCondition>('Used - Good');
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState<'fixed' | 'negotiable'>('fixed');
  const [province, setProvince] = useState(PNG_PROVINCES[0]);
  const [district, setDistrict] = useState(PROVINCE_DISTRICTS[PNG_PROVINCES[0]][0]);
  const [description, setDescription] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [phone, setPhone] = useState('+675 ');
  const [whatsapp, setWhatsapp] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState<string>(
    '/src/assets/images/category_cars_vehicles_1794060138397.jpg'
  );
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentDistricts = PROVINCE_DISTRICTS[province] || ['Town / District'];

  const handleProvinceChange = (newProvince: string) => {
    setProvince(newProvince);
    const districts = PROVINCE_DISTRICTS[newProvince] || ['Town'];
    setDistrict(districts[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an advertisement title');
      return;
    }
    const numericPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setError('Please provide a valid price in PNG Kina (K)');
      return;
    }
    if (!sellerName.trim()) {
      setError('Please provide your seller name');
      return;
    }
    if (!phone.trim() || phone.trim() === '+675') {
      setError('Please provide a valid contact phone number');
      return;
    }

    const cleanWhatsapp = (whatsapp.trim() || phone.trim()).replace(/[^0-9]/g, '');
    const finalPhoto = customPhotoUrl.trim() || selectedPhotoPreset;

    const newListing: Listing = {
      id: `pawa-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      price: numericPrice,
      priceType,
      category,
      condition,
      province,
      district,
      description: description.trim() || 'No additional details provided. Contact seller for inspection.',
      images: [finalPhoto],
      seller: {
        id: `sel-${Date.now().toString().slice(-4)}`,
        name: sellerName.trim(),
        phone: phone.trim(),
        whatsapp: cleanWhatsapp,
        isVerified: true,
        isBusiness: false,
        packageTier: isFeatured ? 'business' : 'free',
        location: `${district}, ${province}`,
        joinedDate: 'March 2026',
        activeAdsCount: 1,
        rating: 5.0,
      },
      isFeatured,
      isApproved: true,
      views: 1,
      saves: 0,
      createdAt: new Date().toISOString(),
    };

    onAddListing(newListing);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="font-display font-bold text-lg text-stone-900">
              Post an Advertisement on Pawa Market
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Connect directly with buyers across Papua New Guinea
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6">
          {submitted ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold font-display text-stone-900">
                Advertisement Published Live!
              </h4>
              <p className="text-sm text-stone-600 max-w-sm">
                Your ad is now active in <span className="font-semibold text-stone-900">{province}</span>. Buyers can now contact you on WhatsApp and phone.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                  Ad Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. 2018 Toyota Hilux 4x4 or iPhone 14 Pro 128GB"
                  className="w-full text-sm p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  required
                />
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                    className="w-full text-sm p-3 border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Item Condition *
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ItemCondition)}
                    className="w-full text-sm p-3 border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Used - Fair">Used - Fair</option>
                    <option value="For Rent">For Rent</option>
                    <option value="Service">Professional Service</option>
                  </select>
                </div>
              </div>

              {/* Price & Price Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Price in PNG Kina (K) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-stone-500 font-bold text-sm">
                      K
                    </span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        setError('');
                      }}
                      placeholder="e.g. 1500"
                      className="w-full text-sm p-3 pl-8 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none tabular-nums"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Price Type
                  </label>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as 'fixed' | 'negotiable')}
                    className="w-full text-sm p-3 border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  >
                    <option value="fixed">Fixed</option>
                    <option value="negotiable">Negotiable</option>
                  </select>
                </div>
              </div>

              {/* Location (Province & District) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    Province *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full text-sm p-3 border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  >
                    {PNG_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                    District / Area *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-sm p-3 border border-stone-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  >
                    {currentDistricts.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                  <span>Product Photograph *</span>
                  <span className="text-stone-400 font-normal">Select sample or enter photo link</span>
                </label>

                {/* Sample Photo Presets */}
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[
                    { name: 'Vehicle', path: '/src/assets/images/category_cars_vehicles_1794060138397.jpg' },
                    { name: 'Property', path: '/src/assets/images/category_real_estate_1794060139114.jpg' },
                    { name: 'Phones/Tech', path: '/src/assets/images/category_electronics_phones_1794060139077.jpg' },
                    { name: 'Agriculture', path: '/src/assets/images/category_food_agriculture_1794060139372.jpg' },
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() => {
                        setSelectedPhotoPreset(preset.path);
                        setCustomPhotoUrl('');
                      }}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all ${
                        selectedPhotoPreset === preset.path && !customPhotoUrl
                          ? 'border-amber-500 ring-2 ring-amber-500/30'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.path} alt={preset.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="Or enter custom image URL (https://...)"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wide mb-1">
                  Description & Condition Details *
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide specifications, age, reason for sale, warranty, or inspection arrangements..."
                  className="w-full text-sm p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Contact Information */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Direct Seller Contact Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      placeholder="e.g. Samuel Somare"
                      className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+675 7..."
                      className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="6757... (for click-to-chat)"
                      className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Promotion Package Selection - Featured Boost K10 */}
              <div className="p-4 rounded-xl border-2 border-amber-300 bg-amber-50/50 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-stone-900 text-sm">
                      Boost with Featured Placement (K10)
                    </span>
                    <span className="bg-amber-400 text-stone-950 font-extrabold text-[10px] px-2 py-0.5 rounded">
                      7-DAY PROMOTION
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Place your listing at the top of the homepage and search results. Gets 3x more buyer views and quicker phone enquiries.
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-5 h-5 text-amber-500 rounded border-stone-300 focus:ring-amber-400"
                  />
                  <span className="text-xs font-bold text-stone-800">Boost (K10)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] rounded-lg transition-colors shadow-sm"
                >
                  {isFeatured ? 'Publish Featured Ad (K10)' : 'Publish Free Ad (K0)'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
