import React, { useState } from 'react';
import { Listing } from '../types/marketplace';
import { formatKina, calculateSellerTrustScore } from '../utils/marketplace';
import {
  X,
  MapPin,
  ShieldCheck,
  Phone,
  MessageCircle,
  Heart,
  Share2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building,
  Flag,
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (listingId: string) => void;
  onReportListing: (listingId: string, reason: string) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  onClose,
  isSaved,
  onToggleSave,
  onReportListing,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('Suspicious pricing or advance payment requested');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!listing) return null;

  const trust = calculateSellerTrustScore(listing.seller);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    onReportListing(listing.id, reportReason);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setShowReportDialog(false);
    }, 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${listing.seller.name}, I am interested in your listing '${listing.title}' on Pawa Market for ${formatKina(listing.price)}. Is this still available?`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold text-stone-800 uppercase tracking-wide">
              {listing.category.replace('-', ' ')}
            </span>
            <span aria-hidden="true">·</span>
            <span>Ref #{listing.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(listing.id)}
              className={`p-2 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
              title={isSaved ? 'Saved to favourites' : 'Save to favourites'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-white text-stone-700 border border-stone-200 hover:bg-stone-100 transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors ml-1"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Gallery & Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Gallery Image */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={
                  listing.images[selectedImageIndex] ||
                  listing.images[0] ||
                  '/src/assets/images/category_cars_vehicles_1794060138397.jpg'
                }
                alt={listing.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {listing.isFeatured && (
                <div className="absolute top-3 left-3 bg-amber-400 text-stone-950 font-extrabold text-xs px-3 py-1 rounded shadow-sm uppercase tracking-wider">
                  Featured Priority Listing
                </div>
              )}
            </div>

            {/* Thumbnail Row if multiple images */}
            {listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-amber-500 ring-2 ring-amber-500/30'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            <div>
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wide mb-2">
                Description & Specifications
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50 p-4 rounded-xl border border-stone-100">
                {listing.description}
              </p>
            </div>

            {/* Key Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-stone-400 block font-medium">Condition</span>
                <span className="text-stone-900 font-bold mt-0.5 block">{listing.condition}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-stone-400 block font-medium">Province</span>
                <span className="text-stone-900 font-bold mt-0.5 block">{listing.province}</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                <span className="text-stone-400 block font-medium">District / Area</span>
                <span className="text-stone-900 font-bold mt-0.5 block">{listing.district || 'Town'}</span>
              </div>
            </div>

            {/* Report Button */}
            <div className="pt-2">
              <button
                onClick={() => setShowReportDialog(true)}
                className="text-xs text-stone-500 hover:text-rose-600 transition-colors flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report suspicious listing or fraud attempt</span>
              </button>
            </div>
          </div>

          {/* Right Column: Pricing & Contact Action (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Price Box */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">
                Asking Price
              </div>
              <div className="font-display font-extrabold text-3xl sm:text-4xl text-stone-950 mt-1 tabular-nums">
                {formatKina(listing.price)}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                {listing.priceType === 'negotiable'
                  ? 'Price is negotiable with seller'
                  : 'Fixed price (Cash on collection / Direct transfer)'}
              </div>

              {/* Direct Actions */}
              <div className="mt-5 space-y-2.5">
                {/* WhatsApp Primary Button */}
                <a
                  href={`https://wa.me/${listing.seller.whatsapp}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-sm active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat on WhatsApp</span>
                </a>

                {/* Direct Phone Call Button */}
                <a
                  href={`tel:${listing.seller.phone}`}
                  className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-sm active:scale-[0.98]"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Call {listing.seller.phone}</span>
                </a>
              </div>
            </div>

            {/* Seller Information Card */}
            <div className="p-5 rounded-2xl border border-stone-200 bg-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Seller Information
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {trust.badgeLevel}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 font-display font-bold text-xl flex items-center justify-center shrink-0">
                  {listing.seller.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                    {listing.seller.name}
                    {listing.seller.isVerified && (
                      <span title="Verified Seller">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </span>
                    )}
                  </div>
                  {listing.seller.businessName && (
                    <div className="text-xs text-stone-600 flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-stone-400" />
                      {listing.seller.businessName}
                    </div>
                  )}
                  <div className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    {listing.seller.location}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs text-stone-600">
                <div>
                  <span className="text-stone-400 block">Member since</span>
                  <span className="font-semibold text-stone-800">{listing.seller.joinedDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Active listings</span>
                  <span className="font-semibold text-stone-800">{listing.seller.activeAdsCount} ads</span>
                </div>
              </div>
            </div>

            {/* PNG Buyer Safety Notice Box */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>PNG Safe Trading Checklist</span>
              </div>
              <ul className="space-y-1 text-stone-700 pl-5 list-disc text-[12px] leading-relaxed">
                <li>Meet the seller in a busy, public daylight area (e.g. shopping mall or bank).</li>
                <li>Inspect and verify the item completely before handing over cash or transferring funds.</li>
                <li>Never send money via mobile wallet or advance bank deposit to an unknown seller.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Report Dialog Overlay */}
        {showReportDialog && (
          <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-20">
            <div className="bg-white rounded-xl p-5 max-w-md w-full shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Report Listing #{listing.id}
                </h4>
                <button
                  onClick={() => setShowReportDialog(false)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {reportSubmitted ? (
                <div className="py-6 text-center text-emerald-600 text-sm font-semibold flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8" />
                  <span>Report submitted to Pawa Market moderators. Thank you for protecting the community!</span>
                </div>
              ) : (
                <form onSubmit={handleReport} className="space-y-3">
                  <p className="text-xs text-stone-600">
                    Help us keep PNG Marketplace trustworthy. Why are you reporting this ad?
                  </p>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-lg bg-white"
                  >
                    <option>Suspicious pricing or advance payment requested</option>
                    <option>Stolen goods or counterfeit item</option>
                    <option>Prohibited goods policy violation</option>
                    <option>Seller unreachable or incorrect phone number</option>
                    <option>Misleading photograph or description</option>
                  </select>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReportDialog(false)}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
                    >
                      Submit Report
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
